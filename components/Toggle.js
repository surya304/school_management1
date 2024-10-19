import { Switch } from '@headlessui/react'
import { useEffect, useState } from "react";


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


function Toggle(props) {

  const [toggleEnabled, setToggleEnabled] = useState(props.enabled)
  const [errorMsg, setErrorMsg] = useState(props.errorMessage)



  useEffect(() => {
   

    if (props.validate) {
  
      async function fetchData() {
          

        const toggleReturn = {
          name: props.name,
          id: props.id,
          value : toggleEnabled,
        }

        props.sendData(toggleReturn)

      }      
      fetchData()
            
    }
  }, [props.validate]);

 

    return (
      <>
      <Switch.Group as="div" className="flex items-center">
        <Switch
          checked={toggleEnabled}
          onChange={() => setToggleEnabled(!toggleEnabled)}
          className={classNames(
            toggleEnabled ? 'bg-indigo-600' : 'bg-gray-200',
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              toggleEnabled ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch>
        {props.label.show == true && (
          <Switch.Label as="span" className="ml-3">
            {toggleEnabled == true ? <span className="text-sm font-medium text-gray-900">{props.label.textEnabled}</span> :  <span className="text-sm font-medium text-gray-900">{props.label.textDisabled}</span>
  
        }
          </Switch.Label>
  
        )}
  
      </Switch.Group>
      {errorMsg.length > 0 && ( <small>{errorMsg}</small>
    )}
    </>
    )
  }


  Toggle.defaultProps = {
  name : 'toggleComp',
  label: { //
    text: 'Name',
    show: true,
    textEnabled: 'enabled',
    textDisabled: 'disabled',
  },
  enabled: true,
  errorMessage: '',
  isValidated: false,
  required : true,
  id: '12345'
};


export default Toggle

