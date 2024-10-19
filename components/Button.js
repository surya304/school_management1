import {PlusIcon} from "@heroicons/react/20/solid";
function Button(props) {


  function buttonClicked(){

    if(props.enabled == true){
        // buttonTrigger()
    }
}




  return (
    <>

      <button
        type="button" onClick={props.click}
        className="text-md inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {props.loading == false && (

        <div className="flex">


        {props.icon.show == true && (
        <props.icon.icon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />

        )}

              {props.label.show == true && (

                <span>
              {props.label.text}

              </span>
                            )}

              </div>

        )}



        {props.loading == true && (

            <span className="flex">
              <svg
              className="animate-spin ml-3 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            {props.loadingText}
            </span>


        )}
      </button>
    </>
  )
  }


  Button.defaultProps = {
  name : 'buttonComp',
  icon: {
    show: false,
    icon: PlusIcon,
  },
  label: { //
    text: 'This is Button',
    show: true,

  },
  enabled: true,
  errorMessage: '',
  id: '12345'
};


export default Button
