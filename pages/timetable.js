import { Fragment, useState, useEffect, useRef } from "react";

import {
  BookOpenIcon,
  BuildingLibraryIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
  EnvelopeIcon,
  ListBulletIcon,
  ClockIcon,
  Bars4Icon,
} from "@heroicons/react/24/outline";
import { PlusIcon as PlusIconMini } from "@heroicons/react/20/solid";
import { PlusIcon as PlusIconOutline } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Alert from "../components/Alert";

import Input from "../components/Input";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
// import DynamicDropdown from "../components/DynamicDropdownSearch";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import randomstring from "randomstring";
import Select from "react-select";
import Papa from "papaparse";


import * as z from "zod";




const days = [
  {
    name: "Monday",
  },
  {
    name: "Tuesday",
  },
  {
    name: "Wednesday",
  },
  {
    name: "Thursday",
  },
  {
    name: "Friday",
  },
  {
    name: "Saturday",
  },
  {
    name: "Sunday",
  },
];

let subjectsList = []
let teachersList = []

export default function Home() {
  const deleteMsg = "Subject";

  const [openTimetable, setOpenTimetable] = useState(false);
  const [showCSV, setShowCSV] = useState(false);
  const [csvError, setCsvError] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [class_is_selected, setclass_is_selected] = useState(false);

  const [subjectsData, setsubjectsData] = useState([]);
  const [iseditable, setiseditable] = useState({
    checkdata: false,
    editable_id: "asd233d3",
    daytype: "",
  });



  const [timetableData, settimetableData] = useState([
    // {
    //   "_id": "dsada",
    //   "daytype": "Monday",
    //   "value": [
    //     {
    //       "from_time": "09:00 AM",
    //       "to_time": "05:00 PM",
    //       "subject_id": {
    //         "_id": "234324",
    //         "name": "science"
    //       },
    //       "teacher_id": {
    //         "_id": "232133",
    //         "name": "teacher surya"
    //       },
    //     }
    //   ]
    // }
  ]);

  const [school_id, setschool_id] = useState("63f342d58b63575cf5dc3afc");
  const [class_id, setclass_id] = useState("");
  const [category_id, setcategory_id] = useState("");

  const [csvFile, setCsvFile] = useState(null);


  var classseslect = [
    {
      id: getRandomString(),
      name: "default_class_id",
      list: [],
      label: {
        //
        text: "Select Class",
        show: true,
      },
      defaultValuedata: {
        _id: "Please Select Class",
        name: "Please Select Class",
      },
      isValidated: false,
    },
  ];

  var initalformelements = [
    {
      name: "from_time",
      placeholder: "Enter start Time ",
      label: {
        //
        text: "start time (ex : 09:00 AM)",
        show: true,
        position: "top",
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      data: "",
      timetable_type: 'period',
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
      name: "to_time",
      placeholder: "Enter End Time ",

      label: {
        //
        text: "End Name (ex : 05:00 AM)",
        show: true,
        position: "top",
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      data: "",
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
      name: "subject_id",
      list: [],
      label: {
        //
        text: "Select Subject",
        show: true,
      },
      defaultValuedata: {
        _id: "Please Select Subject",
        name: "Please Select Subject",
      },
      isValidated: false,
      required: true,

    },
    {
      id: getRandomString(),
      name: "teacher_id",
      list: [],
      label: {
        //
        text: "Select Teacher",
        show: true,
      },
      defaultValuedata: {
        _id: "Please Select Teacher",
        name: "Please Select Teacher",
      },
      isValidated: false,
      required: true,

    },
  ];

  const [formElements, setformElements] = useState(initalformelements);
  const [selectClass, setselectClass] = useState(classseslect);
  const [from_time, setfrom_time] = useState("");
  const [to_time, setto_time] = useState("");
  const [break_name, setbreak_name] = useState("");
  const [is_break, setis_break] = useState(false);

  const [validate, setValidate] = useState(false);
  const notify = (label) => toast(label);

  const cancelButtonRef = useRef(null);

  //Alert button triggers
  const cancelTrigger = () => {
    setOpenAlert(false);
  };
  function confirmTrigger() {
    console.log("confirm");
    setOpenAlert(false);
  }
  const [alertObj, setAlertObj] = useState({
    type: "header",
    title: "Are you sure, you want to Delete?",
    message:
      " Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.",
    confirmButton: {
      show: true,
      color: "green",
      text: "Confirm",
    },
    dismissButton: {
      show: true,
      color: "red",
      text: "Close",
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
    },
  });

  function triggerdata(type) {
    for (let index = 0; index < formElements.length; index++) {
      const element = formElements[index];

      if (element.name == type) {
        return element;
      }
    }
  }
  function getRandomString() {
    let uniqueKey = randomstring.generate({
      length: 12,
      charset: "alphanumeric",
    });

    return uniqueKey;
  }

  useEffect(() => {
    getSchool_id();
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
    console.log(data, "getSchool_id");
    if (data.data) {

      setschool_id(data.data[0]._id);
      var tempschool_id = data.data[0]._id;

      getClassData(tempschool_id);
      getTeacherData(tempschool_id);
    }
  };

  const getClassData = async (tempschool_id) => {
    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=classes&school_id=" + tempschool_id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    var data = await res.json();
    console.log("class Data>>>>", data);

    // setClassData(data.data)

    if (data.data) {
      const myNextList = [...selectClass];
      const indiobj = myNextList.find((a) => a.name === "default_class_id");
      indiobj.list = data.data;
      setselectClass(myNextList);
    }
  };

  const getTeacherData = async (tempschool_id) => {
    const res = await fetch("/api/timetableAPI?school_id=" + tempschool_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    var data = await res.json();
    console.log("restaurent Data>>>>", data);

    // setClassData(data.data)

    if (data.data) {
      // const myNextList = [...formElements];
      // const indiobj = myNextList.find(
      //   a => a.name === "default_class_id"
      // );
      // indiobj.list = data.data;
      // setformElements(myNextList);
    }
  };

  const get_timetable_data = async (class_id) => {
    const res = await fetch(
      // "/api/All_fetch_queriesAPI?type=classes&school_id=" + school_id,
      // "/api/All_fetch_queriesAPI?type=justsingleClassdata&class_id=" + class_id,
      "/api/timetableAPI?type=justsingleClassdata&class_id=" + class_id,

      // "/api/All_fetch_queriesAPI?type=classes",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (data.data) {
      console.log(data, "get_timetable_data");
      var finalobj = data.data[0];

      // console.log(formElements, "formElements")

      const myNextList = [...formElements];
      const indiobj = myNextList.find((a) => a.name === "subject_id");
      indiobj.list = data.data[0].subjects;

      subjectsList = data.data[0].subjects

      console.log("Subjects List>>>>>", subjectsList);
      setformElements(myNextList);

      // setsubjectsData(finalobj.subjects);

      var newtemparr = [
        {
          daytype: "Monday",
          _id: getRandomString(),
        },
        {
          daytype: "Tuesday",
          _id: getRandomString(),
        },
        {
          daytype: "Wednesday",
          _id: getRandomString(),
        },
        {
          _id: getRandomString(),
          daytype: "Thursday",
        },
        {
          daytype: "Friday",
          _id: getRandomString(),
        },
        {
          daytype: "Saturday",
          _id: getRandomString(),
        },
        {
          daytype: "Sunday",
          _id: getRandomString(),
        },
      ];

      for (let index = 0; index < newtemparr.length; index++) {
        const daytype = newtemparr[index].daytype;
        const objdata = newtemparr[index];
        var smallcase = daytype.toLowerCase();

        objdata["value"] = finalobj[smallcase];
      }

      console.log(newtemparr, "newtemparr");
      settimetableData(newtemparr);

      setclass_id(finalobj._id);
      setcategory_id(finalobj.category_id);
      getTeachersdata(finalobj.category_id);
    }
  };

  function save_daywise_data() {
    // setOpenTimetable
    emptyformData();

    if (is_break == true) {
      handlebreakdata();
    } else {
      setValidate(true);
    }
  }

  async function handlebreakdata() {
    var finalObj21 = {
      type: "break",
      from_time: from_time,
      to_time: to_time,
      break_name: break_name,
    };
    var requesttype;

    finalObj21.daytype = iseditable.daytype.toLowerCase();

    finalObj21.class_id = class_id;

    if (iseditable.checkdata == true) {
      requesttype = "PUT";
      finalObj21._id = iseditable.editable_id;
    } else {
      requesttype = "POST";
    }

    const res = await fetch("/api/timetableAPI", {
      method: requesttype,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalObj21),
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

        setOpenTimetable(false);

        get_timetable_data(class_id);
      }
    }
  }
  let finalObj = {
    school_id: school_id,
  };

  function validationHandler(params) {
    let formValidated = false;

    const result = formElements.filter((element) => element.id == params.id)[0];

    console.log(params, "params");
    if (params.hasOwnProperty("valid")) {
      if (params.valid == true) {
        result.isValidated = true;

        if ("type" in params) {
          if (params.type == "multiselect") {
            var temparr = [];
            for (let index = 0; index < params.value.length; index++) {
              const element = params.value[index].value;
              temparr.push(element);
            }

            finalObj[params.name] = temparr;
          } else if (params.type == "dropdown") {
            finalObj[params.name] = params.value._id;
          } else {
            finalObj[params.name] = params.value;
          }
        }
      } else {
        console.log("params.name", params);
        result.isValidated = false;
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

  async function deletedaydata(indiid, day_id, daytype) {
    const res = await fetch("/api/timetableAPI", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "delete",
        class_id: class_id,
        day_id: day_id,
        daytype: daytype.toLowerCase(),
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
        // getClassData(school_id);
        get_timetable_data(class_id);
      }
    }
  }

  function editDaydata(indiid, day_id, daytype) {
    console.log(indiid, day_id, daytype, "editDaydata");

    var daydata = timetableData.filter((val) => val._id == indiid);
    var indi_period_data = daydata[0].value.filter((val) => val._id == day_id);

    console.log(daydata, "daydata");
    console.log(indi_period_data, "indi_period_data");

    if (indi_period_data[0].type == "period") {
      setis_break(false);

      getTeachersdata(category_id);

      const from_time = indi_period_data[0].from_time;
      const to_time = indi_period_data[0].to_time;
      const subject_id = indi_period_data[0].subject_id;
      const teacher_id = indi_period_data[0].teacher_id;

      var finalteacherobj = {
        _id: teacher_id._id,
        name: teacher_id.first_name.concat(teacher_id.last_name),
      };

      for (let index = 0; index < formElements.length; index++) {
        const name = formElements[index].name;
        const indiobj = formElements[index];

        if (name == "from_time") {
          indiobj.data = from_time;
        } else if (name == "to_time") {
          indiobj.data = to_time;
        } else if (name == "subject_id") {
          indiobj.defaultValuedata = subject_id;
        } else {
          indiobj.defaultValuedata = finalteacherobj;
        }
      }
    } else {
      setis_break(true);

      const from_time = indi_period_data[0].from_time;
      const to_time = indi_period_data[0].to_time;
      const name = indi_period_data[0].name;

      setfrom_time(from_time);
      setto_time(to_time);
      setbreak_name(name);

    }

    setiseditable({
      ...iseditable,
      checkdata: true,
      editable_id: indi_period_data[0]._id,
      daytype: daytype,
    });

    setOpenTimetable(true);
  }

  function closecat() {
    var modal = document.getElementById("myModal21");
    modal.style.display = "none";
  }

  async function saveEditCategoryModel() {
    var modal = document.getElementById("myModal21");
    modal.style.display = "none";

    var finalObj43 = {
      _id: iseditable.editable_id,
      type: "sort",
      data: list,
      class_id: class_id,

      daytype: iseditable.daytype.toLowerCase(),
    };

    console.log(finalObj43, "finalObj43");

    const res = await fetch("/api/timetableAPI", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalObj43),
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

        var modal = document.getElementById("myModal21");
        modal.style.display = "none";

        get_timetable_data(class_id);
      }
    }
  }

  async function createfetchdata() {
    console.log(finalObj, "finalObj finalObj");

    finalObj.daytype = iseditable.daytype.toLowerCase();

    finalObj.class_id = class_id;
    finalObj.type = "period";

    var requesttype;
    if (iseditable.checkdata == true) {
      requesttype = "PUT";
      finalObj._id = iseditable.editable_id;
    } else {
      requesttype = "POST";
    }

    const res = await fetch("/api/timetableAPI", {
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

        setOpenTimetable(false);

        get_timetable_data(class_id);
      }
    }
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

  function createtimetableValue(_id, daytype) {
    setis_break(false);
    emptyformData();

    setOpenTimetable(true);
    getTeachersdata(category_id);

    setiseditable({
      ...iseditable,
      checkdata: false,
      editable_id: "",
      daytype: daytype,
    });
  }

  const getTeachersdata = async (category_id) => {
    // here getting teacher data that are linked to that class

    const res = await fetch(
      // "/api/All_fetch_queriesAPI?type=classes&school_id=" + school_id,
      "/api/timetableAPI?type=teacherData&category_id=" +
      category_id +
      "&school_id=" +
      school_id,

      // "/api/All_fetch_queriesAPI?type=classes",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    teachersList = data.data;

    console.log("Teachers List>>>>>", teachersList);

    if (data.data) {
      const transformed = data.data.map(({ _id, first_name, last_name }) => ({
        name: first_name.concat(last_name),
        _id: _id,
      }));

      const myNextList = [...formElements];
      const indiobj = myNextList.find((a) => a.name === "teacher_id");
      indiobj.list = transformed;

      setformElements(myNextList);
    }
  };

  async function sendInput(data) {
    console.log(data, "sendInput");
  }

  async function sendData(data) {
    // setValidate(false)

    if (data.name == "default_class_id") {
      console.log(data, "senddata");

      get_timetable_data(data.value._id);

      setclass_is_selected(true);

    } else {
      setValidate(false);

      let formValidated = await validationHandler(data);

      console.log(formValidated, "formValidated");

      if (formValidated == true) {
        createfetchdata();
      }
    }
  }

  // Time Table Template
  const [templateObj, setTemplateObj] = useState({
    type: "text",
    icon: {
      show: true,
      position: "left",
      iconSelected: BuildingLibraryIcon,
    },
    label: {
      text: "Template Name",
      show: true,
      position: "top",
    },
    value: "",
    enabled: true,
    placeholder: "Enter Category",
    errorMessage: "Please enter a caregory name to add!",
  });
  const templateValue = (param) => {
    // let newObj = txtAreaObj.label;
    // newObj.text = param;
    setTemplateObj({
      ...templateObj, // Copy the old fields
      value: param, // But override this one
    });
  };

  //Button Create Time Table
  const [buttonObj, setButtonObj] = useState({
    label: "Create Template",

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
  };

  const [inputObj, setInputObj] = useState({
    type: "time",

    icon: {
      show: true,
      position: "left",
      iconSelected: ClockIcon,
    },
    label: {
      text: "Select time",
      show: true,
      position: "top",
    },
    value: "09:00 AM",
    enabled: true,
    placeholder: "Enter Category",
    errorMessage: "Please enter a caregory name to add!",
  });

  const subjectObj = {
    type: "text",

    icon: {
      show: true,
      position: "left",
      iconSelected: BookOpenIcon,
    },
    label: {
      text: "Subject",
      show: true,
      position: "top",
    },
    value: "",
    enabled: true,
    placeholder: "Enter Category",
    errorMessage: "Please enter a caregory name to add!",
  };

  const periodObj = {
    type: "text",

    icon: {
      show: true,
      position: "left",
      iconSelected: ListBulletIcon,
    },
    label: {
      text: "Period",
      show: true,
      position: "top",
    },
    value: "",
    enabled: true,
    placeholder: "Enter Category",
    errorMessage: "Please enter a caregory name to add!",
  };



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
      setShowCSV(false)

    }
    else {
      setCsvError("Oops! Please re-check your CSV and upload again")
    }




  }

  async function fileChanged(event) {
    const file = event.target.files[0];
    console.log("File Changed>>>>");
    setCsvError("")

    let dataObj =
    {
      class_id: class_id,
      type: "timetable",
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    }


    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log("Parsed>>>>", results.data);

        if (results.data.length > 0) {
          let index = 0

          for (const iterator of results.data) {

            console.log(iterator, 'iterator');

            let type = iterator.Day;

            console.log(type, "type");


            index++

            if (type.includes("Subject")) {

              if (iterator.Monday != "Break" && iterator.Monday != "") {
                dataObj.monday.push({
                  teacher_id: getObjectId(
                    results.data[index].Monday,
                    "teacher"
                  ),
                  subject_id: getObjectId(iterator.Monday, "subject"),
                  type: "period",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              } else {
                dataObj.monday.push({
                  name: "Break",
                  type: "break",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              }

              if (iterator.Tuesday != "Break" && iterator.Tuesday != "") {
                dataObj.tuesday.push({
                  teacher_id: getObjectId(
                    results.data[index].Tuesday,
                    "teacher"
                  ),
                  subject_id: getObjectId(iterator.Tuesday, "subject"),
                  type: "period",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              } else {
                dataObj.tuesday.push({
                  name: "Break",
                  type: "break",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              }

              if (iterator.Wednesday != "Break" && iterator.Wednesday != "") {
                dataObj.wednesday.push({
                  teacher_id: getObjectId(results.data[index].Wednesday, "teacher"),
                  subject_id: getObjectId(iterator.Wednesday, "subject"),
                  type: "period",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              } else {
                dataObj.wednesday.push({
                  name: "Break",
                  type: "break",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              }

              if (iterator.Thursday != "Break" && iterator.Thursday != "") {
                dataObj.thursday.push({
                  teacher_id: getObjectId(
                    results.data[index].Thursday,
                    "teacher"
                  ),
                  subject_id: getObjectId(iterator.Thursday, "subject"),
                  type: "period",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              } else {
                dataObj.thursday.push({
                  name: "Break",
                  type: "break",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              }

              if (iterator.Friday != "Break" && iterator.Friday != "") {
                dataObj.friday.push({
                  teacher_id: getObjectId(results.data[index].Friday, "teacher"),
                  subject_id: getObjectId(iterator.Friday, "subject"),
                  type: "period",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              } else {
                dataObj.friday.push({
                  name: "Break",
                  type: "break",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              }


              if (iterator.Saturday != "Break" && iterator.Saturday != "") {
                dataObj.saturday.push({
                  teacher_id: getObjectId(results.data[index].Saturday, "teacher"),
                  subject_id: getObjectId(iterator.Saturday, "subject"),
                  type: "period",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              } else {
                dataObj.saturday.push({
                  name: "Break",
                  type: "break",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              }


              if (iterator.Sunday != "Break" && iterator.Sunday != "") {
                dataObj.sunday.push({
                  teacher_id: getObjectId(results.data[index].Sunday, "teacher"),
                  subject_id: getObjectId(iterator.Sunday, "subject"),
                  type: "period",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              } else {
                dataObj.sunday.push({
                  name: "Break",
                  type: "break",
                  from_time: "9:00 AM",
                  to_time: "10:00 AM",
                });
              }

            }

          }

          uploadCSV(dataObj)
        }
        else {
          setCsvError("No Records to upload")
        }

      },
    });

    // const csvData = await parseFile(file);


  }


  function getObjectId(label, type) {
    let objId = ""
    if (label.length > 0) {
      if (type == "subject") {

        objId = subjectsList.filter(e => e.name == label)[0]._id
      }

      if (type == "teacher") {
        objId = teachersList.filter((e) => e.first_name + " " + e.last_name == label)[0]._id;
      }
    }

    // return object ID from the array
    return objId;
  }


  function downloadCSV() {


    let newTeachers = []
    for (const iterator of teachersList) {

      newTeachers.push({
        _id: iterator._id,
        name: iterator.first_name + " " + iterator.last_name,
      });
    }

    var maindata = [
      [
        "Day",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      [
        "Period1 Subject",
        "English",
        "English",
        "English",
        "English",
        "English",
        "English",
        "English",
      ],
      [
        "Period1 Teacher",
        "Mahesh",
        "Mahesh",
        "Mahesh",
        "Mahesh",
        "Mahesh",
        "Mahesh",
        "Mahesh",
      ],
      [
        "Period2 Subject",
        "Mathematics",
        "Mathematics",
        "Mathematics",
        "Mathematics",
        "Mathematics",
        "Mathematics",
        "Mathematics",
      ],
      [
        "Period2 Teacher",
        "Robert",
        "Robert",
        "Robert",
        "Robert",
        "Robert",
        "Robert",
        "Robert",
      ],
      [
        "Period3 Subject",
        "Break",
        "Break",
        "Break",
        "Break",
        "Break",
        "Break",
        "Break",
      ],
      ["Period3 Teacher", "", "", "", "", "", "", ""],
      [
        "Period4 Subject",
        "Social",
        "Social",
        "Social",
        "Social",
        "Social",
        "Social",
        "Social",
      ],
      [
        "Period4 Teacher",
        "Haneef",
        "Haneef",
        "Haneef",
        "Haneef",
        "Haneef",
        "Haneef",
        "Haneef",
      ],
      [],
      [],
      ["Subjects List"],
      ...subjectsList.map(({ name }) => [name]),
      [],
      [],
      ["Teachers List"],
      ...newTeachers.map(({ name }) => [name])
    ];

    downloadFile(maindata);
  }

  function downloadFile(sheets) {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      sheets.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "timetable.csv");


    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleOnDragEnd(result) {
    console.log(result, "handleOnDragEnd");

    if (!result.destination) return;

    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // setCategory1(items);

    // console.log(items, "items");

    setList(items);
  }

  function breakfn(_id, daytype) {
    setis_break(true);
    emptyformData();

    setOpenTimetable(true);
    setiseditable({
      ...iseditable,
      checkdata: false,
      editable_id: "",
      daytype: daytype,
    });
  }

  const [openSortablepopoup, setopenSortablepopoup] = useState(false);
  const [list, setList] = useState([]);

  function openpopdata(data) {
    console.log(data, "openpopdata data");

    setList(data.value);

    setiseditable({
      ...iseditable,
      checkdata: true,
      editable_id: data._id,
      daytype: data.daytype,
    });

    // setopenSortablepopoup(true)
    var modal = document.getElementById("myModal21");
    modal.style.display = "block";
  }

  return (
    <>
      <ToastContainer autoClose={3000} />
      {/*  */}
        <div className="px-6 py-3">
          <div>
            <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg ">
              Time Table
            </h2>
            <p className="mt-1 text-md text-gray-500 sm:text-lg md:mt-2 md:max-w-3xl pl-2">
              Create time table Template
            </p>
          </div>

          <div className="mt-4 flex space-x-4 justify-start max-w-md justify-start items-center border border-gray-200 rounded-md px-2 py-2">
            <div className="flex space-x-4">
              <div className="md:w-72 md:min-w-2xl md:max-w-3xl">
                <Dropdown {...selectClass[0]} sendData={sendData} />
              </div>
              <div>



                {class_is_selected == true &&
                  <button
                    onClick={() => setShowCSV(true)}
                    type="button"
                    className="mt-5 rounded bg-indigo-600 py-2.5 px-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Upload CSV File
                  </button>
                }
              </div>

            </div>
          </div>

        </div>

        {timetableData.length == 0 && (
          <div className="pl-0 ml-10 text-center py-10 sm:py-24 mt-3 max-w-xl text-md sm:text-4xl border border-slate-400 text-slate-400 rounded-lg shadow-sm">
            No data to display
          </div>
        )}
        {timetableData.length != 0 && (
          <div className="px-4 sm:px-4 lg:px-4">
            <div className="-mx-4 mt-4 max-h-[550px] overflow-y-auto ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-50 sticky top-0 divide-x divide-gray-200">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                    >
                      Day
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white ">
                  {timetableData.map((item) => (
                    <tr key={item._id}>
                      <td className="w-24 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        <p>{item.daytype}</p>
                        <span onClick={() => openpopdata(item)} className="w-14 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 cursor-pointer">
                          <BarsArrowUpIcon className="-ml-0.5 h-4 w-4 text-indigo-700" aria-hidden="true" />
                          Sort
                        </span>
                        {/* <button className="sm:text-sm inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => openpopdata(item)} > Sort Periods </button> */}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                        <div className="max-w-full overflow-auto px-0 py-2 flex space-x-3">
                          {item.value.length > 0 && (
                            <ul role="list" className=" flex space-x-1">
                              {item.value.map((item1, index) => (
                                <li
                                  key={item1._id}
                                  className="col-span-1 flex rounded-lg bg-white text-center "
                                >
                                  {item1.type == "period" && (
                                    <div className="border border-gray-200 rounded-lg w-24 h-24 pt-1">
                                      <div className="flex flex-1 flex-col px-2 py-0">
                                        <div>
                                          <div className="flex justify-around">
                                            <div className="timepicker relative form-floating mb-1 text-center">
                                              <input
                                                type="text"
                                                className="w-10 px-1 py-1 text-base font-thin sm:text-xs text-slate-600 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                value={item1.from_time}
                                                disabled
                                              />
                                            </div>
                                            <span className="text-gray-300 pt-1">
                                              -
                                            </span>
                                            <div className="timepicker relative form-floating mb-1 text-center">
                                              <input
                                                type="text"
                                                className="w-10 px-1 py-1 text-base font-thin sm:text-xs text-slate-600 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                value={item1.to_time}
                                                disabled
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        {/* <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={person.imageUrl} alt="" /> */}
                                        <h3 className="text-xs font-medium text-gray-900 truncate w-24">
                                          {item1.subject_id.name}
                                        </h3>
                                        <dl className="flex flex-grow flex-col justify-between">
                                          <dd className="text-xs text-gray-500 truncate max-w-20">
                                            {item1.teacher_id.first_name}
                                            {item1.teacher_id.last_name}
                                          </dd>
                                        </dl>
                                      </div>
                                      <div className="flex space-x-4 justify-center items-center pb-1 pt-1">
                                        <span
                                          onClick={() =>
                                            editDaydata(
                                              item._id,
                                              item1._id,
                                              item.daytype
                                            )
                                          }
                                        >
                                          <PencilSquareIcon
                                            className="h-5 w-5 text-indigo-400 p-0.5 bg-indigo-50 rounded-md hover:shadow-xl cursor-pointer"
                                            aria-hidden="true"
                                          />
                                        </span>
                                        <span
                                          onClick={() =>
                                            deletedaydata(
                                              item._id,
                                              item1._id,
                                              item.daytype
                                            )
                                          }
                                        >
                                          <TrashIcon
                                            className="h-5 w-5 text-red-400 p-0.5 rounded-md bg-red-50 hover:shadow-xl cursor-pointer"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {item1.type == "break" && (
                                    <div className="border border-gray-200 rounded-lg w-24 h-24 pt-1 bg-gray-300 rounded-lg relative" >
                                      <div className="flex flex-1 flex-col px-0 py-0 mb-1">
                                        <div>
                                          <div className="flex justify-center pt-2 px-0.5">
                                            <div className="timepicker relative form-floating text-left  w-16 truncate">
                                              {/* <input
                                                type="text"
                                                className="w-10 px-1 py-1 text-base font-thin sm:text-xs text-slate-600 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                value={item1.from_time}  style={{writingMode: "vertical-rl", textOrientation: "mixed"}}
                                                disabled
                                              /> */}
                                              <small className="text-xs text-gray-700 font-thin rounded-md">{item1.from_time}</small>
                                            </div>
                                            <span className="text-gray-700 text-xs">
                                              -
                                            </span>
                                            <div className="timepicker relative form-floating text-left w-16 truncate ">
                                              {/* <input
                                                type="text"
                                                className="w-10 px-1 py-1 text-base font-thin sm:text-xs text-slate-600 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                value={item1.to_time}
                                                disabled
                                              /> */}

                                              <small className="text-xs text-gray-700 font-thin rounded-md">{item1.to_time}</small>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-center w-full" >
                                          <span className=" text-xs font-medium text-gray-700 h-auto my-auto break-all break-words w-24 truncate py-2">
                                            {item1.name}
                                            {/* <p className="text-slate-800 text-xs">break</p> */}
                                          </span>
                                        </div>
                                        {/* <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={person.imageUrl} alt="" /> */}

                                      </div>
                                      <div className="flex space-x-4 justify-center items-center ml-1">
                                        <span
                                          onClick={() =>
                                            editDaydata(
                                              item._id,
                                              item1._id,
                                              item.daytype
                                            )
                                          }
                                        >
                                          <PencilSquareIcon
                                            className="h-5 w-5 p-0.5 text-indigo-400 bg-indigo-50 rounded-md hover:shadow-xl cursor-pointer"
                                            aria-hidden="true"
                                          />
                                        </span>
                                        <span
                                          onClick={() =>
                                            deletedaydata(
                                              item._id,
                                              item1._id,
                                              item.daytype
                                            )
                                          }
                                        >
                                          <TrashIcon
                                            className="h-5 w-5 p-0.5 text-red-400 rounded-md bg-red-50 hover:shadow-xl cursor-pointer"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      </div>

                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}

                          <span className="grid grid-cols-1 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-lg w-24 h-24 py-1 px-1 gap-2 items-center justify-center">
                            <button
                              className="sm:text-xs inline-flex items-center mx-auto rounded-md border border-transparent bg-indigo-100 px-3 py-1 font-medium text-indigo-700 shadow-sm hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() =>
                                createtimetableValue(item._id, item.daytype)
                              }
                            >
                              <PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                              Period
                            </button>

                            <button
                              className="sm:text-xs inline-flex items-center mx-auto rounded-md border border-transparent bg-gray-300 px-3 py-1 font-medium text-gray-800 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => breakfn(item._id, item.daytype)}
                            >
                              <PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                              Break
                            </button>

                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      {/*  */}

      <div id="myModal21" className="relative modal21" style={{ display: "none" }}>
        <div className="relative modal-content21">
          <h2 className="text-4xl font-extrabold leading-6 text-slate-400 pb-6">Sort Time Table</h2>
          {list.length > 0 && (
            <div className="mt-5">
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="characters">
                  {(provided) => (
                    <ul
                      className="characters"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {list.map((detail, index) => {
                        return (
                          <Draggable
                            key={detail._id}
                            draggableId={detail._id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps} // Make sure this is passed to the correct element
                                style={{
                                  ...provided.draggableProps.style,
                                  backgroundColor: snapshot.isDragging
                                    ? "lightblue"
                                    : "white",
                                }}
                              >
                                <div className="flex items-center space-x-4 justify-start">
                                  <Bars4Icon
                                    className="block h-6 w-6 border-none text-gray-400"
                                    aria-hidden="true"
                                  />

                                  {detail.type == "period" && (
                                    <div className="bg-indigo-100 md:min-w-[550px] md:max-w-[550px] truncate flex space-x-2 justify-around items-center border border-indigo-200 p-2 my-2 rounded-md">

                                      <h3 className=" text-sm font-medium text-gray-900 truncate ">
                                        <span className="text-sm font-bold text-gray-600">From:</span><span className="text-xs font-normal text-gray-600">{detail.from_time}</span>
                                      </h3>

                                      <h3 className=" text-sm font-medium text-gray-900 truncate ">
                                        <span className="text-sm font-bold text-gray-600">To:</span><span className="text-xs font-normal text-gray-600">{detail.to_time}</span>
                                      </h3>
                                      <h3 className="  truncate ">
                                        <span className="text-sm font-bold text-gray-600">Subject :</span><span className="text-sm font-normal text-gray-600">{detail.subject_id.name}</span>
                                      </h3>

                                      <h3 className="text-sm text-gray-500 truncate ">
                                        <span className="text-sm font-bold text-gray-600">Teacher Name :{" "}</span><span className="text-sm font-normal text-gray-600"> {detail.teacher_id.first_name}{" "}
                                          {detail.teacher_id.last_name}</span>
                                      </h3>
                                    </div>
                                  )}

                                  {detail.type == "break" && (
                                    <div className="bg-gray-100 md:min-w-[550px] md:max-w-[550px]  truncate flex space-x-2 justify-around items-center border border-gray-200 p-2 my-2 rounded-md">
                                      <h3 className="text-sm font-medium text-gray-900 truncate ">
                                        <span className="text-sm font-bold text-gray-600">Name:</span><span className="text-sm font-normal text-gray-600"> {detail.name}</span>
                                      </h3>
                                      <h3 className="text-sm font-medium text-gray-900 truncate ">
                                        <span className="text-sm font-bold text-gray-600">From:</span><span className="text-sm font-normal text-gray-600"> {detail.from_time}</span>
                                      </h3>
                                      <h3 className="text-sm font-medium text-gray-900 truncate ">
                                        <span className="text-sm font-bold text-gray-600">To:</span><span className="text-sm font-normal text-gray-600"> {detail.to_time}</span>
                                      </h3>
                                    </div>
                                  )}
                                </div>
                              </li>
                            )}
                          </Draggable>
                        );
                      })}

                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}

          <div className="absolute bottom-5 left-0 text-center flex items-bottom justify-center w-full">
            <button
              type="button"
              className=" mr-3 w-36 rounded-md border border-red-500 bg-white px-4 py-2 text-base font-medium text-red-500 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:text-sm"
              onClick={() => closecat()}
            >
              Close
            </button>
            <button
              type="button"
              className="w-36 rounded-md border border-transparent bg-orange-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:text-sm"
              onClick={() => saveEditCategoryModel()}
            >
              Save
            </button>
          </div>
        </div>

      </div>

      <Transition.Root show={openSortablepopoup} as={Fragment}>
        <Dialog
          as="div"
          className=" z-10"
          initialFocus={cancelButtonRef}
          onClose={setopenSortablepopoup}
        >
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
                <Dialog.Panel className="border-l-8 border-slate-400 relative transform overflow-hidden rounded-lg bg-white px-4 pt-10 pb-8 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-16">
                  <Dialog.Title
                    as="h3"
                    className="text-4xl font-extrabold leading-6 text-slate-400 pb-6"
                  >
                    Sort Time Table
                  </Dialog.Title>
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setopenSortablepopoup(false)}
                    >
                      <XMarkIcon
                        className="h-10 w-10 text-slate-400"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-left sm:mt-5">
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                          <Droppable droppableId="characters">
                            {(provided) => (
                              <ul
                                className="characters"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {list.value.map((detail, index) => {
                                  return (
                                    <Draggable
                                      key={detail._id}
                                      draggableId={detail._id.toString()}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <li
                                          snapshot={snapshot}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          key={detail._id}
                                          className="py-1"
                                        >
                                          <div className="flex items-center space-x-4 justify-start w-full">
                                            <Bars4Icon
                                              className="block h-6 w-6 border-none text-gray-400"
                                              aria-hidden="true"
                                            />
                                            <div className="">
                                              <input
                                                type="text"
                                                name="first-name"
                                                id="first-name"
                                                placeholder="New Label"
                                                className="w-96 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                              />
                                            </div>

                                            <div className="cursor-pointer">
                                              <a className="inline-flex items-center rounded-full border border-transparent bg-red-500 px-1 py-1 text-sm font-medium leading-5 text-white shadow-sm">
                                                <TrashIcon className="h-4 w-4 text-white font-medium" />
                                              </a>
                                            </div>
                                          </div>
                                        </li>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </ul>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:flex sm:items-center sm:justify-end sm:space-x-3">
                        <button
                          type="button"
                          className="mt-3 inline-flex w-36 justify-center rounded-md border border-gray-300 bg-white px-3 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-lg"
                          onClick={() => setopenSortablepopoup(false)}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="inline-flex w-36 justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-lg"
                          // onClick={() => setOpenTimetable(false)}
                          onClick={() => saveSortableData()}
                        >
                          Save
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

      <Transition.Root show={openTimetable} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenTimetable}
        >
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-10 pb-8 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-16">
                  <Dialog.Title
                    as="h3"
                    className="text-4xl font-extrabold leading-6 text-slate-400 pb-6"
                  >
                    Add Details
                  </Dialog.Title>
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpenTimetable(false)}
                    >
                      <XMarkIcon
                        className="h-10 w-10 text-slate-400"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-left sm:mt-5">
                      {is_break == false && (
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-1 gap-5">
                          <div>
                            <Input
                              validate={validate}
                              {...triggerdata("from_time")}
                              sendData={sendData}
                            />
                          </div>
                          <div>
                            <Input
                              validate={validate}
                              {...triggerdata("to_time")}
                              sendData={sendData}
                            />
                          </div>
                          <div>
                            <Dropdown
                              validate={validate}
                              {...triggerdata("subject_id")}
                              sendData={sendData}
                            />
                          </div>
                          <div>
                            <Dropdown
                              validate={validate}
                              {...triggerdata("teacher_id")}
                              sendData={sendData}
                            />
                          </div>
                        </div>
                      )}
                      {is_break == true && (
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-1 gap-5">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Break Type Ex : Lunch Break , Snack Break , Morning
                              Break
                            </label>
                            <div className="mt-1">
                              <input
                                value={break_name}
                                onChange={(e) => setbreak_name(e.target.value)}
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              start time (ex : 09:00 AM),
                            </label>
                            <div className="mt-1">
                              <input
                                value={from_time}
                                onChange={(e) => setfrom_time(e.target.value)}
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              End time (ex : 09:20 AM),

                            </label>
                            <div className="mt-1">
                              <input
                                value={to_time}
                                onChange={(e) => setto_time(e.target.value)}
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-5 sm:mt-6 sm:flex sm:items-center sm:justify-end sm:space-x-3">
                        <button
                          type="button"
                          className="mt-3 inline-flex w-36 justify-center rounded-md border border-gray-300 bg-white px-3 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-lg"
                          onClick={() => setOpenTimetable(false)}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="inline-flex w-36 justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-lg"
                          // onClick={() => setOpenTimetable(false)}
                          onClick={() => save_daywise_data()}
                        >
                          Save
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

      <Alert
        openAlert={openAlert}
        cancelTrigger={cancelTrigger}
        data={alertObj}
        confirmTrigger={confirmTrigger}
      />

      {/* CSV Upload  Modal */}

      <Transition.Root show={showCSV} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setShowCSV}>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        TimeTable CSV Upload
                      </Dialog.Title>

                      <button
                        type="button"
                        className="mt-2 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => downloadCSV()}
                      >
                        Download CSV to Fill Data
                      </button>

                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                            <div className="space-y-1 text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                  <span>CSV file</span>
                                  <input
                                    id="file-upload"
                                    onChange={(evt) => fileChanged(evt)}
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                CSV up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">

                    {csvLoading == true && (
                      <div className="mt-2">
                        <p className="text-sm text-red-500">Uploading CSV...</p>
                      </div>
                    )}
                    {csvError.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-red-500">{csvError}</p>
                      </div>
                    )}

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
