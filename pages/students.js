import { Fragment, useState, useEffect, useRef } from "react";

import { BookOpenIcon, BuildingLibraryIcon, PlusIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon, XMarkIcon, } from '@heroicons/react/24/outline';
import LayoutMini from "../components/LayoutMini";
import randomstring from "randomstring";

import Alert from "../components/Alert";

import Input from "../components/Input";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Textarea from "../components/Textarea";
import ImagePicker from "../components/ImagePicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MultiSelect from '../components/MultiSelect'

import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import * as z from "zod";

import DataTable from '../components/DataTable'



let classesList = []

export default function Home() {

  const deleteMsg = "Subject"

  const [openTimetable, setOpenTimetable] = useState(false)
  const [openAlert, setOpenAlert] = useState(false);
  const [ClassData, setClassData] = useState([]);
  const [show_csv, setshow_csv] = useState(false);

  const [errMessage, setErrMessage] = useState("");


  const notify = (label) => toast(label);





  const [iseditable, setiseditable] = useState({
    checkdata: false,
    editable_id: "asd233d3",
    parent_type: 'family',
    currentSelectedata: 'check',

  })
  const [validate, setValidate] = useState(false)
  const [school_id, setschool_id] = useState("63f342d58b63575cf5dc3afc");
  const [selected_class_id, set_selected_class_id] = useState("");


  var classseslect = [
    {
      id: getRandomString(),
      name: 'default_class_id',
      list: [
      ],
      label: { //
        text: 'Select Class to view Students in that Class',
        show: true,
      },
      defaultValuedata: {
        "_id": "Please Select Class",
        "name": "Please Select Class"
      },
      isValidated: false,

    },

  ]
  const [csvpopup, setcsvpopup] = useState(false)

  const [selectClass, setselectClass] = useState(classseslect)
  const [students, setstudents] = useState([])



  const [csvError, setCsvError] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);

  var finalObj = {}

  const cancelButtonRef = useRef(null)

  //Alert button triggers
  const cancelTrigger = () => {
    setOpenAlert(false);
  }
  function confirmTrigger() {
    console.log("confirm");
    setOpenAlert(false);
  }
  const [alertObj, setAlertObj] = useState({
    type: "header",
    title: "Are you sure, you want to Delete?",
    message: " Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.",
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
      show: true,
      placeholder: deleteMsg,
      label: `Enter ${deleteMsg} to delete`,
      errorMessage: "Unable to delete",


    }
  });

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
  }





  const [formElements, setformElements] = useState([

    {
      name: 'student_id',
      placeholder: "please Enter Your student_id ",
      label: { //
        text: 'Enter student id',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: false,
      preview: true,
      data: '',
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
      name: 'first_name',
      placeholder: "please Enter Your First Name ",
      label: { //
        text: 'First Name',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      preview: true,
      schema: z.object({
        inputFieldName: z.string({
          required_error: "Value is required",
          invalid_type_error: "Value must be a text",
        })
          .min(3, { message: 'Min 3 characters' })
          .max(40, { message: 'Max 40 characters' }),
      }),

      data: '',

    },

    {
      name: 'last_name',
      placeholder: "please Enter Your Last Name ",
      label: { //
        text: 'Last Name',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      preview: true,
      schema: z.object({
        inputFieldName: z.string({
          required_error: "Value is required",
          invalid_type_error: "Value must be a text",
        })
          .min(3, { message: 'Min 3 characters' })
          .max(40, { message: 'Max 40 characters' }),
      }),

      data: ''

    },

    {
      name: 'email',
      placeholder: "please Enter Your Email ",
      label: { //
        text: 'Email',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      preview: true,

      schema: z.object({
        inputFieldName: z.string()
          .email({ message: "Invalid Email" }),
      }),

      data: ''

    },
    {
      name: 'phone',
      placeholder: "please Enter Your phone Number ",
      label: { //
        text: 'Phone Number',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      data: '',
      preview: true,
      schema: z.object({
        inputFieldName: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), { message: "Expected number, received a string" })
      })

    },

    {
      id: getRandomString(),
      name: 'gender',
      list: [
        {
          "_id": "female",
          "name": "female"
        }, {
          "_id": "male",
          "name": "male"
        }
      ],
      label: { //
        text: 'Select gender',
        show: true,
      },
      defaultValuedata: {
        "_id": "female",
        "name": "female"
      },
      isValidated: false,
      preview: true,
      required: true

    },


    {
      name: 'description',
      placeholder: "please Enter Your description ",
      label: { //
        text: 'Description',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      data: '',
      preview: true,
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
      name: 'address',
      placeholder: "please Enter Your address ",
      label: { //
        text: 'Address',
        show: true,
        position: 'top',
      },
      id: getRandomString(),
      isValidated: false,
      required: true,
      data: '',
      preview: true,
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
      name: 'class_id',
      list: [
      ],
      label: { //
        text: 'Select Class',
        show: true,
      },
      defaultValuedata: {
        "_id": "please Select Class",
        "name": "please Select Class"
      },
      preview: true,
      required: true,


      isValidated: false,



    },





  ])

  function getRandomString() {
    let uniqueKey = randomstring.generate({
      length: 12,
      charset: "alphanumeric",
    });

    return uniqueKey
  }


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
    console.log(data, "getCategoryInfo")
    if (data.data) {


      // setpeople(data.data)
      setschool_id(data.data[0]._id)



      getClassData(data.data[0]._id);
     



    }

  };

  async function asyncFunction() {
    getClassData(school_id);


    return "Async function completed";
  }
  

  function triggeropenpopup() {

    emptyformData();
    // remove_select_parents('add')
    getSubectInfo(school_id);


  
    setiseditable({
      ...iseditable,
      checkdata: false,
      editable_id: "",
    });


 
    asyncFunction()
    .then(result => 
      
      setOpenTimetable(true)

      
      )
    .catch(error => console.error(error));

      







  }

  const getSubectInfo = async (tempschool_id) => {

    const res = await fetch(
      // "/api/All_fetch_queriesAPI?type=classes&school_id=" + school_id,
      "/api/All_fetch_queriesAPI?type=school_subject_data&school_id=" + school_id,


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

  };



  function remove_select_parents(type) {


    var filteredforments = formElements;

    if (type == 'edit') {


      // filteredforments = formElements.filter(function (item) {
      //   return item.name !== 'parentsdetails';


      // });

      // filteredforments = filteredforments.filter(function (item) {
      //   return item.type !== 'parent';


      // });

      // filteredforments = filteredforments.filter(function (item) {
      //   return item.type !== 'guardian';


      // });

    } else if (type == 'add') {

      var filteredforments21 = formElements.filter(function (item) {
        return item.name == 'parentsdetails';


      });

      console.log(filteredforments21, "filteredforments21")

      if (filteredforments21.length > 0) {

        filteredforments = formElements.filter(function (item) {
          return item.name !== 'parentsdetails';


        });


      } else {

        // filteredforments = formElements.filter(function (item) {
        //   return item.type !== 'parent';


        // });




        filteredforments.push(

          {
            id: getRandomString(),
            name: 'parentsdetails',
            list: [
              {
                "_id": "father_mother",
                "name": "Enter father and mother Details"
              }, {
                "_id": "guardian",
                "name": "enter Guardian Details"
              }
            ],
            label: { //
              text: 'Select parent Details to Enter',
              show: true,
            },
            defaultValuedata: {
              "_id": "please Select parents details",
              "name": "please Select parents details"
            },
            isValidated: true,


          },


        )
      }



    }


    const myNextList = [...filteredforments];

    console.log(filteredforments, "filteredforments")

    setformElements(myNextList);

  }

  const getClassData = async (temp_school_id) => {

    const res = await fetch(
      "/api/All_fetch_queriesAPI?type=classes&school_id=" + temp_school_id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    var data = await res.json();
    console.log("Class Data>>>>", data);

    // setClassData(data.data)


    if (data.data) {


      setClassData(data.data);

      const myNextList = [...formElements];
      const indiobj = myNextList.find(
        a => a.name === "class_id"
      );
      indiobj.list = data.data;
      setformElements(myNextList);



      const myNextList21 = [...selectClass];
      const indiobj21 = myNextList21.find(
        a => a.name === "default_class_id"
      );
      indiobj21.list = data.data;
      setselectClass(myNextList21);




    }



  };

  function validate_parent_data(params) {

    let formValidated = false;


        const myNextList = [...formElements];
        const indiobj = myNextList.find(
          a => a.id == params.id
        );
        indiobj.isValidated = false;


        // const result = formElements.filter(element => element.id == params.id)[0];

        // result.isValidated = false;

      if (params.hasOwnProperty('valid')) {
        if (params.valid == true) {
          // result.isValidated = true;
          indiobj.isValidated = true;

          if ('type' in params) {
            if (params.type == 'multiselect') {
              var temparr = [];
              for (let index = 0; index < params.value.length; index++) {
                const element = params.value[index].value;
                temparr.push(element)
              }


              finalObj[params.name] = temparr;
                indiobj.defaultValuedata = params.value;


            } else if (params.type == 'dropdown') {

              finalObj[params.name] = params.value._id;
                indiobj.defaultValuedata = params.value;


            } else {

              finalObj[params.name] = params.value;
                indiobj.data = params.value;


            }
          }

        } else {
          // result.isValidated = false;
            indiobj.isValidated = false;
            if ('type' in params) {
              if (params.type == 'multiselect') {

                indiobj.defaultValuedata = params.value;


              } else if (params.type == 'dropdown') {


                indiobj.defaultValuedata = params.value;


              } else {


                indiobj.data = params.value;


              }
            }

        }
      }

      else {
        finalObj[params.name] = params.value;

      }

        setformElements(myNextList);

      var tempdata = formElements.filter(element => element.type == params.is_parent_guardian);


      const validationResults = tempdata.filter(element => element.isValidated == false);

    console.log(tempdata,"parent family data");
    console.log(validationResults,"validationResults validationResults data");



      if (validationResults.length == 0) {

        formValidated = true


      }


      return formValidated
    }



  async function sendData(data) {



    if (data.name == 'default_class_id') {

      console.log(data, "senddata")

      set_selected_class_id(data.value._id)

      // getStudentData(data.value._id);


      fetchData(data.value._id);

      setshow_csv(true);




    } else {
      if (iseditable.checkdata == true) {

        if (iseditable.parent_type == 'personal') {

          setValidate(false)

          var tempdata12 = await check_isParent_guardian(iseditable.currentSelectedata)



          data["is_parent_guardian"] = tempdata12;
          data["popup_type"] = "personal";





          let validationHandlerdata = await validationHandler(data)


          if (validationHandlerdata == true) {

          // console.log(validationHandlerdata, "validationHandlerdata");
          // console.log(formElements, "formElements");



            createfetchdata()

          } else {

            // family

          }

        } else {

          setValidate(false)



          console.log(iseditable, " check_isParent_guardian")

          var tempdata12 = await check_isParent_guardian(iseditable.currentSelectedata)



          data["is_parent_guardian"] = tempdata12;
          data["popup_type"] = "family";

          console.log(data, "data validate_parent_data")

          let validationHandlerdata = await validate_parent_data(data)
          console.log(validationHandlerdata, "validationHandlerdata");


          if (validationHandlerdata == true) {




            createfetchdata()



          } else {

            // family


            // console.log(validationHandlerdata, "validationHandlerdata");
            // console.log(formElements, "formElements");
          }

        }


      } else {


        if (data.value._id == "father_mother" || data.value._id == "guardian") {
  await validationHandler(data)


          const updatedItems = formElements.map(item => {


            if (data.value._id == "father_mother") {




              if (item.type == 'parent') {

                return { ...item, preview: true };

              } else {
                if (item.type == 'guardian') {
                  return { ...item, preview: false };

                } else {
                  return { ...item, preview: true };

                }

              }
            } else if (data.value._id == "guardian") {

              if (item.type == 'guardian') {

                return { ...item, preview: true };

              } else {
                if (item.type == 'parent') {
                  return { ...item, preview: false };

                } else {
                  return { ...item, preview: true };

                }
              }



            }
          });
          console.log(updatedItems,"updatedItems")



          setformElements(updatedItems);

        }else{

          setValidate(false)



          let validationHandlerdata = await validationHandler(data)




          if (validationHandlerdata == true) {




            createfetchdata()




          } else {


            console.log(validationHandlerdata, "validationHandlerdata");
            console.log(formElements, "formElements");

          }
        }







      }

    }








  }

  async function fetchData(selected_class_id) {
    let data21 = await getdatatabledata(0, 5, undefined, selected_class_id);
    console.log(data21, "fetchData data");

    if ('data' in data21) {
      setAriaInfo(data21.data);

    }

  }

  const getStudentData = async (class_id) => {






    const res = await fetch(
      "/api/studentAPI?class_id=" + class_id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    var data = await res.json();
    console.log("get_student_data Data>>>>", data);

    // setClassData(data.data)


    if (data.data) {




      setstudents(data.data)


    }



  };


  function setfamilydata(id, data) {

    console.log(id, data, "setfamilydata")

    if (id == 'guardian') {


      const updatedItems = formElements.map(item => {
        var element_name = item.name;
        var placeholdeasdsar = item.placeholder;




        if (element_name == 'guardian_name') {

          return { ...item, data: data.guardian_id.name, preview: true };

        } else if (element_name == 'guardian_email') {
          return { ...item, data: data.guardian_id.email, preview: true };

        }
        else if (element_name == 'guardian_phone') {

          return { ...item, data: data.guardian_id.mobile, preview: true };

        } else {
          return { ...item, isValidated: false, preview: false };

        }


      });

      setformElements(updatedItems);








    } else if (id == 'parent') {


      const updatedItems = formElements.map(item => {
        var element_name = item.name;
        var placeholdeasdsar = item.placeholder;




        if (element_name == 'father_name') {

          return { ...item, data: data.father_id.name, preview: true };

        } else if (element_name == 'father_email') {
          return { ...item, data: data.father_id.email, preview: true };

        }
        else if (element_name == 'father_phone') {
          return { ...item, data: data.father_id.mobile, preview: true };

        }
        else if (element_name == 'mother_name') {
          return { ...item, data: data.mother_id.name, preview: true };

        } else if (element_name == 'mother_email') {
          return { ...item, data: data.mother_id.email, preview: true };

        } else if (element_name == 'mother_phone') {
          return { ...item, data: data.mother_id.mobile, preview: true };

        }
        else {
          return { ...item, isValidated: false, preview: false };

        }


      });

      setformElements(updatedItems);





    }





  }



  function triggerdetails(id) {


    var filteredforments;

    // const updatedArray = formElements.filter(o => o.type !== 'parent' && o.type !== 'guardian');

    // console.log(updatedArray,"updatedArray")


    // setformElements(updatedArray);





    if (id == 'guardian') {



      setformElements(
        formElements.map((item) => {
          if (data.value._id == "father_mother") {
            if (item.type == 'parent') {
              return { ...item, preview: true };

            } else {
              return { ...item, preview: false };

            }
          } else {

            if (item.type == 'parent') {
              return { ...item, preview: false };

            } else {
              return { ...item, preview: true };

            }

          }
        })
      );


      // var newtempelements = family_inputs.filter(function (item) {
      //   return item.type == 'guardian';


      // });


      // setformElements([
      //   ...formElements,
      //   ...newtempelements,

      // ]);



    } else if (id == 'father_mother') {



      var newtempelements = family_inputs.filter(function (item) {
        return item.type == 'parent';


      });


      setformElements([
        ...formElements,
        ...newtempelements,

      ]);


    }



  }


  function emptyformData() {
  

    for (let index = 0; index < formElements.length; index++) {
      const obj = formElements[index];

      if (obj.type == 'parent') {
        obj.preview = false;

      } else if (obj.type == 'guardian') {
        obj.preview = false;

      } else {
        obj.preview = true;

      }

      obj.isValidated = false;


      if ('defaultValuedata' in obj) {

        var checkdata = obj_or_arr(obj.defaultValuedata);
        if (checkdata == 'object') {
          obj.defaultValuedata = {
            "_id": "please select Data",
            "name": "please select Data"
          };
        } else {
          obj.defaultValuedata = [];
        }
        console.log(checkdata, "emptyformData checkdata");

      } else {
        obj.data = '';

      }



    }




  }

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



  function triggerdata(type) {



    for (let index = 0; index < formElements.length; index++) {
      const element = formElements[index];


      if (element.name == type) {



        if (element.preview == true) {




          return element;

        } else {

          return null;
        }

      }


    }



  }

  function formElements_addparent(checkbooldata, data) {












  }





  function check_isParent_guardian(data) {

    if ('guardian_id' in data) {
      return 'guardian';
    } else if ('mother_id' in data) {

      return 'parent';
    }

  }
  function validationHandler(params) {

    let formValidated = false;


    const myNextList = [...formElements];
    const indiobj = myNextList.find(
      a => a.id == params.id
    );
    indiobj.isValidated = false;


    const result = formElements.filter(element => element.id == params.id)[0];

    result.isValidated = false;

    if (params.hasOwnProperty('valid')) {
      if (params.valid == true) {
        // result.isValidated = true;
        indiobj.isValidated = true;


        if ('type' in params) {
          if (params.type == 'multiselect') {
            var temparr = [];
            for (let index = 0; index < params.value.length; index++) {
              const element = params.value[index].value;
              temparr.push(element)
            }


            finalObj[params.name] = temparr;
            // result.defaultValuedata = params.value;
            indiobj.defaultValuedata = params.value;


          } else if (params.type == 'dropdown') {

            finalObj[params.name] = params.value._id;

            if (params.name == 'class_id') {
              finalObj['category_id'] = params.value.category_id;

            }
            // result.defaultValuedata = params.value;
            indiobj.defaultValuedata = params.value;


          } else {

            finalObj[params.name] = params.value;
            // result.data = params.value;
            indiobj.data = params.value;


          }
        }


      } else {
        // result.isValidated = false;

        indiobj.isValidated = false;

        if ('type' in params) {
          if (params.type == 'multiselect') {

            indiobj.defaultValuedata = params.value;


          } else if (params.type == 'dropdown') {


            indiobj.defaultValuedata = params.value;


          } else {


            indiobj.data = params.value;


          }
        }





      }
    }

    else {

      finalObj[params.name] = params.value;


    }

    setformElements(myNextList);


    var previewdata = formElements.filter(function (item) {

      return item.preview !== false;


    });


  const validationResults = previewdata.filter(element => element.isValidated == false);



  console.log("finaldata", previewdata)
  console.log("validationResults", validationResults)



  if (validationResults.length == 0) {


    formValidated = true


  }




    return formValidated
  }





  async function createfetchdata() {






    var requesttype;
    if (iseditable.checkdata == true) {
      requesttype = "PUT";
      finalObj._id = iseditable.editable_id;
      finalObj.parent_type = iseditable.parent_type;
      finalObj.school_id = school_id;

      console.log(iseditable, "iseditable");

      finalObj.type = 'personalinfo';





    } else {
      requesttype = "POST";
      finalObj.school_id = school_id;

    }


    console.log("finalObj>>>>", finalObj);


    const res = await fetch("/api/studentAPI", {
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

        // setOpenTimetable(false)

        if (requesttype == "POST") {
          setOpenTimetable(false)


        } else {
          setOpenTimetable(false)



          fetchData(selected_class_id);


        }



      }
    }


  }

  async function editfamilydata() {

    emptyvalidate();
    setTimeout(() => {
    setValidate(true)

    }, 500);



  }


  function emptyvalidate() {

    const updatedItems = formElements.map(item => {


      return { ...item, isValidated: false };

    });


    setformElements(updatedItems);


  }

  async function createTeacher() {


    emptyvalidate();

    setTimeout(() => {
    setValidate(true)

    }, 500);






  }

  // ///// Datatable Code

  let dataTableColumns = [

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
      header: "Student ID",
      accessor: "student_personal_id",
    },

    {
      header: "Edit/delete",
      accessor: "Edit/delete"
    },
  ];

  let setSkip = 0;
  let setLimit = 10;

  let dataTableProps = {
    showEdit: false,
    showDelete: true,
    showViewData: true,
    showButtonsData: true,
    editpersonal: true,
    editfamily: true,
    heading: " ",
    subHeading: "",
  };










  const search = async (query) => {
    seachText.current = { value: query };

    let data = await getdatatabledata(0, 5, query, selected_class_id);
    console.log(data, "search data");
    setAriaInfo(data.data);
  };

  const moveNext = async (skip, limit) => {

    console.log(skip, limit, "skip moveNext")

    let data = {};
    if (seachText.current && seachText.current.value !== "") {

      data = await getdatatabledata(skip + limit, limit, seachText.current.value, selected_class_id);
    } else {
      data = await getdatatabledata(skip + limit, limit, undefined, selected_class_id);
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
      data = await getdatatabledata(skip - limit, limit, seachText.current.value, selected_class_id);
    } else {
      data = await getdatatabledata(skip - limit, limit, undefined, selected_class_id);
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
      data = await getdatatabledata(skip, limit, seachText.current.value, selected_class_id);
    } else {
      data = await getdatatabledata(skip, limit, undefined, selected_class_id);
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

  const getdatatabledata = async (skip, limit, query, class_id1) => {
    let res;
    if (query) {


      res = await fetch(
        `/api/All_searchable_queryAPI?type=get_students_data&request_type=search&class_id=${class_id1}&searchTerm=${query}&skip=${skip}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    } else {


      res = await fetch(
        `/api/All_searchable_queryAPI?type=get_students_data&request_type=getallData&class_id=${class_id1}&skip=${skip}&limit=${limit}`,

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



  async function editData(type, data) {



    console.log(data, "data editpersonaldata")
    var finalresult = data;

    var tempdata12 = await check_isParent_guardian(finalresult)

    console.log(tempdata12, "tempdata12 check_isParent_guardian")

    setiseditable({
      ...iseditable,
      checkdata: true,
      editable_id: finalresult._id,
      parent_type: type,
      currentSelectedata: finalresult,
    });



    emptyformData();

    if (type == 'personal') {



      cleardata(type, undefined)

      // remove_select_parents('edit')








      const updatedItems = formElements.map(item => {
        var element_name = item.name;
        var placeholdeasdsar = item.placeholder;




        if (element_name == 'student_id') {

          return { ...item, data: data.student_personal_id, preview: true };

        } else if (element_name == 'class_id') {
          return { ...item, defaultValuedata: data.class_id, preview: true };

        } else if (element_name == 'optional_subjects') {
    const transformed = data.optional_subjects.map(({ _id, name }) => ({ label: name, value: _id }));

          return { ...item, defaultValuedata: transformed, preview: true };

        } else if (element_name == 'first_name') {
          return { ...item, data: data.first_name, preview: true };

        }
        else if (element_name == 'last_name') {
          return { ...item, data: data.last_name, preview: true };

        }
        else if (element_name == 'email') {
          return { ...item, data: data.email, preview: true };

        }
        else if (element_name == 'address') {
          return { ...item, data: data.address, preview: true };

        }
        else if (element_name == 'description') {
          return { ...item, data: data.description, preview: true };

        }
        else if (element_name == 'phone') {
          return { ...item, data: data.phone, preview: true };

        }
        else if (element_name == 'gender') {
          // return { ...item, data: data.guardian_id,preview:true};


          var femaledata = {
            "_id": "female",
            "name": "female"
          }
          var maledata = {
            "_id": "male",
            "name": "male"
          }

          if (data.gender == 'female') {
            return { ...item, defaultValuedata: femaledata, preview: true };

          } else {

            return { ...item, defaultValuedata: maledata, preview: true };


          }

        }

        else {
          return { ...item, isValidated: false, preview: false };

        }


      });

      console.log(updatedItems, "updatedItems")

      setformElements(updatedItems);


      

      setTimeout(() => {
      setOpenTimetable(true);
        
      }, 1500);


    } else {


      // edit family data functionality



      var checkbooldata = check_isParent_guardian(data);
      console.log(checkbooldata, "checkbooldata");










  


    }


  }



  function cleardata(type, check_isParent_guardian) {


    const updatedItems = formElements.map(item => {


      if (type == "personal") {




        if (item.type == 'parent') {

          return { ...item, preview: false };

        } else if (item.type == 'guardian') {
          return { ...item, preview: false };

        } else if (item.name == 'parentsdetails') {
          return { ...item, preview: false };

        } else {
          return { ...item, preview: true };

        }


      } else {



        if (check_isParent_guardian == 'guardian') {

          if (item.type == 'guardian') {

            return { ...item, preview: true };

          } else {
            return { ...item, preview: false };

          }


        } else if (check_isParent_guardian == 'parent') {
          if (item.type == 'parent') {

            return { ...item, preview: true };

          } else {
            return { ...item, preview: false };

          }

        }






      }
    });

    setformElements(updatedItems);
  }




  async function DeleteData(data) {


    const res = await fetch("/api/studentAPI", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "_id": data._id,
        type: 'delete'
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
        async function fetchData() {
          let data = await getdatatabledata(0, 5, undefined, selected_class_id);

          console.log(data, "fetchData data");

          setAriaInfo(data.data);

        }

        fetchData();
      }
    }


  }



  function downloadCSV() {

    var maindata = [
      [
        "first_name",
        "last_name",
        "student_personal_id",
        "email",
        "description",
        "phone",
        "address",
        "gender",
        "father_name",
        "father_mobile",
        "father_email",
        "mother_name",
        "mother_mobile",
        "mother_email",
        "guardian_name",
        "guardian_mobile",
        "guardian_email",
      ],
      [
        "test_first_name",
        "test last_name",
        "1234421321",
        "testemail@gmail.com",
        "test description",
        "9876543219",
        "test address",
        "male",
        "test father_name",
        "3432432432",
        "testfather@email.com",
        "test mother_name",
        "23213213213",
        "testmother@email.com",
      ],
      [
        "test_first_name",
        "test last_name",
        "1234421321",
        "testemail@gmail.com",
        "test description",
        "9876543219",
        "test address",
        "male",
        "",
        "",
        "",
        "",
        "",
        "",
        "testguardian_name",
        "3243243423324",
        "testguard@gmail.com",
      ],

      [""],
      [""],
      ["Please add Gender as (male or female) all smallcase letters"],
     

    ];

     

    downloadFile(maindata)
  }


  function downloadFile(data) {
    const csvContent = "data:text/csv;charset=utf-8," + data.map(row => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



  const [csvData, setCsvData] = useState(null);

  function checkif_classid(classid_12) {
    if (classid_12.length > 0) {
      console.log(ClassData, "classdata")
      console.log(classid_12, "classid_12")

      const validationResults = ClassData.filter(element => element._id == classid_12);

      console.log(validationResults, "validationResults")

      if (validationResults.length == 1) {

        return true;



      } else {
        return false;


      }

    } else {
      return false;

    }

    // return object ID from the array
  }

  const handleFileUpload = (event) => {
    setCsvError("")


    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const contents = event.target.result;
      const lines = contents.split('\n');
      const data = lines.map(line => line.split(','));


      console.log(data, "csv")
      // setCsvData(data);


      var newarr = [];


      for (let index = 1; index < data.length; index++) {
        const element = data[index];

        var checkdata231 = checkif_classid(element[0]);
        if (element.length > 10) {

          console.log(element, "element")
          newarr.push(element)


        }


      }




      refinedata(newarr)
      document.getElementById('fileInput').value = '';



    };



    reader.readAsText(file);
  };



  function combinedata(mainarr, indidata) {
    var finaldata = [indidata].map(function (item) {
      var obj = {
      };
      mainarr.forEach(function (key, i) {
        obj[key] = item[i];
      });
      return obj;
    });

    return finaldata[0];

  }
  var finalarr = [];

  const makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }
  var main_arr =
    [
      "first_name",
      "last_name",
      "student_personal_id",
      "email",
      "description",
      "phone",
      "address",
      "gender",
      "father_name",
      "father_mobile",
      "father_email",
      "mother_name",
      "mother_mobile",
      "mother_email",
      "guardian_name",
      "guardian_mobile",
      "guardian_email"
    ];



  function refinedata(data) {
    for (let index = 0; index < data.length; index++) {

      const element = data[index];


      var adata = combinedata(main_arr, element);
      finalarr.push(adata);


    }


    checkfor_validation(finalarr);


  }
  var error_arr = []


  function checkfor_validation(data) {

    console.log(data, "checkfor_validation data")
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const father_name = data[index].father_name;
      const mother_name = data[index].mother_name;
      const guardian_name = data[index].guardian_name;
      const class_id21 = data[index].class_id;
      const _id = data[index]._id;



      var final_str = ''
      // selected_class_id

      // if (class_id21.length > 10) {





      // } else {
      //   final_str += `missing Class_id`

      //   setCsvError("Oops! Please re-check your CSV and upload again")

      // }

      data[index].class_id = selected_class_id;

      if (father_name.length > 4 && mother_name.length > 4) {

        data[index].isValidated = true;
        data[index].type = 'parent';



      } else if (guardian_name.length > 4) {

        data[index].isValidated = true;
        data[index].type = 'guardian';

      }

      var obj = {
        data: final_str
      };
      error_arr.push(obj)


    }

    // const final_error_arr = error_arr.filter(obj => obj.data.length > 0);

    // console.log(final_error_arr, "final_error_arr")
    // console.log(data, "finalarr")

    // if (final_error_arr.length > 0) {

    // } else {



    // }
    console.log(data, "finalarr")

    savedataCSV(data);







  }


  async function savedataCSV(data) {
    setCsvLoading(true)


    var finaldataobj = {
      school_id: school_id,
      finaldata: data,
      type: 'csv_upload'
    }
    const res = await fetch("/api/studentAPI", {
      method: 'PUT',
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
        setErrMessage("Oops! Please try again");
      } else {

        // goToNext();




        if (data.success == true) {

          notify('CSV Uploaded');
          setcsvpopup(false)
          setCsvLoading(false)
          fetchData(selected_class_id);


        }
        else {
          setCsvError("Oops! Please re-check your CSV and upload again")
        }


      }
    }

  }



  return (

    <LayoutMini>
    <div className="m-auto md:px-6 md:py-3">
     

        <div className="">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-2xl sm:text-5xl text-slate-500 font-extrabold border border-gray-50 rounded-lg px-2 py-2">
                Students
              </h2>
              <p className="mt-1 text-md text-gray-500 sm:text-lg md:mt-2 md:max-w-3xl pl-3">
                Add students list with details
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex sm:space-x-4">
              <button onClick={() => triggeropenpopup()}
                type="button"
                className="sm:text-md inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-3 h-6 w-6" aria-hidden="true" />
                Add Student
              </button>
         



            </div>
        



          </div>
          <div className="mt-8 flex flex-col">
            <div className="flex md:max-w-xl justify-left items-center space-x-4">
              <div>
                <Dropdown {...selectClass[0]} sendData={sendData} />
              </div>
           
            </div>
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:mt-4">
              <div className="inline-block min-w-full py-2 md:px-6 lg:px-8">


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
              
              </div>
            </div>


          </div>
        </div>




      <Transition.Root show={openTimetable} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenTimetable}>
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
                  <Dialog.Title as="h3" className="text-4xl font-extrabold leading-6 text-slate-400 pb-6">
                    Add Student Details
                  </Dialog.Title>
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button type="button" className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpenTimetable(false)} >
                      <XMarkIcon className="h-10 w-10 text-slate-400" aria-hidden="true" />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-left sm:mt-5">

                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-5">

                 





                        <div>

                          <Input validate={validate} {...triggerdata('student_id')} sendData={sendData} />
                        </div>
                        <div>

                          <Dropdown validate={validate} {...triggerdata('class_id')} sendData={sendData} />
                        </div>
                   

                        <div>

                          <Input validate={validate} {...triggerdata('first_name')} sendData={sendData} />
                        </div>
                        <div>

                          <Input validate={validate} {...triggerdata('last_name')} sendData={sendData} />
                        </div>
                        <div>

                          <Input validate={validate} {...triggerdata('email')} sendData={sendData} />
                        </div>


                      </div>


                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5">

                        <div>


                          <Input validate={validate} {...triggerdata('phone')} sendData={sendData} />
                        </div>
                        <div>

                          <Dropdown validate={validate} {...triggerdata('gender')} sendData={sendData} />

                        </div>

                        <div>

                          <Textarea validate={validate} {...triggerdata('description')} sendData={sendData} />
                        </div>
                        <div>

                          <Textarea validate={validate} {...triggerdata('address')} sendData={sendData} />
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



      <Transition.Root show={csvpopup} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setcsvpopup}>
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
                  <Dialog.Title as="h3" className="text-4xl font-extrabold leading-6 text-slate-400 pb-6">
                    Add Student Details
                  </Dialog.Title>
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button type="button" className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setcsvpopup(false)} >
                      <XMarkIcon className="h-10 w-10 text-slate-400" aria-hidden="true" />
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
                              <b className="text-red-500">Note:</b> Download the Sample
                              CSV and add your data,


                              <ul>
                                <li>
                                  <b className="text-red-500">Important Instructions :</b>
                                </li>
                                <li>

                                  1 . Make sure you link class_id for each record

                                </li>
                                <li>

                                  2 . Please add mother and father details or guardian details to save record

                                </li>
                              </ul>


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
                              <div

                                className="bg-gray-800 mt-1 flex justify-center pt-10 pb-10 border-2 border-white border-dashed rounded-md w-full"
                              >
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
                                      <span className="p-1"
                                      >Upload Media</span
                                      >
                                      {/* <input
                        onChange={handleFileUpload} id="fileInput"
                          type="file"
                          className="sr-only"
                          accept="text/csv"
                        /> */}


                                      <input type="file" onChange={handleFileUpload} id="fileInput" />

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

    </div>
    </LayoutMini>




  );
}