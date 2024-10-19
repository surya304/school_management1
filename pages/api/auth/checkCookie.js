import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method == "GET") {
    const token = await getToken({ req, secret });

    try {
      if (token) {
        const user_id = token.sub;
        res.status(200).json({ success: true, message: user_id });
      } else {
        res.status(401).json({ success: false, message: "Not Authorized" });
      }
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else {
    res.status(400).json({ success: false });
  }
}
