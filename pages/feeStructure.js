import Input from '../components/Input'
import Dropdown from '../components/Dropdown'
import Button from '../components/Button'
import Table from '../components/Table'
import Alert from '../components/Alert'
import LayoutMini from '../components/LayoutMini'
import DateTimePicker from '../components/DateTimePicker'
import { useState, useEffect, Fragment, useRef } from 'react';
import { Dialog, Transition, Menu } from '@headlessui/react'
import MultiSelect from '../components/MultiSelect'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as z from "zod";
import randomstring from "randomstring";
import {
  PlusIcon, EllipsisVerticalIcon
} from "@heroicons/react/20/solid";
import { LogIn } from 'react-feather'

function getRandomString() {
  let uniqueKey = randomstring.generate({
    length: 12,
    charset: "alphanumeric",
  });

  return uniqueKey
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



let addBtnProps = {
  name: 'buttonComp',

  label: { //
    text: 'Add Fee',
    show: true
  }

}


let createBtnProps = {
  name: 'buttonComp',

  label: { //
    text: 'Add New Fee Category',
    show: true
  }

}


let addRowBtnProps = {
  name: 'buttonComp',

  label: { //
    text: 'Add New Row',
    show: true
  }

}



let finalObj = {};




export default function FeeStructure() {

  const [validate, setValidate] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonLoadingText, setButtonLoadingText] = useState('Loading..')
  const [tableUpdated, setTableUpdated] = useState(false);
  const [addFeePopup, setAddFeePopup] = useState(false)
  const [addFeeCatPopup, setAddFeeCatPopup] = useState(false)
  let addType = useRef("addCategory")
  let editingType = useRef("add")
  let editParams = useRef({})

  const [tableProps, setTableProps] = useState([])

  function validationHandler(params, validType) {


    let formValidated = false;
    let result;

    if (validType == 'addCategory') {
      result = formElements.filter(element => element.id == params.id)[0];

    }

    else if (validType == 'addRow') {
      result = formElements2.filter(element => element.id == params.id)[0];

    }



    if (result) {
      result.isValidated = false;


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

    let validationResults

    if (validType == 'addCategory') {
      validationResults = formElements.filter(element => element.isValidated == false);

    }

    else if (validType == 'addRow') {
      validationResults = formElements2.filter(element => element.isValidated == false);

    }


    if (validationResults.length == 0) {

      formValidated = true


    }

    return formValidated


  }


  let school_id = useRef("")

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
      name: 'classes',
      list: [
      ],

      defaultValuedata: [],
      placeholder: 'Select Here',

      label: { //
        text: 'Select Classes',
        show: true,
      },
      isValidated: false,

    },


  ]);


  const [formElements2, setformElements2] = useState([
    {
      name: 'name',
      placeholder: "Enter a name for Fee",
      label: { //
        text: 'Fee Name',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,

    },

    {
      name: 'feeAmount',
      type: "number",
      placeholder: "Add Amount Ex: 25000",
      label: { //
        text: 'Fee Amount',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      schema: z.object({
        inputFieldName: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), { message: "Expected number, received a string" })
      })


    },
    {
      id: getRandomString(),
      name: 'feeType',
      list: [
        { _id: 'quarterly', name: 'Quarterly' },
        { _id: 'half_yearly', name: 'Half Yearly' },
        { _id: 'yearly', name: 'Yearly' },
        { _id: 'monthly', name: 'Monthly' },
        { _id: 'one_time', name: 'One Time' },

      ],
      allowNew: {
        show: true,
        text: 'Add New Type',
        icon: PlusIcon
      },
      label: { //
        text: 'Select Type',
        show: true,
      },
    },
    {


      name: 'due_date',
      pickerType: "date",
      selectionType: 'single',
      placeholder: "Due Date",
      label: { //
        text: 'Due Date',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,



    }

  ]);

  let categoriesData = useRef([]);
  let classData = useRef([]);
  let feesData = useRef([]);

  function checkFields(e) {

    e.preventDefault();
    setButtonLoading(true)
    setTableUpdated(false)

    setButtonLoadingText('Adding to Table..')
    setValidate(true)

  }


  function obj_or_arr(val) {
    if (typeof val === "object") {
      // return if is not array or object
      try {
        for (x of val) // is no errors happens here is an array
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

      if ("defaultValuedata" in obj) {
        var checkdata = obj_or_arr(obj.defaultValuedata);

        if (checkdata == "object") {
          obj.defaultValuedata = {
            _id: "please select Data",
            name: "please select Data",
          };
        } else {

          obj.defaultValuedata = [];
        }
      } else {
        obj.data = "";
      }
    }
    for (let index = 0; index < formElements2.length; index++) {
      const obj = formElements2[index];


      obj.isValidated = false;

      if ("defaultValuedata" in obj) {
        var checkdata = obj_or_arr(obj.defaultValuedata);

        if (checkdata == "object") {
          obj.defaultValuedata = {
            _id: "please select Data",
            name: "please select Data",
          };
        } else {

          obj.defaultValuedata = [];
        }
      } else {
        obj.data = "";
      }
    }
  }



  async function sendData(data) {

    setValidate(false)

    let formValidated = await validationHandler(data, addType.current)
    setButtonLoading(false);

    if (formValidated == true) {

      let msg = ""

      if (addType.current == 'addCategory') {

        if (editingType.current == 'add') {
          finalObj['categories'] = {}

          finalObj.categories['category_id'] = finalObj.category_id;
          finalObj.categories['fees'] = [];
          finalObj['name'] = 'fee';
          finalObj.categories['classes'] = finalObj.classes;

          msg = 'Category Added'

        }

        else if (editingType.current == 'edit') {
          finalObj['categories'] = {}

          finalObj.categories['category_id'] = finalObj.category_id;
          finalObj.categories['fees'] = editParams.current.main;
          finalObj['name'] = 'fee';
          finalObj['type'] = 'updateCat';
          finalObj['_id'] = editParams.current.props.table_id;
          finalObj.categories['classes'] = finalObj.classes;
          msg = 'Category Edited'

        }


        setButtonLoading(false);
        setAddFeeCatPopup(false)

        createfetchdata("POST", msg)

      }


      else if (addType.current == 'addRow') {
        finalObj['type'] = 'update';


        if (editingType.current == 'add') {
          finalObj['_id'] = editParams.current.props.table_id;
          const resultFees = feesData.current.filter(data => data._id == editParams.current.props.table_id)[0];

          resultFees.categories.fees.push(
            {
              'name': finalObj.name,
              'type': finalObj.feeType,
              'amount': finalObj.feeAmount,
              'due_date': finalObj.due_date.startDate,
            }

          )

          finalObj['fees'] = resultFees.categories.fees;
          msg = 'Row Added'

        }

        else if (editingType.current == 'edit') {

          finalObj['_id'] = editParams.current.table_id;
          const resultFees = feesData.current.filter(data => data._id == editParams.current.table_id)[0];
          let editElem = resultFees.categories.fees[editParams.current.row_id]

          editElem.name = finalObj.name;
          editElem.type = finalObj.feeType;
          editElem.amount = finalObj.feeAmount;
          editElem.due_date = finalObj.due_date.startDate;

          finalObj['fees'] = resultFees.categories.fees;

          msg = 'Row Updates'

        }


        setAddFeePopup(false)
        createfetchdata("POST", msg)

      }




    }

  }


  async function createfetchdata(type, msg) {

    var requesttype;


    requesttype = type;

    finalObj['school_id'] = school_id.current;

    const res = await fetch("/api/feeAPI", {
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
        notify(msg);

        getFeesData()


      }
    }


  }





  async function getClassData() {

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



    classData.current = data.data;
    getFeesData()

    setSchoolValues(data.data)

  };


  function setSchoolValues(data) {


    const transformed = data.map(({ _id, name }) => ({ label: name, value: _id }));


    let index = formElements.findIndex((e) => e.name == 'classes');

    formElements[index].list = transformed;

  }

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


      categoriesData.current = data.data;
      let index = formElements.findIndex((e) => e.name == 'category_id');


      let newArr = [...formElements];
      newArr[index].list = data.data;

      setformElements(newArr);
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


  async function getFeesData() {



    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=fees&school_id=" + school_id.current,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    var data = await res.json();

    if (data.data) {

      feesData.current = data.data;
      getTableData(data.data)


    }


  };


  async function getTableData(data) {
    let initArray = [];



    for (let i = 0; i < data.length; i++) {
      let tablesArr = {};

      const element = data[i];

      let item = {};

      const resultCat = categoriesData.current.filter(data => data._id == element.categories.category_id)[0];

      if (resultCat) {


        let classNamesArray = [];

        for (let i = 0; i < element.categories.classes.length; i++) {
          const elementC = element.categories.classes[i];
          const resultClass = classData.current.filter(data => data._id == elementC)[0];

          console.log(resultClass, 'resultClass');
          if (resultClass) {
            classNamesArray.push(resultClass.name)

          }


        }

        item['heading'] = resultCat.name;
        item['subHeading'] = classNamesArray.join(", ");
        item['headers'] = ['Name', 'Amount', 'Fee Type', 'Due Date'];
        item['classes'] = element.categories.classes;
        item['category_id'] = element.categories.category_id;
        item['table_id'] = element._id;





        tablesArr['props'] = item

        let rowData = [];
        let mainData = [];

        for (let value of element.categories.fees) {

          const element2 = value;

          let index = formElements2.findIndex((e) => e.name == "feeType");

          let eventElem = formElements2[index];
          let indexT = eventElem.list.findIndex((e) => e._id == element2.type);


          rowData.push({
            name: element2.name,
            amount: element2.amount,
            type: eventElem.list[indexT].name,
            due_date: new Date(element2.due_date).toLocaleDateString(),

          })



          mainData.push({
            name: element2.name,
            amount: element2.amount,
            type: element2.type,
            due_date: element2.due_date,

          })

        }

        tablesArr['list'] = rowData;
        tablesArr['main'] = mainData;

        initArray.push(tablesArr)
      }

    }


    setTableProps(initArray);
    setTableUpdated(true);

  }



  useEffect(() => {

    getSchool_id()

  }, []);



  function editRowClicked(params) {
    emptyformData();

    finalObj = {}

    addType.current = 'addRow'
    editingType.current = 'edit'

    setAddFeePopup(true)

    editParams.current = params;

    let index2 = formElements2.findIndex((e) => e.name == "name");

    let eventElem2 = formElements2[index2];
    eventElem2['data'] = params.value.name;


    let index3 = formElements2.findIndex((e) => e.name == "feeAmount");

    let eventElem3 = formElements2[index3];

    eventElem3['data'] = params.value.amount;

    let index = formElements2.findIndex((e) => e.name == "feeType");

    let eventElem = formElements2[index];

    let indexT = eventElem.list.findIndex((e) => e.name == params.value.type);


    eventElem['defaultValuedata'] = {
      name: params.value.type,
      _id: eventElem.list[indexT]._id,
    }

    let index4 = formElements2.findIndex((e) => e.name == "due_date");

    let eventElem4 = formElements2[index4];

    eventElem4['startDate'] = new Date(params.value.due_date);

  }


  function editCategoryTable(params) {
    emptyformData();
    addType.current = 'addCategory'
    editingType.current = 'edit'
    editParams.current = params;

    setAddFeeCatPopup(true)


    let index = formElements.findIndex((e) => e.name == "category_id");

    let eventElem = formElements[index];

    eventElem['defaultValuedata'] = {
      name: params.props.heading,
      _id: params.props.category_id,
    }
    let index2 = formElements.findIndex((e) => e.name == "classes");

    let eventElem2 = formElements[index2];

    eventElem2.defaultValuedata =[];

    for (let i = 0; i < params.props.classes.length; i++) {
      const element = params.props.classes[i];

      const resultClass = classData.current.filter(data => data._id == element)[0];


      eventElem2.defaultValuedata.push({
        label: resultClass.name,
        value: element,
      })



    }




  }

  const [editdeleteParams, setEditDeleteParams] = useState({});
  const [openAlert, setOpenAlert] = useState(false);

  const [alertObj, setAlertObj] = useState({
    type: "header",
    title: "Are you sure, you want to delete?",
    message: "This action cannot be undone.",
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
      show: false,
      placeholder: 'delete',
      label: `Enter delete to delete`,
      errorMessage: "Unable to delete",


    }
  });


  const cancelTrigger = () => {
    setOpenAlert(false);
  }

  function confirmTrigger() {
    setTableUpdated(false);

    finalObj = {}

    if (editdeleteParams.type == 'category') {

      finalObj['type'] = 'delete';
      finalObj['_id'] = editdeleteParams.props.table_id

      createfetchdata("PUT", 'Category Deleted');
      setOpenAlert(false)

    }

    if (editdeleteParams.type == 'row') {


      finalObj['type'] = 'update';

      const resultFees = feesData.current.filter(data => data._id == editdeleteParams.table_id)[0];
      let editElem = resultFees.categories.fees;

      finalObj['_id'] = editdeleteParams.table_id;
      finalObj['name'] = "fee";


      editElem = editElem.splice(editdeleteParams.row_id, 1);


      finalObj['fees'] = resultFees.categories.fees


      createfetchdata("POST", "Row Deleted");

      setOpenAlert(false);


    }

  }

  function deleteCategoryTable(params) {
    finalObj = {}

    setEditDeleteParams(params);

    setEditDeleteParams(prevState => ({ ...prevState, type: 'category' }));

    setOpenAlert(true);


  }


  function addFeeCategory() {
    finalObj = {}
    emptyformData();

    setAddFeeCatPopup(true)
    addType.current = 'addCategory'
    editingType.current = 'add'

  }


  function deleteRowClicked(params) {
    finalObj = {}
    setEditDeleteParams(params);

    setEditDeleteParams(prevState => ({ ...prevState, type: 'row' }));

    setOpenAlert(true);


  }


  function addNewFeeRow(params) {
    emptyformData();

    addType.current = 'addRow'
    editingType.current = 'add'

    finalObj = {}
    editParams.current = params;
    setAddFeePopup(true)

  }

  return (


    <LayoutMini>
      <ToastContainer autoClose={3000} />

      <div className="text-center max-w-full md:px-6 mt-4">

        <div className="pb-5 sm:flex sm:items-center sm:justify-between">
          <h3 className="md:text-5xl text-lg font-extrabold leading-6 text-gray-400">Fees Dashboard</h3>
          <div className="mt-3 flex sm:mt-0 sm:ml-4">
            <Button loading={buttonLoading} loadingText={buttonLoadingText} {...createBtnProps} click={(e) => addFeeCategory()} />


          </div>
        </div>



        <div className="">

          <div className="flex min-h-full flex-col justify-start sm:px-2 lg:px-2">

            <div className="mt-2 sm:w-full">
              {tableProps.map((objdata, index) => (

                <div key={objdata.id} className="bg-white py-4 px-4 my-2 sm:rounded-lg sm:px-4 border border-gray-200">
                  <div className="-mb-8">
                    <div className="sm:flex sm:items-baseline sm:justify-between">
                      <div className="sm:w-0 sm:flex-1">
                        <h1 id="message-heading" className="text-base font-semibold leading-6 text-gray-600">
                        </h1>
                      </div>

                      <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">

                        <Button loading={buttonLoading} loadingText={buttonLoadingText} {...addRowBtnProps} click={(e) => addNewFeeRow(objdata)} />

                        <Menu as="div" className="relative ml-3 inline-block text-left">
                          <div>
                            <Menu.Button className="-my-2 flex items-center rounded-full bg-white p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-0 focus:ring-indigo-500">
                              <span className="sr-only">Open options</span>
                              <EllipsisVerticalIcon className="h-9 w-9 bg-gray-100 rounded-md px-1 py-1 " aria-hidden="true" />
                            </Menu.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      type="button" onClick={() => editCategoryTable(objdata)}
                                      className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'flex w-full justify-between px-4 py-2 text-sm'
                                      )}
                                    >
                                      <span>Edit</span>
                                    </button>
                                  )}
                                </Menu.Item>

                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      type="button" onClick={() => deleteCategoryTable(objdata)}
                                      className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'flex w-full justify-between px-4 py-2 text-sm'
                                      )}
                                    >
                                      <span>Delete</span>
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  </div>

                  <Table  {...tableProps[index].props} tableValues={tableProps[index].list} tableUpdated={tableUpdated} editRowClicked={editRowClicked} deleteRowClicked={deleteRowClicked} />


                </div>
              ))}

            </div>
          </div>
        </div>



        <Transition.Root show={addFeeCatPopup} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setAddFeeCatPopup}>
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
                  <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white px-4 pt-5 pb-4 text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>

                      <div className="mt-3 text-center sm:mt-5">

                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Add New Fee Category
                        </Dialog.Title>

                        <form className="space-y-6" >

                          <div className="grid grid-cols-1 gap-4 text-center">


                            {formElements.map((objdata, index) => (
                              <div key={objdata.id}>


                                {objdata.name == 'category_id'
                                  && (
                                    <Dropdown {...formElements[index]} sendData={sendData} validate={validate} />
                                  )}


                                {objdata.name == "classes" && (
                                  <MultiSelect
                                    className="w-full"
                                    {...formElements[index]}
                                    sendData={sendData}
                                    validate={validate}
                                  />
                                )}



                              </div>

                            ))}


                            <Button loading={buttonLoading} loadingText={buttonLoadingText} {...createBtnProps} click={(e) => checkFields(e)} />


                          </div>
                        </form>

                      </div>
                    </div>

                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <Transition.Root show={addFeePopup} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setAddFeePopup}>
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
                  <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white px-4 pt-5 pb-4 text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>

                      <div className="mt-3 text-center sm:mt-5">



                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Add New Row
                        </Dialog.Title>

                        <form className="space-y-6 mt-2 text-left" >

                          <div className="grid grid-cols-1 gap-4 text-center">


                            {formElements2.map((objdata, index) => (
                              <div key={objdata.id}>

                                {objdata.name == 'name'
                                  && (
                                    <Input {...formElements2[index]} sendData={sendData} validate={validate} />
                                  )}

                                {objdata.name == 'feeAmount'
                                  && (
                                    <Input {...formElements2[index]} sendData={sendData} validate={validate} />
                                  )}


                                {objdata.name == 'feeType'
                                  && (
                                    <Dropdown {...formElements2[index]} sendData={sendData} validate={validate} />
                                  )}

                                {objdata.name == 'due_date'
                                  && (
                                    <DateTimePicker {...formElements2[index]} sendData={sendData} validate={validate} />
                                  )}



                              </div>




                            ))}


                            <Button loading={buttonLoading} loadingText={buttonLoadingText} {...addBtnProps} click={(e) => checkFields(e)} />


                          </div>



                        </form>

                      </div>
                    </div>




                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>

      <Alert
        openAlert={openAlert}
        cancelTrigger={cancelTrigger}
        {...alertObj}
        confirmTrigger={confirmTrigger}
      />
    </LayoutMini>
  );
}
