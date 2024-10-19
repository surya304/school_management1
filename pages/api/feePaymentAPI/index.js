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
import FeePayment from "../../../models/FeePayment";

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
      case "GET":
        try {
          let url = req.url;

          // let getObj = {
          //   modal: "FeePayment",
          //   url: url,
          //   type: "find",
          //   selectFields: [
          //     "school_id",
          //     "category_id",
          //     "student_id",
          //     "class_id",
          //     "mode",
          //     "amount",
          //     "transaction_id",
          //     "created_at",
          //   ],
          //   condition: { user_id: user_id },
          // };

          // let feeInfo = await fetchRecords(getObj);

          // console.log("feeInfo>>>>>>", feeInfo);

          // res.status(200).json({ success: true, feeInfo: feeInfo });


          // 64105a90f9d4caa85d622a36
          // FeePayment.find({'school_id':'63ef651ac516d15f2952f65d','class_id.name':'xa'}).exec((err, result) => {
          //   if (err) {
          //     // Handle error
          //     console.log(err);
          //   } else {
          //     console.log(result, "olaaaaaaaaaaaaaaaaaaaaaaaa");
          //     res.status(200).json({ success: true });
          //     // Use the result
          //   }
          // });


    



        } catch (error) {
          console.log("Error>>>>", error);
          res.status(400).json({ success: false });
        }
        break;

      case "POST":


        try {

          console.log(req.body, "FeePayment")
        //   {
        //     "school_id": "63ef651ac516d15f2952f65d",
        //     "class": "64071ebe4bada3c83c0d0b4a",
        //     "student_id": "640ad4dd581e43114b540412",
        //     "paymentDate": {
        //         "startDate": "2023-03-16T09:29:31.000Z",
        //         "endDate": "2023-03-15T09:29:31.296Z"
        //     },
        //     "mode": "cash",
        //     "transactionId": "213123",
        //     "feeAmount": "23213"
        // }

          let feeObj = new FeePayment({
            user_id: user_id,
            school_id: req.body.school_id,
            // category_id: req.body.category_id,
            class_id: req.body.class,
            student_id: req.body.student_id,
            mode: req.body.mode,
            amount: req.body.feeAmount,
            transaction_id: req.body.transactionId,
            payment_date: req.body.paymentDate.startDate,
            created_at: new Date(),
            updated_at: new Date(),
          });

          feeObj.save(async function (err2, result) {
            if (err2) {
              console.log("Error 2>>>>", err2);
              res.status(500).json({ success: false });
            } else {


              res.status(200).json({ success: true,data:result });
            }
          });

        } catch (error) {
          console.log("Error>>>>", error);
          res.status(400).json({ success: false });
        }

        break;


        case "PUT":

        try {

          let url = req.url;

          console.log(req.body, "UPdate FeePayment")

          if (req.body.type == "update") {
 
            let updateFields = [
              { key: "class_id", value: req.body.class },
              { key: "student_id", value: req.body.student_id },
              { key: "mode", value: req.body.mode },
              { key: "amount", value: req.body.feeAmount },
              { key: "transaction_id", value: req.body.transactionId },
              { key: "payment_date", value: req.body.paymentDate.startDate },
              { key: "updated_at", value: new Date() },
            ];
            let updateObj = {
              modal: "FeePayment",
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

        
      case "DELETE":

      try {

        console.log(req.body, "FeePayment")




        FeePayment.findOne({ "_id": req.body._id }).exec(function (err, result) {
          if (err) {
            reject(err);
          } else {



            if (result) {


              result.is_del = true;
              result.is_active = false;



              result.save(function (err, result21) {
                if (err) {
                  res.status(200).json({ success: true, placeInfo: undefined });

                } else {
                  res.status(200).json({ success: true, data: result21 });

                }
              })

            } else {
              resolve(true);

            }


          }
        });



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