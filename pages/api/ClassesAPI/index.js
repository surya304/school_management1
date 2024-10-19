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

  // const token = await getToken({ req, secret });
  // const user_id = token.sub;

  var token = 'a';

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


          let url = req.url;

          let getObj = {
            modal: "Klass",
            url: url,
            type: "find",
            selectFields: [
              "name",
              "school_id",
              "category_id",
              "subjects",
              "is_del",
              "is_active",
            ],
            populate: [
              // Incase you want to populate inner objects
              { path: "subjects", select: { name: 1,is_del:1,is_active:1 }, match: { is_del: false, is_active: true } },
              { path: "category_id", select: { name: 1,is_del:1,is_active:1  }, match: { is_del: false, is_active: true } },

            ],
            condition: { school_id: req.query.school_id, is_del: false, is_active: true },
          };

          let placeInfo = await fetchRecords(getObj);


          // check if category_id is null or subjects is null , if null remove the record from the array

          if (Array.isArray(placeInfo)) {
            placeInfo = placeInfo.filter((item) => {
              return item.category_id != null && item.subjects != null;
            });
          }
          

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


      case "POST":

        try {

          let url = req.url;

          let x = randomstring.generate({
            length: 12,
            charset: "alphanumeric",
          });

          req.body.key = x;

          await validateBody(req, res);

          const errors = validationResult(req);

          if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
          }

          // Check if Restaurant exists 


          let restObj = new Klass({
            name: req.body.classname,
            school_id: req.body.school_id,
            category_id: req.body.category_id,
            subjects: req.body.subjects,
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

          let x = randomstring.generate({
            length: 12,
            charset: "alphanumeric",
          });

          req.body.key = x;
          console.log("ClassesAPI Body>>>>", req.body);

        


          let getObj = {
            modal: "Klass",
            url: url,
            type: "findOne",
            selectFields: [
              "name",
            ],
            condition: { _id: req.body._id },
          };

          let placeInfo = await fetchRecords(getObj);

          console.log("Place Info>>>>", placeInfo);
          

          if (!Array.isArray(placeInfo)) {
            // console.log("Exists");
            // Update Restaurant


            let updateObj = {
              modal: "Klass",
              url: url,
              type: "findOne",
              condition: { _id: req.body._id },
              selectFields: [
                "name",
                "school_id",
                "category_id",
                "updated_at",
                "subjects",
                "is_del",
                "is_active",

              ],
            };
            if(req.body.type == 'edit'){
              updateObj.updateFields = [
                { key: "name", value: req.body.classname },
                { key: "school_id", value: req.body.school_id },
                { key: "category_id", value: req.body.category_id },
                { key: "subjects", value: req.body.subjects },
                { key: "updated_at", value: new Date() },
              ];
            }else if(req.body.type == 'delete'){
              updateObj.updateFields = [
                { key: "is_del", value: true },
                { key: "is_active", value: false },
                { key: "updated_at", value: new Date() },
              ];
            }
        

            console.log("Update Object>>>>", updateObj);
            
            let restInfo = await updateRecord(updateObj);

            res.status(200).json({ success: true, data: restInfo });


          } else {
            res.status(400).json({ success: false, data: "Record Doesnt Exist" });

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
