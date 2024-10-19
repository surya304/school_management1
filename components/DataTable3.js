import { Fragment, React, useState, useMemo, useEffect, useRef } from "react";
import regeneratorRuntime from "regenerator-runtime";
import { Switch } from "@headlessui/react";

import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useFilters,
  useSortBy,
  usePagination,
} from "react-table";
import { LogIn } from "react-feather";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">Search: </span>
      <input
        type="text"
        className="m-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
        className="m-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const EditableCell = ({
  value: initialValue,
  row,
  column: { id },
  updateData,
  // This is a custom function that we supplied to our table instance
}) => {
  const [editable, setEditable] = useState(false);

  const [value, setValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(row.original.reason);

  const onChange = (e) => {
    if (!editable) return;
    setInputValue(e.target.value);
  };

  const onSave = () => {
    if (!editable) return;

    setEditable(false);
    updateData(row.index, "reason", value, row, inputValue);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    return setValue(initialValue);
  }, [initialValue]);

  if (id === "attendance")
    return (
      <div className="flex m-auto align-middle justify-center">
        <Switch.Group as="div" className="flex items-center">
          <Switch
            checked={value}
            onChange={() => {
              setValue(!value);
              setEditable(value);
              updateData(row.index, id, !value, row);
            }}
            className={classNames(
              value
                ? "bg-green-500 focus:ring-green-500"
                : "bg-red-500 focus:ring-red-500",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2  focus:ring-offset-2"
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                value ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        </Switch.Group>

        {row.original.displayReason == true && (
          <>
            <div className="flex m-auto align-middle justify-center">
              {editable && (
                <>
                  <div>
                    <div className="mt-1">
                      <input
                        value={inputValue}
                        onChange={onChange}
                        type="text"
                        name="reason"
                        id="reason"
                        className={classNames(
                          editable
                            ? "ring-1 ring-inset ring-gray-300"
                            : "ring-0 ring-inset ring-gray-300",
                          "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        )}
                        placeholder="Enter reason (Optional)"
                        aria-describedby="email-optional"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex m-auto align-middle justify-center">
                {editable && (
                  <>
                    <a onClick={onSave} className="">
                      <svg
                        fill="none"
                        className="w-6 ml-2 h-6 cursor-pointer text-green-400"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </a>{" "}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );

  return value;
};

function DataTable3(props) {
  // dataTableDataR, dataTableColumns

  const data = props.dataTableDataR;
  const { search, total, limit, skip, moveNext, movePrev, changeLimit } = props;
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

  const defaultColumn = {
    Cell: EditableCell,
  };
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
      defaultColumn,
      deleteData: props.deleteData,
      updateData: props.updateData,
      initialState: { pageSize: 100 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="w-full m-auto">
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
              <div className="py-2 align-middle inline-block min-w-full">
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
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                            {row.cells.map((cell, i) => {
                              return (
                                <td
                                  key={i}
                                  {...cell.getCellProps()}
                                  className="px-6 py-4 whitespace-nowrap"
                                >
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
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
              <div className="flex-1 flex justify-between sm:hidden"></div>
              {limit && (
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex gap-x-2">
                    <span className="text-sm text-gray-700">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                      <span className="isolate inline-flex rounded-md shadow-sm">
                        <button
                          type="button"
                          onClick={() => movePrev(limit, limit)}
                          className="cursor-pointer relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <span className="sr-only">First</span>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-5 w-5"
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
                          className="cursor-pointer relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-5 w-5"
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
                          className=" cursor-pointer relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
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
                          className="cursor-pointer relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <span className="sr-only">Last</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
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
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

DataTable3.defaultProps = {
  name: "tableComp",
  showEdit: true,
  showDelete: true,
  showPagination: false,
  heading: "Table Heading",
  subHeading: "Table Sub Heading",
  showReason: false,
  button: {
    //
    text: "Button Text",
    show: true,
  },
  id: "12345",
};

export default DataTable3;
