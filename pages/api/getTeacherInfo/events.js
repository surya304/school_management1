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
import Subject from "../../../models/Subject";
import Teacher from "../../../models/Teacher";
import Student from "../../../models/Student";

import randomstring from "randomstring";
import * as moment from "moment";
const momentTZ = require("moment-timezone");
import { v4 as uuidv4 } from "uuid";
const fs = require("fs");
const path = require("path");
const ObjectId = require("mongodb").ObjectId;

// export const config = {
//   api: { bodyParser: false },
// };

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  const user_id = token.sub;
console.log(user_id , "<<<user_id");
  if (token) {
    await dbConnect();

    const { method, url } = req;

    switch (method) {
      case "GET":
        try {
          let schoolId;
          var finalobj = {
            category_id: req.query.category_id,
            modalName: "",
            condition_obj: {},
            selectionFields_arr: [],
          };

          let restObj = {
            modal: "Teacher",
            url: url,
            type: "findById",
            selectFields: ["_id", "school_id", "categories", "subjects"],
 
            id: user_id,
          };

          let teacherInfo = await fetchRecords(restObj);

          console.log(teacherInfo, "teacherInfo");

          schoolId = new ObjectId(teacherInfo.school_id._id).toString();

          console.log(req.query, "all_fetchQUeries");

          if (req.query.type == "exams") {
            finalobj.modalName = "Exams";

            finalobj.condition_obj = {
              category_id: { $in: teacherInfo.categories },
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
          } else if (req.query.type == "events") {
            finalobj.modalName = "Event";
            finalobj.condition_obj = {
              school_id: schoolId,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = [
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
              _id: { $in: teacherInfo.subjects },
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = ["name"];
          } else if (req.query.type == "category") {
            finalobj.modalName = "Category";
            finalobj.condition_obj = {
              _id: { $in: teacherInfo.categories },
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = ["name"];
          }

          let getObj = {
            modal: finalobj.modalName,
            url: url,
            type: "find",
            condition: finalobj.condition_obj,
            selectFields: finalobj.selectionFields_arr,
          };

          console.log(getObj, "getObj>>>>");

          let finaldata = await fetchRecords(getObj);

          res.status(200).json({ success: true, data: finaldata });
        } catch (error) {
          console.log(error, "errpr");
          // add error handling
          res.status(500).json({ success: false });
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
