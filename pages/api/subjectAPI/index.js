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
          check("name")
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

    console.log("Method category API >>>>", method);

    switch (method) {

      case "GET":
        try {


          let url = req.url;

          let getObj = {
            modal: "Subject",
            url: url,
            type: "findOne",
            selectFields: [
              "name",
              "is_del",
              "is_active"
            ],
            condition: { category_id: req.body.category_id ,is_del:false,is_active:true},
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


      case "POST":

        try {

          let url = req.url;

          let x = randomstring.generate({
            length: 12,
            charset: "alphanumeric",
          });

          req.body.key = x;
          console.log("Body>>>>", req.body);

       

          let restObj = new Subject({
            school_id: req.body.school_id,
            name: req.body.subject,
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


          let updateObj = {
            modal: "Subject",
            url: url,
            type: "findOne",
            condition: { _id: req.body._id },
            selectFields: [
              "name",

            ],
          };

          if(req.body.type == "edit"){
            updateObj.updateFields = [
              { key: "is_active", value: true },
              { key: "updated_at", value: new Date() },
            ];
          }

          if(req.body.type == "delete"){
            updateObj.updateFields = [
              { key: "is_active", value: false },
              { key: "is_del", value: true },
              { key: "updated_at", value: new Date() },
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
        case "DELETE":

        try {
          let url = req.url;


          let updateFields = [
            { key: "is_del", value: true },
            { key: "is_active", value: false },
            { key: "updated_at", value: new Date() },
          ];

          let updateObj = {
            modal: "Subject",
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
