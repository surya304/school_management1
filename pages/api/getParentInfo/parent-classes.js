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
import Klass from "../../../models/Klass";
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

 
  if (token) {

    const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    const validateBody = initMiddleware(
      validateMiddleware(
        [
          check("classname")
            .isLength({ min: 3, max: 200 })
            .withMessage("Min 3 Max 200 characters")
            .escape()
            .trim(),

        ],
        validationResult
      )
    );

    await dbConnect();

    const { method } = req;

    switch (method) {

      case "GET":
        try {

          console.log(req.query, "reqqueyr")

          let url = req.url;

          // let restObj = {
          //   modal: "Teacher",
          //   url: url,
          //   type: "findById",
          //   selectFields: ["_id", "school_id", "categories", "subjects" ],
            
          //   populate: [
          //     // Incase you want to populate inner objects
          //     { path: "school_id", select: { "name": 1 ,"_id":2 } },
          //   ],
          //   id:   user_id ,
          // };

          // let teacherInfo = await fetchRecords(restObj);

          let getObj = {
            modal: "Klass",
            url: url,
            type: "find",
            selectFields: [
              "name",
              "school_id",
              "category_id",
              "subjects",
              "optional_subjects",
              "is_del",
              "is_active",

            ],
            populate: [
              // Incase you want to populate inner objects
              { path: "subjects", select: { name: 1 }, match: { is_del: false, is_active: true } },
              { path: "optional_subjects", select: { name: 1 }, match: { is_del: false, is_active: true } },



              { path: "category_id", select: { name: 1 }, match: { is_del: false, is_active: true } },



            ],
            condition: { category_id: { $in: teacherInfo.categories } , is_del: false, is_active: true },
          };

          let placeInfo = await fetchRecords(getObj);



          if (!Array.isArray(placeInfo)) {
            res.status(200).json({ success: true, data: undefined });
          } else {
            res.status(200).json({ success: true, data: placeInfo });
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
