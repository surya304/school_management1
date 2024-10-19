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
  heading: 'Teacher Attendance',
  subHeading: 'Select Options Above. Click on Edit icon to change attendance. Save after editing.',
  showReason : true,

  button: { //
    text: 'Save',
    show: true,
  }
}

let dataTableColumns = [

  {
    header: 'Teacher First Name',
    accessor: 'first_name',
  },
  {
    header: 'Teacher Last Name',
    accessor: 'last_name',
  },
  {
    header: 'Attendance',
    accessor: 'attendanceLabel',
  },
  {
    header: 'Action',
    accessor: 'attendance',
  },
    {
    header: 'Reason',
    accessor: 'reason',
  }
]

export default function FeeStructure() {

  const [validate, setValidate] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonLoadingText, setButtonLoadingText] = useState('Loading..')
  const [tableUpdated, setTableUpdated] = useState([]);
  const [ariaInfo, setAriaInfo] = useState([]);
  let school_id = useRef("")
  let changeDate = useRef(new Date())
  const [editTeacherDetails, seteditTeacherDetails] = useState({});
  const [openEditPopup, setOpenEditPopup] = useState(false)
  const notify = (label) => toast(label);

  const updateData = (rowIndex, columnId, value, row, inputValue) => {
    setAriaInfo(data => {
      console.log(rowIndex, columnId, value, row, inputValue, 'rowIndex, columnId, value');
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

    if (columnId == 'reason') {
      finalObj = {}
      finalObj["_id"] = row.original.teacher_id;
      finalObj["date_data"] = (changeDate.current).toLocaleDateString();
      finalObj["is_present"] = value;
      finalObj["attendance_id"] = row.original.attendance_id;
      finalObj["reason"] = inputValue;


      console.log(finalObj, 'finalObj');


      createfetchdata()

    }
    if (columnId == 'attendance' && value == true) {
      finalObj = {}
      finalObj["_id"] = row.original.teacher_id;
      finalObj["date_data"] = (changeDate.current).toLocaleDateString();
      finalObj["is_present"] = value;
      finalObj["attendance_id"] = row.original.attendance_id;
      finalObj["reason"] = "";


      console.log(finalObj, 'finalObj');


      createfetchdata()

    }



  }

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


  const [formElements, setformElements] = useState([
    {
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
      required: true
    }
  ])


  const getTeachersInfo = async () => {

    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=teacher_search&school_id=" + school_id.current,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (data.data) {


      console.log(data, 'dataaaa');

      let rowData = [];

      for (let i = 0; i < data.data.length; i++) {
        const element = data.data[i];

        let result;

        console.log(element, (changeDate.current).toLocaleDateString(), 'element');

        if (element.attendance_data.length > 0) {

          result = element.attendance_data.filter(element2 => element2.date_data == (changeDate.current).toLocaleDateString())[0];

        }

        console.log(result, 'result');

        let finalAttendance = 'Present';
        let is_present = true;
        let attendance_id = "";
        let reason = "";

        if (result) {

          if (result.is_present == false) {

            finalAttendance = 'Absent';
            is_present = false;
            attendance_id = result._id;
            reason = result.reason;

          }

        }



        rowData.push({

          "first_name": element.first_name,
          "last_name": element.last_name,
          "attendance": is_present,
          "teacher_id": element._id,
          "attendanceLabel": finalAttendance,
          "attendance_id": attendance_id,
          "teacherId": element.employee_id,
          "reason": reason,
          "displayReason" : true
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

    setButtonLoadingText('Adding to Table..')
    setValidate(true)

  }




  async function sendData(data) {


    setValidate(false)
    setButtonLoading(false)



    let formValidated = await validationHandler(data)
    if (formValidated == true) {

      changeDate.current = finalObj.attendanceDate.startDate;
      getTeachersInfo();



    }



  }


  async function createfetchdata() {

    var requesttype;


    requesttype = "PUT";

    finalObj.type = 'update_teacher_attendance';
    finalObj.update_type = 'teacher_attendance';


    const res = await fetch("/api/teacherAttendanceAPI", {
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

        console.log('done');
        notify('Attendance Updated');

        getTeachersInfo()


      }
    }


  }





  return (

    <LayoutMini>
      <ToastContainer autoClose={3000} />
      <div className="sm:flex-auto sm:px-6">
        <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg px-2 py-2">
          Teacher Attendance
        </h2>
        <p className="mt-1 text-xs text-gray-500 sm:text-xs md:mt-2 md:max-w-3xl pl-3">
          List of teachers and their attendance
        </p>
      </div>

      <div className="">
        <div className="mt-8 flex min-h-full flex-col justify-start sm:px-6 lg:px-8">
          <div className="sm:w-full sm:max-w-xl">
            <div className="">
              <form className="flex  space-x-2 max-w-3xl justify-start py-2 sm:px-4 border border-gray-200 rounded-md" >
                <div className='w-full md:text-left'>
                  <DateTimePicker {...formElements[0]} sendData={sendData} validate={validate} />
                </div>
                <div className='w-full mt-6'>
                  <Button loading={buttonLoading} loadingText={buttonLoadingText} {...addBtnProps} click={(e) => checkFields(e)} />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="flex min-h-full flex-col justify-center sm:px-6 lg:px-8">
          <div className="mt-8 sm:w-full">
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

                        First Name : {editTeacherDetails.first_name}
                        <br></br>
                        Last Name : {editTeacherDetails.last_name}

                        <br></br>
                        Date : {editTeacherDetails.displayDate}


                        <Dropdown {...formElements[1]} sendData={sendData} validate={validate} />



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
