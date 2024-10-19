import dbConnect from "../../../lib/dbConnect";
import {
  fetchRecords,
  updateRecord,
  
  generateV4ReadSignedUrl,
} from "../../../lib/genericController";
import { getToken } from "next-auth/jwt";
import initMiddleware from "../../../lib/initMiddleware";
import validateMiddleware from "../../../lib/validateMiddleware";
import { check, validationResult } from "express-validator";
import Klass from "../../../models/Klass";
import Exam from "../../../models/Exam";
import ExamMark from "../../../models/ExamMark";
import Student from "../../../models/Student";
import Teacher from "../../../models/Teacher";

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

  if (token) {
    const validateBody = initMiddleware(
      validateMiddleware(
        [
          check("mode")
            .isLength({ min: 3, max: 40 })
            .withMessage("Min 3 Max 40 characters")
            .escape()
            .trim(),
          check("amount")
            .isLength({ min: 1, max: 40 })
            .withMessage("Min 1 Max 40 characters")
            .escape()
            .trim(),
        ],
        validationResult
      )
    );

    await dbConnect();

    const { method } = req;

    switch (method) {

      case "POST":
        try {
          

            console.log("Data from POST>>>>>\n", req.body);
            let type = req.body.type 
            let url = req.url; 
                
            if (type == "timetable") {
               
                 let updateFields = [
                   { key: "monday", value: req.body.monday },
                   { key: "tuesday", value: req.body.tuesday },
                   { key: "wednesday", value: req.body.wednesday },
                   { key: "thursday", value: req.body.thursday },
                   { key: "friday", value: req.body.friday },
                   { key: "saturday", value: req.body.saturday },
                   { key: "sunday", value: req.body.sunday },
                   { key: "updated_at", value: new Date() },
                 ];
                
                 let updateObj = {
                   modal: "Klass",
                   url: url,
                   type: "findById",
                   updateFields: updateFields,
                   id:req.body.class_id, 
                   selectFields: [
                     "name"
                   ],
                 };
               

                 let timeTable = await updateRecord(updateObj);

                 res.status(200).json({ success: true });
                    
            }

            if (type == "exams") {

               let updateFields = [
                 { key: "rowdata", value: req.body.data },
                 { key: "updated_at", value: new Date() },
               ];

               let updateObj = {
                 modal: "Exams",
                 url: url,
                 type: "findById",
                 updateFields: updateFields,
                 id: req.body.exam_id,
                 selectFields: ["name"],
               };

               let examsInfo = await updateRecord(updateObj);

               res.status(200).json({ success: true });

            }

            if (type == "marks") {

              for (const iterator of req.body.data) {

                // Get existing Student Data 
                let studObj = {
                  modal: "Student",
                  url: url,
                  type: "findById",
                  id: iterator.student_id,
                  selectFields: [
                    "first_name",
                    "last_name",
                    "student_personal_id",
                    "marks_data",
                  ],
                };

                let studentInfo = await fetchRecords(studObj);

                let currentMarks = studentInfo.marks_data

                console.log("studentInfo>>>>>", studentInfo);
                console.log("currentMarks before>>>>>", currentMarks);

                let index = currentMarks.findIndex((e) => e.exam_id == req.body.exam_id);

                console.log("index>>>>>", index);
                if (index != -1)
                {
                    // Update Data 
                    currentMarks[index].marks_data = iterator.marks;
                }
                else
                {
                   // Insert Data 

                    currentMarks.push({
                      exam_id: req.body.exam_id,
                      marks_data: iterator.marks,
                    });
                
                }


                console.log("currentMarks after>>>>>", currentMarks)
                let updateFields = [
                  { key: "marks_data", value: currentMarks },
                  { key: "updated_at", value: new Date() },
                ];

                let updateObj = {
                  modal: "Student",
                  url: url,
                  type: "findById",
                  updateFields: updateFields,
                  id: iterator.student_id,
                  selectFields: ["first_name"],
                };

                let marksInfo = await updateRecord(updateObj);
              }
               

               res.status(200).json({ success: true });

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
  } else {
    res.status(400).json({ success: false, message: "Not Authorized" });
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
