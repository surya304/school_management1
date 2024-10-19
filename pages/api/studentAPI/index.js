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
import User from "../../../models/User";
import FamilyData from "../../../models/FamilyData";
import Student from "../../../models/Student";




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

  // const token = await getToken({ req, secret });
  // const user_id = token.sub;

  const token = 'asdsa';
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


          console.log(req.query, "studentAPI")

          let url = req.url;

          let getObj = {
            modal: "Student",
            url: url,
            type: "find",
            selectFields: [
              "first_name",
              "last_name",
              "key",
              "address",
              "email",
              "phone",
              "description",
              "blood_group",
              "profile_image",
              "optional_subjects",
              "gender",
              "class_id",
              "category_id",
              "father_id",
              "mother_id",
              "guardian_id",
              "student_personal_id"


            ],
            populate: [
              // Incase you want to populate inner objects
              { path: "category_id", select: { name: 1 } },
              { path: "optional_subjects", select: { name: 1 }, match: { is_del: false, is_active: true } },
              { path: "class_id", select: { name: 1 } },


            ],
            condition: { class_id: req.query.class_id },
          };

          let placeInfo = await fetchRecords(getObj);

          console.log(placeInfo, "asds")

          res.status(200).json({ success: true, data: placeInfo });

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

          var finalobj = {

            category_id: req.body.category_id,
            school_id: req.body.school_id,


          }

    


          let studentfinalobj = new Student(
            {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              phone: req.body.phone,
              address: req.body.address,
              key: req.body.key,
              profile_image: req.body.image_url,
              description: req.body.description,
              gender: req.body.gender,
              student_personal_id: req.body.student_id,
              category_id: req.body.category_id,
              school_id: req.body.school_id,
              class_id: req.body.class_id,
              created_at: new Date(),
              updated_at: new Date(),
            }
          );


          studentfinalobj.save(async function (err2, result21) {
            if (err2) {
              console.log("Error 2>>>>", err2);
              res.status(500).json({ success: false });
            } else {


              res.status(200).json({ success: true, data: result21 });
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



   
          var fieldsarr;

          console.log(req.body, "req.body studentAPI  put request") ;
          

          let updateObj = {
            modal: "Student",
            url: url,
            type: "findOne",
            condition: { _id: req.body._id },
            selectFields: [
              "first_name",

            ],
          };

         if (req.body.type == "delete"){

        updateObj.updateFields = [
          { key: "is_active", value: false },
          { key: "is_del", value: true },
          { key: "updated_at", value: new Date() },
        ];


          }else
          
          
          {
            // personal info
            finalobj.modal = "Student";




          updateObj.updateFields = [
            {
              key: "first_name", value: req.body.first_name
            }, {
            key: "last_name", value: req.body.last_name

          }, {
            key: "address", value: req.body.address

          }, {
            key: "email", value: req.body.email

          }, {
            key: "optional_subjects", value: req.body.optional_subjects

          }
            , {
              key: "phone", value: req.body.phone

            }
            , {
              key: "profile_image", value: req.body.profile_image

            }, {
            key: "gender", value: req.body.gender

          }, {
            key: "description", value: req.body.description

          }, {
            key: "student_personal_id", value: req.body.student_id

          }, {
            key: "class_id", value: req.body.class_id

          }
        ];


     

          }

       


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


async function uploadCSV(data) {



  await Promise.all(data.finaldata.map(async function (item) {
    var category_id = data.category_id;
    var school_id = data.school_id;

    var finalobj = {

      category_id: category_id,
      school_id: school_id,


    }

    var father_id = '';
    var mother_id = '';
    var guardian_id = '';
    let x = randomstring.generate({
      length: 12,
      charset: "alphanumeric",
    });


    let studentfinalobj = new Student(
      {
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        phone: item.phone,
        address: item.address,
        key: x,
        profile_image: item.image_url,
        description: item.description,
        gender: item.gender,
        student_personal_id: item.student_personal_id,
        school_id: school_id,
        class_id: item.class_id,
        created_at: new Date(),
        updated_at: new Date(),
      }
    );


    try {
      await studentfinalobj.save();
      console.log("Record saved successfully!");

    } catch (err) {
      console.log("Error saving record: ", err);
      throw err;
      return false;
    }
  }));

  return true;

}


