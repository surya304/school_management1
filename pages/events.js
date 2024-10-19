import { useState, useEffect, Fragment, useRef } from 'react';
import * as z from "zod";
import randomstring from "randomstring";
import LayoutMini from '../components/LayoutMini'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, Transition } from '@headlessui/react'
import Input from '../components/Input'
import DateTimePicker from '../components/DateTimePicker'
import Dropdown from "../components/Dropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const localizer = momentLocalizer(moment)


function getRandomString() {
  let uniqueKey = randomstring.generate({
    length: 12,
    charset: "alphanumeric",
  });

  return uniqueKey
}






export default function FeeStructure() {

  const [validate, setValidate] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonLoadingText, setButtonLoadingText] = useState('Loading..')

  const notify = (label) => toast(label);

  const [openEditPopup, setOpenEditPopup] = useState(false)

  let school_id = useRef("")
  let editType = useRef("create")
  let dropdownSel = useRef("general")

  let finalObj = useRef({})



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


              finalObj.current[params.name] = temparr;

            }

            else if (params.type == 'dropdown') {

              finalObj.current[params.name] = params.value._id;

            } else {

              finalObj.current[params.name] = params.value;

            }
          }

        } else {
          result.isValidated = false;
        }
      }

      else {
        result.isValidated = true;

        finalObj.current[params.name] = params.value;

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
      name: 'name',
      placeholder: "Enter a name for Event",
      label: { //
        text: 'Event Name',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,

    }, {
      name: 'eventDate',
      pickerType: "date",
      selectionType: 'range',
      placeholder: "Add Amount Ex: 25000",
      label: { //
        text: 'Select Event Dates',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,



    },

    {
      id: getRandomString(),
      name: 'event_type',
      list: [{
        "_id": "general",
        "name": "General Event"
      },
      {
        "_id": "exam",
        "name": "Exam"
      }
      ],
      label: { //
        text: 'Select Event Type',
        show: true,
      },
      defaultValuedata: {
        "_id": "general",
        "name": "General Event"
      },
      isValidated: false,




    },

    // {
    //   id: getRandomString(),
    //   name: 'exams',
    //   list: [
    //   ],
    //   label: { //
    //     text: 'Select Exam',
    //     show: true,
    //   },
    //   defaultValuedata: {
    //     "_id": "",
    //     "name": "Select here"
    //   },
    //   isValidated: false,




    // },

  ])



  const [eventsData, setEventsData] = useState([

  ])

  function checkFields(e) {

    e.preventDefault();
    setButtonLoading(true)

    setButtonLoadingText('Adding to Table..')
    setValidate(true)
    setOpenEditPopup(false)


  }




  async function sendData(data) {

    console.log(data, 'data');

    let formValidated = await validationHandler(data)


    if (formValidated == true) {

      let msg = "Event created";


      if (editType.current == 'edit') {
        finalObj.current['type'] = "update"
        msg = "Event edited"
      }

      createfetchdata(msg, "POST");




    }

  }


  async function createfetchdata(msg, rType) {


    finalObj.current['school_id'] = school_id.current

    let requesttype = rType;


    const res = await fetch("/api/eventAPI", {
      method: requesttype,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalObj.current),
    });
    //Await for data for any desirable next steps
    var data = await res.json();

    console.log("exams Data>>>>", data);

    if (data.errors) {
      // setErrMessage(data.errors[0].msg);
    } else {
      if (data.status == 422 || data.status == 400 || data.status == 500) {
        setErrMessage("Oops! Please try again");
      } else {

        notify(msg)

        getEventsData()

      }
    }



  }



  const getExamsData = async () => {

    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=exams&school_id=" + school_id.current,


      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    // let index = formElements.findIndex((e) => e.name == 'exams');

    // let eventElem = formElements[index];

    // let examsData = [];

    // for (let i = 0; i < data.data.length; i++) {
    //   const element = data.data[i];

    //   examsData.push({'name' : element.name,  "_id" : element._id})

    // }

    // eventElem.list = examsData;


  };

  async function  getEventsData() {

    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=events&school_id=" + school_id.current,


      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();



    let eventsArr = []


    for (let i = 0; i < data.data.length; i++) {
      const element = data.data[i];

      eventsArr.push({
        start: new Date(element.from_date),
        end: new Date(element.to_date),
        title: element.name,
        _id : element._id
       })

    }

    setEventsData(eventsArr)


    getExamsData();

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

      getEventsData()




    }

  };

  useEffect(() => {
    getSchool_id()



  }, []);




  function editEvent(event) {

    editType.current = 'edit'

    finalObj.current ={}

    finalObj.current['_id'] = event._id;
    finalObj.current['name'] = event.title;



    setOpenEditPopup(true)

    let index = formElements.findIndex((e) => e.name == 'name');

    let eventElem = formElements[index];

    eventElem['data'] = event.title;


    let index2 = formElements.findIndex((e) => e.name == 'eventDate');

    let eventElem2 = formElements[index2];

    eventElem2['startDate'] = event.start;
    eventElem2['endDate'] = event.end;

  }

  function createEvent() {

    editType.current = 'create'

    setOpenEditPopup(true)

    let index = formElements.findIndex((e) => e.name == 'name');

    let eventElem = formElements[index];

    eventElem['data'] = "";


  }


  function deleteEvent() {

    finalObj.current['type'] = "delete";

    createfetchdata("Event deleted", "PUT")
    setOpenEditPopup(false)

  }


  return (
    <LayoutMini>
      <ToastContainer autoClose={3000} />

      <div className="mx-6 my-3">


        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
          <div className="-ml-4 -mt-2 mb-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Events</h3>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              <button type="button" onClick={() => createEvent()} className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Create new event</button>
            </div>
          </div>
          <div>
            <Calendar
              localizer={localizer}
              events={eventsData}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              onSelectEvent={(e) => editEvent(e)}


            />
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

                      {editType.current == 'edit' &&

                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Edit Event
                        </Dialog.Title>
                      }

                      {editType.current == 'create' &&

                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Create New Event
                        </Dialog.Title>

                      }
                      <div className="mt-2 grid grid-cols-1 gap-4">
                        <Input validate={validate} {...formElements[0]} sendData={sendData} />


                        <Dropdown {...formElements[2]} sendData={sendData} validate={validate} />

                        {dropdownSel.current == 'exam' &&

                          <Dropdown {...formElements[3]} sendData={sendData} validate={validate} />

                        }


                        <DateTimePicker {...formElements[1]} sendData={sendData} validate={validate} />


                      </div>
                    </div>
                  </div>
                  {editType.current == 'edit' &&

                    <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                        onClick={() => deleteEvent()}
                      >
                        Delete Event
                      </button>

                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        onClick={(e) => checkFields(e)}
                      >
                        Edit Event
                      </button>
                    </div>

                  }

                  {editType.current == 'create' &&

                    <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-4">


                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        onClick={(e) => checkFields(e)}
                      >
                        Create Event
                      </button>
                    </div>
                  }

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

    </LayoutMini>

  )
}
