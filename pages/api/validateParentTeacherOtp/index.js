import dbConnect from "../../../lib/dbConnect";
import { fetchRecords } from "../../../lib/genericController";
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {

    const { method } = req;

    await dbConnect();

    switch (method) {
      case "POST":

        let url = req.url;

        const code = req.body.code;
        const mobile = req.body.mobile;

        let userModel = 'Teacher'
        if(req.body.role == 'parent'){
              userModel = 'FamilyData'
        } 

        console.log("Body>>>>", req.body);

         let checkObj = {
           modal: userModel ,
           url: url,
           type: "findOne",
           selectFields: ["first_name" , "otp_expires", "otp"],
           condition: {
             mobile: mobile,
             
             
           },
         };

        const userInfo = await fetchRecords(checkObj);

 
           try {
            

            // console.log("userInfo>>>>>>", userInfo);

            let currentDate = new Date();

               if (userInfo.otp_expires >= currentDate) {
                res.status(200).json({
                  success: true,
                  otp_expired: false,
                });
              } else {
                res.status(200).json({
                  success: true,
                  otp_expired: true,
                });
              }
             
          } catch (error) {
            console.log("Error>>>>", error);
            res.status(400).json({ success: false });
          }
         
       
        break;

      default:
        res.status(400).json({ success: false });
        break;
    }
  
}
