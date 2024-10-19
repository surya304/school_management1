import { Fragment, useState, useEffect, useRef } from "react";


import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, XMarkIcon, ListBulletIcon, ClockIcon, CogIcon, SquaresPlusIcon,
  CalendarIcon,
  HomeIcon,
  MagnifyingGlassCircleIcon,
  MapIcon,
  MegaphoneIcon,
  UserGroupIcon,
 } from '@heroicons/react/24/outline';


import Input from "../components/Input";
import Table from "../components/Table";
import Textarea from "../components/Textarea";
import Button from "../components/Button";



  const student = [
      {
          school_id: "123SHANTH228",
            father_id: "Shanu",
            mother_id: "Devi",
            guardian_id: "",
            siblings: "",
            class_id: "Class X",
            first_name: "Manish",
            last_name: "Kaloth",
            email: "manish.k@gmail.com",
            phone: "9856478451",
            address: "Near old airport road, prakash nagar, begumpet, Hyderabad",
            blood_group: "A+",
            pic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
            gender: "Male",
      },
    ]

  const timetable = {
    "Monday": {
      "09:00 AM - 10:00 AM": "Maths (Class 10)",
      "10:00 AM - 11:00 AM": "Maths (Class 07)",
      "11:00 AM - 12:00 PM": "",
      "12:00 PM - 01:00 PM": "==LUNCH BREAK==",
      "01:00 PM - 02:00 PM": "Maths (Class 09",
      "02:00 PM - 03:00 PM": "Maths (Class 08)",
      "03:00 PM - 04:00 PM": ""
    },
    "Tuesday": {
      "09:00 AM - 10:00 AM": "Maths (Class 10)",
      "10:00 AM - 11:00 AM": "Maths (Class 07)",
      "11:00 AM - 12:00 PM": "",
      "12:00 PM - 01:00 PM": "==LUNCH BREAK==",
      "01:00 PM - 02:00 PM": "Maths (Class 09",
      "02:00 PM - 03:00 PM": "Maths (Class 08)",
      "03:00 PM - 04:00 PM": ""
    },
    "Wednesday": {
      "09:00 AM - 10:00 AM": "Maths (Class 10)",
      "10:00 AM - 11:00 AM": "Maths (Class 07)",
      "11:00 AM - 12:00 PM": "",
      "12:00 PM - 01:00 PM": "==LUNCH BREAK==",
      "01:00 PM - 02:00 PM": "Maths (Class 09",
      "02:00 PM - 03:00 PM": "Maths (Class 08)",
      "03:00 PM - 04:00 PM": ""
    },
    "Thursday": {
      "09:00 AM - 10:00 AM": "Maths (Class 10)",
      "10:00 AM - 11:00 AM": "Maths (Class 07)",
      "11:00 AM - 12:00 PM": "",
      "12:00 PM - 01:00 PM": "==LUNCH BREAK==",
      "01:00 PM - 02:00 PM": "Maths (Class 09",
      "02:00 PM - 03:00 PM": "Maths (Class 08)",
      "03:00 PM - 04:00 PM": ""
    },
    "Friday": {
      "09:00 AM - 10:00 AM": "Maths (Class 10)",
      "10:00 AM - 11:00 AM": "Maths (Class 07)",
      "11:00 AM - 12:00 PM": "",
      "12:00 PM - 01:00 PM": "==LUNCH BREAK==",
      "01:00 PM - 02:00 PM": "Maths (Class 09",
      "02:00 PM - 03:00 PM": "Maths (Class 08)",
      "03:00 PM - 04:00 PM": ""
    },
    "Saturday": {
      "09:00 AM - 10:00 AM": "Maths (Class 10)",
      "10:00 AM - 11:00 AM": "Maths (Class 07)",
      "11:00 AM - 12:00 PM": "",
      "12:00 PM - 01:00 PM": "==LUNCH BREAK==",
      "01:00 PM - 02:00 PM": "",
      "02:00 PM - 03:00 PM": "",
      "03:00 PM - 04:00 PM": ""
    }
  };


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function Home() {
  const [openExamMarks, setOpenExamMarks] = useState(false)
  const cancelButtonRef = useRef(null)


  return (
    <>
    
    <div className="px-4 sm:px-2 lg:px-4 max-w-full">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
        <h2 className="text-2xl sm:text-4xl text-slate-500 font-extrabold border border-gray-50 rounded-lg py-2">
          Teacher Profile
        </h2>
        <p className="text-sm text-gray-500 sm:text-md md:max-w-3xl">
            Individual Teacher information, Subject
        </p>
        </div>

      </div>

      <div className="bg-white py-2 sm:py-3 grid gap-y-4 md:gap-y-8">
      <div className="max-w-7xl bg-white shadow-md md:px-6 px-2 md:py-3 py-2 md:rounded-2xl rounded-md border border-slate-200">
        <h2 className="text-slate-500 text-xl py-2 font-bold">Teacher Information</h2>
        <ul
          role="list"
          className=" grid max-w-full"
        >

          {student.map((person) => (
                <li key={person.name} className="flex flex-col gap-x-6 xl:flex-row md:items-top md:justify-center">
                    <div className="mt-3 flex-grow lg:mt-0 lg:flex-shrink-0 lg:flex-grow-0">
                      {/* Mobile profile image  start */}
                      <div className="lg:hidden">
                        <div className="flex items-center">
                          <div className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl" aria-hidden="true" >
                            <img className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover" src={person.pic} alt="" />
                          </div>
                          <div className="ml-5 rounded-md shadow-sm">
                            <div className="group relative flex items-center justify-center rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:bg-gray-50">
                              <label htmlFor="mobile-user-photo" className="pointer-events-none relative text-sm font-medium leading-4 text-gray-700" >
                                <span>Upload New Photo</span>
                                <span className="sr-only"> user photo</span>
                              </label>
                              <input  id="mobile-user-photo" name="user-photo" type="file" className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Desktop profile image  start */}
                      <div className="relative hidden overflow-hidden rounded-2xl lg:block lg:mt-3">
                        <img className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover" src={person.pic} alt="" />
                        <label htmlFor="desktop-user-photo" className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100" >
                          <span>Upload New Photo</span>
                          <span className="sr-only"> user photo</span>
                          <input type="file" id="desktop-user-photo" name="user-photo" className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0" />
                        </label>
                      </div>
                    </div>
                    <div className="flex-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2">
                            <Input /> {/* Full Name */}
                            <Input /> {/* Gender */}
                            <Input /> {/*  Class*/}
                            <Input /> {/* Roll number */}
                            <Input /> {/* Parent name */}
                            <Input /> {/* Email Id */}
                            <Input /> {/* Phone number */}
                            <Input /> {/* Address */}
                            <Input /> {/* Blood group */}
                        </div>
                        <div className="flex md:justify-end justify-center w-full mt-3">
                        <button type="submit" className="ml-5 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
                        > Update Student Info
                        </button>
                        </div>
                    </div>
                </li>
          ))}
        </ul>
      </div>




       {/*Teacher Time Table  */}
      <div className="max-w-7xl bg-white shadow-md md:px-6 px-2 md:py-3 py-2 md:rounded-2xl rounded-md border border-slate-200">
        <h2 className="text-slate-500 text-xl py-2 font-bold">Time Table</h2>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-slate-100">
                    <tr className="divide-x divide-gray-200">
                      <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-slate-700">
                        Time
                      </th>
                      {Object.keys(timetable).map((day, index) => (
                        <th key={index} scope="col" className="px-4 py-2 text-left text-sm font-bold text-slate-700">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.keys(timetable["Monday"]).map((time, index) => (
                      <tr key={index} className="divide-x divide-gray-200">
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-slate-700 bg-slate-100">
                          {time}
                        </td>
                        {Object.keys(timetable).map((day, index) => (
                          <td key={index} className="px-4 py-2 whitespace-nowrap text-sm text-slate-700">
                            {timetable[day][time]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>


        {/*Student Attendance Percentage  */}
        <div className="max-w-7xl bg-white shadow-md md:px-6 px-2 md:py-3 py-2 md:rounded-2xl rounded-md border border-slate-200">
        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl text-slate-600">Total Attendance % till date - <span className="font-bold rounded-md bg-indigo-100 text-indigo-700 py-1">  &nbsp;98%&nbsp;  </span></h2>
        </div>
      </div>


    </div>
    </div>
    

    <Transition.Root show={openExamMarks} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenExamMarks}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-10 pb-8 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-10">
                <Dialog.Title as="h3" className="text-3xl font-extrabold leading-6 text-slate-500 pb-6">
                  Edit Exam Marks
                </Dialog.Title>
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button type="button" className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpenExamMarks(false)} >
                    <XMarkIcon className="h-10 w-10 text-slate-400" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <div className="mt-3 text-left sm:mt-5">
                        <div>
                            <Input />
                        </div>

                     <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <Input />
                            <Input />
                            <Input />
                            <Input />
                            <Input />
                            <Input />
                      </div>

                    <div className="mt-5 sm:mt-6 sm:flex sm:items-center sm:justify-end sm:space-x-3">

                      <button
                        type="button"
                        className="mt-3 inline-flex w-36 justify-center rounded-md border border-gray-300 bg-white px-3 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-lg"
                        onClick={() => setOpenExamMarks(false)}
                        ref={cancelButtonRef}
                      >
                      Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex w-36 justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-lg"
                        onClick={() => setOpenExamMarks(false)}
                      >
                        Save Details
                      </button>
                </div>

                  </div>

                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>



    </>




  );
}
