import  Dropdown  from '../components/Dropdown'
import  Button  from '../components/Button'
import  Textarea  from '../components/Textarea'
import { useState, useEffect } from 'react';
import randomstring from "randomstring";


  function getRandomString() {
    let uniqueKey = randomstring.generate({
      length: 12,
      charset: "alphanumeric",
    });

    return uniqueKey
  }




  let formElements =[

  {
    id : getRandomString(),
    name : 'category',
    list : [
      { id: 'primarySchool', name: 'Primary School' },
      { id: 'secondarySchool', name: 'Secondary School' },
      { id: 'middleSchool', name: 'Middle School' },
      { id: 'highSchool', name: 'High School' },
  
    ],
    label: { //
      text: 'Select Category',
      show: true,
    },
  },
  {
    id : getRandomString(),
    name : 'category',
    list : [
      { id: 'primarySchool', name: 'Primary School' },
      { id: 'secondarySchool', name: 'Secondary School' },
      { id: 'middleSchool', name: 'Middle School' },
      { id: 'highSchool', name: 'High School' },
  
    ],
    label: { //
      text: 'Select Class',
      show: true,
    },
  },
  {
    id : getRandomString(),
    name : 'category',
    list : [
      { id: 'primarySchool', name: 'Primary School' },
      { id: 'secondarySchool', name: 'Secondary School' },
      { id: 'middleSchool', name: 'Middle School' },
      { id: 'highSchool', name: 'High School' },
  
    ],
    label: { //
      text: 'Select Students',
      show: true,
    },
  },
  {
    id : getRandomString(),
    name : 'category',
    list : [
      { id: 'primarySchool', name: 'Primary School' },
      { id: 'secondarySchool', name: 'Secondary School' },
      { id: 'middleSchool', name: 'Middle School' },
      { id: 'highSchool', name: 'High School' },
  
    ],
    label: { //
      text: 'Select Teachers',
      show: true,
    },
  },

  {
    name : 'message',
    label: { //
      text: 'Alert Message',
      show: true,
    },
    placeholder: 'Enter here',
    isValidated: false,
    required : true,
    id: getRandomString()
  }

]


let addBtnProps = {
  name : 'buttonComp',

  label: { //
    text: 'Send Alerts',
    show: true
  }

}





let finalObj ={};
  
  function validationHandler(params) {

    // name: props.name,
    // id: props.id,
    // value : inputVal,
    // valid : valid
    
    let formValidated = false;
   
    const result = formElements.filter(element => element.id == params.id)[0];

    if (params.hasOwnProperty('valid')) {
      if (params.valid == true) {
        result.isValidated = true;
        finalObj[params.name] = params.value;
      }
  
      else{
        result.isValidated = false;

        if(finalObj[params.name]){
          finalObj[params.name] = "";
        }
        
      }
    }

    else{
      finalObj[params.name] = params.value;

    }


    const validationResults = formElements.filter(element => element.isValidated == false);


    if (validationResults.length == 0) {

      formValidated = true
      
    }

    return formValidated
  }


 

export default function FeeStructure() {

  const [validate, setValidate] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonLoadingText, setButtonLoadingText] = useState('Loading..')
  const [tableValues, setTableValues] = useState([]);
  const [tableUpdated, setTableUpdated] = useState([]);
  const [ariaInfo, setAriaInfo] = useState([]);
  const [pageCount, setPageCount] = useState(0)


  function checkFields(e) {
 
    e.preventDefault();
    setButtonLoading(true)
    setTableUpdated(false)

    setButtonLoadingText('Adding to Table..')
    setValidate(true)
    
  }

  let setSkip = 0;
  let setLimit = 5;

  const getDummyData = async (skip, limit, pageSize, pageIndex) => {

    console.log(skip, limit);
    const res = await fetch(`https://dummyjson.com/products/?skip=`+skip+`&limit=` + limit)
    const json = await res.json()
    setPageCount(Math.ceil(100 / pageSize))

    return {data: json.products}  
  };


  async function sendData(data) {

    setValidate(false)


    let formValidated = await validationHandler(data)


    if (formValidated == true) {
      // final logic here 
      

      // finalObj
    
 
      setTableValues([...tableValues, { name: finalObj.feeName , amount: finalObj.feeAmount, category: finalObj.category.name }])
  
      setTableUpdated(true)
}

      setButtonLoading(false)
    
  }





  useEffect(() => {
   
    async function fetchData() {

    let data = await getDummyData(setSkip, setLimit);

    console.log(data);

    setAriaInfo(data.data); // sets ariaInfo state

            
    }

    fetchData()

  }, []);






  return (

    

    <div className="text-center">

      <div className="flex min-h-full flex-col justify-center sm:px-6 lg:px-8">

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" >
            

              <Dropdown {...formElements[0]} sendData={sendData} validate={validate}/>
              <Dropdown {...formElements[1]} sendData={sendData} validate={validate}/>
              <Dropdown {...formElements[2]} sendData={sendData} validate={validate}/>
              <Dropdown {...formElements[3]} sendData={sendData} validate={validate}/>
              <Textarea validate={validate} {...formElements[4]} sendData={sendData}/>
              <Button loading={buttonLoading} loadingText={buttonLoadingText} {...addBtnProps} click={(e) => checkFields(e)}/>     

              
              
     


            </form>

 
          </div>
        </div>
      </div>


    </div>
    

  );
}
