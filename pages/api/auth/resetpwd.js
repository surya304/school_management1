import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { v4 as uuidv4 } from "uuid";
const scrypt = require("scrypt-js");
const crypto = require("crypto");

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === "POST") {
    const { password, password2, key } = req.body;

    console.log("Password>>>>", password);
    console.log("Password2>>>>", password2);
    console.log("Key>>>>", key);

    if (password !== password2) {
      console.log("Passwords do not match");
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    try {
      const userInfo = await User.findOne({
        verification_key: key,
        is_active: true,
      });

      console.log("UserInfo>>>>", userInfo);

      if (!userInfo) {
        return res.status(403).json({ success: false, message: "Invalid or expired key" });
      }

      const currentDate = new Date();
      if (userInfo.verification_expires <= currentDate) {
        return res.status(403).json({ success: false, message: "Link expired" });
      }

      // Use scrypt to hash the password
      const salt = crypto.randomBytes(16).toString("hex");
      const derivedKey = await scrypt.scrypt(
        new Uint8Array(Buffer.from(password)),
        Buffer.from(salt, "hex"),
        16384,
        8,
        1,
        32
      );
      const hash = Buffer.from(derivedKey).toString("hex");
      const new_verification_key = uuidv4();

      await User.findByIdAndUpdate(
        userInfo._id,
        {
          verification_key: new_verification_key,
          verification_expires: new Date(Date.now() + 2 * (60 * 60 * 1000)),
          password: hash,
          salt: salt,
          updated_at: new Date(),
        },
        { new: true }
      );

      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error, "error");
      res.status(400).json({ success: false, message: "An error occurred. Please try again." });
    }
  } else {
    res.status(400).json({ success: false });
  }
}