import dbConnect from "../../../lib/dbConnect";
import { fetchRecords, updateRecord } from "../../../lib/genericController";
const secret = process.env.NEXTAUTH_SECRET;
import randomstring from "randomstring";
const ObjectId = require("mongodb").ObjectId;

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      let url = req.url;

      console.log( req.body, "req.bodyyyyyyyyyy");
      const mobile = req.body.phone;

      // Check if user with the mobile number exists
      let userModel = "Teacher";
      if (req.body.role == "parent") {
        userModel = "FamilyData";
      }

      let getObj = {
        modal: userModel,
        url: url,
        type: "findOne",
        selectFields: ["_id"],
        condition: {
          mobile: mobile,
          //   role:  req.body.role ,
        },
      };

      console.log(getObj, "getObjgetObjgetObj");

      const userInfo = await fetchRecords(getObj);

      console.log("Generate userInfo>>>>", userInfo);
      console.log("Generate idddd>>>>", new ObjectId(userInfo._id).toString());

      const code = randomstring.generate({
        length: 6,
        charset: "numeric",
      });

      const SMS_TEMPLATE = `Your easyPickup Verification Code is ${code}. Techub`;

      const SMS_USER = "jobschool";
      const SMS_PASSWD = "sjshyd1";
      const SMS_SID = "EZPKUP";

      const SMS_COUNTRY_API = `http://api.smscountry.com/SMSCwebservice_bulk.aspx?User=${SMS_USER}&passwd=${SMS_PASSWD}`;
      const HIT_URL = `${SMS_COUNTRY_API}&mobilenumber=${mobile}&message=${SMS_TEMPLATE}&sid=${SMS_SID}&mtype=N&DR=Y`;

      try {
        //  const resp = await fetch(HIT_URL, {
        //    method: "POST",
        //    headers: {
        //      "Content-Type": "application/json",
        //    },
        //  });

        //  const data = resp.status;

        //  console.log("SMS Data>>>>", data);

        if (true) {
          //  if (data == 200) {
          // Save OTP in db
          let currentDate = new Date();

          let updateFields = [
            { key: "otp", value: code },
            {
              key: "otp_expires",
              value: currentDate.getTime() + 3600000, // 1 hour
            },
            { key: "updated_at", value: new Date() },
          ];

          let updateObj = {
            modal: userModel,
            url: url,
            type: "findOne",
            condition: { _id: new ObjectId(userInfo._id).toString() },

            updateFields: updateFields,
            selectFields: ["name"],
          };

          let x = await updateRecord(updateObj);

          console.log(updateObj, "updateObjupdateObjupdateObj");
          console.log("Generate updateObj>>>>", x);
        }

        //  res.status(200).json({ success: true, data: data });
        res.status(200).json({ success: true, data: 200 });
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
