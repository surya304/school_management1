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
import Klass from "../../../models/Klass";
const fs = require("fs");
const path = require("path");
var ObjectId = require('mongodb').ObjectID


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

    switch (method) {

      case "GET":
        try {






          if (req.query.type == "teacherData") {


            let teamObj = {
              "modal": "Teacher",
              "url": req.url,
              "type": "find",
              "selectFields": ["first_name", "last_name"],
              "condition": { 'school_id': req.query.school_id, "categories": { "$in": req.query.category_id } }
            }

            let teamDetails = await fetchRecords(teamObj);



            console.log(teamDetails, "teamDetails")
            res.status(200).json({ success: true, data: teamDetails });


          }
          else if (req.query.type == "justsingleClassdata") {


            Klass.find({ _id: req.query.class_id })
              .populate({ path: 'subjects', select: 'name' })
              .populate({
                path: 'monday',
                populate: [
                  {
                    path: 'teacher_id',
                    model: 'Teacher',
                    select: 'first_name last_name is_del is_active',

                  }, {
                    path: 'subject_id',
                    model: 'Subject',
                    select: 'name school_id is_del is_active'
                  }]
              })
              .populate({
                path: 'tuesday',
                populate: [
                  {
                    path: 'teacher_id',
                    model: 'Teacher',
                    select: 'first_name last_name'

                  }, {
                    path: 'subject_id',
                    model: 'Subject',
                    select: 'name school_id'
                  }]
              }).populate({
                path: 'wednesday',
                populate: [
                  {
                    path: 'teacher_id',
                    model: 'Teacher',
                    select: 'first_name last_name'

                  }, {
                    path: 'subject_id',
                    model: 'Subject',
                    select: 'name school_id'
                  }],
                // match: { is_del: 'true',is_active:'false' },


              }).populate({
                path: 'thursday',
                populate: [
                  {
                    path: 'teacher_id',
                    model: 'Teacher',
                    select: 'first_name last_name'

                  }, {
                    path: 'subject_id',
                    model: 'Subject',
                    select: 'name school_id'
                  }],
              }).populate({
                path: 'friday',
                populate: [
                  {
                    path: 'teacher_id',
                    model: 'Teacher',
                    select: 'first_name last_name',

                  }, {
                    path: 'subject_id',
                    model: 'Subject',
                    select: 'name school_id'
                  }]
              }).populate({
                path: 'saturday',
                populate: [
                  {
                    path: 'teacher_id',
                    model: 'Teacher',
                    select: 'first_name last_name'

                  }, {
                    path: 'subject_id',
                    model: 'Subject',
                    select: 'name school_id'
                  }]
              }).populate({
                path: 'sunday',
                populate: [
                  {
                    path: 'teacher_id',
                    model: 'Teacher',
                    select: 'first_name last_name'

                  }, {
                    path: 'subject_id',
                    model: 'Subject',
                    select: 'name school_id'
                  }]
              }).exec(function (err, docs) {


                if (err) {
                  console.log(err, "err")
                  res.status(200).json({ success: true, placeInfo: undefined });

                } else {



                  res.status(200).json({ success: true, data: docs });

                }
              });
          }
          // let url = req.url;

          // let getObj = {
          //   modal: "Klass",
          //   url: url,
          //   type: "find",
          //   selectFields: [
          //     "name",
          //     "school_id",
          //     "category_id",
          //     "subjects",
          //     "monday",
          //     "tuesday",
          //     "wednesday",
          //     "thursday",
          //     "friday",
          //     "saturday",
          //     "sunday",


          //   ],
          //   populate: [
          //     // Incase you want to populate inner objects
          //     { path: "monday", select: { teacher_id: 1, subject_id: 1 } },
          //     { path: "tuesday", select: { teacher_id: 1, subject_id: 1 } },
          //     { path: "wednesday", select: { teacher_id: 1, subject_id: 1 } },
          //     { path: "thursday", select: { teacher_id: 1, subject_id: 1 } },
          //     { path: "friday", select: { teacher_id: 1, subject_id: 1 } },
          //     { path: "saturday", select: { teacher_id: 1, subject_id: 1 } },
          //     { path: "sunday", select: { teacher_id: 1, subject_id: 1 } },






          //   ],
          //   condition: { school_id: req.body.school_id, is_del: false, is_active: true },
          // };

          // let placeInfo = await fetchRecords(getObj);





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

          // await validateBody(req, res);

          // const errors = validationResult(req);

          // if (!errors.isEmpty()) {
          //   return res.status(422).json({ errors: errors.array() });
          // }

          // Check if Restaurant exists 


          Klass.findOne({ _id: req.body.class_id })
            .exec(function (err, docs) {


              if (err) {
                console.log(err, "err")
                res.status(200).json({ success: true, placeInfo: undefined });

              } else {


                var daytypedata = req.body.daytype;
                // var currentdata=docs[daytypedata];
                console.log(docs, "docs.docs")


                var tempobj;

                if (req.body.type == 'period') {
                  tempobj = {
                    teacher_id: req.body.teacher_id,
                    subject_id: req.body.subject_id,
                    from_time: req.body.from_time,
                    to_time: req.body.to_time,
                    type: 'period',
                    is_del: false,
                    is_active: true

                  }
                } else {
                  tempobj = {
                    type: 'break',
                    from_time: req.body.from_time,
                    to_time: req.body.to_time,
                    name: req.body.break_name,
                    is_del: false,
                    is_active: true

                  }
                }

                docs[daytypedata].push(tempobj);


                docs.save(function (err1, finaldata) {

                  if (err1) {
                    res.status(200).json({ success: true, placeInfo: undefined });

                  } else {
                    res.status(200).json({ success: true, data: finaldata });

                    res.end();
                  }

                });



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
          console.log(req.body, "req.body")

          if (req.body.type == 'sort') {

            Klass.findOne({ _id: req.body.class_id })
            .exec(function (err, docs) {


              if (err) {
                console.log(err, "err")
                res.status(200).json({ success: true, placeInfo: undefined });

              } else {
                console.log(docs, "docs")


                var daytypedata = req.body.daytype;
                // var currentdata=docs[daytypedata];
          

       

                docs[daytypedata]=req.body.data;


                docs.save(function (err1, finaldata) {

                  if (err1) {
                    res.status(200).json({ success: true, placeInfo: undefined });

                  } else {
                    res.status(200).json({ success: true, data: finaldata });

                    res.end();
                  }

                });



              }
            });




          }else{

            
          var daytypedata = req.body.daytype;

          var from_time_key = `${daytypedata}.$.from_time`;
          var to_time_key = `${daytypedata}.$.to_time`;
          var subject_key = `${daytypedata}.$.subject_id`;
          var teacher_key = `${daytypedata}.$.teacher_id`;
          var break_name = `${daytypedata}.$.name`;


          var setdata;


          if (req.body.type == 'period') {
            setdata = { [from_time_key]: req.body.from_time, [to_time_key]: req.body.to_time, [subject_key]: req.body.subject_id, [teacher_key]: req.body.teacher_id };
          } else {

            setdata = { [from_time_key]: req.body.from_time, [to_time_key]: req.body.to_time, [break_name]: req.body.break_name };

          }


          Klass.update({
            _id: req.body.class_id,
            [daytypedata]: {
              $elemMatch: {
                _id: req.body._id,
              }
            }
          }, {
            // "$set": { `${req.body.daytype}.$.from_time`: req.body.from_time, "cityTestObj.$.price": price, "cityTestObj.$.disPrice": disPrice }
            "$set": setdata
          },
            function (err, company) {
              if (err) {
                console.log(err, "err")

                // res.status(500).send({ message: err });
                // res.end();
                res.status(200).json({ success: true, placeInfo: undefined });

              } else {
                console.log(company, "company")

                res.status(200).json({ success: true, data: company });

              }
            });
          }






          // });
        } catch (error) {
          console.log("Error>>>>", error);
          res.status(400).json({ success: false });
        }

        break;


      case "DELETE":

        try {




          console.log(req.body, "delete body")

          Klass.findOne({ "_id": req.body.class_id }).exec(function (err, result) {
            if (err) {
              reject(err);
            } else {



              if (result) {


                var daytype = req.body.daytype
                var tuesdatdata = result[daytype];

                console.log(tuesdatdata, "tuesdatdata tuesdatdata")

                var data31 = tuesdatdata.filter(x => {
                  return x._id != req.body.day_id;
                })

                result[daytype] = [];
                result[daytype] = data31


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
