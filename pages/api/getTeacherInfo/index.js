import dbConnect from "../../../lib/dbConnect";
import { fetchRecords, updateRecord } from "../../../lib/genericController";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  const user_id = token.sub;
  
  console.log(user_id, "user_id");

  if (token) {
    await dbConnect();

    const { method } = req;

    switch (method) {
      case "GET":
        try {
          let url = req.url;

          let getObj = {
            modal: "Teacher",
            url: url,
            type: "findById",
            selectFields: [
              "verified_email",
              "verified_phone",
              "onboarded",
              "revoked_access",
              "trial_expires",
              "is_paid_user",
              "plan_id",
              "first_name",
              "last_name",
              "address",
              "email",
              "phone",
              "mobile",
              "description",
              "profile_pic",
              "gender",
              "subjects",
              "school_id",
              "category_id",
            ],
            id: user_id,
          };

          let userInfo = await fetchRecords(getObj);

          res.status(200).json({ success: true, userInfo: userInfo });
        } catch (error) {
          console.log("Error>>>>", error);
          res.status(400).json({ success: false });
        }
        break;

      case "PUT":
        try {
          const {
            first_name,
            last_name,
            email,
            description,
            mobile,
            address,
            gender,
          } = req.body;

          let updateFields = [
            { key: "first_name", value: first_name },
            { key: "last_name", value: last_name },
            { key: "mobile", value: mobile },
            { key: "email", value: email },
            { key: "description", value: description },
            { key: "address", value: address },
            { key: "gender", value: gender },
            { key: "updated_at", value: new Date() },
          ];

          let updateObj = {
            modal: "Teacher",
            type: "findById",
            updateFields: updateFields,
            id: user_id,

            selectFields: ["_id"],
          };

          let updatedUserInfo = await updateRecord(updateObj);
          console.log(updatedUserInfo, "updatedUserInfo");
          res.status(200).json({ success: true, updatedUserInfo });
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
