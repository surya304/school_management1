import dbConnect from "../../../lib/dbConnect";
import {
  fetchRecords,
  updateRecord,
  
  generateV4ReadSignedUrl, 
} from "../../../lib/genericController";
import { getToken } from "next-auth/jwt";
import initMiddleware from "../../../lib/initMiddleware";
import validateMiddleware from "../../../lib/validateMiddleware";
import { check, body, checkSchema, validationResult } from "express-validator";
import formidable from "formidable";
// import Restaurant from "../../../models/Restaurant";
import randomstring from "randomstring";
import * as moment from "moment";
const momentTZ = require("moment-timezone");
import { v4 as uuidv4 } from "uuid";
import { log } from "console";
const fs = require("fs");
const path = require("path");

// export const config = {
//   api: { bodyParser: false },
// };

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {

  // const token = await getToken({ req, secret });
  // const user_id = token.sub;

  const token = 'a';

  if (token) {

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
          check("phone")
            .matches(phoneRegExp)
            .optional({ checkFalsy: true })
            .withMessage("Invalid Phone Number"),
          check("phone_country")
            .isLength({ min: 2, max: 5 })
            .optional({ checkFalsy: true })
            .withMessage("Invalid Country Code"),
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





        
      case "PUT":

      try {

        let url = req.url;

        if (req.body.type == "update") {


        
        let updateFields = [
          { key: "first_name", value: req.body.teacher_first_name },
          { key: "last_name", value: req.body.teacher_last_name },
          { key: "updated_at", value: new Date() },
        ];
        let updateObj = {
          modal: "Teacher",
          url: url,
          type: "findOne",
          updateFields: updateFields,
          condition: { owner_id: req.body._id },
          selectFields: [
            "first_name",
      
          ],
        };

        let restInfo = await updateRecord(updateObj);
        res.status(200).json({ success: true, data: restInfo });

      }
        if (req.body.type == "delete") {
          // console.log("Exists");
          // Update Restaurant

          let updateFields = [
            { key: "is_del", value: true },
            { key: "is_active", value: false },
            { key: "updated_at", value: new Date() },
          ];
          let updateObj = {
            modal: "Teacher",
            url: url,
            type: "findOne",
            updateFields: updateFields,
            condition: { _id: req.body._id },
            selectFields: [
              "is_del",
              "is_active"

            ],
          };

          let restInfo = await updateRecord(updateObj);
          res.status(200).json({ success: true, data: restInfo });


        } 


        if (req.body.type == "update_teacher_attendance") {

          
          console.log(req.body, '<< data');

          var stepObj = {
            "modal": "Teacher",
            "url": req.url,
            "type": "findOne",
            "condition": { _id: req.body._id },
            selectFields: ["first_name", "attendance_data"],

          }

          let getInfo = await fetchRecords(stepObj);


          var arrayVideos = getInfo.attendance_data;

          if ('attendance_id' in req.body) {

            let dataRemoved = arrayVideos.filter((el) => {
              return el._id !== req.body.attendance_id;
            });
 
            dataRemoved = [{
              is_present: req.body.is_present,
              date_data: req.body.date_data,
              reason : req.body.reason
            }]

            arrayVideos = dataRemoved;
          } 
          
        
          
          else {
            if (arrayVideos) {

              arrayVideos.push({
                is_present: req.body.is_present,
                date_data: req.body.date_data,
                reason : req.body.reason

              })
            }

          }


          console.log(arrayVideos, 'arrayVideos');

          let updateFields = [
            { "key": "attendance_data", "value": arrayVideos },

          ]



          

          let updateObj = {
            modal: "Teacher",
            url: url,
            type: "findOne",
            updateFields: updateFields,
            condition: { _id: req.body._id },
            selectFields: [
              "is_del",
              "is_active"

            ],
          };

          let restInfo = await updateRecord(updateObj);
          res.status(200).json({ success: true, data: restInfo });





        }

        // });
      } catch (error) {
        console.log("Error>>>>", error);
        res.status(400).json({ success: false });
      }

      break;


      case "DELETE":

      try {



        // Check if Restaurant exists 



        // console.log("Exists");
        // Update Restaurant

        var updateFields;

        updateFields = [
          { key: "is_del", value: true },
          { key: "is_active", value: false },

          { key: "updated_at", value: new Date() },
        ];





        let updateObj = {
          modal: "Teacher",
          url: req.url,
          type: "findOne",
          updateFields: updateFields,
          condition: { _id: req.body._id },
          selectFields: [
     
            "is_del",

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
