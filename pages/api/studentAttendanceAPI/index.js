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
import User from "../../../models/User";
import FamilyUser from "../../../models/FamilyUser";



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
          check("first_name")
            .isLength({ min: 3, max: 200 })
            .withMessage("Min 3 Max 200 characters")
            .escape()
            .trim(),
          check("last_name")
            .isLength({ min: 5, max: 200 })
            .withMessage("Min 5 Max 200 characters")
            .escape()
            .trim(),
          check("address")
            .isLength({ min: 5, max: 200 })
            .withMessage("Min 5 Max 200 characters")
            .trim(),
          check('profile_image').isURL()
            .withMessage("Invalid Profile URL")
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
          check("blood_group")
            .isLength({ min: 5, max: 200 })
            .withMessage("Min 5 Max 200 characters")
            .escape()
            .trim(),
          check("gender")
            .isLength({ min: 5, max: 200 })
            .withMessage("Min 5 Max 200 characters")
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

          let getObj = {
            modal: "Student",
            url: url,
            type: "findOne",
            selectFields: [
              "first_name",
              "last_name",
              "key",
              "address",
              "email",
              "phone",
              "blood_group",
              "profile_image",
              "gender",
              "class_id",
              "category_id",
              "father_id",
              "mother_id",
              "guardian_id",


            ],
            populate: [
              // Incase you want to populate inner objects
              { path: "category_id", select: { name: 1 } },
              { path: "father_id", select: { first_name: 1, last_name: 1 } },
              { path: "mother_id", select: { first_name: 1, last_name: 1 } },
              { path: "guardian_id", select: { first_name: 1, last_name: 1 } },

            ],
            condition: { _id: req.body._id },
          };

          let placeInfo = await fetchRecords(getObj);

          if (!Array.isArray(placeInfo)) {
            res.status(200).json({ success: true, placeInfo: placeInfo });
          } else {
            res.status(200).json({ success: true, placeInfo: undefined });
          }


        } catch (error) {
          console.log("Error>>>>", error);
          res.status(400).json({ success: false });
        }
        break;




      case "PUT":



        try {

          let url = req.url;


          if (req.body.type == "update") {
            // console.log("Exists");
            // Update Restaurant


            let updateFields = [
              { key: "updated_at", value: new Date() },
            ];

            var modal_name = '';
            var modal_name;
            let fieldsarr = [];


         if (req.body.update_type == 'student_marks_update') {

              modal_name = "Student";

              fieldsarr = [
                "first_name",

              ];

              // var data21={
              //   "exam_id":"3432d23d3d",
              //   "marks_data":[
              //     {"subject_id":"sad323d23d","marks":"333"}
              //     {"subject_id":"sad323d23d","marks":"333"}
              //   ]

              // }




              var stepObj = {
                "modal": "Student",
                "url": req.url,
                "type": "findOne",
                "condition": { _id: req.body._id },
                selectFields: ["first_name"],

              }

              let getInfo = await fetchRecords(stepObj);


              var arrayVideos = getInfo.marks_data;

              if ('exam_id' in req.body) {

                const dataRemoved = arrayVideos.filter((el) => {
                  return el.exam_id !== req.body.exam_id;
                });

                console.log(dataRemoved, "dataRemoved");

                dataRemoved.push({
                  exam_id: req.body.exam_id,
                  marks_data: req.body.marks_data
                })

                arrayVideos = dataRemoved;
              } else {
                if (arrayVideos) {

                  arrayVideos.push(final_video)
                }

              }




              updateFields.push(
                { "key": "marks_data", "value": arrayVideos },

              )






            } else if (req.body.update_type == 'student_attendance') {
              modal_name = "Student";

              console.log(req.body, '<< data');

              // this scenerio push into array 
              fieldsarr = [
                "first_name",

              ];



              var stepObj = {
                "modal": "Student",
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
                  date_data: req.body.date_data
                }]

                arrayVideos = dataRemoved;
              } else {
                if (arrayVideos) {


                  arrayVideos.push({
                    is_present: req.body.is_present,
                    date_data: req.body.date_data
                  })
                }

              }


  
              updateFields.push(

                { "key": "attendance_data", "value": arrayVideos },


              )


            }




            else {

              // updating student Data 

              modal_name = "Student";

              fieldsarr = [
                "first_name",

              ]

              updateFields.push(
                {
                  key: "first_name", value: req.body.first_name
                }, {
                key: "last_name", value: req.body.last_name

              }



              )
            }


            let updateObj = {
              modal: modal_name,
              url: url,
              type: "findOne",
              updateFields: updateFields,
              condition: { _id: req.body._id },
              selectFields: fieldsarr,
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

      default:
        res.status(400).json({ success: false });
        break;
    }

  } else {
    res.status(400).json({ success: false, message: "Not Authorized" });
  }


}


function createUser(data) {

  return new Promise(function (resolve, reject) {

    let restObj = new FamilyUser({
      category_id: data.category_id,
      first_name: data.first_name,
      email: data.email,
      mobile: data.mobile,
      role: data.role,
      created_at: new Date(),
      updated_at: new Date(),
    });
    callObj.save(function (err, result) {
      if (err) {
        reject(err);

      } else {
        resolve(result._id);

      }
    });



  });


}




function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
