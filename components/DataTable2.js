import { Fragment, React, useState, useMemo, useEffect } from "react";
import regeneratorRuntime from "regenerator-runtime";
import { Switch } from '@headlessui/react'

import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useFilters,
  useSortBy,
  usePagination,
} from "react-table";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  search,
  defaultSearch
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {

    if (defaultSearch == true) {
          setGlobalFilter(value || undefined);

    }

    else{
      search(value);

    }


  }, 200);

  return (
    <label className="flex items-baseline">
      <span className="text-gray-700 text-xs">Search: </span>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </label>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows = [], id, render },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set();

    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">{render("Header")}: </span>
      <select
        className="mt-1 block w-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

let columns = [];


function DataTable2(props) {
  // dataTableDataR, dataTableColumns

  // console.log(props, 'props');

  const data = props.dataTableDataR;
  const { search, total, limit, skip, moveNext, movePrev, changeLimit, editRowClicked } = props;
  const [enabled, setEnabled] = useState(false)

  function editRow(event, value, id) {
    console.log(value, event, id, "edit button clicked");

    let rowInfo = {
      value: value,
      event: event,
      id: id
    }

    editRowClicked(rowInfo)
  }
  function deleteRow(event, value, id) {
    console.log(value, event, id, "delete button clicked");
  }


  for (const [i, element] of props.dataTableColumns.entries()) {
    const elementType = element.type;

    const elementHeader = element.header;
    const elementAccessor = element.accessor;

    columns[i] = {};
    columns[i]["Header"] = elementHeader;
    columns[i]["accessor"] = elementAccessor;

    if (elementType == "filter") {
      columns[i]["Filter"] = SelectColumnFilter;
      columns[i]["filter"] = "includes";
    }

  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize },
    preGlobalFilteredRows, // new
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 100 }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="w-full m-auto">
      <div className="sm:flex sm:items-center pb-4">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-left text-gray-900">
            {props.heading}
          </h1>
          <p className="mt-2 text-sm text-left text-gray-700">
            {props.subHeading}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
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

      {props.loading ? (
        <div className="flex justify-center items-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span>Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              search={search}
              defaultSearch={props.defaultSearch}
            />

            {headerGroups.map((headerGroup) =>
              headerGroup.headers.map((column) =>
                column.Filter ? (
                  <div key={column.id}>
                    {/* <label htmlFor={column.id}>{column.render("Header")}: </label> */}
                    {column.render("Filter")}
                  </div>
                ) : null
              )
            )}
          </div>

          <div className="mt-2 flex flex-col ">
            <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full md:px-4">
                <div className=" overflow-hidden ">
                  <table
                    {...getTableProps()}
                    className="min-w-full divide-y divide-gray-200"
                  >
                    <thead className="bg-gray-50">
                      {headerGroups.map((headerGroup) => (
                        <tr
                          key={headerGroup.id}
                          {...headerGroup.getHeaderGroupProps()}
                        >
                          {headerGroup.headers.map((column) => (
                            // Add the sorting props to control sorting. For this example
                            // we can add them into the header props
                            <th
                              key={column.id}
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              {column.render("Header")}
                              {/* Add a sort direction indicator */}
                              <span>
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? " ▼"
                                    : " ▲"
                                  : ""}
                              </span>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody
                      {...getTableBodyProps()}
                      className="bg-white divide-y divide-gray-200"
                    >
                      {page.map((row, i) => {
                        // new
                        prepareRow(row);
                        return (
                          <tr key={row.id} {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                              return (
                                <td
                                  key={cell.id}
                                  {...cell.getCellProps()}
                                  className="px-6 py-4 whitespace-nowrap"
                                >
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                            <td className="text-left flex m-auto align-middle justify-center">



                              {props.showEdit == true && (
                                <a
                                  onClick={(e) => editRow(e, row, row.id)}
                                  className="text-indigo-600 hover:text-indigo-900 pointer underline cursor-pointer"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 text-indigo-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </a>
                              )}

                              {" "}
                              {props.showDelete == true && (
                                <a
                                  onClick={() => deleteRow(e, row, row.id)}
                                  className="ml-4 text-red-400 hover:text-red-500 pointer underline cursor-pointer"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </a>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {props.showPagination == true && (

          <div className="py-3 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              {/* <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
              <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button> */}
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div className="flex gap-x-2 items-center">
                <span className="text-xs text-gray-700">
                  Page{" "}
                  <span className="font-medium">
                    {parseInt((skip + limit) / limit)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {Math.ceil(total / limit)}
                  </span>
                </span>
                <label>
                  <span className="sr-only">Items Per Page</span>
                  <select
                    className="text-xs mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={limit}
                    onChange={(e) => {
                      changeLimit(skip, e.target.value);
                    }}
                  >
                    {[5, 10, 20].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <span className="isolate inline-flex rounded-md">
                    <button
                      type="button"
                      onClick={() => movePrev(limit, limit)}
                      className="cursor-pointer relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <span className="sr-only">First</span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => movePrev(skip, limit)}
                      disabled={skip == 0}
                      className="cursor-pointer relative -ml-px inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>{" "}
                    </button>
                    <button
                      type="button"
                      onClick={() => moveNext(skip, limit)}
                      disabled={skip + limit >= total}
                      className=" cursor-pointer relative -ml-px inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        let allSkip =
                          total % limit == 0
                            ? total - limit
                            : total - (total % limit);
                        allSkip = allSkip - limit;
                        moveNext(allSkip, limit);
                      }}
                      className="cursor-pointer relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Last</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </button>
                  </span>
                </nav>
              </div>
            </div>
          </div>
      )}
        </>
      )}
    </div>
  );
}

DataTable2.defaultProps = {
  name: "tableComp",
  showEdit: true,
  showDelete: true,
  showPagination : true,
  defaultSearch : false,

  heading: "Table Heading",
  subHeading: "Table Sub Heading",
  button: {
    //
    text: "Button Text",
    show: true,
  },
  id: "12345",
};

export default DataTable2;
