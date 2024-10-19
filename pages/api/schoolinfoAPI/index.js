import dbConnect from "../../../lib/dbConnect";
import {
  fetchRecords,
  updateRecord,
  
  generateV4ReadSignedUrl,
  getCount

} from "../../../lib/genericController";
import { getToken } from "next-auth/jwt";
import initMiddleware from "../../../lib/initMiddleware";
import validateMiddleware from "../../../lib/validateMiddleware";
import { check, body, checkSchema, validationResult } from "express-validator";
import formidable from "formidable";
import School from "../../../models/School";
import randomstring from "randomstring";
import * as moment from "moment";
const momentTZ = require("moment-timezone");
import { v4 as uuidv4 } from "uuid";
const fs = require("fs");
const path = require("path");

// export const config = {
//   api: { bodyParser: false },
// };




const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
 

  const token = await getToken({ req, secret });

  if(!token){
  
    res.status(400).json({ success: false, message: "Not Authorized" });
  }

  

  if (token) {
    const user_id = token.sub;

    const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    const validateBody = initMiddleware(
      validateMiddleware(
        [
          check("name")
            .isLength({ min: 3, max: 200 })
            .withMessage("Min 3 Max 200 characters")
            .escape()
            .trim(),
          check("address")
            .isLength({ min: 5, max: 200 })
            .withMessage("Min 5 Max 200 characters")
            .escape()
            .trim(),
          check("latitude")
            .isLength({ min: 4, max: 50 })
            .withMessage("Invalid Latitude")
            .escape()
            .trim(),
          check("longitude")
            .isLength({ min: 4, max: 50 })
            .withMessage("Invalid Longitude")
            .escape()
            .trim(),
          check("email")
            .optional({ checkFalsy: true })
            .escape()
            .trim()
            .isEmail()
            .withMessage("Invalid Email"),
          check("phone1")
            .matches(phoneRegExp)
            .optional({ checkFalsy: true })
            .withMessage("Invalid Phone Number"),
          check("phone2")
            .matches(phoneRegExp)
            .optional({ checkFalsy: true })
            .withMessage("Invalid Phone Number"),
          check("description")
            .isLength({ min: 5, max: 200 })
            .withMessage("Min 5 Max 200 characters")
            .escape()
            .trim(),
          check("key").custom((value) => {
            return Restaurant.findOne({ key: value }).then((user) => {
              if (user) {
                return Promise.reject("Unique Key already in use");
              }
            });
          }),
        ],
        validationResult
      )
    );

    await dbConnect();

    const { method } = req;

    switch (method) {

      case "GET":
        try {

          let url = req.url;
          console.log("user_id>>>>", user_id);


          var vObj = {
            modal: "School",
            "url": req.url,
            "condition": {
              owner_id :user_id
            }
          }

          let countdata = await getCount(vObj);
          console.log(countdata,"countdata")
        

          if(countdata == 1){

            let getObj = {
              modal: "School",
              url: url,
              type: "findOne",
              selectFields: [
                "name",
                "logo",
                "address",
                "phone1",
                "phone2",
                "email",
                "googleMaps_url",
                "description"
              ],
              condition: { owner_id: user_id },
            };
  
            let placeInfo = await fetchRecords(getObj);
            console.log(placeInfo,"placeInfo")
  
  
  
  
  
      
            res.status(200).json({ success: true, data: placeInfo });
  
          }else{
            res.status(200).json({ success: true, data: "nodata" });

          }




        } catch (error) {
          console.log("Error>>>>", error);
          res.status(400).json({ success: false });
        }
        break;


      case "POST":

        try {

          let url = req.url;

          let x = randomstring.generate({
            length: 12,
            charset: "alphanumeric",
          });

          req.body.key = x;
          console.log("Body>>>>", req.body);


     
     


          let restObj = new School({
            owner_id: user_id,
            name: req.body.schoolname,
            logo: req.body.logo,
            description: req.body.description,
            address: req.body.address,
            phone1: req.body.phone1,
            phone2: req.body.phone2,
            email: req.body.email,
            googleMaps_url: req.body.googleMaps_url,
            created_at: new Date(),
            updated_at: new Date(),
          });

          restObj.save(async function (err2, result) {
            if (err2) {
              console.log("Error 2>>>>", err2);
              res.status(500).json({ success: false });
            } else {
              res.status(200).json({ success: true, data: result });
            }
          });






          // });
        } catch (error) {
          console.log("Error>>>>", error);
          res.status(400).json({ success: false });
        }

        break;


      case "PUT":

        try {

          let url = req.url;


            // console.log("Exists");
            // Update Restaurant



      
            let updateFields = [
              { key: "name", value: req.body.schoolname },
              { key: "logo", value: req.body.logo },
              { key: "description", value: req.body.description },
              { key: "address", value: req.body.address },
              { key: "phone1", value: req.body.phone1 },
              { key: "phone2", value: req.body.phone2 },
              { key: "email", value: req.body.email },
              { key: "googleMaps_url", value: req.body.googleMaps_url },
              { key: "updated_at", value: new Date() },
            ];



            let updateObj = {
              modal: "School",
              url: url,
              type: "findOne",
              updateFields: updateFields,
              condition: { owner_id: user_id },
              selectFields: [
                "name",
                "logo",
                "address",
                "phone1",
                "phone2",
                "email",
                "googleMaps_url",
                "description"

              ],
            };

            let restInfo = await updateRecord(updateObj);
            res.status(200).json({ success: true, data: restInfo });



          // });
        } catch (error) {
          console.log("Error>>>>", error);
          res.status(400).json({ success: false });
        }

        break;



        

      default:

        res.status(400).json({ success: false });
        break;
    }

  } else {
    res.status(400).json({ success: false, message: "Not Authorized" });
  }


}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
