
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


function Textarea(props) {


  const [textareaVal, setTextareaVal] = useState(props.data);


    const {
     register,
     trigger,
     setValue,
     formState: { errors },
   } = useForm({
     resolver: zodResolver(props.schema),
   })

  useEffect(() => {

    if(props.data){
      console.log(props.data,"props.data")

      setTextareaVal(props.data)
      setValue("textareaName", props.data);

    }

    if (props.validate) {
      
 
  
      async function fetchData() {
          
        const valid = await trigger('textareaName')

        const textareaReturn = {
          name: props.name,
          id: props.id,
          value : textareaVal,
          valid : valid,
          type:'textarea '
        }

        props.sendData(textareaReturn)

      }      
      fetchData()
            
    }
  }, [props.validate,props.data]);

 

    return (
      <div>

        
            {props.label.show == true && (
                <label htmlFor="comment" className="block text-left text-sm font-medium text-gray-700">
                {props.label.text}
              </label>
          )}
        <div className="mt-1">
          <textarea
            {...register('textareaName')}

            onChange={(e) => setTextareaVal(e.target.value)}
            rows={props.rows}
            disabled={!props.enabled}
            placeholder={props.placeholder}

            className={`block w-full rounded-md shadow-sm sm:text-sm ${
              errors.textareaName
                ? "border-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            value={textareaVal}
          />
          
          {errors.textareaName && <p className="mt-2 text-xs text-red-500">{errors.textareaName.message}</p>}    

        </div>
      </div>
    )
  }


  Textarea.defaultProps = {
  data : '',
  name : 'textareaComp',
  label: { //
    text: 'Name',
    show: true,
  },
  rows : 5,
  enabled: true,
  placeholder: 'Enter name',
  errorMessage: '',
  isValidated: false,
  required : true,
  schema : z.object({
    textareaName: z.string()
    .min(3, { message: 'Min 3 characters' })
    .max(250, { message: 'Max 250 characters' }),
  }),
  id: '12345'
};


export default Textarea
