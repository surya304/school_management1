import Dropdown from '../components/Dropdown'
import Button from '../components/Button'
import LayoutMini from '../components/LayoutMini'
import DateTimePicker from '../components/DateTimePicker'
import { useState, useEffect, Fragment, useRef } from 'react';
import randomstring from "randomstring";
import DataTable3 from '../components/DataTable3'
import { Dialog, Transition } from '@headlessui/react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function getRandomString() {
  let uniqueKey = randomstring.generate({
    length: 12,
    charset: "alphanumeric",
  });

  return uniqueKey
}



let addBtnProps = {
  name: 'buttonComp',

  label: { //
    text: 'Show Attendance',
    show: true
  }

}




let dataTableProps = {
  showEdit: true,
  showDelete: false,
  heading: '',
  subHeading: '',
  button: { //
    text: 'Save',
    show: true,
  },
  showReason : false

}



let dataTableColumns = [


  {
    header: 'Student ID',
    accessor: 'studentId',
  },

  {
    header: 'Student First Name',
    accessor: 'first_name',
  },
  {
    header: 'Student Last Name',
    accessor: 'last_name',
  },



  {
    header: 'Attendance',
    accessor: 'attendanceLabel',
  },


  {
    header: 'Action',
    accessor: 'attendance',
  }
]



export default function FeeStructure() {



  const [validate, setValidate] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonLoadingText, setButtonLoadingText] = useState('Loading..')
  const [tableUpdated, setTableUpdated] = useState([]);
  const [ariaInfo, setAriaInfo] = useState([]);
  let school_id = useRef("")
  let presentCount = useRef(0)
  let absentCount = useRef(0)
  let totalCount = useRef(0)
  const [editStudentDetails, setEditStudentDetails] = useState({});
  const [openEditPopup, setOpenEditPopup] = useState(false)
  const notify = (label) => toast(label);

  let classID = useRef("")
  let changeDate = useRef(new Date())

  const updateData = (rowIndex, columnId, value, row) => {
    setAriaInfo(data => {


      console.log(rowIndex, columnId, value, row, 'rowIndex, columnId, value');
      return {
        ...data,
        products: data.products.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...data.products[rowIndex],
              [columnId]: value
            }
          }
          return row
        })
      }
    })


    finalObj = {}
    finalObj["_id"] = row.original.student_id;
    finalObj["date_data"] = (changeDate.current).toLocaleDateString();
    finalObj["is_present"] = value;
    finalObj["attendance_id"] = row.original.attendance_id;


    console.log(finalObj, 'finalObj');


    createfetchdata()

  }

  const [formElements, setformElements] = useState([
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
        "_id": "",
        "name": "Select Value"
      },
      isValidated: false,
    },

    {
      id: getRandomString(),
      name: 'class',
      list: [
      ],
      label: { //
        text: 'Select Class',
        show: true,
      },
      defaultValuedata: {
        "_id": "",
        "name": "Select Value"
      },
      isValidated: false,

    }, {


      name: 'attendanceDate',
      pickerType: "date",
      selectionType: 'single',
      placeholder: "Select a Date",
      label: { //
        text: 'Select a Date',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,

    }


    //   {
    //     id: getRandomString(),
    //     name: 'attendance',
    //     list: [
    //       {
    //         "_id": "present",
    //         "name": "Present"
    //       },
    //       {
    //         "_id": "absent",
    //         "name": "Absent"
    //       }
    //     ],
    //     label: { //
    //       text: 'Edit Attendance',
    //       show: true,
    //     },
    //     defaultValuedata: {
    //       "_id": "present",
    //       "name": "Present"
    //     },
    //     isValidated: false,

    // },

  ])


  function validationHandler(params) {



    let formValidated = false;

    let result = formElements.filter(element => element.id == params.id)[0];


    if (result) {


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

            }

            else if (params.type == 'dropdown') {

              finalObj[params.name] = params.value._id;

            } else {

              finalObj[params.name] = params.value;

            }
          }

        } else {
          result.isValidated = false;
        }
      }

      else {
        result.isValidated = true;

        finalObj[params.name] = params.value;

      }
    }



    const validationResults = formElements.filter(element => element.isValidated == false);


    if (validationResults.length == 0) {

      formValidated = true


    }

    return formValidated


  }


  const getClassData = async () => {


    const res = await fetch(
      "/api/ClassesAPI?school_id=" + school_id.current,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    var data = await res.json();


    if (data.data) {



      let index = formElements.findIndex((e) => e.name == 'class');

      let newArr = [...formElements];
      newArr[index].list = data.data;

      setformElements(newArr);


    }




  };

  const getCategoryInfo = async () => {



    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=category&school_id=" + school_id.current,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (data.data) {

      let index = formElements.findIndex((e) => e.name == 'category_id');


      let newArr = [...formElements];
      newArr[index].list = data.data;

      setformElements(newArr);
    }

  };

  const getStudentInfo = async () => {


    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=school_attendance_data&school_id=" + school_id.current + "&class_id=" + classID.current,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    if (data.data) {

      setButtonLoading(false)



      let rowData = [];
      let absents = [];

      totalCount.current = data.data.length;

      for (let i = 0; i < data.data.length; i++) {
        const element = data.data[i];

        let result;


        if (element.attendance_data.length > 0) {

          result = element.attendance_data.filter(element2 => element2.date_data == (changeDate.current).toLocaleDateString())[0];

        }


        let finalAttendance = 'Present';
        let is_present = true;
        let attendance_id = "";

        if (result) {

          if (result.is_present == false) {

            finalAttendance = 'Absent';
            is_present = false;
            attendance_id = result._id

            absents.push(attendance_id);

          }

        }


        absentCount.current = absents.length;
        presentCount.current = totalCount.current > absentCount.current ? totalCount.current - absentCount.current : absentCount.current - totalCount.current;




        rowData.push({

          "first_name": element.first_name,
          "last_name": element.last_name,
          "student_id": element._id,
          "attendance": is_present,
          "attendanceLabel": finalAttendance,
          "attendance_id": attendance_id,
          "studentId": element.student_personal_id


        })


      }

      let tabledata = {
        skip: 0,
        limit: 5,
        products: rowData,
        total: 5
      }

      setAriaInfo(tabledata);


    }


  };


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


    if (data.data) {

      school_id.current = data.data[0]._id;


      getClassData();
      getCategoryInfo();



    }

  };

  useEffect(() => {
    getSchool_id()



  }, []);

  let finalObj = {

  };

  function checkFields(e) {


    e.preventDefault();
    setButtonLoading(true)
    setTableUpdated(false)

    setButtonLoadingText('Fetching Data..')
    setValidate(true)

  }





  async function sendData(data) {


    setValidate(false)


    let formValidated = await validationHandler(data)


    if (formValidated == true) {


      changeDate.current = finalObj.attendanceDate.startDate

      classID.current = finalObj.class

      getStudentInfo()



    }


  }


  async function createfetchdata() {

    var requesttype;


    requesttype = "PUT";

    finalObj.type = 'update';
    finalObj.update_type = 'student_attendance';


    const res = await fetch("/api/studentAttendanceAPI", {
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
        notify('Unexpected error occured');

      } else {
        notify('Attendance Updated');

        getStudentInfo()



      }
    }


  }



  return (

    <LayoutMini>
            <ToastContainer autoClose={3000} />

      <div className="sm:flex-auto sm:px-6">
        <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg px-2 py-2">
          Student Attendance
        </h2>
        <p className="mt-1 text-xs text-gray-500 sm:text-xs md:mt-2 md:max-w-3xl pl-3">
          List of students and their attendance
        </p>
      </div>

      <div className=" sm:px-6 lg:px-8 ">

        {/* <div className=""> */}

          <div className="mt-4 max-w-full ">
            <form className=" flex space-x-2 max-w-3xl justify-start py-2 sm:px-4 border border-gray-200 rounded-md" >
              {formElements.map((objdata, index) => (
                <div key={objdata.id} className="">
                  {objdata.name == 'category_id'
                    && (
                      <Dropdown {...formElements[index]} sendData={sendData} validate={validate} />
                    )}
                  {objdata.name == 'class'
                    && (
                      <Dropdown {...formElements[index]} sendData={sendData} validate={validate} />
                    )}
                  {objdata.name == 'attendanceDate'
                    && (
                      <DateTimePicker {...formElements[index]} sendData={sendData} validate={validate} />
                    )}

                </div>

              ))}


              <div className='mt-6 mx-auto'>
                <Button loading={buttonLoading} loadingText={buttonLoadingText} {...addBtnProps} click={(e) => checkFields(e)} />
              </div>
            </form>


          </div>
        {/* </div> */}
        <div className='flex w-full justify-end items-center space-x-6 mt-8 border border-slate-200 rounded-lg px-2 sm:px-6 py-3 max-w-md'>
          <span className='text-md font-bold text-slate-600'>Present: <span className='border-2 border-green-100 text-green-600 md:text-lg md:px-5 md:py-2 rounded-lg shadow-sm'>{presentCount.current}</span></span>
          <span className='text-md font-bold text-slate-600'>Absent: <span className='border-2 border-red-100 text-red-600 md:text-lg md:px-6 md:py-2 rounded-lg shadow-sm'>{absentCount.current}</span></span>
          <span className='text-md font-bold text-slate-600'>Total: <span className='border-2 border-white text-slate-700 md:text-lg md:px-5 md:py-2 rounded-lg shadow-sm'>{totalCount.current}</span></span>
        </div>

        <div className="flex min-h-full flex-col justify-start">
          <div className="mt-1 sm:mx-auto sm:w-full">
            <div className="bg-white py-8 px-4 border border-gray-200 sm:rounded-lg sm:px-10">
              <DataTable3
                dataTableDataR={ariaInfo.products || []}
                dataTableColumns={dataTableColumns}
                {...dataTableProps}
                updateData={updateData}
              />

            </div>
          </div>
        </div>
      </div>

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



                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Edit Student Attendance
                      </Dialog.Title>

                      <div className="mt-2 grid grid-cols-1 gap-4">

                        First Name : {editStudentDetails.first_name}
                        <br></br>
                        Last Name : {editStudentDetails.last_name}

                        <br></br>
                        Date : {editStudentDetails.displayDate}


                        <Dropdown {...formElements[3]} sendData={sendData} validate={validate} />



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
