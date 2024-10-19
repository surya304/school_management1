import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import LayoutMini from "../components/LayoutMini";
import { useState, useEffect, Fragment, useRef } from "react";
import * as z from "zod";
import randomstring from "randomstring";
import DataTable2 from "../components/DataTable2";
import { Dialog, Transition } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";
import { useRouter } from "next/router";

import {

  ArrowDownIcon,

} from "@heroicons/react/20/solid";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

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
    text: "Get Exam Data",
    show: true,
  },
};

let finalObj = {
};




let studentsList = []
let subjectsList = []
let exam_id = ""

export default function FeeStructure() {
  const router = useRouter();

  const [validate, setValidate] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonLoadingText, setButtonLoadingText] = useState("Loading..");
  const [ariaInfo, setAriaInfo] = useState([]);
  let school_id = useRef("");
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [editStudentDetails, setEditStudentDetails] = useState({});
  const [formElements2, setformElements2] = useState([]);
  const notify = (label) => toast(label);

  let examRedirectId = useRef("")

  const [dataTableProps, setDataTableProps] = useState({
    showEdit: true,
    showDelete: false,
    heading: "Marks",
    subHeading: "",
    showPagination: false,
    defaultSearch: true,
    button: {
      //
      text: "Save",
      show: false,
    },
  });

  let marksObj = []

  const [examsData, setExamsData] = useState([]);

  let editDatatableColumns = useRef([]);

  const [editSubjectData, setEditSubjectData] = useState([]);
  const [editStudentData, setEditStudentData] = useState([]);
  const [dataTableColumns, setDataTableColumns] = useState([]);

  const [csvError, setCsvError] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);

  const [showTable, setShowTable] = useState(false);


  function validationHandler(params) {


    let formValidated = false;

    if (params.name.startsWith("exammark")) {
      marksObj.push(params)

    }



    if (formElements2.length == marksObj.length) {


      formValidated = true


    }

    return formValidated


  }

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
    },
    {
      id: getRandomString(),
      name: "exams",
      list: [],
      label: {
        //
        text: "Select Exam",
        show: true,
      },
      defaultValuedata: {
        "_id": "",
        "name": "Select Value"
      },
    },
  ]);

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

  let selectedExam = useRef({});

  let editselectedClass = useRef("");

  function checkFields(e) {
    setValidate(true);
    if (openEditPopup == false) {
      setTableValues();
    }
  }


  async function sendData(data) {
    setValidate(false);

    if (openEditPopup == false) {
      if (data.name == "class") {
        editselectedClass.current = data.value._id;

        putExamData();
      }

      if (data.name == "exams") {
        selectedExam.current = data.value;

        exam_id = data.value._id

      }
    } else {
      // replace



      let formValidated = await validationHandler(data)


      if (formValidated == true) {




        for (let i = 0; i < marksObj.length; i++) {
          const element = marksObj[i];

          finalObj.marks_data.push({
            subject_id: element.name.replace("exammark", ""),
            marks: element.value,
          });

        }

        setOpenEditPopup(false);


        createfetchdata();
      }
    }
  }

  async function createfetchdata() {
    var requesttype;



    requesttype = "PUT";

    finalObj.type = "update";
    finalObj.update_type = "student_marks_update";

    const res = await fetch("/api/marksExamAPI", {
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
        notify("Marks Updated");

        getStudentInfo();
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
      setExamsData(data.data);
    }
  };

  function putExamData() {
    let examsArray = [];

    for (let i = 0; i < examsData.length; i++) {
      const element = examsData[i];

      if (element.classes.includes(editselectedClass.current)) {
        examsArray.push(element);
      }
    }

    let index = formElements.findIndex((e) => e.name == "exams");

    let newArr = [...formElements];
    newArr[index].list = examsArray;



    setformElements(newArr);


  }

  async function getClassData() {

    const res = await fetch("/api/ClassesAPI?school_id=" + school_id.current, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    var data = await res.json();

    let index = formElements.findIndex((e) => e.name == "class");

    let newArr = [...formElements];
    newArr[index].list = data.data;

    setformElements(newArr);
  }

  const getStudentInfo = async () => {

    if (editselectedClass.current) {
      const res = await fetch(
        "/api/All_fetch_queriesAPI?type=exam_marks_data&school_id=" +
        school_id.current +
        "&class_id=" +
        editselectedClass.current,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (data.data) {



        setEditStudentData(data.data);

        let rowData = [];

        for (let i = 0; i < data.data.length; i++) {
          const element = data.data[i];

          studentsList.push({
            name: element.first_name + " " + element.last_name,
            rollno: element.student_personal_id,
            _id: element._id,
          });

          rowData.push({
            first_name: element.first_name,
            last_name: element.last_name,
            student_id: element.student_personal_id,
          });

          if (element.marks_data.length > 0) {
            const result = element.marks_data.filter(
              (element) => element.exam_id == selectedExam.current._id
            )[0];

            if (result) {
              for (let j = 0; j < result.marks_data.length; j++) {
                const element2 = result.marks_data[j];

                const result2 = editDatatableColumns.current.filter(
                  (element) => element.id == element2.subject_id
                )[0];


                if (result2) {
                  let heading = result2.accessor;

                  rowData[i][heading] = element2.marks;
                }
              }
            }
          }
        }


        let tabledata = {
          skip: 0,
          limit: 5,
          products: rowData,
          total: 5,
        };

        setAriaInfo(tabledata);
      }
    }
  };

  async function getSubjectInfo() {

    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=school_subject_data&school_id=" +
      school_id.current,

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


      setEditSubjectData(data.data);
    }
  }
  function setTableValues() {
    // heading : 'Marks',

    // let index = selectedExam.current.classes.findIndex(
    //   (e) => e == editselectedClass.current
    // );

    if (selectedExam.current._id) {


    setDataTableProps({
      ...dataTableProps,
      heading: selectedExam.current.name,
    });

    let newHeadings = [
      {
        header: "Student First Name",
        accessor: "first_name",
      },
      {
        header: "Last Name",
        accessor: "last_name",
      },

      {
        header: "Student ID",
        accessor: "student_id",
      },
    ];


    let examRows = selectedExam.current.rowdata.filter(
      (element) => element.class_id == editselectedClass.current
    )[0];





    for (let i = 0; i < examRows.rows.length; i++) {
      const element = examRows.rows[i].subject_id[0];

      let defValue = editSubjectData.filter(
        (elementV) => elementV._id == element
      )[0];



      if (element) {
        const result = newHeadings.filter(
          (elementR) => elementR.id == defValue._id
        )[0];

        if (!result) {
          newHeadings.push({
            header: defValue.name,
            accessor: defValue.name.toLowerCase(),
            id: defValue._id,
          });
        }
      }
    }



    let newArr = [...dataTableColumns];
    newArr = newHeadings;

    setDataTableColumns(newArr);

    editDatatableColumns.current = newArr;

    setShowTable(true);

    getStudentInfo();
  }
  }
  const getSchool_id = async () => {
    const res = await fetch("/api/All_fetch_queriesAPI?type=getSchool_id", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.data) {

      school_id.current = data.data[0]._id;

      getClassData();

      getExamsData();

      getSubjectInfo();
    }
  };


  function downloadCSV() {

    var maindata = [
      ["Class", "Exam", "Student", "English", "Mathematics", "Science"],
      ["1 A", "General Exam", "John Smith", 80, 78, 88],
      ["1 A", "General Exam", "Rohan Kapoor", 86, 66, 92],
      ["1 A", "General Exam", "Jahnvi Sharma", 67, 75, 81],
      [],
      [],
      ["Subjects List"],
      ...subjectsList.map(({ name }) => [name]),
    ];

    // const subjectsSheet = [["name"], ...subjectsList.map(({ name }) => [name])];

    // const sheets = {
    //   "Main Sheet": maindata,
    //   "Subjects Sheet": subjectsSheet,
    // };

    downloadFile(maindata);
  }


  function downloadFile(sheets) {


    const csvContent =
      "data:text/csv;charset=utf-8," +
      sheets.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "marks.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function fileChanged(event) {

    const file = event.target.files[0];
    setCsvError("");

    let dataObj = {
      exam_id: exam_id,
      type: "marks",
      data: [],
    };

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log("Parsed>>>>", results.data);

        if (results.data.length > 0) {

          for (const iterator of results.data) {

            let marksArray = [];

            const keys = Object.keys(iterator).slice(3); // slice to ignore first three keys
            keys.forEach((key) => {
              console.log(`${key}: ${iterator[key]}`);
              marksArray.push({
                subject_id: getObjectId(key, "subject"),
                marks: iterator[key],
              });
            });

            dataObj.data.push({
              student_id: getObjectId(iterator.Student, "student"),
              marks: marksArray,
            });
          }

          console.log("Final Data>>>>>", dataObj);
          uploadCSV(dataObj);
        } else {
          setCsvError("No Records to upload");
        }
      },
    });
  }


  function getObjectId(label, type) {
    let objId = ""


    if (label.length > 0) {
      if (type == "student") {

        objId = studentsList.filter(e => e.name == label)[0]._id
      }

      if (type == "subject") {
        objId = subjectsList.filter((e) => e.name == label)[0]._id;
      }
    }

    // return object ID from the array
    return objId;
  }

  async function uploadCSV(csvData) {
    // loop through and show errors if any

    // save data in db

    console.log("Sending Data>>>>", csvData);

    setCsvLoading(true);

    const res = await fetch("/api/csvUploadAPI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(csvData),
    });
    //Await for data for any desirable next steps
    var data = await res.json();

    setCsvLoading(false);

    if (data.success == true) {
      notify("CSV Uploaded");
      getStudentInfo()
    } else {
      setCsvError("Oops! Please re-check your CSV and upload again");
    }
  }


  async function editRowClicked(params) {
    await emptyformData();


    setOpenEditPopup(true);

    finalObj = {};


    finalObj["marks_data"] = [];

    const resultid = editStudentData.filter(
      (element) =>
        element.student_personal_id == params.value.original.student_id
    );


    let marksData = resultid[0].marks_data.filter(
      (element) =>
        element.exam_id == selectedExam.current._id
    );


    finalObj["_id"] = resultid[0]._id;
    finalObj["exam_id"] = selectedExam.current._id;

    let extraColumns = dataTableColumns.slice(3);

    for (let i = 0; i < extraColumns.length; i++) {
      let newFormElement = {};

      const element = extraColumns[i];

      let marks = "";


      if (marksData.length > 0) {
        if (marksData[0].marks_data[i]) {

          marks = marksData[0].marks_data[i].marks

        }
      }



      newFormElement = {
        id: getRandomString(),
        name: "exammark" + element.id,
        isValidated: false,
        data: marks, //bind to input
        type: "text",
        icon: {
          show: false,
          position: "left",
        },
        label: {
          //
          text: "Marks for " + element.header,
          show: true,
          position: "top",
        },
        placeholder: "Enter marks",
        schema: z.object({
          inputFieldName: z
            .string()
            .min(1, "Please enter a valid value")
            .optional()
            .or(z.literal('')),
        })
      };

      let result = formElements2.filter(
        (element) => element.name == newFormElement.name
      );


      if (result.length == 0) {
        formElements2.push(newFormElement);
      }

      else {

        let index = formElements2.findIndex((e) => e.name == newFormElement.name);

        let newArr = formElements2;

        newArr[index] = newFormElement;

      }
    }


    let editObj = {
      first_name: params.value.original.first_name,
      last_name: params.value.original.last_name,
      student_id: params.value.original.student_id,
    };

    setEditStudentDetails(editObj);
  }

  useEffect(() => {

    examRedirectId.current = router.query.examid;
    getSchool_id();
  }, []);

  return (
    <LayoutMini>
      <ToastContainer autoClose={3000} />
      <div className="sm:flex-auto md:px-6">
        <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg px-2 py-2">
          Marks
        </h2>
        <p className="mt-1 text-xs text-gray-500 sm:text-xs md:mt-2 md:max-w-3xl pl-3">
          List of students and their marks in each exam
        </p>
      </div>
      <div className="">
        <div className="md:px-8 min-w-5xl max-w-5xl">
          <div className="mt-8 ">
            {/* <div className=""> */}
            <form className="w-full flex space-x-2 px-4 border border-gray-200 rounded-md py-2">
              <div className="w-56">
                <Dropdown
                  {...formElements[0]}
                  sendData={sendData}
                  validate={validate}
                />
              </div>

              <div className="w-56">
                <Dropdown
                  {...formElements[1]}
                  sendData={sendData}
                  validate={validate}
                />
              </div>

              <div className="mt-5">
                <Button
                  loading={buttonLoading}
                  loadingText={buttonLoadingText}
                  {...addBtnProps}
                  click={(e) => checkFields(e)}
                />
              </div>

            </form>
            {/* </div> */}
          </div>
        </div>

        <div className="flex min-h-full flex-col justify-center sm:px-6 lg:px-8">
          <div className="mt-8 sm:w-full sm:max-w-7xl">
            <div className="bg-white py-8 px-4 border border-gray-200 sm:rounded-lg sm:px-10">
              {showTable && (
                <div >
                  <div className="flex space-x-4 w-full">
                  <span className="hidden sm:block">
                    <button
                      onClick={() => {
                        downloadCSV();
                      }}
                      type="button"
                      className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <ArrowDownIcon
                        className="-ml-0.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      Download Sample CSV
                    </button>
                  </span>
                  <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="flex space-x-2 border border-indigo-200 px-2 py-2 relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <CloudArrowUpIcon className="-ml-0.5 h-5 w-5 text-indigo-600"/>
                        <span>Upload a file</span>
                        <input onChange={(evt) => fileChanged(evt)} id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                    </div>


                  </div>

                  <DataTable2
                    dataTableDataR={ariaInfo.products || []}

                    dataTableColumns={dataTableColumns}
                    {...dataTableProps}

                    editRowClicked={editRowClicked}
                  />
                </div>
              )}
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
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Add Student Marks
                        </Dialog.Title>

                        <div className="mt-2 grid grid-cols-1 gap-4">
                          First Name : {editStudentDetails.first_name}
                          <br></br>
                          Last Name : {editStudentDetails.last_name}
                          {formElements2.map((objdata, index) => (
                            <div key={objdata.id} className="my-2">
                              <Input
                                {...formElements2[index]}
                                sendData={sendData}
                                validate={validate}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-4">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        onClick={(e) => checkFields(e)}
                      >
                        Edit Marks
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </LayoutMini>
  );
}