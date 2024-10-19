
import {XCircleIcon} from "@heroicons/react/20/solid";


function AlertMsg(props) { 

      return (

        <div>

        {props.openAlertMsg == true && (

        <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h2 className="text-sm font-medium text-red-800">{props.heading}</h2>
            <h3 className="text-sm font-medium text-red-800">{props.subHeading}</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                       {props.list.map((item) => (
  
                          <li>{item}</li>
  
                    ))}
  
  
              </ul>
            </div>
  
          </div>
        </div>
      </div>
        )}
        </div>
    )
  }


  AlertMsg.defaultProps = {
  heading : 'This is heading',
  subHeading: 'This is subheading',
  list : [ 
    'List item 1',  
    'List item 2',  
    'List item 3',  
  ],
};


export default AlertMsg
