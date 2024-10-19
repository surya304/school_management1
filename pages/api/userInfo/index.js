import dbConnect from "../../../lib/dbConnect";
import * as moment from "moment";
import { fetchRecords } from "../../../lib/genericController";
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  
    await dbConnect();
  
    const { method } = req;

    switch (method) {
      case "GET":
        try {

          let url = req.url 

          const user_id = req.query.user_id;
         
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
            ],
            populate: [
              // Incase you want to populate inner objects
              { path: "user_id", select: { role: 1 } },
            ],
            condition: { user_id: user_id },
          };

          let userInfo = await fetchRecords(getObj); 

          res
            .status(200)
            .json({ success: true, userInfo: userInfo });
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
