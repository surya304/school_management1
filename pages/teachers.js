import { Fragment, useState, useEffect, useRef } from "react";

import {
  BuildingLibraryIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  XMarkIcon,

} from "@heroicons/react/24/outline";

import randomstring from "randomstring";

import Alert from "../components/Alert";

import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import Textarea from "../components/Textarea";

import MultiSelect from "../components/MultiSelect";

import DataTable from "../components/DataTable";
import "react-toastify/dist/ReactToastify.css";
import * as z from "zod";
import { ToastContainer, toast } from "react-toastify";

import { Dialog, Transition } from "@headlessui/react";






export default function Home() {
  const deleteMsg = "Subject";

  const [school_id, setschool_id] = useState("");
  const [subjectData, setsubjectData] = useState([]);
  const [CategoryData, setCategoryData] = useState([]);

  const [openTimetable, setOpenTimetable] = useState(false);
  const [csvpopup, setcsvpopup] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);
  const [validate, setValidate] = useState(false);

  const [csvError, setCsvError] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);
  const notify = (label) => toast(label);

  const [iseditable, setiseditable] = useState({
    checkdata: false,
    editable_id: "asd233d3",
  });

  const [teacherData, setteacherData] = useState([]);

  let finalObj = {
    school_id: school_id,
  };

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

  async function sendData(data) {
    // setValidate(false)

    setValidate(false);

    let formValidated = await validationHandler(data);

    if (formValidated == true) {
      // console.log(finalObj, "finalObj sendData formValidated")
      console.log(iseditable, "iseditable");

      createfetchdata();
    }
  }

  function validationHandler(params) {
    let formValidated = false;

    const result = formElements.filter((element) => element.id == params.id)[0];
    result.isValidated = false;

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
            result.defaultValuedata = params.value;

          } else if (params.type == "dropdown") {
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
    errorMessage: "Please Enter a caregory name to add!",
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


  const [formElements, setformElements] = useState([
    {
      name: "employee_id",
      placeholder: "Please Enter Your employee_id ",
      label: {
        //
        text: "Enter Employee ID",
        show: true,
        position: "top",
      },
      id: getRandomString(),
      isValidated: false,
      required: false,
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
      name: "teacher_first_name",
      placeholder: "Please Enter Your First Name ",
      label: {
        text: "First Name",
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
      name: "teacher_last_name",
      placeholder: "Please Enter Your Last Name ",
      label: {
        //
        text: "Last Name",
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
      name: "email",
      placeholder: "Please Enter Your Email ",
      label: {
        //
        text: "Email",
        show: true,
        position: "top",
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      data: "",



      schema: z.object({
        inputFieldName: z.string()
          .email({ message: "Invalid Email" }),
      }),


    },
    {
      name: "mobile",
      placeholder: "Please Enter Your mobile Number ",
      label: {
        //
        text: "mobile Number",
        show: true,
        position: "top",
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      data: "",
      schema: z.object({
        inputFieldName: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), { message: "Expected number, received a string" })
      })
    },

    {
      id: getRandomString(),
      name: "gender",
      list: [
        {
          _id: "female",
          name: "female",
        },
        {
          _id: "male",
          name: "male",
        },
      ],
      label: {
        //
        text: "Select gender",
        show: true,
      },
      defaultValuedata: {
        _id: "female",
        name: "female",
      },
      isValidated: false,
      required: true,

    },
    {
      name: "description",
      placeholder: "Please Enter Your description ",
      label: {
        //
        text: "Description",
        show: true,
        position: "top",
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      data: "",
      schema: z.object({
        textareaName: z.string({
          required_error: "Value is required",
          invalid_type_error: "Value must be a text",
        })
          .min(3, { message: 'Min 3 characters' })
          .max(400, { message: 'Max 400 characters' }),
      }),


    },

    {
      name: "address",
      placeholder: "Please Enter Your address ",
      label: {
        //
        text: "Address",
        show: true,
        position: "top",
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      data: "",
      schema: z.object({
        textareaName: z.string({
          required_error: "Value is required",
          invalid_type_error: "Value must be a text",
        })
          .min(3, { message: 'Min 3 characters' })
          .max(400, { message: 'Max 400 characters' }),
      }),
    },

    {
      id: getRandomString(),
      name: "category",
      list: [],
      label: {
        //
        text: "Select Category",
        show: true,
      },
      defaultValuedata: [],
      isValidated: false,
      required: true,

    },

    {
      id: getRandomString(),
      name: "subject",
      list: [],
      label: {
        //
        text: "Select Subjects",
        show: true,
      },
      defaultValuedata: [],
      isValidated: false,
      required: true,

    },
  ]);

  function getRandomString() {
    let uniqueKey = randomstring.generate({
      length: 12,
      charset: "alphanumeric",
    });

    return uniqueKey;
  }

  useEffect(() => {
    // getSchooldata();

    getSchool_id();
  }, []);
  async function fetchData(school_id1) {
    let data21 = await getdatatabledata(0, 15, undefined, school_id1);
    console.log(data21, "fetchData data");

    if ("data" in data21) {
      setAriaInfo(data21.data);
    }
  }

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
      // setpeople(data.data)
      setschool_id(data.data[0]._id);
      var tempschool_id = data.data[0]._id;

      getCategoryInfo(tempschool_id);
      getSubectInfo(tempschool_id);
      getteacherData(tempschool_id);

      fetchData(tempschool_id);
    }
  };

  const getCategoryInfo = async (school_id1) => {
    const res = await fetch(
      // "/api/All_fetch_queriesAPI?type=classes&school_id=" + school_id,
      "/api/All_fetch_queriesAPI?type=category&school_id=" + school_id1,

      // "/api/All_fetch_queriesAPI?type=classes",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    console.log(data, "data");

    if (data.data) {
      setCategoryData(data.data);
  

      const transformed = data.data.map(({ _id, name }) => ({
        label: name,
        value: _id,
      }));

      console.log(transformed, "transformed");

      let index = formElements.findIndex((e) => e.name == "category");
      formElements[index].list = transformed;
    }
  };

  const getSubectInfo = async (school_id1) => {
    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=school_subject_data&school_id=" +
      school_id1,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    console.log(data, "data");

    if (data.data) {
      setsubjectData(data.data);
      const transformed = data.data.map(({ _id, name }) => ({
        label: name,
        value: _id,
      }));

      console.log(transformed, "transformed");

      let index = formElements.findIndex((e) => e.name == "subject");
      formElements[index].list = transformed;
    }
  };

  async function createTeacher() {
    setValidate(true);
  }

  const getteacherData = async (school_id1) => {
    const res = await fetch("/api/teacherAPI?school_id=" + school_id1, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    var data = await res.json();
    console.log("restaurent Data>>>>", data);

    setteacherData(data.data);
  };

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

  function editData(data) {
    emptyformData();

    setiseditable({
      ...iseditable,
      checkdata: true,
      editable_id: data._id,
    });

    var finalresult = teacherData.filter((val) => val._id == id);

    var transformedsubjects = [];
    var transformedcategories = [];

    console.log(finalresult, "finalresult");

    if (data.subjects.length > 0 && data.categories.length > 0) {
      transformedsubjects = data.subjects.map(({ _id, name }) => ({
        label: name,
        value: _id,
      }));
      transformedcategories = data.categories.map(({ _id, name }) => ({
        label: name,
        value: _id,
      }));
    }

    for (let index = 0; index < formElements.length; index++) {
      const name = formElements[index].name;
      const indiobj = formElements[index];

      if (name == "employee_id") {
        indiobj.data = data.employee_id;
      } else if (name == "teacher_first_name") {
        indiobj.data = data.first_name;
      } else if (name == "teacher_last_name") {
        indiobj.data = data.last_name;
      } else if (name == "email") {
        indiobj.data = data.email;
      } else if (name == "address") {
        indiobj.data = data.address;
      } else if (name == "description") {
        indiobj.data = data.description;
      } else if (name == "mobile") {
        indiobj.data = data.mobile;
      } else if (name == "gender") {
        // indiobj.defaultValuedata = data.category_id;
        if (data.gender == "female") {
          indiobj.defaultValuedata = {
            _id: "female",
            name: "female",
          };
        } else {
          indiobj.defaultValuedata = {
            _id: "male",
            name: "male",
          };
        }
      } else if (name == "category") {
        indiobj.defaultValuedata = transformedcategories;
      } else if (name == "subject") {
        indiobj.defaultValuedata = transformedsubjects;
      }
    }

    setOpenTimetable(true);
  }

  async function createfetchdata() {
    var requesttype;
    if (iseditable.checkdata == true) {
      requesttype = "PUT";
      finalObj._id = iseditable.editable_id;
      finalObj.school_id = school_id;
      finalObj.type = "update";
    } else {
      requesttype = "POST";
      finalObj.school_id = school_id;
    }



    console.log("finalObj>>>>", finalObj);

    const res = await fetch("/api/teacherAPI", {
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

        fetchData(school_id);


        notify("Teacher Info Saved!!")


      }
    }
  }


  async function DeleteData(data) {
    console.log(data, "deleteedata");

    const res = await fetch("/api/teacherAPI", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: data._id,
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
        fetchData(school_id);
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

  function triggeropenpopup() {
    setiseditable({
      ...iseditable,
      checkdata: false,
      editable_id: "",
    });

    emptyformData();

    setOpenTimetable(true);
  }



  let dataTableColumns = [
    // {
    //   header: "Brand",
    //   accessor: "brand",
    //   type: "filter",
    // },

    // view all data , change parent Data , delete student Datata
    {
      header: "Profile image",
      accessor: "profile_pic",
    },
    {
      header: "First Name",
      accessor: "first_name",
    },
    {
      header: "last Name",
      accessor: "last_name",
    },

    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "mobile",
      accessor: "mobile",
    },

    {
      header: "Employee ID",
      accessor: "employee_id",
    },

    {
      header: "Action",
      accessor: "Action",
    },
  ];

  let setSkip = 0;
  let setLimit = 10;

  let dataTableProps = {
    showEdit: true,
    showDelete: true,
    showButtonsData: true,
    heading: " ",
    subHeading: "",
  };

  const search = async (query) => {
    seachText.current = { value: query };

    let data = await getdatatabledata(0, 15, query, school_id);
    console.log(data, "search data");
    setAriaInfo(data.data);
  };

  const moveNext = async (skip, limit) => {
    console.log(skip, limit, "skip moveNext");

    let data = {};
    if (seachText.current && seachText.current.value !== "") {
      data = await getdatatabledata(
        skip + limit,
        limit,
        seachText.current.value,
        school_id
      );
    } else {
      data = await getdatatabledata(skip + limit, limit, undefined, school_id);
    }
    if (data.limit < limit) {
      data.limit = limit;
    }
    console.log(data, "moveNext");
    setAriaInfo(data.data);
  };

  const movePrev = async (skip, limit) => {
    console.log(skip, limit, "skip movePrev");

    let data = {};
    if (seachText.current && seachText.current.value !== "") {
      data = await getdatatabledata(
        skip - limit,
        limit,
        seachText.current.value,
        school_id
      );
    } else {
      data = await getdatatabledata(skip - limit, limit, undefined, school_id);
    }
    if (data.limit < limit) {
      data.limit = limit;
    }
    console.log(data, "movePrev");

    setAriaInfo(data.data);
  };

  const changeLimit = async (skip, limit) => {
    let data = {};
    if (seachText.current && seachText.current.value !== "") {
      data = await getdatatabledata(
        skip,
        limit,
        seachText.current.value,
        school_id
      );
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
    console.log(skip, limit, query, school_id1, "getdatatabledata");
    let res;
    if (query) {


      res = await fetch(
        `/api/All_searchable_queryAPI?type=get_teachers_data&request_type=search&school_id=${school_id1}&searchTerm=${query}&skip=${skip}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      res = await fetch(
        `/api/All_searchable_queryAPI?type=get_teachers_data&request_type=getallData&school_id=${school_id1}&skip=${skip}&limit=${limit}`,

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

  function downloadCSV() {
    var maindata = [
      [
        "email",
        "first_name",
        "last_name",
        "address",
        "description",
        "employee_id",
        "mobile",
        "address",
        "gender",
      ],
      [
        "a@b.com",
        "test first_name",
        "test last_name",
        "test address",
        "test description",
        "21312312",
        "12321312312",
        "test adddress newyork 39493",
        "male",
      ],
      [""],
      [""],
      ["Please add Gender as (male or female) all smallcase letters"],
    ];

    downloadFile(maindata);
  }

  function downloadFile(data) {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "teachers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleFileUpload = (event) => {
    setCsvError("");

    const file = event.target.files[0];
    const reader = new FileReader();

    // reader.onload = (event) => {
    //   const contents = event.target.result;
    //   const lines = contents.split("\n");
    //   const data = lines.map((line) => line.split(","));

    //   console.log(data, "csv");
    //   // setCsvData(data);

    //   var newarr = [];

    //   for (let index = 0; index < data.length; index++) {
    //     const element = data[index];

    //     if (validateEmail(element[0]) == true) {
    //       console.log(element, "element");
    //       newarr.push(element);
    //     }
    //   }

    //   refinedata(newarr);

    //   document.getElementById("fileInput").value = "";
    // };

    reader.onload = (event) => {
      let contents = event.target.result;

      // Remove all carriage return characters
      contents = contents.replace(/\r/g, "");

      const lines = contents.split("\n");
      const data = lines.map((line) => line.split(","));

      console.log(data, "csv");

      var newarr = [];

      for (let index = 0; index < data.length; index++) {
        const element = data[index];

        if (validateEmail(element[0]) == true) {
          console.log(element, "element");
          newarr.push(element);
        }
      }

      refinedata(newarr);

      document.getElementById("fileInput").value = "";
    };


    reader.readAsText(file);
  };

  function combinedata(mainarr, indidata) {
    var finaldata = [indidata].map(function (item) {
      var obj = {
        _id: makeid(19),
      };
      mainarr.forEach(function (key, i) {
        obj[key] = item[i].trim();
      });
      return obj;
    });

    return finaldata[0];
  }
  var finalarr = [];

  const makeid = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  var main_arr = [
    "email",
    "first_name",
    "last_name",
    "address",
    "description",
    "employee_id",
    "mobile",
    "address",
    "gender",
  ];

  function refinedata(data) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      var adata = combinedata(main_arr, element);
      finalarr.push(adata);
    }

    savedataCSV(finalarr);
  }

  async function savedataCSV(data) {
    setCsvLoading(true);

    var finaldataobj = {
      school_id: school_id,
      finaldata: data,
      type: "csv_upload",
    };
    const res = await fetch("/api/teacherAPI", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finaldataobj),
    });
    //Await for data for any desirable next steps
    var data = await res.json();

    console.log("Data>>>>", data);

    if (data.errors) {
      // setErrMessage(data.errors[0].msg);
    } else {
      if (data.status == 422 || data.status == 400 || data.status == 500) {
        alert("something went wront please make sure u dont leave any column ");
        // setErrMessage("Oops! Please try again");
      } else {
        // goToNext();

        if (data.success == true) {
          notify("CSV Uploaded");
          setcsvpopup(false);
          fetchData(school_id);
          setCsvLoading(false);
        } else {
          setCsvError("Oops! Please re-check your CSV and upload again");
        }
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
    <>
     

        <div className="md:px-2 md:py-3">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg py-2">
                Teachers
              </h2>
              <p className="mt-1 text-md text-gray-500 sm:text-lg md:mt-2 md:max-w-3xl">
                Add Teachers Data
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex sm:space-x-4">
              <button onClick={() => triggeropenpopup()}
                type="button"
                className="sm:text-md inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                Add Teacher
              </button>


           

            </div>
          </div>

      
          <div className="px-8 py-3 mt-3 border border-gray-200 rounded-lg">
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
                <Dialog.Panel className="border-l-8 border-slate-400 relative transform overflow-hidden rounded-lg bg-white px-4 pt-10 pb-8 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:p-10">
                  <Dialog.Title
                    as="h3"
                    className="text-4xl font-extrabold leading-6 text-slate-400 pb-6"
                  >
                    Add Teacher Details
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

                   

                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                          <Input
                            validate={validate}
                            {...triggerdata("employee_id")}
                            sendData={sendData}
                          />
                        </div>

                        <div>
                          <Input
                            validate={validate}
                            {...triggerdata("teacher_first_name")}
                            sendData={sendData}
                          />
                        </div>

                        <div>
                          <Input
                            validate={validate}
                            {...triggerdata("teacher_last_name")}
                            sendData={sendData}
                          />
                        </div>

                        <div>
                          <Input
                            validate={validate}
                            {...triggerdata("email")}
                            sendData={sendData}
                          />
                        </div>

                        <div>
                          <Textarea
                            validate={validate}
                            {...triggerdata("description")}
                            sendData={sendData}
                          />
                        </div>

                        <div>
                          <Input
                            validate={validate}
                            {...triggerdata("mobile")}
                            sendData={sendData}
                          />
                        </div>

                        <div>
                          <Textarea
                            validate={validate}
                            {...triggerdata("address")}
                            sendData={sendData}
                          />
                        </div>

                        <div>
                          <Dropdown
                            validate={validate}
                            {...triggerdata("gender")}
                            sendData={sendData}
                          />
                        </div>

                        <div>
                          <MultiSelect
                            validate={validate}
                            {...triggerdata("category")}
                            sendData={sendData}
                          />
                        </div>
                        <div>
                          <MultiSelect
                            validate={validate}
                            {...triggerdata("subject")}
                            sendData={sendData}
                          />
                        </div>
                      </div>

                   
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
                          onClick={() => createTeacher()}
                        >
                          Add Teacher
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

      <Transition.Root show={csvpopup} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setcsvpopup}
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
                <Dialog.Panel className="border-l-8 border-slate-400 relative transform overflow-hidden rounded-lg bg-white px-4 pt-10 pb-8 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:p-10">
                  <Dialog.Title
                    as="h3"
                    className="text-4xl font-extrabold leading-6 text-slate-400 pb-6"
                  >
                    Add Teacher Details
                  </Dialog.Title>
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setcsvpopup(false)}
                    >
                      <XMarkIcon
                        className="h-10 w-10 text-slate-400"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-left sm:mt-5">
                      {/* <!-- Tab 2 Start --> */}

                      <div
                        className="max-w-2xl mx-auto sm:max-w-3xl mb-4"
                        id="shareStep1"
                      >
                        <div>
                          <div className="mt-8 sm:flex sm:items-center justify-end">
                            <span>
                              <b className="text-red-500">Note:</b> Download the
                              Sample CSV and add your data,Make Sure You add
                              Name , Email ,number
                            </span>

                            <div className="mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
                              <a
                                onClick={() => downloadCSV()}
                                className="cursor-pointer block w-full text-center px-4 py-2 border rounded-sm border-gray-300 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                              >
                                Download Sample CSV
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="mt-8">
                          <div className=" sm:mt-0 sm:col-span-2">
                            <div className="max-w-full flex justify-center rounded-md">
                              <div className="bg-gray-800 mt-1 flex justify-center pt-10 pb-10 border-2 border-white border-dashed rounded-md w-full">
                                <div className="space-y-1 text-center ">
                                  <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                  </svg>
                                  <div className="flex text-sm text-gray-600">
                                    <label
                                      for="file-upload"
                                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                      <span className="p-1">Upload Media</span>
                                      {/* <input
                                onChange={handleFileUpload} id="fileInput"
                                  type="file"
                                  className="sr-only"
                                  accept="text/csv"
                                /> */}

                                      <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        id="fileInput"
                                      />
                                    </label>
                                    {/* <p className="pl-1 mt-1 text-xs text-white">
                                or drag and drop
                              </p> */}
                                  </div>
                                  {/* <p className="text-xs text-white">
                              CSV file up to 50MB
                            </p> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:flex sm:items-center sm:justify-end sm:space-x-3">
                        <button
                          type="button"
                          className="mt-3 inline-flex w-36 justify-center rounded-md border border-gray-300 bg-white px-3 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-lg"
                          onClick={() => setcsvpopup(false)}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="mt-5 sm:mt-6">
                        {csvLoading == true && (
                          <div className="mt-2">
                            <p className="text-sm text-red-500">
                              Uploading CSV...
                            </p>
                          </div>
                        )}
                        {csvError.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-red-500">{csvError}</p>
                          </div>
                        )}
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
    </>
  );
}