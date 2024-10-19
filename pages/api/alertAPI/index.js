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
import Alert from "../../../models/Alert";
import randomstring from "randomstring";
import * as moment from "moment";
const momentTZ = require("moment-timezone");
import { v4 as uuidv4 } from "uuid";
const fs = require("fs");
const path = require("path");


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

    switch (method) {

      case "GET":
        try {


          if (req.query.type == "teacher_search") {

            finalobj.modalName = "Classes";
            finalobj.condition = {
              category_id: req.query.category_id,
              is_active: true,
              is_del: false,
            };
            finalobj.selectionFields_arr = [
              "name",

            ];



          }






          let getObj = {
            modal: finalobj.modalName,
            url: req.url,
            type: "find",
            condition: finalobj.condition_obj,
            selectFields: finalobj.selectionFields_arr,
          };

          let finaldata = await fetchRecords(getObj);





          if (!Array.isArray(placeInfo)) {
            res.status(200).json({ success: true, placeInfo: finaldata });
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

      

          // Check if Restaurant exists 



          // Create Restaurant 

          let restObj = new Alert({
            category_id: req.body.category_id,
            teachers: req.body.teachers,
            parents: req.body.parents,
            message: message,
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


          if (req.body.type == "delete") {
            // console.log("Exists");
            // Update Restaurant

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
              condition: { owner_id: req.body._id },
              selectFields: [
                "is_del",
                "is_active"

              ],
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

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
