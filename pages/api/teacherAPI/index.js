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
import randomstring from "randomstring";
import * as moment from "moment";
import Teacher from "../../../models/Teacher";



const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {





    const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

   

    await dbConnect();

    const { method } = req;

    switch (method) {

      case "GET":
        try {




          let url = req.url;


          let getObj = {
            modal: "Teacher",
            url: url,
            type: "find",
            selectFields: [
              "first_name",
              "last_name",
              "email",
              "categories",
              "key",
              "address",
              "profile_pic",
              "blood_group",
              "description",
              "employee_id",
              "mobile",
              "address",
              "gender",
              "subjects",
            ],
            populate: [
              // Incase you want to populate inner objects
              { path: "subjects", select: { name: 1 }, match: { is_del: false, is_active: true } },
              { path: "categories", select: { name: 1 }, match: { is_del: false, is_active: true } },



            ],
            condition: { school_id: req.query.school_id, is_del: false, is_active: true },
          };



          let placeInfo = await fetchRecords(getObj);

          console.log("teacherapi Teacjer Data>>>>", placeInfo);
          

          if (Array.isArray(placeInfo)) {
            placeInfo = placeInfo.filter((item) => {
              return item.categories != null && item.subjects != null;
            });
          }

          res.status(200).json({ success: true, data: placeInfo });




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



          let restObj = new Teacher({
            first_name: req.body.teacher_first_name,
            last_name: req.body.teacher_last_name,
            email: req.body.email,
            employee_id: req.body.employee_id,
            school_id: req.body.school_id,
            categories: req.body.category,
            subjects: req.body.subject,
            address: req.body.address,
            mobile: req.body.mobile,
            description: req.body.description,
            gender: req.body.gender,
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

          console.log(req.body)

          if (req.body.type == 'update') {

            console.log(req.body, "req.body")

            let updateFields = [
              { key: "first_name", value: req.body.teacher_first_name },
              { key: "last_name", value: req.body.teacher_last_name },
              { key: "email", value: req.body.email },
              { key: "address", value: req.body.address },
              { key: "mobile", value: req.body.mobile },
              { key: "profile_pic", value: req.body.profile_pic },
              { key: "employee_id", value: req.body.employee_id },
              { key: "gender", value: req.body.gender },
              { key: "categories", value: req.body.category },
              { key: "subjects", value: req.body.subject },
              { key: "description", value: req.body.description },
              { key: "updated_at", value: new Date() },
            ];


            let updateObj = {
              modal: "Teacher",
              url: url,
              type: "findOne",
              updateFields: updateFields,
              condition: { _id: req.body._id },
              selectFields: [
                "first_name",

              ],
            };

            let restInfo = await updateRecord(updateObj);
            res.status(200).json({ success: true, data: restInfo });


          } else {

            var is_email_exists = await uploadCSV(req.body);

            if (is_email_exists == true) {
              res.status(200).json({ success: true });


            } else {
              res.status(200).json({ success: false });

            }

          }





          // });
        } catch (error) {
          console.log("Error>>>>", error);
          res.status(400).json({ success: false });
        }

        break;


      case "DELETE":

        try {



          // Check if Restaurant exists 



          console.log(req.body, "delete teacher");
          // Update Restaurant

          var updateFields;

          updateFields = [
            { key: "is_del", value: true },
            { key: "is_active", value: false },

            { key: "updated_at", value: new Date() },
          ];





          let updateObj = {
            modal: "Teacher",
            url: req.url,
            type: "findOne",
            updateFields: updateFields,
            condition: { _id: req.body._id },
            selectFields: [

              "is_del",

            ],
          };

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



}



async function uploadCSV(data) {



  await Promise.all(data.finaldata.map(async function (item) {
    var school_id = data.school_id;




    let x = randomstring.generate({
      length: 12,
      charset: "alphanumeric",
    });


    let restObj = new Teacher({
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      employee_id: item.employee_id,
      school_id: school_id,
      address: item.address,
      mobile: item.mobile,
      key: x,
      description: item.description,
      gender: item.gender,
      created_at: new Date(),
      updated_at: new Date(),
    });




    try {
      await restObj.save();
      console.log("Record saved successfully!");

    } catch (err) {
      console.log("Error saving record: ", err);
      throw err;
      return false;
    }
  }));

  return true;

}