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

  if (token) {
    const user_id = token.sub;

    await dbConnect();

    const { method, url, query } = req;
    //let selectedStudentId = query.schoolId;

    const selectedStudentId = query.cur_std;
    switch (method) {
      case "GET":
        try {
          let schoolId;
          let categoryId;
          let classId;
          let curStudentInfo;
          var finalobj = {
            category_id: req.query.category_id,
            modalName: "",
            condition_obj: {},
            selectionFields_arr: [],
            populate_arr: [],
          };

          if (req.query.type != "parentskid") {

            console.log("Code is here>>>");
            let restObj = {
              modal: "Student",
              url: url,
              type: "findById",
              selectFields: [
                "school_id",
                "category_id",
                "subjects",
                "class_id",
              ],

              populate: [
                // Incase you want to populate inner objects
                { path: "school_id", select: { name: 1, _id: 2 } },
                { path: "category_id", select: { name: 1, _id: 2 } },
                { path: "class_id", select: { name: 1, _id: 2 } },
              ],
              id: selectedStudentId,
            };

            let curStudentInfo = await fetchRecords(restObj);

            console.log("curStudentInfo>>>>>", curStudentInfo);

            schoolId = new ObjectId(curStudentInfo.school_id._id).toString();

            if (curStudentInfo.hasOwnProperty('category_id'))
            {
               categoryId = new ObjectId(
                 curStudentInfo.category_id._id
               ).toString();
            }
             
            classId = new ObjectId(curStudentInfo.class_id._id).toString();

            console.log("schoolId", schoolId);
            console.log("categoryId", categoryId);
            console.log("classId", classId);
          }

          if (req.query.type == "exams") {
            finalobj.modalName = "Exams";

            finalobj.condition_obj = {
              classes: classId,
              is_active: true,
              is_del: false,
            };
            // finalobj.condition_obj = {
            //   category_id:   categoryId,
            //   is_active: true,
            //   is_del: false,
            // };
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
              //   category_id:  categoryId , change this later to school id
              school_id: schoolId,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = ["name"];
          } else if (req.query.type == "curstudent_clasees") {
            finalobj.modalName = "Klass";
            finalobj.condition_obj = {
              _id: classId,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = [
              "name",
              "school_id",
              "category_id",
              "subjects",
              "optional_subjects",
              "is_del",
              "is_active",
            ];

            finalobj.populate_arr = [
              // Incase you want to populate inner objects
              {
                path: "subjects",
                select: { name: 1 },
                match: { is_del: false, is_active: true },
              },
              {
                path: "optional_subjects",
                select: { name: 1 },
                match: { is_del: false, is_active: true },
              },
              {
                path: "category_id",
                select: { name: 1 },
                match: { is_del: false, is_active: true },
              },
            ];
          } else if (req.query.type == "category") {
            finalobj.modalName = "Category";
            finalobj.condition_obj = {
              _id: categoryId,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = ["name"];
          } else if (req.query.type == "attendance_data") {
            finalobj.modalName = "Student";
            finalobj.condition_obj = {
              is_active: true,
              is_del: false,
              _id: selectedStudentId,
            };
            finalobj.selectionFields_arr = [
              "first_name",
              "last_name",
              "school_id",
              "attendance_data",
              "student_personal_id",
            ];
          } else if (req.query.type == "parentskid") {
            finalobj.modalName = "Student";
            finalobj.condition_obj = {
              $or: [
                { guardian_id: user_id },
                { father_id: user_id },
                { mother_id: user_id },
              ],
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = [
              "first_name",
              "guardian_id",
              "father_id",
              "mother_id",
              "category_id",
              "class_id",
              "school_id",
            ];
          } else if (req.query.type == "exam_marks_data") {
            finalobj.modalName = "Student";
            finalobj.condition_obj = {
              is_active: true,
              is_del: false,
              _id: selectedStudentId,
              // class_id : req.query.class_id,
              // school_id:req.query.school_id,
            };
            finalobj.selectionFields_arr = [
              "first_name",
              "last_name",
              "key",
              "marks_data",
              "student_personal_id",
            ];
          }

          console.log("Final Object>>>");

          let getObj = {
            modal: finalobj.modalName,
            url: url,
            type: "find",
            condition: finalobj.condition_obj,
            selectFields: finalobj.selectionFields_arr,
            // populate:finalobj.populate_arr
          };

          if (finalobj.populate_arr.length > 0) {
            getObj["populate"] = finalobj.populate_arr;
          }

          console.log( "getObj>>>>", getObj);

          let finaldata = await fetchRecords(getObj);

          res.status(200).json({ success: true, data: finaldata });
        } catch (error) {
          console.log(error, "errpr");
          // add error handling
          res.status(500).json({ success: false, message: error });
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
