import { Fragment, useState, useEffect, useRef } from "react";

import { BuildingLibraryIcon, PlusIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon, HomeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Alert from "../components/Alert";
import LayoutMini from "../components/LayoutMini";
import Input from "../components/Input";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Table from "../components/Table";
import MultiSelect from '../components/MultiSelect'

import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import randomstring from "randomstring";

import * as z from "zod";






const classList = [
  {
    id: 1,
    name: "Primary School",
  },
  {
    id: 2,
    name: "Secondary School",
  },
  {
    id: 3,
    name: "Senior Section",
  },

]


export default function Home() {
  const [openCategory, setOpenCategory] = useState(false);
  const [currenttype, setcurrenttype] = useState("create");
  const [openpopup, setopenpopup] = useState(false);
  const [currentSubjectData, setcurrentSubjectData] = useState([]);

  const [school_id, setschool_id] = useState("63f342d58b63575cf5dc3afc");


  const [iseditable, setiseditable] = useState({
    checkdata: false,
    editable_id: "asd233d3"
  })

  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonLoadingText, setButtonLoadingText] = useState('Loading..')
  const cancelButtonRef = useRef(null);


  const [ClassData, setClassData] = useState([
    {
      name: "Class I (A)",
      category_id: {
        _id: "121",
        "name": "sad"
      },
      subjects: [
        {
          _id: "a1212",
          name: 'adsas'
        }
      ],
   
    },


  ]);





  function getRandomString() {
    let uniqueKey = randomstring.generate({
      length: 12,
      charset: "alphanumeric",
    });

    return uniqueKey
  }


  const [openAlert, setOpenAlert] = useState(false);
  var deleteMsg = "JEEVAN";

  const [alertObj, setAlertObj] = useState({
    type: "header",
    title: "Are you sure, you want to Delete?",
    message: " Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.",
    confirmButton: {
      show: true,
      color: "green",
      text: "Confirm"
    },
    dismissButton: {
      show: true,
      color: "red",
      text: "Close"
    },
    icon: {
      show: true,
      color: "red",
      iconSelected: ExclamationTriangleIcon,
    },
    inputBox: {
      show: true,
      placeholder: deleteMsg,
      label: `Enter ${deleteMsg} to delete`,
      errorMessage: "Unable to delete",


    }
  });


  const [inputObj, setInputObj] = useState({
    type: "text",

    icon: {
      show: true,
      position: "left",
      iconSelected: BuildingLibraryIcon,
    },
    label: {
      text: "Name",
      show: false,
      position: "top",

    },
    value: "",
    enabled: true,
    placeholder: "Enter Category",
    errorMessage: "Please enter a caregory name to add!",
  });



  useEffect(() => {

    // getSchooldata();


    getSchool_id();

    // ClassData
  }, []);



  const getSchool_id = async () => {

    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=getSchool_id",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    console.log(data, "getSchool_id")
    if (data.data) {


      // setpeople(data.data)
      setschool_id(data.data[0]._id)
      var tempschool_id = data.data[0]._id;

      getCategoryInfo(tempschool_id);
      getSubectInfo(tempschool_id);
      getClassData(tempschool_id);


    }

  };


  const getClassData = async (tempschool_id) => {

    const res = await fetch(
      "/api/ClassesAPI?school_id=" + tempschool_id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    var data = await res.json();
    console.log("restaurent Data>>>>", data);

    setClassData(data.data)

  };





  const getCategoryInfo = async (tempschool_id) => {

    const res = await fetch(
      // "/api/All_fetch_queriesAPI?type=classes&school_id=" + school_id,
      "/api/All_fetch_queriesAPI?type=category&school_id=" + tempschool_id,


      // "/api/All_fetch_queriesAPI?type=classes",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    console.log(data, "data")
    if (data.data) {
      console.log(formElements, "formElements")

      let index = formElements.findIndex((e) => e.name == 'category_id');

      formElements[index].list = data.data;

      // setformElements({
      //   ...formElements, // Copy the old fields
      //   formElements // But override this one
      // });


    }

  };


  const getSubectInfo = async (tempschool_id) => {

    const res = await fetch(
      // "/api/All_fetch_queriesAPI?type=classes&school_id=" + school_id,
      "/api/All_fetch_queriesAPI?type=school_subject_data&school_id=" + tempschool_id,


      // "/api/All_fetch_queriesAPI?type=classes",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    console.log(data, "data")

    if (data.data) {


      const transformed = data.data.map(({ _id, name }) => ({ label: name, value: _id }));


      let index = formElements.findIndex((e) => e.name == 'subjects');


      formElements[index].list = transformed;

    }



  };


 



  //Alert button triggers
  const cancelTrigger = () => {
    setOpenAlert(false);
  }

  function confirmTrigger() {
    console.log("confirm");
    setOpenAlert(false);


  }

  const inputValue = (param) => {
    // let newObj = txtAreaObj.label;
    // newObj.text = param;
    setInputObj({
      ...inputObj, // Copy the old fields
      value: param, // But override this one

    });
  }

  const [buttonObj, setButtonObj] = useState({
    label: "Add Category",

    icon: {
      show: false,
      position: "left",
      icon: ExclamationTriangleIcon,
    },
    padding: {
      xAxisMob: "px-2",
      yAxisMob: "py-2",
      xAxis: "px-3",
      yAxis: "py-3",
    },
    bgColor: "indigo",
    textColor: "white",
    enabled: true,
    loading: false,
    loadingText: "",
    errorMessage: "",

  });



  const buttonTrigger = () => {
    setButtonObj({
      ...buttonObj, // Copy the old fields
      loading: true, // But override this one

    });
  }

  const [editButtonObj, setEditButtonObj] = useState({
    label: "Save Category",

    icon: {
      show: false,
      position: "left",
      icon: ExclamationTriangleIcon,
    },
    bgColor: "slate",
    textColor: "white",
    enabled: true,
    loading: false,
    loadingText: "",
    errorMessage: "",

  });



  const editButtonTrigger = () => {
    setEditButtonObj({
      ...editButtonObj, // Copy the old fields
      loading: true, // But override this one

    });
  }



  // Enter Class

  const [classObj, setClassObj] = useState({
    type: "text",
    icon: {
      show: true,
      position: "left",
      iconSelected: BuildingLibraryIcon,
    },
    label: {
      text: "Class Name",
      show: true,
      position: "top",

    },
    value: "",
    enabled: true,
    placeholder: "Enter Category",
    errorMessage: "Please enter a caregory name to add!",
  });
  const classValue = (param) => {
    // let newObj = txtAreaObj.label;
    // newObj.text = param;
    setClassObj({
      ...classObj, // Copy the old fields
      value: param, // But override this one

    });
  }





  // Enter Section
  const [sectionObj, setSectionObj] = useState({
    type: "text",
    icon: {
      show: true,
      position: "left",
      iconSelected: BuildingLibraryIcon,
    },
    label: {
      text: "Section Name",
      show: true,
      position: "top",

    },
    value: "",
    enabled: true,
    placeholder: "Enter Section",
    errorMessage: "Please enter a Section name to add!",
  });

  const sectionValue = (param) => {
    // let newObj = txtAreaObj.label;
    // newObj.text = param;
    setSectionObj({
      ...sectionObj, // Copy the old fields
      value: param, // But override this one

    });
  }


  //   Select Category
  const [categoryObj, setCategoryObj] = useState({
    label: {
      show: true,
      text: "Select Class",
    },
    list: classList,
    allowNew: {
      show: false,
      text: "Add Dude",
      icon: 'BarsArrowUpIcon',
    },
    selected: 'none',
    errorMessage: "Wornt work"
  });



  const categoryDropdownChanged = (id) => {
    let index = list.findIndex((e) => e.id == id);
    setCategoryObj({
      ...categoryObj, // Copy the old fields
      selected: list[index], // But override this one
    });
  };




  const [validate, setValidate] = useState(false)
  let finalObj = {

    "school_id": school_id
  };



  const [formElements, setformElements] = useState([


    {
      name: 'classname',
      placeholder: "Enter Class Name Ex: X ",
      label: { //
        text: 'Class Name',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      schema: z.object({
        inputFieldName: z.string({
          required_error: "Value is required",
          invalid_type_error: "Value must be a text",
        })
          .min(3, { message: 'Min 3 characters' })
          .max(40, { message: 'Max 40 characters' }),
      }),
      data: ''

    },

    {
      id: getRandomString(),
      name: 'category_id',
      list: [
      ],
      label: { //
        text: 'Select Category',
        show: true,
      },
      defaultValuedata: {
        // "_id": "please select Category",
        // "name": "please select Category"
      },
      isValidated: false,
      required: true,




    },
    {
      id: getRandomString(),
      name: 'subjects',
      list: [
      ],
      label: { //
        text: 'Select Subject',
        show: true,
      },
      defaultValuedata: [

      ],
      isValidated: false,
      required: true,



    }




  ])


  // let formElements =




  let addBtnProps = [{
    name: 'createbtn',
    label: { //
      text: 'Create Class ',
      show: true
    }

  }, {
    name: 'savebtn',
    label: { //
      text: 'Save Class Data ',
      show: true
    }

  }]




  function checkFields() {

    // setButtonLoading(true)

    // setButtonLoadingText('Creating A Class..')





    emptyformData();

    setopenpopup(true)


    setiseditable({
      ...iseditable,
      checkdata: false,
      editable_id: "",
    });


  }




  function emptyformData() {
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
        console.log(checkdata, "emptyformData checkdata");

      } else {
        obj.data = '';

      }



    }


  }
  function obj_or_arr(val) {
    if (typeof val === "object") { // return if is not array or object
      try {
        for (x of val)  // is no errors happens here is an array
          break;
        return "array";
      } catch {
        return "object"; // if there was an error is an object
      }
    } else return false;
  }
  async function sendData(data) {


    // setValidate(false)

    setValidate(false)



    let formValidated = await validationHandler(data)


    console.log(formValidated, "formValidated")
    console.log(formElements, "formElements")


    if (formValidated == true) {





      createfetchdata()


    }

  }


  function viewSubjects(id) {

    setOpenCategory(true);

    var finalresult = ClassData.filter(val => val._id == id);



    setcurrentSubjectData(finalresult[0].subjects);

  }
  function editclass(id) {

    emptyformData();


    var finalresult = ClassData.filter(val => val._id == id);


    const transformed = finalresult[0].subjects.map(({ _id, name }) => ({ label: name, value: _id }));










    for (let index = 0; index < formElements.length; index++) {
      const name = formElements[index].name;
      const indiobj = formElements[index];


      if (name == "classname") {
        indiobj.data = finalresult[0].name;

      } else if (name == "category_id") {
        indiobj.defaultValuedata = finalresult[0].category_id;

      }  else if (name == "subjects") {
        indiobj.defaultValuedata = transformed

      }

    }


    setiseditable({
      ...iseditable,
      checkdata: true,
      editable_id: id,
    });

    setopenpopup(true);





  }

  async function deleteClass(id) {

    const res = await fetch("/api/ClassesAPI", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "type": "delete",
        "_id": id,
      }),
    });
    //Await for data for any desirable next steps
    var data = await res.json();


    if (data.errors) {
      // setErrMessage(data.errors[0].msg);
    } else {
      if (data.status == 422 || data.status == 400 || data.status == 500) {
        setErrMessage("Oops! Please try again");
      } else {

        // goToNext();
        getClassData(school_id);
      }
    }
  }

  function validationHandler(params) {

    let formValidated = false;

    const result = formElements.filter(element => element.id == params.id)[0];

    if (params.hasOwnProperty('valid')) {
      if (params.valid == true) {
        result.isValidated = true;

        if ('type' in params) {
          if (params.type == 'multiselect') {

            var temparr = [];
            for (let index = 0; index < params.value.length; index++) {
              const element = params.value[index].value;
              temparr.push(element)
            }


            finalObj[params.name] = temparr;

          } else if (params.type == 'dropdown') {

            finalObj[params.name] = params.value._id;

          } else {

            finalObj[params.name] = params.value;

          }
        }

      } else {
        result.isValidated = false;

        if ('type' in params) {
          if (params.type == 'multiselect') {




            result.defaultValuedata = params.value;


          } else if (params.type == 'dropdown') {


            result.defaultValuedata = params.value;


          } else {


            result.data = params.value;


          }
        }
      }
    }

    else {
      finalObj[params.name] = params.value;

    }


    const validationResults = formElements.filter(element => element.isValidated == false);


    if (validationResults.length == 0) {

      formValidated = true


    }


    return formValidated
  }






  async function createClass() {

    setValidate(true)


  }

  async function createfetchdata() {



    var requesttype;
    if (iseditable.checkdata == true) {
      requesttype = "PUT";
      finalObj._id = iseditable.editable_id;
      finalObj.type = "edit";

    } else {
      requesttype = "POST";
    }


    const res = await fetch("/api/ClassesAPI", {
      method: requesttype,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalObj),
    });
    //Await for data for any desirable next steps
    var data = await res.json();

    console.log("Data>>>>", data);
    console.log("Data>>>>", data);


    if (data.errors) {
      // setErrMessage(data.errors[0].msg);
    } else {
      if (data.status == 422 || data.status == 400 || data.status == 500) {
        setErrMessage("Oops! Please try again");
      } else {

        // goToNext();

        setopenpopup(false)

        getClassData(school_id);
      }
    }



  }








  function triggerdata(type) {

    for (let index = 0; index < formElements.length; index++) {
      const element = formElements[index];
      if (element.name == type) {
        return element;
      }

    }



  }
  return (
    <LayoutMini>
    <div className="m-auto md:px-6 md:py-3">
        <div className="m-auto md:py-3">
        <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg px-2 py-2">
                Classes & Sections:
              </h2>
              <p className="text-xs text-gray-500 md:max-w-3xl pl-3">
                Add your classes Ex: 10-A , 10-B
              </p>
            </div>
            {/* <div className="mt-6">
              <Button loading={buttonLoading} loadingText={buttonLoadingText} {...addBtnProps[0]} click={(e) => checkFields()} />
            </div> */}
           <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex sm:space-x-4">
              <button onClick={() => checkFields()}
                type="button"
                className="sm:text-md inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                Create Classes & Sections
              </button>
            </div>

          </div>


          <div className="max-w-xl pt-4 sm:pt-10">

            {/* <div className="px-4 sm:px-6 lg:px-8"> */}

            {ClassData.length == 0 && (
              <div className="pl-0 text-center py-10 sm:py-24 mt-3 max-w-xl text-md sm:text-4xl border border-slate-400 text-slate-400 rounded-lg shadow-sm">
               There is no data to display
              </div>
            )}
            {ClassData.length != 0 && (
              <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">


                      <table className="max-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr className="divide-x divide-gray-200">
                            <th scope="col" className="text-center w-36 py-3.5 px-2 text-left text-md font-semibold text-gray-900 sm:pl-4">
                              Class
                            </th>
                            <th scope="col" className="text-center w-full px-2 py-3.5 text-left text-md font-semibold text-gray-900">
                              Category Name
                            </th>
                            <th scope="col" className="text-center w-full px-2 py-3.5 text-left text-md font-semibold text-gray-900">
                              Subjects
                            </th>

                            <th scope="col" className="text-center w-full px-2 py-3.5 text-left text-md font-semibold text-gray-900">
                              Actions
                            </th>

                            {/* <th scope="col" className="px-4 py-3.5 text-left text-lg font-semibold text-gray-900">

                        </th> */}
                          </tr>
                        </thead>

                        {ClassData.length == 0 && (
                          <div className="pl-0 text-center py-4 sm:py-6 mt-3 max-w-xl text-md sm:text-4xl border border-slate-400 text-slate-400 rounded-lg shadow-sm">
                            You haven't added any
                            Category
                          </div>
                        )}

                        {ClassData.length != 0 && (

                          <tbody className="divide-y divide-gray-200 bg-white text-center">

                            {ClassData.map((person) => (
                              <tr key={person.name} className="divide-x divide-gray-200">
                                <td className="whitespace-nowrap py-3 px-2 text-md font-medium text-gray-900 sm:pl-4">
                                  {person.name}
                                </td>
                                <td className="whitespace-nowrap p-3 text-md text-gray-500">{person.category_id.name}</td>
                                <td className="whitespace-nowrap p-3 text-md text-gray-500 ">

                                  <span onClick={() => viewSubjects(person._id)} className="inline-flex items-center rounded-md bg-indigo-100 px-6 py-2 text-md font-bold text-indigo-600">
                                    {person.subjects.length}
                                  </span>



                                </td>
                             

                                <td className="px-3 py-5 text-md flex justify-start tems-center">
                                  <a onClick={() => editclass(person._id)} className="text-indigo-600 hover:text-indigo-900 pointer underline">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-400" fill="none"
                                      viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span className="sr-only">, {person.number}</span>
                                  </a>
                                  <a onClick={() => deleteClass(person._id)} className="ml-4 text-red-400 hover:text-red-500 pointer underline">
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
                        )}

                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* </div> */}
        </div>


      {/*  */}

      <Transition.Root show={openCategory} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenCategory}>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-10 sm:w-full sm:max-w-3xl sm:p-10">
                  <Dialog.Title as="h3" className="text-3xl font-medium leading-6 text-gray-900">
                    Classes
                  </Dialog.Title>
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpenCategory(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div>

                    <div className="mt-6 flow-root">
                      <ul role="list" className="-my-5 divide-y divide-gray-200">
                        {currentSubjectData.map((person) => (
                          <li key={person._id} className="py-4">
                            <div className="flex items-center space-x-4">

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">


                                  {person.name}

                                </p>
                              </div>
                              {/* <div>
                                <a
                                  href="#"
                                  className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                  View
                                </a>
                              </div> */}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>



      <Transition.Root show={openpopup} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setopenpopup}>
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

                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-10 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-10">

                  {/* <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-10 sm:w-full sm:max-w-3xl sm:p-10"> */}
                  <Dialog.Title as="h3" className="text-3xl font-extrabold text-slate-400">
                    Classes
                  </Dialog.Title>
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setopenpopup(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div>

                    <div className="mt-2 flow-root">

                      {/* <div className="lg:max-w-5xl max-w-full mt-4 grid grid-cols-2 sm:grid-cols-2 gap-3 justify-start w-full justify-start items-center"> */}
                      <div className="mt-3 text-left sm:mt-5">

                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-1 gap-5">

                          <div className="mt-2">
                            <Input validate={validate} {...triggerdata('classname')} sendData={sendData} />
                          </div>

                          <div>
                            <Dropdown validate={validate} {...triggerdata('category_id')} sendData={sendData} />
                          </div>

                          <div>
                            <MultiSelect validate={validate} {...triggerdata('subjects')} sendData={sendData} />
                          </div>

                    


                        </div>



                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-5">

                        </div>




                      </div>
                      <div className="mt-6">

                        <Button loading={buttonLoading} loadingText={buttonLoadingText} {...addBtnProps[1]} click={(e) => createClass(e)} />


                      </div>


                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>


      <Alert
        openAlert={openAlert}
        cancelTrigger={cancelTrigger}
        data={alertObj}
        confirmTrigger={confirmTrigger}
      />
    </div>
    </LayoutMini>

  );
}
