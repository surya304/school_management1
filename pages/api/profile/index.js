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
import formidable from "formidable";
const momentTZ = require("moment-timezone");
import { v4 as uuidv4 } from "uuid";
const fs = require("fs");
const path = require("path");

export const config = {
  api: { bodyParser: false },
};

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  const user_id = token.sub;

  if (token) {
    const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    const validateBody = initMiddleware(
      validateMiddleware(
        [
          check("fname")
            .isLength({ min: 3, max: 40 })
            .withMessage("Min 3 Max 40 characters")
            .escape()
            .trim(),
          check("lname")
            .isLength({ min: 1, max: 40 })
            .withMessage("Min 1 Max 40 characters")
            .escape()
            .trim(),
          check("phone")
            .matches(phoneRegExp)
            .optional({ checkFalsy: true })
            .withMessage("Invalid Phone Number"),
          check("phone_country")
            .isLength({ min: 2, max: 5 })
            .optional({ checkFalsy: true })
            .withMessage("Invalid Country Code"),
          check("city")
            .escape()
            .trim()
            .isLength({ min: 2, max: 40 })
            .optional({ checkFalsy: true })
            .withMessage("Invalid City"),
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
            modal: "User",
            url: url,
            type: "findById",
            selectFields: [
              "first_name",
              "last_name",
              "email",
              "profile_pic",
              "mobile",
              "mobile_country",
              "city",
              "company",
              "category",
            ],
            id: user_id,
          };

          let userInfo = await fetchRecords(getObj);

          console.log("userInfo>>>>>>", userInfo);

          // let picUrl = "";

          // if (userInfo.profile_pic) {
           
          //   if (userInfo.profile_pic.length > 0) {
             
          //     var rest = userInfo.profile_pic.substring(
          //       0,
          //       userInfo.profile_pic.lastIndexOf("/") + 1
          //     );
          //     var last = userInfo.profile_pic.substring(
          //       userInfo.profile_pic.lastIndexOf("/") + 1,
          //       userInfo.profile_pic.length
          //     );

          //     picUrl = await generateV4ReadSignedUrl(rest, last);
              
          //   }
          // }
         

          // console.log("picUrl>>>>", picUrl);

          // userInfo.profile_pic = picUrl;

          res.status(200).json({ success: true, userInfo: userInfo });
          
        } catch (error) {
          console.log("Error>>>>", error);
          res.status(400).json({ success: false });
        }
        break;

      case "POST":
        try {
          let url = req.url;
          let picUrl = "";

          const data = await new Promise(function (resolve, reject) {
            const form = new formidable.IncomingForm();
            form.uploadDir = "/tmp";
            form.keepExtensions = true;

            form.parse(req, async function (err, fields, files) {
              if (err) return reject(err);
              resolve({ fields, files });
            });
          });

          console.log("Files>>>>>", data.files);

          if (!isEmpty(data.files)) {
picUrl= "https://mybucket4345.s3.us-east-2.amazonaws.com/Screenshot+2024-02-02+095544.png"
          }

          req.body = data.fields;

          console.log("Body>>>>>", req.body);

          await validateBody(req, res);

          const errors = validationResult(req);

          if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
          }          

            let updateFields = [
              { key: "first_name", value: req.body.fname },
              { key: "last_name", value: req.body.lname },
              { key: "mobile", value: req.body.phone },
              { key: "city", value: req.body.city },
              { key: "updated_at", value: new Date() },
            ];

            if (picUrl.length > 0) {
              updateFields.push({ key: "profile_pic", value: picUrl });
            }
          
            if (req.body.phone.length > 0) {
              updateFields.push({ key: "mobile_country", value: req.body.phone_country });
            }
          
            let updateObj = {
              modal: "User",
              url: url,
              type: "findById",
              updateFields: updateFields,
              id: user_id,
              selectFields: [
                "first_name",
                "last_name",
                "email",
                "profile_pic",
                "mobile",
                "mobile_country",
                "city",
              ],
            };

            let userInfo = await updateRecord(updateObj);
            res.status(200).json({ success: true, data: userInfo });
          

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
