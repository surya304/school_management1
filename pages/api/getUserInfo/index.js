import dbConnect from "../../../lib/dbConnect";
import {
  fetchRecords
} from "../../../lib/genericController";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });

  if (!token) {
    res.writeHead(401, { Location: '/login' }).end();
    return;
  }

    const user_id = token.sub;

    await dbConnect();

    const { method } = req;

    switch (method) {
      case "GET":
        try {
          let url = req.url;

          let getObj = {
            modal: "UserInfo",
            url: url,
            type: "findOne",
            selectFields: [
              "verified_email",
              "verified_phone",
              "onboarded",
              "revoked_access",
              "trial_expires",
              "is_paid_user",
              "plan_id",
            ],
            condition: {"user_id": user_id},
          };

          let userInfo = await fetchRecords(getObj);

          res.status(200).json({ success: true, userInfo: userInfo });
          
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

