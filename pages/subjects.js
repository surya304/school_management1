


import { Fragment, useState, useEffect, useRef } from "react";

import { BuildingLibraryIcon, PlusIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon, HomeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import LayoutMini from "../components/LayoutMini";
import Alert from "../components/Alert";

import Input from "../components/Input";
import Button from "../components/Button";

import DataTable from '../components/DataTable'

import { useSession } from "next-auth/react";


import { z } from "zod";

import { Dialog, Transition } from '@headlessui/react'
import randomstring from "randomstring";


let dataTableColumns = [
  // {
  //   header: "Brand",
  //   accessor: "brand",
  //   type: "filter",
  // },
  {
    header: "Name",
    accessor: "name",
  },

  // {
  //   header: "Action",
  //   accessor: "Action",
  // },
];

let setSkip = 0;
let setLimit = 10;

let dataTableProps = {
  showEdit: true,
  showDelete: true,
  heading: " ",
  subHeading: "",
};





export default function Home() {
  const [openCategory, setOpenCategory] = useState(false);
  const [currenttype, setcurrenttype] = useState("create");
  const [openpopup, setopenpopup] = useState(false);
  const [currentSubjectData, setcurrentSubjectData] = useState([]);

  const [school_id, setschool_id] = useState("");

  const { data: session } = useSession();

  // Access the user ID from the session
  const userId = session?.user?.id;

  console.log("User ID:", userId);

  const [iseditable, setiseditable] = useState({
    checkdata: false,
    editable_id: "asd233d3",
  })
  // const [school_id, setschool_id] = useState("63e360af282e97031d9b02e9");




  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonLoadingText, setButtonLoadingText] = useState('Loading..')
  const cancelButtonRef = useRef(null);


  const [subjectData, setsubjectData] = useState([

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













  //Alert button triggers
  const cancelTrigger = () => {
    setOpenAlert(false);
  }

  function confirmTrigger() {
    console.log("confirm");
    setOpenAlert(false);


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



  const [validate, setValidate] = useState(false)
  let finalObj = {

    "school_id": school_id
  };



  const [formElements, setformElements] = useState([
    {
      name: 'subject',
      placeholder: "Enter Class Name Ex: X ",
      label: { //
        text: 'Subject Name',
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


  ])
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





  // let formElements =




  let addBtnProps = [
    {
      name: 'Createsubject',

      label: { //
        text: 'Create Subject ',
        show: true
      }


    },
    {
      name: 'savesbject',

      label: { //
        text: 'Save Subject Data',
        show: true
      }


    }
  ]




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

  function createSubject() {

    // setButtonLoading(true)

    // setButtonLoadingText('Creating A Class..')

    // setValidate(true)


    emptyformData();




    setopenpopup(true)

    setiseditable({
      ...iseditable,
      checkdata: false,
      editable_id: "",

    });








  }




  async function sendData(data) {


    // setValidate(false)


    setValidate(false)



    let formValidated = await validationHandler(data)


    console.log(formValidated, "formValidated")

    if (formValidated == true) {





      createfetchdata()


    }

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


    console.log(finalObj, "finalObj")

    const res = await fetch("/api/subjectAPI", {
      method: requesttype,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalObj),
    });
    //Await for data for any desirable next steps
    var data = await res.json();

    console.log("Data>>>>", data);

    if (data.errors) {
      // setErrMessage(data.errors[0].msg);
    } else {
      if (data.status == 422 || data.status == 400 || data.status == 500) {
        setErrMessage("Oops! Please try again");
      } else {

        // goToNext();
        setopenpopup(false)

        async function fetchData() {
          let data = await getdatatabledata(0, 10, undefined, school_id);
          console.log(data, "fetchData data");

          setAriaInfo(data.data);

        }

        fetchData();

      }
    }





  }


  function editData(data) {


    emptyformData();


    setiseditable({
      ...iseditable,
      checkdata: true,
      editable_id: data._id,
    });

    formElements[0].data = data.name;

    console.log(formElements, "editSubject");

    setopenpopup(true);






  }




  async function DeleteData(data) {
    console.log(data, "DeleteData");

    const finalObj = { _id: data._id ,type:"delete" };

    try {
        const res = await fetch("/api/subjectAPI", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalObj),
        });

        console.log(res, "res");

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log("Data>>>>", result);

        if (result.errors) {
            // setErrMessage(result.errors[0].msg);
        } else if ([422, 400, 500].includes(result.status)) {
            setErrMessage("Oops! Please try again");
        } else {
          let data = await getdatatabledata(0, 10, undefined, school_id);
          console.log(data, "fetchData data");

          setAriaInfo(data.data);
        }
    } catch (error) {
        console.error("Error deleting subject:", error);
    }
}




  function validationHandler(params) {
    console.log(params, "params")

    let formValidated = false;

    const result = formElements.filter(element => element.id == params.id)[0];

    if (params.hasOwnProperty('valid')) {
      if (params.valid == true) {
        result.isValidated = true;
        finalObj[params.name] = params.value;
      }

      else {
        result.isValidated = false;
        result.data = params.value;
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






  async function savesubject(data) {


    setValidate(true)



  }








  useEffect(() => {

    getSchool_id();



    // var myNextList = [...formElements];





  }, []);

  const getSchool_id = async () => {

    const res = await fetch(
      // "/api/All_fetch_queriesAPI?type=classes&school_id=" + school_id,
      "/api/All_fetch_queriesAPI?type=getSchool_id",
      // "/api/All_fetch_queriesAPI?type=classes",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    console.log(data, "getCategoryInfo")
    if (data.data) {


      // setpeople(data.data)
      setschool_id(data.data[0]._id)



      fetchData(data.data[0]._id);


      async function fetchData(school_id1) {
        let data21 = await getdatatabledata(0, 10, undefined, school_id1);
        console.log(data21, "fetchData data");

        if ('data' in data21) {
          setAriaInfo(data21.data);

        }

      }


    }

  };

  const search = async (query) => {
    seachText.current = { value: query };

    let data = await getdatatabledata(0, 10, query, school_id);
    console.log(data, "search data");
    setAriaInfo(data.data);
  };

  const moveNext = async (skip, limit) => {

    console.log(skip, limit, "skip moveNext")

    let data = {};
    if (seachText.current && seachText.current.value !== "") {

      data = await getdatatabledata(skip + limit, limit, seachText.current.value, school_id);
    } else {
      data = await getdatatabledata(skip + limit, limit, undefined, school_id);
    }
    if (data.limit < limit) {
      data.limit = limit;
    }
    console.log(data, "moveNext")
    setAriaInfo(data.data);

  };

  const movePrev = async (skip, limit) => {
    console.log(skip, limit, "skip movePrev")

    let data = {};
    if (seachText.current && seachText.current.value !== "") {
      data = await getdatatabledata(skip - limit, limit, seachText.current.value, school_id);
    } else {
      data = await getdatatabledata(skip - limit, limit, undefined, school_id);
    }
    if (data.limit < limit) {
      data.limit = limit;
    }
    console.log(data, "movePrev")

    setAriaInfo(data.data);

  };

  const changeLimit = async (skip, limit) => {
    let data = {};
    if (seachText.current && seachText.current.value !== "") {
      data = await getdatatabledata(skip, limit, seachText.current.value, school_id);
    } else {
      data = await getdatatabledata(skip, limit, undefined, school_id);
    }
    setAriaInfo(data.data);

  };


  const [ariaInfo, setAriaInfo] = useState({
    products: [],
    skip: null,
    limit: 10,
    total: null,
  });
  const seachText = useRef();

  const getdatatabledata = async (skip, limit, query, school_id1) => {
    console.log(skip, limit, query, school_id1, "getdatatabledata")
    let res;
    if (query) {
      // res = await fetch(
      //   `https://dummyjson.com/products/search?skip=${skip}&limit=${limit}&q=${query}`
      // );

      res = await fetch(
        `/api/All_searchable_queryAPI?type=school_subject_search&request_type=search&school_id=${school_id1}&searchTerm=${query}&skip=${skip}&limit=${limit}`,


        // "/api/All_fetch_queriesAPI?type=classes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    } else {
      // res = await fetch(
      //   `https://dummyjson.com/products?skip=${skip}&limit=${limit}&q=${query}`
      // );


      res = await fetch(
        // "/api/All_searchable_queryAPI?type=school_subject_search&request_type=getallData&school_id=" + school_id,
        `/api/All_searchable_queryAPI?type=school_subject_search&request_type=getallData&school_id=${school_id1}&skip=${skip}&limit=${limit}`,





        // "/api/All_fetch_queriesAPI?type=classes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


    }
    const json = await res.json();
    return json;
  };




  return (
    <LayoutMini>
    <div className="m-auto md:px-6 md:py-3">
    <div>

        <div className="m-auto">
        <div className="flex justify-between">
            <div className="">
            <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg px-2 py-2">
              Subjects
            </h2>
            <p className="mt-1 max-w-md text-xs text-gray-500 sm:text-xs md:mt-2 md:max-w-3xl pl-3">
              Add your Subjects Ex: Maths,Science,Physics Etc...
            </p>
            </div>
            <div className="">
              <div className=" mt-4 w-full sm:text-center lg:mx-0 lg:text-left">
                  <button onClick={() => createSubject()}
                    type="button"
                    className="sm:text-md inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <PlusIcon className="-ml-1 mr-3 h-6 w-6" aria-hidden="true" />
                    Create Subject
                  </button>
                </div>
            </div>
          </div>

          <div className="px-8 py-2 mt-10 ml-4 border border-gray-200 md:max-w-2xl md:rounded-lg">

            {ariaInfo.products.length == 0 && (
              <div className="pl-0 text-center py-10 sm:py-24 mt-3 max-w-xl text-md sm:text-4xl border border-slate-400 text-slate-400 rounded-lg shadow-sm">
                There is no data to display
              </div>
            )}

            {ariaInfo.products.length != 0 && (

              <DataTable
                dataTableDataR={ariaInfo.products || []}
                skip={ariaInfo.skip}
                limit={ariaInfo.limit}
                total={ariaInfo.total}
                moveNext={moveNext}
                movePrev={movePrev}
                changeLimit={changeLimit}
                dataTableColumns={dataTableColumns}
                {...dataTableProps}
                search={search}
                getdatatabledata={getdatatabledata}
                editData={editData}
                DeleteData={DeleteData}


              />

            )}
          </div>



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
                    Subjects
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
                        {currentSubjectData.map((person,index) => (
                          <li key={index} className="py-4">
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-10 sm:w-full sm:max-w-sm sm:p-10">
                  <Dialog.Title as="h3" className="text-3xl font-extrabold leading-6 text-gray-400">
                    Subjects
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

                    <div className="mt-6 flow-root">

                      <div className="mt-4 grid grid-cols-1 gap-3 justify-start justify-start items-center">
                        <div>

                          <Input validate={validate} {...formElements[0]} sendData={sendData} />

                        </div>



                        <Button loading={buttonLoading} loadingText={buttonLoadingText} {...addBtnProps[1]} click={(e) => savesubject()} />




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
    </div>
    </LayoutMini>

  );
}
