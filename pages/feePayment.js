import Dropdown from "../components/Dropdown";
import Input from "../components/Input";
import Button from "../components/Button";
import LayoutMini from "../components/LayoutMini";
import DateTimePicker from "../components/DateTimePicker";
import { useState, useEffect, Fragment, useRef } from "react";
import * as z from "zod";
import randomstring from "randomstring";
import DataTable from "../components/DataTable";
import { Dialog, Transition } from "@headlessui/react";
import { BookOpenIcon, BuildingLibraryIcon, PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon, XMarkIcon, EnvelopeIcon, ListBulletIcon, ClockIcon } from '@heroicons/react/24/outline';


function getRandomString() {
  let uniqueKey = randomstring.generate({
    length: 12,
    charset: "alphanumeric",
  });

  return uniqueKey;
}

let addBtnProps = {
  name: "buttonComp",

  label: {
    //
    text: "Save Transaction",
    show: true,
  },
};

let dataTableProps = {
  showEdit: true,
  showDelete: false,
  heading: "Student Attendance",
  subHeading:
    "Select Options Above. Click on Edit icon to change attendance. Save after editing.",
  button: {
    //
    text: "Save",
    show: true,
  },
};



export default function FeePayment() {
  const [validate, setValidate] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonLoadingText, setButtonLoadingText] = useState("Saving..");
  const [tableUpdated, setTableUpdated] = useState([]);
  let school_id = "";
  const [schoolID, setSchoolID] = useState("");
  const [editStudentDetails, setEditStudentDetails] = useState({});
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [changeDate, setChangeDate] = useState(new Date());

  const [iseditable, setiseditable] = useState({
    checkdata: false,
    editable_id: "asd233d3"
  })

  const transactions = [
    {
      id: 'Nursery A',
      company: 'Shirish K',
      share: 'March 25, 2023',
      commission: '25000',
      price: 'Card',
      quantity: 'R646U78P',
    },
    {
      id: 'Class 1 A',
      company: 'Anand G',
      share: 'June 25, 2023',
      commission: '55000',
      price: 'Card',
      quantity: 'R646X78P',
    },
    {
      id: 'Class 2 B',
      company: 'Kiran U',
      share: 'April 25, 2023',
      commission: '75000',
      price: 'Cash',
      quantity: 'R446G79P',
    },
    // More transactions...
  ]

  const cancelButtonRef = useRef(null)

  let classID = "";

  const [formElements, setformElements] = useState([
    {
      id: getRandomString(),
      name: "class",
      list: [],
      label: {
        //
        text: "Select Class",
        show: true,
      },
      defaultValuedata: {
        "_id": "please select Data",
        "name": "please select Data"
      },
      isValidated: false,
      required: true,

    },

    {
      id: getRandomString(),
      name: "student_id",
      list: [],
      label: {
        //
        text: "Select Student",
        show: true,
      },
      defaultValuedata: {
        "_id": "please select Data",
        "name": "please select Data"
      },
      isValidated: false,
      required: true,


    },
    {
      name: "paymentDate",
      pickerType: "date",
      selectionType: "single",
      placeholder: "Fee Payment Date",
      label: {
        //
        text: "Fee Payment Date",
        show: true,
        position: "top",
      },
      id: getRandomString(),
      isValidated: false,
      required: true,

    },
    {
      name: "feeAmount",
      type: "text",
      placeholder: "Add Amount Ex: 25000",
      label: {
        //
        text: "Fee Amount",
        show: true,
        position: "top",
      },
      id: getRandomString(),
      isValidated: false,
      required: false,
      schema: z.object({
        inputFieldName: z.string({
          required_error: "Value is required",
          invalid_type_error: "Value must be a text",
        })
          .min(3, { message: 'Min 3 characters' })
          .max(40, { message: 'Max 40 characters' }),
      }),
    },
    {
      id: getRandomString(),
      name: "mode",
      list: [
        {
          _id: "cash",
          name: "Cash",
        },
        {
          _id: "card",
          name: "Card",
        },
        {
          _id: "upi",
          name: "Upi",
        },
      ],
      label: {
        //
        text: "Payment Mode",
        show: true,
      },
      defaultValuedata: {
        "_id": "please select Data",
        "name": "please select Data"
      },
      isValidated: false,
      required: true,

    },
    {
      name: "transactionId",
      type: "text",
      placeholder: "Transaction ID",
      label: {
        //
        text: "Transaction ID",
        show: true,
        position: "top",
      },
      id: getRandomString(),
      isValidated: false,
      required: false,
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

  const getClassData = async () => {
    school_id = school_id || schoolID;

    const res = await fetch("/api/ClassesAPI?school_id=" + school_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    var data = await res.json();

    if (data.data) {
      let index = formElements.findIndex((e) => e.name == "class");

      let newArr = [...formElements];
      newArr[index].list = data.data;

      setformElements(newArr);
    }

  };


  const getStudentList = async () => {
    if (classID) {
      school_id = school_id || schoolID;

      const res = await fetch(
        "/api/All_fetch_queriesAPI?type=school_attendance_data&school_id=" +
        school_id +
        "&class_id=" +
        classID,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      console.log("Students List>>>>>", data.data);
      if (data.data) {

        let createArray = []

        for (const iterator of data.data) {
          createArray.push({
            _id: iterator._id,
            name: `${iterator.first_name} ${iterator.last_name} (${iterator.student_personal_id})`,
          });
        }

        let index = formElements.findIndex((e) => e.name == "student_id");

        let newArr = [...formElements];
        newArr[index].list = createArray;

        setformElements(newArr);
      }
    }
  };

  const getSchool_id = async () => {
    const res = await fetch("/api/All_fetch_queriesAPI?type=getSchool_id", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.data) {
      setSchoolID(data.data[0]._id);
      school_id = data.data[0]._id || schoolID;

      getClassData();


      fetchData(school_id);

    }
  };

  async function fetchData(school_id1) {
    let data21 = await getdatatabledata(0, 5, undefined, school_id1);
    console.log(data21, "fetchData data");

    if ('data' in data21) {
      setAriaInfo(data21.data);

    }

  }

  useEffect(() => {
    getSchool_id();
  }, []);


  let finalObj = {
    school_id: school_id,
  };

  function checkFields(e) {
    setIsvalidated();


    setValidate(true);

  }





  function setIsvalidated() {
    for (let index = 0; index < formElements.length; index++) {
      const obj = formElements[index];
      obj.isValidated = false;





    }


  }


  function validationHandler(params) {



    let formValidated = false;

    const result = formElements.filter((element) => element.id == params.id)[0];
    result.isValidated = false;

    if (params.hasOwnProperty("valid")) {
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
            result.defaultValuedata = params.value;


          } else if (params.type == 'dropdown') {

            finalObj[params.name] = params.value._id;
            result.defaultValuedata = params.value;


          } else {

            finalObj[params.name] = params.value;
            result.data = params.value;

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
    } else {
      finalObj[params.name] = params.value;
    }






    const validationResults = formElements.filter(
      (element) => element.isValidated == false
    );


    if (validationResults.length == 0) {
      formValidated = true;
    }

    return formValidated;
  }

  async function sendData(data) {
    setValidate(false);






    console.log("sendData sendData>>>>", data);




    if (data.name == "class") {

      classID = data.value._id;


      // Reset Selected Student

      let index = formElements.findIndex((e) => e.name == "student_id");

      let newArr = [...formElements];
      newArr[index].list = []
      newArr[index].defaultValuedata = {
        _id: "Select Value",
        name: "Select Value",
      }

      console.log(newArr, "newArr")

      setformElements(newArr);



      // const updatedItems = formElements.map(item => {
      //   if (item.name == 'student_id') {
      //     return {
      //       ...item,
      //       defaultValuedata: {
      //         _id: "Select Value",
      //         name: "Select Value",
      //       }, list: []
      //     };

      //   }


      // });

      // console.log(updatedItems,"updatedItems")


      // setformElements(updatedItems);

      // defaultValuedata

      getStudentList();
    }


    let formValidated = await validationHandler(data)





    if (formValidated == true) {


      createfetchdata();
      console.log(formValidated, "formValidated")
      console.log(formElements, "formElements")

    } else {
      console.log(formValidated, "formValidated")
      console.log(formElements, "formElements")
    }









  }

  async function createfetchdata() {
    var requesttype;



    if (iseditable.checkdata == true) {
      requesttype = "PUT";
      finalObj._id = iseditable.editable_id;
      finalObj.school_id = schoolID;
      finalObj.type = 'update';



    } else {
      requesttype = "POST";
      finalObj.school_id = schoolID;

    }

    console.log(finalObj, "finalObj")

    const res = await fetch("/api/feePaymentAPI", {
      method: requesttype,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalObj),
    });
    //Await for data for any desirable next steps
    var data = await res.json();

    if (data.errors) {
      // setErrMessage(data.errors[0].msg);
    } else {
      if (data.status == 422 || data.status == 400 || data.status == 500) {
        setErrMessage("Oops! Please try again");
      } else {
        // getStudentInfo();

        setOpenCategory(false);

        fetchData(schoolID);
      }
    }
  }





  const [openCategory, setOpenCategory] = useState(false);
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
          obj.defaultValuedata = [

          ];
        }
        console.log(checkdata, "emptyformData checkdata");

      } else {
        obj.data = '';

      }



    }


  }


  function editData(data) {

    console.log(data, "editData")

    emptyformData();


    setiseditable({
      ...iseditable,
      checkdata: true,
      editable_id: data.rawdata._id,
    });




    for (let index = 0; index < formElements.length; index++) {
      const name = formElements[index].name;
      const indiobj = formElements[index];


      if (name == "class") {
        // indiobj.data = data.transaction_id;

        indiobj.defaultValuedata = data.rawdata.class_id;

      } else if (name == "student_id") {


        indiobj.defaultValuedata =
        {
          _id: data.rawdata.student_id._id,
          name: `${data.rawdata.student_id.first_name} ${data.rawdata.student_id.last_name} `,
        };


      }
      else if (name == "paymentDate") {
        // indiobj.data = data.last_name;
        indiobj['startDate'] = new Date(data.rawdata.payment_date);

      }
      else if (name == "mode") {
        var mode = data.rawdata.mode;
        if (mode == 'cash') {
          indiobj.defaultValuedata = {
            _id: "cash",
            name: "Cash",
          };

        } else if (mode == 'card') {
          indiobj.defaultValuedata = {
            _id: "card",
            name: "Card",
          };

        } else {
          indiobj.defaultValuedata = {
            _id: "upi",
            name: "Upi",
          };

        }




      }
      else if (name == "feeAmount") {
        indiobj.data = data.rawdata.amount;

      }
      else if (name == "transactionId") {
        indiobj.data = data.rawdata.transaction_id;

      }












    }



    setOpenCategory(true);





  }

  async function DeleteData(data) {


    console.log(data, "deleteedata")

    const res = await fetch("/api/feePaymentAPI", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "_id": data.rawdata._id,
      }),
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
        fetchData(schoolID);

      }
    }


  }
  function createfeepayment() {
    setOpenCategory(true);

    emptyformData();

    setiseditable({
      ...iseditable,
      checkdata: false,
      editable_id: '',
    });


  }









  let dataTableColumns = [
    // {
    //   header: "Brand",
    //   accessor: "brand",
    //   type: "filter",
    // },

    // view all data , change parent Data , delete student Datata


    {
      header: "Student Name",
      accessor: "student_name",
    },
    {
      header: "Class Name",
      accessor: "class_name",
    },
    {
      header: "Fee Amount",
      accessor: "amount",
    },

    {
      header: "Payment Mode",
      accessor: "mode",
    },
    {
      header: "Transaction ID",
      accessor: "transaction_id",
    },


  ];

  let setSkip = 0;
  let setLimit = 10;

  let dataTableProps = {
    showEdit: true,
    showDelete: true,
    showButtonsData: true,
    heading: "Fee Records  ",
    subHeading: "Search by Fee amount (or) Transaction ID  ",
  };










  const search = async (query) => {
    seachText.current = { value: query };

    let data = await getdatatabledata(0, 5, query, schoolID);
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
      res = await fetch(
        `/api/All_searchable_queryAPI?type=get_fee_payment&request_type=search&school_id=${school_id1}&searchTerm=${query}&skip=${skip}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      res = await fetch(
        `/api/All_searchable_queryAPI?type=get_fee_payment&request_type=getallData&school_id=${school_id1}&skip=${skip}&limit=${limit}`,
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
      <div className="md:px-6 md:py-3">
        <div className="pb-5 sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg px-2 py-2">
              Fees Payment
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-xs md:mt-2 md:max-w-3xl pl-3">
              All your fee structure details
            </p>
          </div>

          <div className="mt-2 flex sm:mt-0 sm:ml-4">
            <button onClick={() => createfeepayment()}
              type="button"
              className="sm:text-md inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-3 h-6 w-6" aria-hidden="true" />
              Create A Fee Payment
            </button>
          </div>
        </div>




        <div className="flex min-h-full flex-col justify-start">
          <div className="mt-8 sm:w-full sm:max-w-full">
            <div className=" p-2 m-2">



              <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900"></h1>
                    <p className="mt-2 text-sm text-gray-700">
                      Payment Details
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                      type="button"
                      className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Export
                    </button>
                  </div>
                </div>
                <div className="mt-8 flow-root">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <table className="min-w-full bg-gray-100 divide-y divide-gray-300 border border-gray-200">
                        <thead>
                          <tr className="divide-x divide-gray-300">
                            <th
                              scope="col"
                              className="whitespace-nowrap py-3.5 pl-4 pr-3 text-center text-md font-semibold text-gray-900 sm:pl-0"
                            >
                              Class Name
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-center text-md font-semibold text-gray-900"
                            >
                              Student Name
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-center text-md font-semibold text-gray-900"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-center text-md font-semibold text-gray-900"
                            >
                              Amount
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-center text-md font-semibold text-gray-900"
                            >
                              Payment Mode
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-center text-md font-semibold text-gray-900"
                            >
                              Transaction Id
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-center text-md font-semibold text-gray-900"
                            >
                              Actions
                            </th>
                            {/* <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th> */}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-center">
                          {transactions.map((transaction) => (
                            <tr key={transaction.id} className="divide-x divide-gray-300">
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{transaction.id}</td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm font-normal text-gray-900">
                                {transaction.company}
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{transaction.share}</td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{transaction.commission}</td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{transaction.price}</td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{transaction.quantity}</td>
                              {/* <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{transaction.netAmount}</td> */}
                              <td className="flex space-x-4 mx-auto justify-center relative whitespace-nowrap py-2 pl-3 pr-4 text-sm font-normal sm:pr-0">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </a>

                                <a href="#" className="text-red-600 hover:text-red-900">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
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
            </div>
          </div>
        </div>
      </div>


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

                      <form className="space-y-6">
                        {formElements.map((objdata, index) => (
                          <div key={objdata.id}>
                            {objdata.name == "class" && (
                              <Dropdown
                                {...formElements[index]}
                                sendData={sendData}
                                validate={validate}
                              />
                            )}

                            {objdata.name == "student_id" && (
                              <Dropdown
                                {...formElements[index]}
                                sendData={sendData}
                                validate={validate}
                              />
                            )}

                            {objdata.name == "paymentDate" && (
                              <DateTimePicker
                                {...formElements[index]}
                                sendData={sendData}
                                validate={validate}
                              />
                            )}

                            {objdata.name == "mode" && (
                              <Dropdown
                                {...formElements[index]}
                                sendData={sendData}
                                validate={validate}
                              />
                            )}

                            {objdata.name == "feeAmount" && (
                              <Input
                                {...formElements[index]}
                                sendData={sendData}
                                validate={validate}
                              />
                            )}

                            {objdata.name == "transactionId" && (
                              <Input
                                {...formElements[index]}
                                sendData={sendData}
                                validate={validate}
                              />
                            )}
                          </div>
                        ))}

                        <Button
                          loading={buttonLoading}
                          loadingText={buttonLoadingText}
                          {...addBtnProps}
                          click={(e) => checkFields(e)}
                        />
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={openEditPopup} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenEditPopup}>
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
                <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Edit Student Attendance
                      </Dialog.Title>

                      <div className="mt-2 grid grid-cols-1 gap-4">
                        First Name : {editStudentDetails.first_name}
                        <br></br>
                        Last Name : {editStudentDetails.last_name}
                        <br></br>
                        Date : {editStudentDetails.displayDate}
                        <Dropdown
                          {...formElements[3]}
                          sendData={sendData}
                          validate={validate}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-4">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                      onClick={(e) => checkFields(e)}
                    >
                      Edit Attendance
                    </button>
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