import { useState, useEffect } from "react";

function Table(props) {

  console.log(props);

  function tableButtonClicked() {

    console.log('table button clicked');

  }

  function editRow(event, value, id) {

    console.log(value, event, id, "edit button clicked");

    let rowInfo = {
      value : value,
      event : event,
      row_id : id,
      table_id : props.table_id
     }

    props.editRowClicked(rowInfo)

  }
  function deleteRow(value, id) {

    console.log(value,'delete button clicked');

    let rowInfo = {
      value : value,
      row_id : id,
      table_id : props.table_id
     }

    props.deleteRowClicked(rowInfo)

  }



  const [tableVal, setTableVal] = useState(props.tableValues);


  useEffect(() => {


    if (props.tableUpdated) {

      async function fetchData() {

        setTableVal(props.tableValues)

      }
      fetchData()

    }
  }, [props.tableUpdated]);
    return (
      <div className="w-full">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto max-w-3xl">
            <h1 className="text-xl font-bold text-left text-gray-700 capitalize">{props.heading}</h1>
            <p className="mt-1 text-xs text-left text-gray-700">
              {props.subHeading}
            </p>
          </div>
          <div className="mb-8 sm:mt-0 sm:flex-none">
            {props.button.show == true && (
                 <button
                 onClick={() => tableButtonClicked()}
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                    {props.button.text}
                </button>
            )}

          </div>
        </div>
        <div className="mt-8 overflow-hidden ring-0 ring-black ring-opacity-5 md:rounded-lg border border-gray-200 w-full max-w-full ">
          <table className="divide-y divide-gray-300 w-full">
            <thead className="bg-gray-50">

              <tr className="divide-x divide-gray-200">
                {props.headers.map((item, i) => (
                    <th scope="col" key={i}  className="py-2 pl-4 pr-3 text-center text-sm font-bold text-gray-900 sm:pl-6">
                        {item}
                    </th>
                ))}

               {props.headers.showEdit == true && (
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
               )}

              </tr>
            </thead>


            <tbody className="divide-y divide-gray-200 bg-white text-center">
                      {tableVal.map((item, i) => (
                        <tr key={i} className="divide-x divide-gray-200">

                        {Object.keys(item).map((keyName, i) => (
                            <td key={i} className="whitespace-nowrap py-2 pl-4 pr-4 text-sm font-normal text-gray-900 sm:pl-6">
                                <span className="input-label">{item[keyName]}</span>
                            </td>

                        ))}


                          <td className="whitespace-nowrap text-sm flex justify-center p-2">

                          {props.showEdit == true && (

                          <a onClick={(e) => editRow(e, item, i)} className=" rounded-md text-indigo-600 hover:text-indigo-900 cursor-pointer">

                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </a>

                            )}

                            {props.showDelete == true && (

                            <a onClick={() => deleteRow(item, i)} className=" rounded-md ml-8 text-red-400 hover:text-red-500 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </a>

                            )}

                          </td>

                        </tr>
                      ))}
                    </tbody>


          </table>
        </div>
      </div>
    )
  }


  Table.defaultProps = {
  name : 'tableComp',
  showEdit: true,
  showDelete: true,
 heading : 'Table Heading',
 subHeading : 'Table Sub Heading',
  button: { //
    text: 'Button Text',
    show: false,
  },
  headers : [
    'Name', 'Title', 'Email', 'Role', 'Edit'
  ],

  list : [],

  id: '12345'
};


export default Table

