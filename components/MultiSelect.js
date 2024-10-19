import { useEffect, useState } from "react";

import Select from 'react-select';
import React from 'react';


function MultiSelect(props) {


  const [multiselectVal, setMultiselectVal] = useState(props.defaultValuedata);
  const [error_message, setError] = useState("");

  const handleWarnaChange = async (selected, selectaction) => {




    const { action } = selectaction;


    // console.log(selected,selectaction,"selected selectaction ")
    setMultiselectVal(selected);



    if (action == "clear") {


    } else if (action == "select-option") {



      // const multiselectReturn = {
      //   name: props.name,
      //   id: props.id,
      //   value : multiselectVal,
      //   valid : true,
      //   type:"multiselect"
      // }
      // console.log(multiselectReturn,"multiselectReturn")

      // props.sendData(multiselectReturn)



    } else if (action == "remove-value") {


    } else if (action == "create-option") {


      // props.saveCreatedata(selectaction.option.value)




    }




  };


  useEffect(() => {

    if (props.defaultValuedata == null) {
      setMultiselectVal(null);

    } else {

      setMultiselectVal(props.defaultValuedata)

    }

    // if(props.defaultValuedata.length > 0) {

    //   setMultiselectVal(props.defaultValuedata)

    // }else{

    //   setMultiselectVal(null);

    // }

    if (props.validate) {



      async function fetchData() {



        const multiselectReturn = {
          name: props.name,
          id: props.id,
          value: multiselectVal,
          type: "multiselect"
        }
        console.log(multiselectReturn, "multiselectReturn")

        if (props.required == true) {


          if (multiselectVal == null || multiselectVal.length == 0) {
            setError("Please Select Data");
            setMultiselectVal(null);

            multiselectReturn.valid = false;
          } else {
            if (multiselectVal.length > 0) {


              multiselectReturn.valid = true;
              setError("");

            }
          }


        } else {
          multiselectReturn.valid = true;
          setError("");

        }


        props.sendData(multiselectReturn)



      }
      fetchData()

    }
  }, [props.validate]);



  return (

    <div>

      {props.label.show == true && (
        <label htmlFor="comment" className="block text-left text-sm font-medium text-gray-700">
          {props.label.text}
        </label>
      )}

      <div className="mt-1">

        <Select
          id={props.id}
          instanceId={props.id}
          isMulti
          name={props.name}
          className="basic-multi-select"
          classNamePrefix="select"
          options={props.list}
          onChange={handleWarnaChange}
          placeholder={props.placeholder}
          value={multiselectVal}
          defaultValue={props.defaultValuedata}
          closeMenuOnSelect={false}

        />

        <p className="mt-2 text-xs text-red-500">{error_message}</p>

      </div>
    </div>

  )
}


MultiSelect.defaultProps = {
  data: '',
  defaultValuedata: [],

  name: 'multiselectComp',
  label: { //
    text: 'Select (or) create Subjects Here',
    show: true,
  },
  value: "",
  list: [
    { value: 'Please Select Subject', label: 'Please Select Subject' },

  ],
  enabled: true,
  placeholder: 'Select (or) create Subjects Here',
  errorMessage: '',
  isValidated: false,
  required: true,
  id: '12345'
};


export default MultiSelect

