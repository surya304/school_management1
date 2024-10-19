




import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


function Input(props) {


  const [inputVal, setInputVal] = useState(props.data);



    const {
     register,
     trigger,
     setValue,
     formState: { errors },
   } = useForm({
     resolver: zodResolver(props.schema),
   })

  useEffect(() => {


    if(props){
      setInputVal(props.data)
      // setValue("inputFieldName", props.data);

    }

    if (props.validate) {

      async function fetchData() {



        const valid = await trigger('inputFieldName')





        const inputReturn = {
          name: props.name,
          id: props.id,
          value : inputVal,
          valid : valid,
          type:"input"

        }

        props.sendData(inputReturn)


        // if(props.required == false){
        //   inputReturn.valid = true;

        // }



      }
      fetchData()

    }
  }, [props.validate,,props.data]);



    return (
      <div>
       


          <div className="">
          {props.label.show == true && (
                <label
                htmlFor="email"
                className="text-sm font-medium text-gray-600"
                >
              {props.label.text}
            </label>
          )}
              <input
                type={props.type}
                {...register('inputFieldName')}
                placeholder={props.placeholder}
                name="inputFieldName"
                className={`block w-full px-2 py-2 border rounded-md shadow-sm placeholder-gray-400  sm:text-md ${
                  errors.inputFieldName
                    ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)
                }
              />
              {errors.inputFieldName && <p className="mt-1 text-xs text-red-500">{errors.inputFieldName.message}</p>}

          </div>
        {/* </div> */}
      </div>
    )
  }


Input.defaultProps = {
  name : 'inputComp',
  type: 'text',
  icon: {
    show: true,
    position: 'left',
  },
  label: { //
    text: 'Name',
    show: true,
    position: 'top',
  },
  enabled: true,
  placeholder: 'Enter name',
  errorMessage: '',
  isValidated: false,
  required : true,
  schema : z.object({
    inputFieldName: z.string({
      required_error: "Value is required",
      invalid_type_error: "Value must be a text",
    })
    .min(3, { message: 'Min 3 characters' })
    .max(40, { message: 'Max 40 characters' }),
  }),
  id: '12345'
};


export default Input
