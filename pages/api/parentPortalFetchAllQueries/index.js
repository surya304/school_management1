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
  const user_id = token.sub;

  // var token='a';

  if (token) {
    const phoneRegExp =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

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
            category_id: req.query.category_id,
            modalName: "",
            condition_obj: {},
            selectionFields_arr: [],
          };
          // Category

          console.log(req.query, "all_fetchQUeries");

          if (req.query.type == "classes") {
            finalobj.modalName = "Klass";
            finalobj.condition_obj = {
              school_id: req.query.school_id,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = ["name", "category_id"];
          } else if (req.query.type == "category") {
            finalobj.modalName = "Category";
            finalobj.condition_obj = {
              school_id: req.query.school_id,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = ["name"];
          } else if (req.query.type == "exams") {
            finalobj.modalName = "Exams";
            finalobj.condition_obj = {
              school_id: req.query.school_id,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = [
              "name",
              "from_date",
              "to_date",
              "from_time",
              "to_time",
              "rowdata",
              "category_id",
              "classes",
            ];
          } else if (req.query.type == "fees") {
            finalobj.modalName = "Fee";
            finalobj.condition_obj = {
              is_active: true,
              is_del: false,
              school_id: req.query.school_id,
            };
            finalobj.selectionFields_arr = [
              "name",
              "category_id",
              "due_date",
              "type",
              "amount",
              "categories",
            ];
          } else if (req.query.type == "events") {
            finalobj.modalName = "Event";
            finalobj.condition_obj = {
              school_id: req.query.school_id,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = [
              ,
              "school_id",
              "name",
              "from_date",
              "to_date",
              "type",
              "exam_id",
            ];
          } else if (req.query.type == "school_subject_data") {
            finalobj.modalName = "Subject";
            finalobj.condition_obj = {
              school_id: req.query.school_id,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = ["name"];
          } else if (req.query.type == "school_student_data") {
            finalobj.modalName = "Student";
            finalobj.condition_obj = {
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = ["first_name", "last_name"];
          } else if (req.query.type == "school_attendance_data") {
            finalobj.modalName = "Student";
            finalobj.condition_obj = {
              is_active: true,
              is_del: false,
              // class_id: req.query.class_id,
              // school_id: req.query.school_id,
              _id: req.query.student_id,
            };

            finalobj.selectionFields_arr = [
              "first_name",
              "last_name",
              "attendance_data",
              "student_personal_id",
            ];
          } else if (req.query.type == "exam_marks_data") {
            finalobj.modalName = "Student";
            finalobj.condition_obj = {
              is_active: true,
              is_del: false,
              class_id: req.query.class_id,
              school_id: req.query.school_id,
            };
            finalobj.selectionFields_arr = [
              "first_name",
              "last_name",
              "key",
              "marks_data",
              "student_personal_id",
            ];
          } else if (req.query.type == "teacher_search") {
            finalobj.modalName = "Teacher";
            finalobj.condition_obj = {
              is_active: true,
              is_del: false,
              school_id: req.query.school_id,
            };
            finalobj.selectionFields_arr = [
              "first_name",
              "last_name",
              "attendance_data",
            ];
          } else if (req.query.type == "justschooldata") {
            finalobj.modalName = "School";
            finalobj.condition_obj = {
              owner_id: req.user_id,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = ["first_name", "last_name"];
          } else if (req.query.type == "justsingleClassdata") {
            finalobj.modalName = "Klass";
            finalobj.condition_obj = {
              _id: req.query.class_id,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
              "school_id",
              "name",
              "category_id",
            ];
          } else if (req.query.type == "getSchool_id") {
            finalobj.modalName = "School";
            finalobj.condition_obj = {
              owner_id: user_id,
            };
            finalobj.selectionFields_arr = ["owner_id"];
          }

          let getObj = {
            modal: finalobj.modalName,
            url: req.url,
            type: "find",
            condition: finalobj.condition_obj,
            selectFields: finalobj.selectionFields_arr,
          };

          console.log(getObj, "<<<<<<<<<<<<<< getObj");
          let finaldata = await fetchRecords(getObj);

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

          req.body.key = x;
          console.log("Body>>>>", req.body);

          await validateBody(req, res);

          const errors = validationResult(req);

          if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
          }

          // Check if Restaurant exists

          let getObj = {
            modal: "Restaurant",
            url: url,
            type: "findOne",
            selectFields: [
              "name",
              "key",
              "address",
              "profile_pic",
              "email",
              "phone",
              "phone_country",
              "latitude",
              "longitude",
            ],
            condition: { owner_id: user_id },
          };

          let placeInfo = await fetchRecords(getObj);

          if (!Array.isArray(placeInfo)) {
            // console.log("Exists");
            // Update Restaurant

            let updateFields = [
              { key: "name", value: req.body.name },
              { key: "address", value: req.body.address },
              { key: "email", value: req.body.email },
              { key: "phone", value: req.body.phone },
              { key: "phone_country", value: req.body.phone_country },
              { key: "latitude", value: req.body.latitude },
              { key: "longitude", value: req.body.longitude },
              { key: "google_place_id", value: req.body.google_place_id },
              { key: "profile_pic", value: req.body.profile_pic },
              { key: "updated_at", value: new Date() },
            ];

            // if (picUrl.length > 0)
            // {
            //    updateFields.push({ key: "profile_pic", value: picUrl });
            // }

            let updateObj = {
              modal: "Restaurant",
              url: url,
              type: "findOne",
              updateFields: updateFields,
              condition: { owner_id: user_id },
              selectFields: [
                "name",
                "key",
                "address",
                "profile_pic",
                "email",
                "phone",
                "phone_country",
                "latitude",
                "longitude",
              ],
            };

            let restInfo = await updateRecord(updateObj);
            res.status(200).json({ success: true, data: restInfo });
          } else {
            let phone_country = "";
            if (req.body.phone.length > 0) {
              phone_country = req.body.phone_country;
            }

            // Create Restaurant
            let restObj = new Restaurant({
              owner_id: user_id,
              name: req.body.name,
              address: req.body.address,
              email: req.body.email,
              phone: req.body.phone,
              phone_country: phone_country,
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              profile_pic: req.body.profile_pic,
              google_place_id: req.body.google_place_id,
              key: req.body.key,

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

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
