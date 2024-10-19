import { Fragment, useState, useEffect } from "react";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Listbox, Transition } from "@headlessui/react";
import {
  PlusIcon, CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" }
  ];

  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch =async event => {
    setSearchTerm(event.target.value);


      
    const res = await fetch(
      "/api/All_searchable_queryAPI?type=school_subject_search&searchTerm=" + event.target.value + "&school_id=" + school_id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    var data = await res.json();
    console.log("searchbar Data>>>>", data);


if(data.data){
  const transformed = data.data.map(({ _id, name }) => ({ label: name, value: _id }));

console.log(transformed,"transformed")
setFilteredOptions(transformed)

}

    // setFilteredOptions(
    //   options.filter(
    //     option =>
    //       option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    //   )
    // );
  };


function DynamicDropdown(props) {


  // console.log(props,"dropdown")

  // const [selected, setSelected] = useState({
  // "_id": "please select value",
  // "name": "please select value"

  // })


  const [selected, setSelected] = useState({
    "_id": "please select value",
    "name": "please select value"
  })
  const [addNewItemVal, setAddNewItemVal] = useState("");

  //   useEffect(() => {

  //     setSelected(props.defaultValuedata);

  // }, []);




  function addToDropdown(params) {
    console.log("a2");

    console.log(params, 'params');

  }

  function handleSearch(event) {
    var inputValue= event.target.value;

    const dropdownReturn = {
        name: props.name,
        id: props.id,
        value: inputValue,
        valid: true,
        type: "dynamicDropdown"
  
  
      }
  
      props.sendInput(dropdownReturn)
  

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

    props.sendData(dropdownReturn)



  }


  const {
    register,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(props.schema),
  })

  async function checkAddition() {

    if (addNewItemVal.trim().length > 1) {

      const valid = await trigger('additionField')


      if (!valid) {
        // if invalid nothing happens
        return
      }

      addToDropdown(addNewItemVal);


    }

  }


  useEffect(() => {

    setSelected(props.defaultValuedata)
    console.log(props, "props dropdown ")
  

    if (props.validate) {

      async function fetchData() {

        const valid21 = await trigger('dropdown_select')


        console.log(valid21, "valid dropdown ")

        const dropdownReturn = {
          name: props.name,
          id: props.id,
          value: selected,
          valid: true,
          type: "dropdown"


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
          {props.label.show == true && (
            <Listbox.Label className="text-left mb-0 block text-sm font-medium text-gray-700">
              {props.label.text}
            </Listbox.Label>
          )}
          <div className="relative mt-0">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
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
      
<input
            type="text"
            className="w-full p-2 bg-white border border-gray-400 rounded-lg focus:outline-none focus:border-indigo-500"
            placeholder="Search options"
            onChange={handleSearch}
          />

                {props.list.length > 0 &&

                  <div>


                    {props.list.map((item) => (

                      <Listbox.Option
                        {...register('dropdown_select')}

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
          </div>
        </>
      )}
    </Listbox>
  )
}


DynamicDropdown.defaultProps = {
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


  schema: z.object({
    name: z.string(),
    _id: z.string()
  })

};


export default DynamicDropdown