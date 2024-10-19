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
import Category from "../../../models/Category";
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

  console.log(user_id,"user_id categoryapi")


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
    console.log(req.body, "req.body category API");

    switch (method) {

      case "GET":
        try {

          let url = req.url;
          let getObj = {
            modal: "Category",
            url: url,
            type: "find",
            selectFields: [
              "name",
              "school_id",
              "is_del",
              "is_active"
            ],
            condition: {school_id: req.body.school_id ,is_del:false,is_active:true},
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

          let restObj = new Category({
            school_id: req.body.school_id,
            name: req.body.category,
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

      console.log("PUT category API >>>>", req.body);
      
        try {

          if (req.body._id == undefined || req.body._id == "") {
            res.status(400).json({ success: false, message: "Invalid ID" });
          }

          let url = req.url;

          let updateObj = {
            modal: "Category",
            url: url,
            type: "findOne",
            condition: { _id: req.body._id },
            selectFields: [
              "name",
              "is_del",
              "is_active"

            ],
          };

          if(req.body.type == "edit"){
            updateObj.updateFields = [
              { key: "name", value: req.body.category },
              { key: "updated_at", value: new Date() },
            ];
          }else{
            updateObj.updateFields = [

              { key: "is_del", value: true },
              { key: "is_active", value: false },
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
