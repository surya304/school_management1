import trackEvent from "./trackEventFrontend"
const hubspot = require("@hubspot/api-client");

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_API_KEY,
});


const platformsList = [
  {
    id: "hubspot",
    send: true,
  },
  {
    id: "mixpanel",
    send: true,
  },
  {
    id: "slack",
    send: false,
  },
];


const sendLeads = (fname, lname, email, uid, role) => {

  console.log("fname>>>>", fname);
  console.log("lname>>>>", lname);
  console.log("email>>>>", email);
  console.log("uid>>>>", uid);
  console.log("role>>>>", role);
  
  const selectedPlatforms = platformsList.filter(e => e.send == true)
  
  if (selectedPlatforms.length > 0) {

    for (const iterator of selectedPlatforms) {
        
      if (iterator.id == "hubspot" && role != "waiter")
      {
        sendInfoToHubSpot(fname, lname, email, role);
      }

      if (iterator.id == "slack" && role != "waiter") {
        sendInfoToSlack(fname, lname, email, role);
      }

      if (iterator.id == "mixpanel" && role!= "waiter") {
         sendInfoToMixpanel(fname, lname, email, uid, role);
      }
       
    }

  }

}





 async function sendInfoToHubSpot(fname, lname, email, role) {

   
   const BatchInputSimplePublicObjectInput = { inputs: [{"properties":{"email":email,"firstname":fname,"lastname":lname}}] };

    try {
      const apiResponse = await hubspotClient.crm.contacts.batchApi.create(BatchInputSimplePublicObjectInput);
      console.log(JSON.stringify(apiResponse.body, null, 2));
    } catch (e) {
      e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)
    }
   
  //  }
 }


function sendInfoToMixpanel(fname, lname, email, uid, role) {
  try {
    let properties = {
      type: "Account Created",
      user_actual_id: uid,
      first_name: fname,
      last_name: lname,
      email: email,
      created_time: new Date(),
    };

    trackEvent("Account Created", properties);
  } catch (error) {
    console.log("error>>>>", error);
  }
}


 function sendInfoToSlack(fname, lname, email, role) {
   if (process.env.NODE_ENV == "production") {
     let message =
       "Name: " +
       fname +
       " " +
       lname +
       "\nEmail: " +
       email +
       "\nContext: Created New Personalization Account";

     try {
       const requestOptions = {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         json: {
           text: message,
         },
       };

       fetch(process.env.SLACK_USER_SIGNUP, requestOptions)
         .then((response) => response.json())
         .then((data) => {
           console.log("Data from HubSpot>>>>", data);
         });
     } catch (error) {
       console.log("error>>>>", error);
     }
   }
 }



module.exports = sendLeads;
