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
import randomstring from "randomstring";
import * as moment from "moment";
const momentTZ = require("moment-timezone");
import { v4 as uuidv4 } from "uuid";
import FeePayment from "../../../models/FeePayment";
const fs = require("fs");
const path = require("path");

// export const config = {
//   api: { bodyParser: false },
// };

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {

  const token = await getToken({ req, secret });
  const user_id = token.sub;


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

      case "GET":
        try {


   

          var finalobj = {
            "modalName": "",
            "condition_obj": {

            },
            "selectionFields_arr": [],
            "limit": 10,
            "skip": 0,


          }



          console.log(req.query, "req.query all searchable");

          if (req.query.type == "class_search") {

            finalobj.modalName = "Classes";
            finalobj.condition_obj = { 'school_id': req.query.school_id, "is_del": false, is_active: true, "name": new RegExp(req.query.searchTerm, 'i') };
            finalobj.selectionFields_arr = [
              "name",
            ];


          } else if (req.query.type == "school_subject_search") {
            finalobj.modalName = "Subject";

            finalobj.selectionFields_arr = [
              "name",
            ];
            if (req.query.request_type == "getallData") {

              finalobj.condition_obj = { 'school_id': req.query.school_id, "is_del": false, is_active: true };
              finalobj.limit = req.query.limit;
              finalobj.skip = req.query.skip;

            } else {


              finalobj.condition_obj = { 'school_id': req.query.school_id, "is_del": false, is_active: true, "name": new RegExp(req.query.searchTerm, 'i') };

              finalobj.limit = req.query.limit;
              finalobj.skip = req.query.skip;


            }

            finalobj.modalName = "Subject";
            finalobj.condition_obj = { 'school_id': req.query.school_id, "is_del": false, is_active: true, "name": new RegExp(req.query.searchTerm, 'i') };
            finalobj.selectionFields_arr = [
              "name",
            ];



          } else if (req.query.type == "student_search") {
            finalobj.modalName = "Student";
            finalobj.condition = { $or: [{ "first_name": new RegExp(searchTerm, 'i') }, { "last_name": new RegExp(searchTerm, 'i') }], "is_del": false, is_active: true, }
            finalobj.selectionFields_arr = [
              "first_name",
              "last_name",

            ];


          } else if (req.query.type == "get_students_data") {
            finalobj.modalName = "Student";

            finalobj.selectionFields_arr = [
              "first_name",
              "last_name",
              "key",
              "address",
              "email",
              "phone",
              "blood_group",
              "profile_image",
              "optional_subjects",

              "gender",
              "class_id",
              "category_id",
              "description",
              "father_id",
              "mother_id",
              "guardian_id",
              "student_personal_id"
            ];
            finalobj.populate_arr = [
              // Incase you want to populate inner objects
              { path: "category_id", select: { name: 1 } },
              { path: "father_id", select: { name: 1, email: 1, mobile: 1 } },
              { path: "mother_id", select: { name: 1, email: 1, mobile: 1 } },
              { path: "guardian_id", select: { name: 1, email: 1, mobile: 1 } },
              { path: "optional_subjects", select: { name: 1 }, match: { is_del: false, is_active: true } },

              { path: "class_id", select: { name: 1 } },


            ];

            if (req.query.request_type == "getallData") {

              finalobj.condition_obj = { 'class_id': req.query.class_id, "is_del": false, is_active: true };
              finalobj.limit = req.query.limit;
              finalobj.skip = req.query.skip;

            } else {


              finalobj.condition_obj = { $or: [{ "first_name": new RegExp(req.query.searchTerm, 'i') }, { "last_name": new RegExp(req.query.searchTerm, 'i') }, { "student_personal_id": new RegExp(req.query.searchTerm, 'i') }], 'class_id': req.query.class_id, "is_del": false, is_active: true, }

              finalobj.limit = req.query.limit;
              finalobj.skip = req.query.skip;


            }



          } else if (req.query.type == "get_teachers_data") {
            finalobj.modalName = "Teacher";

            finalobj.selectionFields_arr = [
              "first_name",
              "last_name",
              "email",
              "categories",
              "key",
              "address",
              "profile_pic",
              "blood_group",
              "description",
              "employee_id",
              "mobile",
              "address",
              "gender",
              "subjects",
            ];
            finalobj.populate_arr = [
              // Incase you want to populate inner objects
              { path: "subjects", select: { name: 1 }, match: { is_del: false, is_active: true } },
              { path: "categories", select: { name: 1 }, match: { is_del: false, is_active: true } },


            ];

            if (req.query.request_type == "getallData") {


              finalobj.condition_obj = { 'school_id': req.query.school_id, "is_del": false, is_active: true };
              finalobj.limit = req.query.limit;
              finalobj.skip = req.query.skip;

            } else {


              finalobj.condition_obj = { $or: [{ "first_name": new RegExp(req.query.searchTerm, 'i') }, { "last_name": new RegExp(req.query.searchTerm, 'i') }, { "employee_id": new RegExp(req.query.searchTerm, 'i') }], 'school_id': req.query.school_id, "is_del": false, is_active: true, }

              finalobj.limit = req.query.limit;
              finalobj.skip = req.query.skip;


            }



          } else if (req.query.type == "get_fee_payment") {
            finalobj.modalName = "FeePayment";

            finalobj.selectionFields_arr = [
              "school_id",
              "student_id",
              "class_id",
              "mode",
              "amount",
              "transaction_id",
              "created_at",
              "payment_date",
            ];
            finalobj.populate_arr = [
              // Incase you want to populate inner objects
              { path: "school_id", select: { name: 1 }, match: { is_del: false, is_active: true } },
              { path: "student_id", select: { first_name: 1, last_name: 1 }, match: { is_del: false, is_active: true } },
              { path: "class_id", select: { name: 1 }, match: { is_del: false, is_active: true } },



            ];

            if (req.query.request_type == "getallData") {


              finalobj.condition_obj = { 'school_id': req.query.school_id, "is_del": false, is_active: true };
              finalobj.limit = req.query.limit;
              finalobj.skip = req.query.skip;

            } else {


              finalobj.condition_obj = { $or: [ { "transaction_id": new RegExp(req.query.searchTerm, 'i') }], 'school_id': req.query.school_id, "is_del": false, is_active: true, }

              finalobj.limit = req.query.limit;
              finalobj.skip = req.query.skip;


            }



          }





          let class_obj = {

            "modal": finalobj.modalName,
            "url": req.url,
            "condition": finalobj.condition_obj,
            "selectFields": finalobj.selectionFields_arr,
            "limit": finalobj.limit,
            "skip": finalobj.skip,
            "type": "find",
            "orderBy": "desc",
            "orderByKey": "created_at"

          }



          if ('populate_arr' in finalobj) {

            class_obj["populate"] = finalobj.populate_arr

          }



          console.log(class_obj, "class_obj")
          //   var userObj = {
          //     "modal": "User",
          //     "url": url,
          //     "type": "find",
          //     "skip": skip,
          //     "limit": limit,
          //     "condition": undefined,
          //     "orderBy": orderBy,
          //     "orderByKey": orderByKey
          // }



          let class_list = await fetchRecords(class_obj);

          var vObj = {
            "modal": finalobj.modalName,
            "url": req.url,
            "condition": finalobj.condition_obj
          }

          let countdata = await getCount(vObj);

          console.log(class_list,"class_list")


          var full_finaldata = [];
          if (req.query.type == "get_fee_payment") {

            for (let index = 0; index < class_list.length; index++) {
              const element = class_list[index];
              full_finaldata.push({
                student_name: element.student_id.first_name.concat(element.student_id.last_name),
                mode: element.mode,
                amount: element.amount,
                class_name: element.class_id.name,
                transaction_id: element.transaction_id,
                rawdata:element




              })

            }

          } else {
            full_finaldata = class_list;

          }



          console.log(countdata, "countdata")
          // console.log(finalobj, "finalobj")
          console.log(full_finaldata, "fetchRecords search queries")

          var finaldata = {
            "products": full_finaldata,
            "total": countdata,
            "skip": finalobj.skip,
            "limit": finalobj.limit,
          }
          // console.log(finaldata, "finaldata")

          res.status(200).json({ success: true, data: finaldata });




        } catch (error) {
          console.log(error, "errpr");
          // add error handling
          res.status(500).json({ success: false });
        }

        break;


      case "POST":

        try {

          let url = req.url;

          let x = randomstring.generate({
            length: 12,
            charset: "alphanumeric",
          });


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
