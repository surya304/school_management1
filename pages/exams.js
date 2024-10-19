import Input from '../components/Input'
import Button from '../components/Button'
import LayoutMini from '../components/LayoutMini'
import DateTimePicker from '../components/DateTimePicker'
import MultiSelect from '../components/MultiSelect'
import { useState, useEffect, useRef, Fragment } from 'react';
import randomstring from "randomstring";
import Dropdown from "../components/Dropdown";
import { Dialog, Transition, Menu } from '@headlessui/react'
import { ExclamationTriangleIcon, XMarkIcon, PlusIcon as PlusIconOutline, PlusIcon, DocumentArrowUpIcon, DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline'
import { PencilSquareIcon, TrashIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Alert from "../components/Alert";
import { useRouter } from "next/router";

import Papa from "papaparse";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

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
    text: 'Add Exam',
    show: true
  }

}

let createBtnProps = {
  name: 'buttonComp',

  label: { //
    text: 'Add New Exam',
    show: true
  }

}





let finalObj = {};


let subjectsList = [];
let classesList = [];

export default function Exams() {
  const router = useRouter();

  const [csvError, setCsvError] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);

  const notify = (label) => toast(label);

  let addType = useRef("add")


  const [formElements, setformElements] = useState([
    {
      id: getRandomString(),
      name: 'category_id_exams',
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

    }, {
      name: 'name',
      placeholder: "Enter a name for Exam",
      label: { //
        text: 'Exam Name',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,

    }, {
      name: 'examDate',
      pickerType: "date",
      selectionType: 'range',
      placeholder: "Add Amount Ex: 25000",
      label: { //
        text: 'Select Exam Dates',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,



    }, {
      name: 'examFromTime',
      pickerType: "time",
      selectionType: 'single',
      placeholder: "Select Exam From Time",
      label: { //
        text: 'Select Exam From Time',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,


    }, {
      name: 'examToTime',
      pickerType: "time",
      selectionType: 'single',
      placeholder: "Select Exam To Time",
      label: { //
        text: 'Select Exam To Time',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,


    },






  ])

  const [tableProps, setTableProps] = useState([])

  const [validate, setValidate] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonLoadingText, setButtonLoadingText] = useState('Loading..')
  const [tableUpdated, setTableUpdated] = useState([]);
  const [openEditPopup, setOpenEditPopup] = useState(false)
  const [addExamPopup, setAddExamPopup] = useState(false)
  const [showExamPopup, setShowExamPopup] = useState(false)



  let school_id = useRef("")
  let categoryData = useRef([])
  let [showExamData, setShowExamData] = useState({
    props: {
      heading: 'View Exam',
      newHeaders: []
    },
    main: []
  })

  const [formElements2, setformElements2] = useState([]);

  const [editData, setEditData] = useState({})


  let classData = useRef([]);

  let subjectData = useRef([]);


  async function fileChanged(event, exam_id, classInfo) {

    classesList = classInfo
    const file = event.target.files[0];
    setCsvError("");

    let dataObj = {
      exam_id: exam_id,
      type: "exams",
      data: []
    };

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log("Parsed>>>>", results.data);

        if (results.data.length > 0) {

          for (const iterator of results.data) {


            dataObj.data.push({
              class_id: getObjectId(iterator.Class, "class"),
              date: iterator.Date,
              from_time: iterator.StartTime,
              to_time: iterator.EndTime,
              subject_id: getObjectId(iterator.Subject, "subject"),
            });
          }

          console.log("DataObj>>>", dataObj);

          const groupedData = dataObj.data.reduce((accumulator, current) => {
            const foundIndex = accumulator.findIndex(
              (item) => item.class_id === current.class_id
            );
            if (foundIndex !== -1) {
              accumulator[foundIndex].rows.push({
                date: convertToISODate(current.date),
                from_time: convertTimeToDate(current.from_time),
                to_time: convertTimeToDate(current.to_time),
                subject_id: current.subject_id,
              });
            } else {
              accumulator.push({
                class_id: current.class_id,
                rows: [
                  {
                    date: convertToISODate(current.date),
                    from_time: convertTimeToDate(current.from_time),
                    to_time: convertTimeToDate(current.to_time),
                    subject_id: current.subject_id,
                  },
                ],
              });
            }
            return accumulator;
          }, []);

          console.log("groupedData>>>", groupedData);

          dataObj.data = groupedData

          uploadCSV(dataObj);
        } else {
          setCsvError("No Records to upload");
        }
      },
    });

  }

  function convertToISODate(dateString) {
    const [day, month, year] = dateString.split("-");
    const isoDate = new Date(`${year}-${month}-${day}`);
    if (isNaN(isoDate.getTime())) {
      throw new Error("Invalid date");
    }
    return isoDate.toISOString();
  }

  function convertTimeToDate(timeStr) {
    let [time, meridian] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    if (meridian === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    } else if (meridian === 'AM' && hours === '12') {
      hours = '00';
    }

    let now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now;
  }

  function downloadCSV(data) {

    classesList = data

    console.log("Data from Row>>>", data);
    var maindata = [
      ["Class", "Date", "StartTime", "EndTime", "Subject"],
      ["1 A", "12/03/2023", "11 AM", "12 PM", "Mathematics"],
      ["1 B", "13/03/2023", "11 AM", "12 PM", "Science"],
      ["2 A", "12/03/2023", "11 AM", "12 PM", "Mathematics"],
      ["2 B", "13/03/2023", "11 AM", "12 PM", "Science"],

      [],
      [],
      ["List of Subjects"],
      ...subjectsList.map(({ name }) => [name]),
      [],
      [],
      ["List of Classes"],
      ...classesList.map(({ name }) => [name]),
    ];

    downloadFile(maindata);
  }


  function downloadFile(sheets) {


    const csvContent =
      "data:text/csv;charset=utf-8," +
      sheets.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exams.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



  async function uploadCSV(csvData) {

    // loop through and show errors if any

    // save data in db

    console.log("Sending Data>>>>", csvData);

    setCsvLoading(true)

    const res = await fetch("/api/csvUploadAPI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(csvData),
    });
    //Await for data for any desirable next steps
    var data = await res.json();

    setCsvLoading(false)

    if (data.success == true) {

      notify('CSV Uploaded');
      getExamsData()

    }
    else {
      setCsvError("Oops! Please re-check your CSV and upload again")
    }

  }


  function checkFields(e) {

    e.preventDefault();
    setButtonLoading(true)
    setTableUpdated(false)

    setButtonLoadingText('Adding to Table..')
    setValidate(true)

  }

  function validationHandler(params, skip) {



    let formValidated = false;

    let result = formElements.filter(element => element.id == params.id)[0];

    if (skip == true) {

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
              result.defaultValuedata = params.value;

            }

            else if (params.type == 'dropdown') {

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
      }

      else {
        result.isValidated = true;

        finalObj[params.name] = params.value;

      }
    }

    if (skip == false) {

      const validationResults = formElements.filter(element => element.isValidated == false);


      if (validationResults.length == 0) {

        formValidated = true


      }

    }

    else {

      const validationResults = formElements2.filter(element => element.isValidated == false);


      if (validationResults.length == 0) {

        formValidated = true


      }

    }

    return formValidated


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
        console.log(checkdata, "emptyformData checkdata");
      } else {
        obj.data = "";
      }
    }
  }


  async function sendData(data) {


    if (data.name == 'category_id_exams') {


      let newClassArray = [];


      newClassArray = classData.current.filter(element => element.category_id._id == data.value._id);


      setSchoolValues(newClassArray)



    }

    setValidate(false)

    if (openEditPopup == false) {

      let formValidated = await validationHandler(data, false)

      if (formValidated == true) {


        let rowData = [];

        let rowDates = await getDaysArray(finalObj.examDate.startDate, finalObj.examDate.endDate)

        for (let i = 0; i < finalObj.classes.length; i++) {
          const element = finalObj.classes[i];

          rowData.push({
            class_id: element,

            rows: []
          })

          for (let value of rowDates) {

            const element2 = value;


            rowData[i].rows.push({
              date: element2.toDateString(),
              from_time: finalObj.examFromTime.startDate,
              to_time: finalObj.examToTime.startDate,
              syllabus: "",
              subject_id: []
            })

          }

        }


        finalObj['rowdata'] = rowData;

        if (addType.current == 'edit') {

          finalObj['type'] = 'update';

        }


        createfetchdata("POST", 'Exam Added');

        setTableUpdated(true)

        setButtonLoading(false)
      }
    }

    else {

      let formValidated = false;
      let formValidated2 = false;

      if (data.name == 'subject') {
        formValidated2 = await validationHandler(data, true)

      }

      else {

        formValidated = await validationHandler(data, false)

      }


      if (formValidated2 == true) {


        let msg = ""


        finalObj['type'] = 'updateRow';
        finalObj['_id'] = editData.table.props.table_id;
        finalObj['name'] = editData.table.props.heading;

        if (editData.type == 'edit') {

          let rowList = editData.mainRow.rows[editData.index];

          rowList.subject_id = [finalObj.subject];
          rowList.date = (finalObj.examDate.startDate).toISOString();
          rowList.from_time = (finalObj.examFromTime.startDate).toISOString();
          rowList.to_time = (finalObj.examToTime.startDate).toISOString();

          let indexClass = editData.table.main.findIndex((e) => e.class_id == editData.mainRow.class_id);

          editData.table.main[indexClass].rows[editData.index] = rowList;

          msg = "Exam Updated"
        }

        if (editData.type == 'add') {


          let rowList = {};

          rowList['subject_id'] = [finalObj.subject];
          rowList['date'] = (finalObj.examDate.startDate).toISOString();
          rowList['from_time'] = (finalObj.examFromTime.startDate).toISOString();
          rowList['to_time'] = (finalObj.examToTime.startDate).toISOString();

          let indexClass = editData.table.main.findIndex((e) => e.class_id == editData.row.class_id);

          editData.table.main[indexClass].rows.push(rowList);
          msg = "New Date Added"

        }


        finalObj['rowdata'] = editData.table.main

        createfetchdata("POST", msg);
        setButtonLoading(false)

        setOpenEditPopup(false)

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


    if (data.data) {

      getTableData(data.data)


    }

  };



  async function getTableData(data) {
    let initArray = [];



    for (let i = 0; i < data.length; i++) {
      let tablesArr = {};

      const element = data[i];



      let finalDates = await getFromToDates(element.rowdata)

      let item = {};


      let indexCat = categoryData.current.findIndex((e) => e._id == element.category_id);

      item['heading'] = element.name;
      item['newHeaders'] = [];
      item['classInfo'] = [];
      item['classes'] = element.classes;
      item['table_id'] = element._id;
      item['from_date'] = finalDates.first;
      item['to_date'] = finalDates.last;
      item['from_time'] = element.from_time;
      item['to_time'] = element.to_time;
      item['category'] = categoryData.current[indexCat].name;
      item['categoryId'] = categoryData.current[indexCat]._id;


      for (let j = 0; j < element.classes.length; j++) {
        const element2 = element.classes[j];



        let index = classData.current.findIndex((e) => e._id == element2);


        if (index >= 0) {
          item.newHeaders.push(classData.current[index].name)
          item.classInfo.push({
            "name": classData.current[index].name,
            "_id": classData.current[index]._id,
          })
        }


      }

      tablesArr['props'] = item



      tablesArr['main'] = element.rowdata;

      initArray.push(tablesArr)


    }


    setTableProps(initArray);

  }



  function getFromToDates(params) {

    let newArr = [];


    for (let i = 0; i < params.length; i++) {
      const element = params[i];
      for (let j = 0; j < element.rows.length; j++) {
        const element2 = new Date(element.rows[j].date);
        newArr.push(element2)
      }
    }


    const maxDate = new Date(Math.max(...newArr));
    const minDate = new Date(Math.min(...newArr));


    var objOutput = {
      first: minDate,
      last: maxDate
    };

    return objOutput;

  }



  let getDaysArray = function (start, end) {
    for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
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

      let index = formElements.findIndex((e) => e.name == 'category_id_exams');

      formElements[index].list = data.data;


      categoryData.current = data.data;

    }

  };




  function setSchoolValues(data) {


    const transformed = data.map(({ _id, name }) => ({ label: name, value: _id }));


    let index = formElements.findIndex((e) => e.name == 'classes');

    formElements[index].list = transformed;

  }

  async function getSubjectInfo() {

    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=school_subject_data&school_id=" + school_id.current,

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (data.data) {


      subjectsList = data.data

      subjectData.current = data.data


    }



  };


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

    setSchoolValues(data.data)

    getExamsData();
  };

  useEffect(() => {

    getSchool_id();


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


    if (data.data) {


      school_id.current = data.data[0]._id
      getSubjectInfo();

      getClassData();
      getCategoryInfo();

    }

  };



  async function createfetchdata(type, msg) {



    finalObj.school_id = school_id.current;

    let requesttype = type;



    const res = await fetch("/api/examsAPI", {
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


        getExamsData()
        setAddExamPopup(false)


      }
    }



  }


  function editRowClicked(params, index, item) {

    finalObj = {}


    setEditData({ row: params, table: showExamData, index: index, mainRow: item, type: 'edit' });

    let editObj = params;


    let index2 = formElements.findIndex((e) => e.name == "examDate");

    let eventElem2 = formElements[index2];

    eventElem2['startDate'] = new Date(editObj.date);
    eventElem2.selectionType = "single";

    let index3 = formElements.findIndex((e) => e.name == "examFromTime");

    let eventElem3 = formElements[index3];

    eventElem3['startDate'] = new Date(editObj.from_time);

    let index4 = formElements.findIndex((e) => e.name == "examToTime");

    let eventElem4 = formElements[index4];

    eventElem4['startDate'] = new Date(editObj.to_time);



    let defId = "";
    let defValue = "Select a Value";

    if (editObj.subject_id[0]) {


      defId = editObj.subject_id[0];

      defValue = subjectData.current.filter(element => element._id == defId)[0].name;

    }

    let newFormElement = {};

    newFormElement =

    {
      id: getRandomString(),
      name: 'subject',
      list: subjectData.current,
      label: { //
        text: 'Select Subject',
        show: true,
      },
      defaultValuedata: {
        "_id": defId,
        "name": defValue
      },
      isValidated: false,


    }



    setformElements2([newFormElement])




    setOpenEditPopup(true)

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

    finalObj = {}

    if (editdeleteParams.type == 'exam') {


      finalObj['type'] = 'delete';
      finalObj['_id'] = editdeleteParams.props.table_id

      createfetchdata("PUT", 'Exam Deleted');
      setOpenAlert(false)

    }

    if (editdeleteParams.type == 'day') {

      finalObj['type'] = 'updateRow';
      finalObj['_id'] = editData.table.props.table_id;
      finalObj['name'] = editData.table.props.heading;


      let indexClass = editData.table.main.findIndex((e) => e.class_id == editData.mainRow.class_id);


      let rowList = editData.table.main[indexClass].rows;


      rowList = rowList.splice(editdeleteParams.index, 1);


      finalObj['rowdata'] = editData.table.main


      createfetchdata("POST", "Day Deleted");

      setOpenAlert(false);


    }

  }


  function sortDates(params) {

    finalObj = {};

    for (let i = 0; i < params.main.length; i++) {
      const element = params.main[i];

      element.rows.sort(function compare(a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return dateA - dateB;
      });

    }

    finalObj['type'] = 'updateRow';
    finalObj['_id'] = params.props.table_id;
    finalObj['name'] = params.props.heading;

    finalObj['rowdata'] = params.main

    createfetchdata("POST", "Dates Sorted");



  }

  function openShowExamPopup(index, data) {


    setShowExamData(data);
    setShowExamPopup(true)

  }


  function openAddExamPopup() {
    finalObj = {}
    emptyformData();

    setAddExamPopup(true)
    addType.current = 'add';


  }

  function editExamData(params) {

    finalObj = {}

    addBtnProps.label.text = 'Edit Exam';
    addType.current = 'edit';

    finalObj["_id"] = params.props.table_id;

    let index2 = formElements.findIndex((e) => e.name == "examDate");

    let eventElem2 = formElements[index2];

    eventElem2['startDate'] = new Date(params.props.from_date);
    eventElem2['endDate'] = new Date(params.props.to_date);
    eventElem2.selectionType = "range";

    let index3 = formElements.findIndex((e) => e.name == "examFromTime");

    let eventElem3 = formElements[index3];

    eventElem3['startDate'] = new Date(params.props.from_time);

    let index4 = formElements.findIndex((e) => e.name == "examToTime");

    let eventElem4 = formElements[index4];

    eventElem4['startDate'] = new Date(params.props.to_time);

    let index = formElements.findIndex((e) => e.name == "classes");

    let eventElem = formElements[index];

    let classList = [];
    for (let i = 0; i < params.props.classInfo.length; i++) {
      const element = params.props.classInfo[i];

      classList.push({
        'label': element.name,
        'value': element._id

      })

    }

    eventElem.defaultValuedata = classList;


    let index5 = formElements.findIndex((e) => e.name == "name");

    let eventElem5 = formElements[index5];

    eventElem5['data'] = params.props.heading

    let index6 = formElements.findIndex((e) => e.name == "category_id_exams");

    let eventElem6 = formElements[index6];

    eventElem6.defaultValuedata = { _id: params.props.categoryId, name: params.props.category }

    setAddExamPopup(true)

  }



  function deleteExam(params) {

    setEditDeleteParams(params);

    setEditDeleteParams(prevState => ({ ...prevState, type: 'exam' }));

    setOpenAlert(true);

  }


  function deleteDayData(params, index, row) {


    setEditDeleteParams(params);

    setEditData({ row: params, table: showExamData, index: index, mainRow: row });

    setEditDeleteParams(prevState => ({ ...prevState, type: 'day', index: index }));

    setOpenAlert(true);

  }



  function addDayData(params) {

    finalObj = {}


    setEditData({ row: params, table: showExamData, type: 'add' });

    if (params.rows.length > 0) {

    let editObj = params.rows[0];


    let index2 = formElements.findIndex((e) => e.name == "examDate");

    let eventElem2 = formElements[index2];

    eventElem2['startDate'] = new Date(editObj.date);
    eventElem2.selectionType = "single";

    let index3 = formElements.findIndex((e) => e.name == "examFromTime");

    let eventElem3 = formElements[index3];

    eventElem3['startDate'] = new Date(editObj.from_time);

    let index4 = formElements.findIndex((e) => e.name == "examToTime");

    let eventElem4 = formElements[index4];

    eventElem4['startDate'] = new Date(editObj.to_time);


    let newFormElement =

    {
      id: getRandomString(),
      name: 'subject',
      list: subjectData.current,
      label: { //
        text: 'Select Subject',
        show: true,
      },
      defaultValuedata: {
        "_id": "",
        "name": "Select a Value"
      },
      isValidated: false,


    }



    setformElements2([newFormElement])
  }

  else{




    let index2 = formElements.findIndex((e) => e.name == "examDate");

    let eventElem2 = formElements[index2];

    eventElem2['startDate'] = new Date();
    eventElem2.selectionType = "single";

    let index3 = formElements.findIndex((e) => e.name == "examFromTime");

    let eventElem3 = formElements[index3];

    eventElem3['startDate'] = new Date();

    let index4 = formElements.findIndex((e) => e.name == "examToTime");

    let eventElem4 = formElements[index4];

    eventElem4['startDate'] = new Date();


    let newFormElement =

    {
      id: getRandomString(),
      name: 'subject',
      list: subjectData.current,
      label: { //
        text: 'Select Subject',
        show: true,
      },
      defaultValuedata: {
        "_id": "",
        "name": "Select a Value"
      },
      isValidated: false,


    }



    setformElements2([newFormElement])

  }

    setOpenEditPopup(true)



  }


  function getSubject(params) {

    let subjectName = ""


    if (params) {

      let index = subjectData.current.findIndex((e) => e._id == params);
      subjectName = subjectData.current[index].name;
    }


    return subjectName


  }


  function getObjectId(label, type) {
    let objId = ""


    if (label.length > 0) {
      if (type == "subject") {

        objId = subjectsList.filter(e => e.name == label)[0]._id
      }

      if (type == "class") {
        objId = classesList.filter((e) => e.name == label)[0]._id;
      }
    }

    // return object ID from the array
    return objId;
  }

  function getClass(params) {

    let className = ""


    if (params) {

      let index = classData.current.findIndex((e) => e._id == params.class_id);
      if (index >= 0 ) {
        className = classData.current[index].name;

      }
    }


    return className


  }


  function viewMarks(obj) {


    router.push("/marks?examid=" + obj.props.table_id);

  }



  return (
    <LayoutMini>
      <ToastContainer autoClose={3000} />

      <div className="mt-2 sm:mx-auto sm:w-full md:px-6 ">
        <div className="pb-5 sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg px-2 py-2">
              Exams
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-xs md:mt-2 md:max-w-3xl pl-3">
              List of all exams
            </p>
          </div>
          {/* <div className="mt-3 flex sm:mt-0 sm:ml-4">
            <Button
              loading={buttonLoading}
              loadingText={buttonLoadingText}
              {...createBtnProps}
              click={(e) => openAddExamPopup(true)}
            />
          </div> */}
          <div className="mt-2 flex sm:mt-0 sm:ml-4">
            <button onClick={() => openAddExamPopup()}
              type="button"
              className="sm:text-md inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-3 h-6 w-6" aria-hidden="true" />
              Add New Exam
            </button>
          </div>
        </div>

        {tableProps.map((objdata, index) => (
          <section
            key={objdata.id}
            aria-labelledby="applicant-information-title"
          >
            <div className="my-6 border border-gray-200 sm:rounded-md">
              <header className="bg-white py-1">
                <div className="mx-auto px-4 sm:px-6 lg:px-4 xl:flex xl:items-center xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <h1 className="mt-1 text-md font-bold leading-4 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight capitalize">
                      {objdata.props.heading}
                    </h1>
                    <div className="mt-1 mb-2 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-8">
                      <div className="mt-1 flex items-center text-xs text-gray-600 capitalize">
                        {objdata.props.category}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex xl:mt-0 xl:ml-4">
                    <span className="hidden sm:block">
                      <button
                        onClick={() => {
                          downloadCSV(objdata.props.classInfo);
                        }}
                        type="button"
                        className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        {/* <ArrowDownIcon
                          className="-ml-0.5 h-4 w-4 text-gray-400"
                          aria-hidden="true"
                        /> */}

                        <DocumentArrowDownIcon
                          className="-mr-0.5 h-5 w-5 text-indigo-600"
                          aria-hidden="true"
                        />
                        {/* <span className='text-xs text-indigo-600'>Download Sample</span> */}
                      </button>
                    </span>

                    <span className="ml-3 hidden sm:block">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <DocumentArrowUpIcon
                            className="h-5 w-5 text-indigo-600"
                            aria-hidden="true"
                          />
                          {/* <span className='text-xs text-indigo-600'>Upload file</span> */}
                          {/* <span>Upload CSV</span> */}
                          <input id="file-upload" onChange={(evt) =>
                            fileChanged(
                              evt,
                              objdata.props.table_id,
                              objdata.props.classInfo
                            )
                          } name="file-upload" type="file" className="sr-only" />
                        </label>
                      </div>
                      {/* <input
                        id="file-upload"
                        onChange={(evt) =>
                          fileChanged(
                            evt,
                            objdata.props.table_id,
                            objdata.props.classInfo
                          )
                        }
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      /> */}
                    </span>

                    <span className="ml-3 hidden sm:block">
                      <button
                        type="button"
                        onClick={() => viewMarks(objdata)}
                        className="border border-indigo-200 inline-flex items-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-xs font-semibold text-indigo-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fill-rule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clip-rule="evenodd" />
                        </svg>

                        Marks
                      </button>
                    </span>

                    <span className="ml-3 hidden sm:block">
                      <button
                        type="button"
                        onClick={() => openShowExamPopup(index, objdata)}
                        className="border border-indigo-200 inline-flex items-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-xs font-semibold text-indigo-700"
                      >
                        <EyeIcon
                          className="-ml-0.5 h-5 w-5"
                          aria-hidden="true"
                        />
                        Exam
                      </button>
                    </span>

                    <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-shrink-0 sm:justify-start">
                      <Menu
                        as="div"
                        className="relative ml-3 inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="-my-2 flex items-center rounded-md bg-gray-200 px-2 py-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-0 focus:ring-indigo-500">
                            <span className="sr-only">Open options</span>
                            <EllipsisVerticalIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
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
                          <Menu.Items className="absolute right-0 z-10 mt-5 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => editExamData(objdata)}
                                    type="button"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "flex w-full justify-between px-4 py-2 text-sm"
                                    )}
                                  >
                                    <span>Edit</span>
                                  </button>
                                )}
                              </Menu.Item>

                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => deleteExam(objdata)}
                                    type="button"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "flex w-full justify-between px-4 py-2 text-sm"
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
              </header>
              <div className="border-t border-gray-200 px-4 py-2 lg:px-4">
                <dl className="flex space-x-6">
                  <div className="sm:col-span-1">
                    <dt className="text-xs font-medium text-gray-500 flex">
                      Start Date :{" "}
                      <dd className=" ml-2 text-xs text-gray-900">
                        {new Date(objdata.props.from_date)
                          .toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                          .replace(/ /g, "-")}{" "}

                      </dd>
                    </dt>
                  </div>

                  <div className="sm:col-span-1 ">
                    <dt className="text-xs font-medium text-gray-500 flex">
                      Classes :
                      <dd className="ml-2 text-xs text-gray-900">
                        {objdata.props.newHeaders.join(", ")}
                      </dd>
                    </dt>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        ))}



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
                          Edit Row
                        </Dialog.Title>

                        <div className="grid grid-cols-1 gap-2">
                          {formElements.map((objdata, index) => (
                            <div key={objdata.id}>
                              {objdata.name == "examDate" && (
                                <DateTimePicker
                                  {...formElements[index]}
                                  sendData={sendData}
                                  validate={validate}
                                />
                              )}

                              {objdata.name == "examFromTime" && (
                                <DateTimePicker
                                  {...formElements[index]}
                                  sendData={sendData}
                                  validate={validate}
                                />
                              )}
                              {objdata.name == "examToTime" && (
                                <DateTimePicker
                                  {...formElements[index]}
                                  sendData={sendData}
                                  validate={validate}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        {/* {formElements2.map((objdata, index) => (
                          <div key={objdata.id} className="my-2"> */}
                        <Dropdown
                          {...formElements2[0]}
                          sendData={sendData}
                          validate={validate}
                        />
                        {/* </div> */}
                        {/* ))} */}
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-4">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        onClick={(e) => checkFields(e)}
                      >
                        Edit Row
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <Transition.Root show={addExamPopup} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setAddExamPopup}>
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
                  <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white px-4 pb-4 text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                    <div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg pb-6 font-medium leading-6 text-gray-900"
                        >
                          {addBtnProps.label.text}
                        </Dialog.Title>

                        <form className="space-y-6">
                          <div className="grid grid-cols-1 text-left gap-4">
                            {formElements.map((objdata, index) => (
                              <div key={objdata.id}>
                                {objdata.name == "category_id_exams" && (
                                  <Dropdown
                                    {...formElements[index]}
                                    sendData={sendData}
                                    validate={validate}
                                  />
                                )}
                                {objdata.name == "classes" && (
                                  <MultiSelect
                                    className="w-full"
                                    {...formElements[index]}
                                    sendData={sendData}
                                    validate={validate}
                                  />
                                )}
                                {objdata.name == "name" && (
                                  <Input
                                    validate={validate}
                                    {...formElements[index]}
                                    sendData={sendData}
                                  />
                                )}
                                {objdata.name == "examDate" && (
                                  <DateTimePicker
                                    {...formElements[index]}
                                    sendData={sendData}
                                    validate={validate}
                                  />
                                )}

                                {objdata.name == "examFromTime" && (
                                  <DateTimePicker
                                    {...formElements[index]}
                                    sendData={sendData}
                                    validate={validate}
                                  />
                                )}
                                {objdata.name == "examToTime" && (
                                  <DateTimePicker
                                    {...formElements[index]}
                                    sendData={sendData}
                                    validate={validate}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 grid grid-cols-1 text-center gap-4">
                      <Button
                        loading={buttonLoading}
                        loadingText={buttonLoadingText}
                        {...addBtnProps}
                        click={(e) => checkFields(e)}
                      />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <Transition.Root show={showExamPopup} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => null}>
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
                  <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white px-4 pb-4 text-center shadow-xl transition-all sm:m-4 sm:h-screen sm:w-full sm:max-w-full sm:p-6">
                    <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setShowExamPopup(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg pb-6 font-medium leading-6 text-gray-900"
                        >
                          {showExamData.props.heading} (
                          {showExamData.props.category})
                        </Dialog.Title>

                        <div className="px-4 sm:px-6 lg:px-8">
                          <div className="-mx-4 mt-2 max-h-[700px] overflow-y-auto ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-slate-100 sticky top-0 z-10">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-4 pl-4 pr-3 text-left text-lg font-semibold text-slate-800 sm:pl-6"
                                  >
                                    Classes
                                  </th>
                                  <th
                                    scope="col"
                                    className="flex justify-between py-4 pl-4 pr-3 text-left text-lg font-semibold text-slate-800 sm:pl-6"
                                  >Exams
                                    <button
                                      type="button"
                                      className="inline-flex w-32 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                      onClick={() => sortDates(showExamData)}
                                    >

                                      Sort Dates
                                    </button>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {showExamData.main.map((item) => (
                                  <tr key={item._id}>
                                    <td className="whitespace-nowrap text-left py-2 pl-4 pr-3 text-xl font-medium text-gray-900 sm:pl-6">
                                      {getClass(item)}
                                    </td>
                                    <td className=" whitespace-nowrap px-3 py-2 text-sm text-gray-500 sm:table-cell">
                                      <div className="max-w-full overflow-auto px-0 py-1 flex space-x-3">
                                        {item.rows.length > 0 && (
                                          <ul
                                            role="list"
                                            className="mt-1 flex space-x-3"
                                          >
                                            {item.rows.map((item1, index) => (
                                              <li
                                                key={item1._id}
                                                className="col-span-1 flex flex-col rounded-lg bg-white text-center shadow border border-slate-200 "
                                              >
                                                <div className="flex flex-1 flex-col px-4 py-3">
                                                  <div>
                                                    <div className="flex justify-between">
                                                      <div></div>

                                                      <div className="flex">
                                                        <div className="timepicker relative form-floating mb-1 text-left">
                                                          <input
                                                            type="text"
                                                            className="w-16 px-1 py-1 text-base font-thin sm:text-xs text-slate-600 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                            value={new Date(
                                                              item1.from_time
                                                            ).toLocaleTimeString(
                                                              [],
                                                              {
                                                                hour: "2-digit",
                                                                minute:
                                                                  "2-digit",
                                                              }
                                                            )}
                                                            disabled
                                                          />
                                                        </div>
                                                        <span className="text-gray-300 pt-1">
                                                          -to-
                                                        </span>
                                                        <div className="timepicker relative form-floating mb-1 text-left">
                                                          <input
                                                            type="text"
                                                            className="w-16 px-1 py-1 text-base font-thin sm:text-xs text-slate-600 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                            value={new Date(
                                                              item1.to_time
                                                            ).toLocaleTimeString(
                                                              [],
                                                              {
                                                                hour: "2-digit",
                                                                minute:
                                                                  "2-digit",
                                                              }
                                                            )}
                                                            disabled
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <h3 className=" text-sm font-medium text-gray-900 truncate w-auto">
                                                    {new Date(
                                                      item1.date
                                                    ).toDateString()}
                                                  </h3>

                                                  <dl className="mt-1 flex flex-grow flex-col justify-between">
                                                    <dd className="text-sm text-gray-500 whitespace-normal w-full">
                                                      <b>Subject : </b>

                                                      {getSubject(
                                                        item1.subject_id[0]
                                                      )}
                                                      <br></br>
                                                    </dd>
                                                  </dl>
                                                </div>
                                                <div className="flex space-x-6 justify-center items-center pb-2">
                                                  <span
                                                    onClick={() =>
                                                      editRowClicked(
                                                        item1,
                                                        index,
                                                        item
                                                      )
                                                    }
                                                  >
                                                    <PencilSquareIcon
                                                      className="h-8 w-8 text-indigo-400 p-1.5 bg-indigo-50 rounded-md hover:shadow-xl cursor-pointer"
                                                      aria-hidden="true"
                                                    />
                                                  </span>
                                                  <span
                                                    onClick={() =>
                                                      deleteDayData(
                                                        item1,
                                                        index,
                                                        item
                                                      )
                                                    }
                                                  >
                                                    <TrashIcon
                                                      className="h-8 w-8 text-red-400 p-1.5 rounded-md bg-red-50 hover:shadow-xl cursor-pointer"
                                                      aria-hidden="true"
                                                    />
                                                  </span>
                                                </div>
                                              </li>
                                            ))}



                                          </ul>
                                        )}
                                        <button
                                          type="button"
                                          className="inline-flex items-center rounded-md border-2 bg-white p-6 text-slate-300 hover:text-slate-400 shadow-sm focus:outline-none"
                                          onClick={() => addDayData(item)}>
                                          <PlusIconOutline className="h-24 w-24" aria-hidden="true" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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