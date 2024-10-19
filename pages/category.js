import { Fragment, useState, useEffect, useRef } from "react";
import LayoutMini from "../components/LayoutMini";
import { BuildingLibraryIcon, PlusIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon, HomeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Alert from "../components/Alert";
import { useSession } from "next-auth/react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import randomstring from "randomstring";
import * as z from "zod";
import { set } from "mongoose";

export default function Home() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const cancelButtonRef = useRef(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonLoadingText, setButtonLoadingText] = useState('Loading..');
  const [errMessage, setErrMessage] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [isEditable, setIsEditable] = useState({
    checkdata: false,
    editable_id: "asd233d3",
  });
  const [validate, setValidate] = useState(false);
  const [school_id, setSchool_id] = useState("63f342d58b63575cf5dc3afc");
  const [currentText, setCurrentText] = useState({
    text: "Create Category",
  });

  useEffect(() => {
    getSchool_id();
  }, []);

  const getSchool_id = async () => {
    try {
      const res = await fetch("/api/All_fetch_queriesAPI?type=getSchool_id", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data, "getSchool_id");
      if (data.data) {
        setSchool_id(data.data[0]._id);
        getCategoryInfo(data.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching school ID:", error);
      setLoading(false);
    }
  };

  const getCategoryInfo = async (schoolid) => {
    try {
      const res = await fetch(`/api/All_fetch_queriesAPI?type=category&school_id=${schoolid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data, "getCategoryInfo");
      if (data.data) {
        setPeople(data.data);
      }
    } catch (error) {
      console.error("Error fetching category info:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBtnProps = [
    {
      name: 'Createsubject',
      label: {
        text: 'Save ',
        show: true
      }
    },
    {
      name: 'savesbject',
      label: {
        text: 'Save Subject Data',
        show: true
      }
    }
  ];

  const [formElements, setFormElements] = useState([
    {
      name: 'category',
      placeholder: "Enter Category Name",
      label: {
        text: 'Category Name',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      data: '',
      schema: z.object({
        inputFieldName: z.string({
          required_error: "Value is required",
          invalid_type_error: "Value must be a text",
        })
          .min(3, { message: 'Min 3 characters' })
          .max(40, { message: 'Max 40 characters' }),
      }),
    },
  ]);

  function getRandomString() {
    let uniqueKey = randomstring.generate({
      length: 12,
      charset: "alphanumeric",
    });
    return uniqueKey;
  }

  function editCategory(data) {
    emptyFormData();
    setIsEditable({
      ...isEditable,
      checkdata: true,
      editable_id: data._id,
    });
    setCurrentText({
      text: "Edit Category",
    });
    formElements[0].data = data.name;
    setOpenPopup(true);
  }

  async function deleteCategory(data) {
    console.log(data, "data deleteCategory");
    try {
      const response = await fetch("/api/categoryAPI", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: data._id, type: "delete" }),
      });

      console.log(response, "response");
      const result = await response.json();
      console.log("Data>>>>", result);

      if (result.errors) {
        setErrMessage(result.errors[0].msg);
      } else if ([422, 400, 500].includes(result.status)) {
        setErrMessage("Oops! Please try again");
      } else {
        getCategoryInfo(school_id);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setErrMessage("An error occurred. Please try again.");
    }
  }

  function emptyFormData() {
    for (let index = 0; index < formElements.length; index++) {
      const obj = formElements[index];
      obj.isValidated = false;

      if ('defaultValuedata' in obj) {
        var checkdata = obj_or_arr(obj.defaultValuedata);
        if (checkdata == 'object') {
          obj.defaultValuedata = {
            "_id": "please select Data",
            "name": "please select Data"
          };
        } else {
          obj.defaultValuedata = [];
        }
        console.log(checkdata, "emptyFormData checkdata");
      } else {
        obj.data = '';
      }
    }
  }

  function obj_or_arr(val) {
    if (typeof val === "object") {
      try {
        for (x of val)
          break;
        return "array";
      } catch {
        return "object";
      }
    } else return false;
  }

  function createSubject() {
    emptyFormData();
    setOpenPopup(true);
    setIsEditable({
      ...isEditable,
      checkdata: false,
      editable_id: "",
    });
  }

  async function saveSubject(data) {
    setValidate(true);
  }

  let finalObj = {
    "school_id": school_id
  };

  function validationHandler(params) {
    console.log(params, "params");
    let formValidated = false;
    const result = formElements.filter(element => element.id == params.id)[0];

    if (params.hasOwnProperty('valid')) {
      if (params.valid == true) {
        result.isValidated = true;
        finalObj[params.name] = params.value;
      } else {
        result.isValidated = false;
        result.data = params.value;
      }
    } else {
      finalObj[params.name] = params.value;
    }

    const validationResults = formElements.filter(element => element.isValidated == false);
    if (validationResults.length == 0) {
      formValidated = true;
    }
    return formValidated;
  }

  async function sendData(data) {
    setValidate(false);
    let formValidated = await validationHandler(data);
    console.log(formValidated, "formValidated");
    if (formValidated == true) {
      createFetchData();
    }
  }

  async function createFetchData() {
    var requestType;
    if (isEditable.checkdata == true) {
      requestType = "PUT";
      finalObj._id = isEditable.editable_id;
      finalObj.type = "edit";
    } else {
      requestType = "POST";
    }

    const res = await fetch("/api/categoryAPI", {
      method: requestType,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalObj),
    });

    var data = await res.json();
    console.log("Data>>>>", data);

    if (data.errors) {
      // setErrMessage(data.errors[0].msg);
    } else {
      if (data.status == 422 || data.status == 400 || data.status == 500) {
        setErrMessage("Oops! Please try again");
      } else {
        setOpenPopup(false);
        getCategoryInfo(school_id);
      }
    }
  }

  return (
    <LayoutMini>
      <div className="m-auto md:px-6 md:py-3">
        <div className="flex justify-between">
          <div className="">
            <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg px-2 py-2">
              Categories
            </h2>
            <p className="mt-1 max-w-md text-xs text-gray-500 sm:text-xs md:mt-2 md:max-w-3xl pl-3">
              Add your Category Ex: Primary Section, Secondary Section Etc...
            </p>
          </div>
          <div className="mt-4 w-full sm:text-center lg:mx-0 lg:text-left">
            <button onClick={() => createSubject()}
              type="button"
              className="sm:text-md inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-3 h-6 w-6" aria-hidden="true" />
              Create Category
            </button>
          </div>
        </div>
        {errMessage && (
          <div className="mt-6">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="w-5 h-5 current text-red-400" />
                </div>
                <div className="ml-1 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-red-500 ">{errMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-xl">
          {loading ? (
            <div className="pl-0 text-center py-10 sm:py-24 mt-3 max-w-xl text-md sm:text-5xl border border-slate-400 text-slate-400 rounded-lg shadow-sm">
              Loading...
            </div>
          ) : people.length === 0 ? (
            <div className="pl-0 text-center py-10 sm:py-24 mt-3 max-w-xl text-md sm:text-5xl border border-slate-400 text-slate-400 rounded-lg shadow-sm">
              You haven't added any Category
            </div>
          ) : (
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr className="divide-x divide-gray-200">
                          <th scope="col" className="px-2 py-2 text-left text-md font-semibold text-gray-900">
                            Category Name
                          </th>
                          <th scope="col" className="px-2 py-2 text-left text-md font-semibold text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {people.map((person) => (
                          <tr key={person.id} className="divide-x divide-gray-200">
                            <td className="whitespace-nowrap px-2 py-3 text-md text-gray-500">{person.name}</td>
                            <td className="whitespace-nowrap px-2 py-3 text-md flex justify-around">
                              <a onClick={() => editCategory(person)} className="text-indigo-600 hover:text-indigo-900 pointer underline">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-400" fill="none"
                                  viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span className="sr-only">, {person.number}</span>
                              </a>
                              <a onClick={() => deleteCategory(person)} className="ml-4 text-red-400 hover:text-red-500 pointer underline">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-400" fill="none"
                                  viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="sr-only">, {person.number}</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Transition.Root show={openPopup} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenPopup}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-3 pb-4 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-md sm:p-4">
                  <Dialog.Title as="h3" className="text-3xl font-extrabold leading-6 text-gray-400">
                    {currentText.text == "Create Category" ? "Create Category" : "Edit Category"}
                  </Dialog.Title>
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpenPopup(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div>
                    <div className="mt-6 flow-root">
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-1 gap-3 justify-start w-full justify-start items-center">
                        <div>
                          <Input validate={validate} {...formElements[0]} sendData={sendData} />
                        </div>
                        <div className="md:max-w-[200px] sm:max-w-[150px] max-w-full flex justify-start">
                          <Button loading={buttonLoading} loadingText={buttonLoadingText} {...addBtnProps[0]} click={(e) => saveSubject()} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </LayoutMini>
  );
}