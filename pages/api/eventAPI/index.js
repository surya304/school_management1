import dbConnect from "../../../lib/dbConnect";
import {
  fetchRecords,
  updateRecord,

} from "../../../lib/genericController";
import { getToken } from "next-auth/jwt";
import initMiddleware from "../../../lib/initMiddleware";
import validateMiddleware from "../../../lib/validateMiddleware";
import { check, body, checkSchema, validationResult } from "express-validator";
import formidable from "formidable";
import Event from "../../../models/Event";
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
  const token = 'a';


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


          let url = req.url;

          let getObj = {
            modal: "Event",
            url: url,
            type: "findOne",
            selectFields: [
              "name",
              "is_del",
              "is_active",
              "from_date",
              "to_date",
              "type",
              "exam_id"
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

          await validateBody(req, res);

          const errors = validationResult(req);

          if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
          }

          // Check if Restaurant exists 




          if (req.body.type == "update") {
            // console.log("Exists");
            // Update Restaurant

            let updateFields = [
              { key: "name", value: req.body.name },
              { key: "from_date", value: req.body.eventDate.startDate },
              { key: "to_date", value: req.body.eventDate.endDate },
              { key: "type", value: req.body.event_type },
              { key: "exam_id", value: req.body.exam_id },

              { key: "updated_at", value: new Date() },
            ];
            let updateObj = {
              modal: "Event",
              url: url,
              type: "findOne",
              updateFields: updateFields,
              condition: { _id: req.body._id },
              selectFields: [
                "name",

              ],
            };

            let restInfo = await updateRecord(updateObj);
            res.status(200).json({ success: true, data: restInfo });


          } else {


            // Create Restaurant 

            let restObj = new Event({
              school_id: req.body.school_id,
              name: req.body.name,
              type: req.body.event_type,
              exam_id: req.body.exam_id,
              from_date: req.body.eventDate.startDate,
              to_date: req.body.eventDate.endDate,
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
              modal: "Event",
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
