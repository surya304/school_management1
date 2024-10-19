import { React, useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';



function DateTimePicker(props) {


  const [dateTimePickerVal, setDateTimePickerVal] = useState(props.data);

  const [startDate, setStartDate] = useState(props.startDate);
  const [endDate, setEndDate] = useState(props.endDate);


  const onChange = (dates) => {

    console.log(dates, 'dates');

    if (dates.length > 0) {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    }

    else {
      setStartDate(dates);

    }

  };


  useEffect(() => {


    if (props.validate) {

      async function fetchData() {

        const dateTimePickerReturn = {
          // name: props.name,
          // id: props.id,
          // value: { startDate: startDate, endDate: endDate },
          name: props.name,
          id: props.id,
          valid: true,
          value: { startDate: startDate, endDate: endDate },
          type: "datetimepicker"
        }

        props.sendData(dateTimePickerReturn)

      }
      fetchData()

    }
  }, [props.validate]);



  return (

    <div>
       {props.label.show == true && (
          <label
            htmlFor="email"
            className="text-xs font-medium text-gray-700 px-1 text-left"
          >
            {props.label.text}
          </label>
        )}
      <div className="border border-gray-300 appearance-none relative w-full rounded-md placeholder-gray-400  sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

      >




        <div className="calendarWrapper w-full">

          {props.selectionType == 'range' && (

            <div>
              {props.pickerType == 'dateTime' && (

                <DatePicker
                  selected={startDate}
                  onChange={onChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  timeInputLabel="Time:"
                  showTimeInput
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="datePickerStyle mt-2 border-none w-full"

                />
              )}


              {props.pickerType == 'date' && (

                <DatePicker
                  showIcon
                  selected={startDate}
                  onChange={onChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  className="NewPadding border-none w-full"
                  popperPlacement="bottom-end"
                  popperModifiers={[
                    {
                      name: "offset",
                      options: {
                        offset: [1, 1],
                      },
                    },
                    {
                      name: "preventOverflow",
                      options: {
                        rootBoundary: "viewport",
                        tether: false,
                        altAxis: true,
                      },
                    },
                  ]}

                />
              )}


              {props.pickerType == 'time' && (

                <div>
                  <DatePicker
                    showIcon
                    selected={startDate}
                    onChange={onChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    className=" mt-2 border-none w-1/2"

                  />

                  <DatePicker
                    showIcon
                    selected={startDate}
                    onChange={onChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    className=" mt-2 border-none w-1/2"

                  />
                </div>

              )}

            </div>



          )}


          {props.selectionType == 'single' && (

            <div>
              {props.pickerType == 'dateTime' && (

                <DatePicker
                  showIcon
                  selected={startDate}
                  onChange={onChange}
                  startDate={startDate}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="datePickerStyle mt-2 border-none w-full"


                />
              )}

              {props.pickerType == 'date' && (

                <DatePicker
                  showIcon
                  selected={startDate}
                  onChange={onChange}
                  startDate={startDate}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dateFormat="MMMM d, yyyy"
                  className="datePickerStyle border-none w-full "

                />
              )}

              {props.pickerType == 'time' && (

                <DatePicker
                  showIcon
                  selected={startDate}
                  onChange={onChange}
                  showTimeSelectOnly
                  showTimeInput
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="datePickerStyle mt-2 border-none w-full"

                />
              )}
            </div>



          )}





          <style jsx>{`
                .calendarWrapper {
                    display: block;
                    justify-items: center;
                    margin: 0 auto 0 auto;
                    width: 100%;
                    z-index : 999999;
                  }

                  .datePickerStyle{
                    width:100%;
                    border : 3px solid gray;
                    background-color : #000!important;
                    z-index : 999999;

                  }


                  .react-datepicker-popper {
                    z-index: 9999!important;
                }
                .NewPadding{
                  paddint-top:0.4em!important;
                  padding-bottom:0.4em!important;
                }
                      `}</style>
        </div>


      </div>
    </div>


  )
}


DateTimePicker.defaultProps = {
  data: new Date(),
  name: 'datepickerComp',
  pickerType: 'dateTime', // date, time, dateTime
  selectionType: 'range', //range, single
  startDate: new Date(),
  endDate: new Date(),
  label: { //
    text: 'Pick a Date and Time',
    show: true,
    position: 'top',
  },
  enabled: true,
  errorMessage: '',
  isValidated: false,
  required: true,
  id: '12345'
};


export default DateTimePicker
