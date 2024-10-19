import { Fragment, useState, useEffect } from "react";




import * as z from "zod";
import { Listbox, Transition } from "@headlessui/react";
import {
  PlusIcon, CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


function Dropdown(props) {
  const [error_message, setError] = useState("");



  const [selected, setSelected] = useState({
    "_id": "please select value",
    "name": "please select value"
  })
  const [addNewItemVal, setAddNewItemVal] = useState("");


  function addToDropdown(params) {
    console.log("a2");

    console.log(params, 'params');

  }

  function dropdownChanged(params) {
    console.log("a1 dropdownChanged", params);

    setSelected(params)

    const dropdownReturn = {
      name: props.name,
      id: props.id,
      value: params,
      valid: true,
      type: "dropdown"


    }


    if (props.name == 'default_class_id' || props.name == 'parentsdetails' || props.name == 'event_type' || props.name == 'class' || props.name == 'exams') {

      props.sendData(dropdownReturn)


    }



  }






  useEffect(() => {


    if ('defaultValuedata' in props) {
      console.log(props, "props dropdown ")

      setSelected(props.defaultValuedata)

    }
    if (props.validate) {


      async function fetchData() {


        const dropdownReturn = {
          name: props.name,
          id: props.id,
          value: selected,
          valid: true,
          type: "dropdown"

        }

        if(props.required == true){
          if (selected._id.includes("please") == true || selected._id.includes("select") == true) {

            setError("Please Select Data");
            dropdownReturn.valid = false;
  
          }
          else {
            dropdownReturn.valid = true;
            setError("");
  
          }
        }else{
          dropdownReturn.valid = true;
          setError("");

        }
       




        props.sendData(dropdownReturn)



      }
      fetchData()

    }
  }, [props.validate]);


  return (

    <Listbox value={selected} onChange={(e) => dropdownChanged(e)}>
      {({ open }) => (
        <>
          <div className="relative">
            {props.label.show == true && (
              <Listbox.Label className="text-left mb-1 block text-sm font-medium text-gray-700">
                {props.label.text}
              </Listbox.Label>
            )}


            <Listbox.Button

              className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="block truncate">{selected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>


            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">


                {props.list.length > 0 &&

                  <div>

                    {props.list.map((item) => (

                      <Listbox.Option

                        key={item._id}
                        className={({ active }) =>
                          classNames(
                            active ? "text-white bg-indigo-600" : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-8 pr-4"
                          )
                        }
                        value={item}
                      >
                        {({ selected, active }) => (
                          <>
                            <span

                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "block truncate"
                              )}
                            >
                              {item.name}
                            </span>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-white" : "text-indigo-600",
                                  "absolute inset-y-0 left-0 flex items-center pl-1.5"
                                )}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </div>

                }

              </Listbox.Options>
            </Transition>
            <p className="mt-2 text-xs text-red-500">{error_message}</p>

          </div>
        </>
      )}
    </Listbox>

  )
}


Dropdown.defaultProps = {
  id: 12345,
  name: 'dropdownComp',
  list: [
    { _id: 1, name: 'Select Option' },

  ],
  allowNew: {
    show: false,
    text: 'Add New Category',
    icon: PlusIcon
  },
  label: { //
    text: 'Add Category',
    show: true,
  },
  initialValue: '',
  enabled: true,
  errorMessage: '',
  isValidated: false,
  // schema: z.object(
  //   {
  //     _id: z.string(),
  //     name: z.string(),
  //   }
  // ),

  // schema:z.object({
  //     name: z
  //       .string()
  //       .refine((name) =>
  //         fieldsOfEng.map((field) => field.name).includes(name)
  //       ),
  //       _id: z
  //       .string()
  //       .refine((_id) =>
  //         fieldsOfEng.map((field) => field._id).includes(_id)
  //       ),
  //   })

//   schema: z.object({
//     name: z.string(),
//     _id: z.string()
//   })

};


export default Dropdown