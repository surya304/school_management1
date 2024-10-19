import dbConnect from "../../../lib/dbConnect";
import initMiddleware from "../../../lib/initMiddleware";
import validateMiddleware from "../../../lib/validateMiddleware";
import { check, body, checkSchema, validationResult } from "express-validator";

import User from "../../../models/User";
import School from "../../../models/School";
import Subject from "../../../models/Subject";
import UserInfo from "../../../models/UserInfo";
import { v4 as uuidv4 } from "uuid";
import randomstring from "randomstring";
import {
  verificationRules,
  companyName,
  companyLogo,
} from "../../../lib/customRules";
import sendEmail from "../../../lib/emailController";
const scrypt = require("scrypt-js");
const crypto = require("crypto");


const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

const validateBody = initMiddleware(
  validateMiddleware(
    [
      check("first_name")
        .isLength({ min: 3, max: 40 })
        .withMessage("Min 3 Max 40 characters")
        .escape()
        .trim(),
      check("last_name")
        .isLength({ min: 1, max: 40 })
        .withMessage("Min 1 Max 40 characters")
        .escape()
        .trim(),
      check("role")
        .isIn(["owner", "member", "waiter", "customer"])
        .escape()
        .trim(),
      check("email")
        .isEmail()
        .escape()
        .toLowerCase()
        .trim()
        .withMessage("This is an invalid email"),
      check("email").custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("E-mail already in use");
          }
        });
      }),
      check("random").custom((value) => {
        return User.findOne({ uid: value }).then((user) => {
          if (user) {
            return Promise.reject("Unique ID already in use");
          }
        });
      }),
      check("mobile")
        .matches(phoneRegExp)
        .optional({ checkFalsy: true })
        .withMessage("Invalid Phone Number"),
      check("password")
        .isLength({ min: 6, max: 100 })
        .withMessage("Min 6 Max 100 characters"),
    ],
    validationResult
  )
);




export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method == "POST") {
    
    try {
      // Check if user has an account

      let x = randomstring.generate({
        length: 8,
        charset: "alphanumeric",
      });

      req.body.random = x 
      console.log("Body>>>>", req.body);

      await validateBody(req, res);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log("Error>>>>", errors.array());
        return res.status(422).json({ errors: errors.array() });
      }
      else
      {

        try {
  

            // Create User in DB
            const salt = crypto.randomBytes(16).toString("hex");

            const derivedKey = await scrypt.scrypt(
              new Uint8Array(Buffer.from(req.body.password)),
              Buffer.from(salt, "hex"),
              16384,
              8,
              1,
              32
            );

            const hash = Buffer.from(derivedKey).toString("hex");

            const verification_key = uuidv4();

            let currentDate = new Date();

            let uInfo = await User.create({
              uid: req.body.random,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              from: req.body.from,
              role: req.body.role,
              verification_key: verification_key,
              verification_expires: currentDate.getTime() + 7200000,
              password: hash,
              salt: salt,
            });


            res.status(200).json({ success: true });

            
            createUserInfo(uInfo._id, uInfo.role, {
              fname: req.body.first_name,
              email: req.body.last_name,
              uuid: verification_key,
            });

        
          
        } catch (captchaError) {
          console.log("Captcha Error>>>>", captchaError);
          res
            .status(403)
            .json({ success: false, message: "Invalid Captcha", status: 403 });
        }
      }
      
    } catch (error) {
      console.log("Error>>>>>", error);
      res.status(400).json({ success: false });
    }
  } else {
    res.status(400).json({ success: false });
  }
}



async function createUserInfo(user_id, role, more_info) {
  try {
    if (role == "owner") {
      UserInfo.create({
        user_id: user_id,
      });


      // Create School

      let schoolInfo = await School.create({
        owner_id: user_id,
        name: "School Name",
      });

  
   

     console.log("Subjects Info >>>>", x);

      // Send Verification Email Logic
      if (userRule.verify_email == true) {
        console.log("Send Verification Email>>>>");

        var importEmail = require("../../../emails/verify-email");
        let verifyURL =
          process.env.NEXT_PUBLIC_BASE_URL +
          "/confirm-email?key=" +
          more_info.uuid;
        let verifyTemplate = importEmail.emailTemplate(
          more_info.fname,
          companyName,
          companyLogo,
          verifyURL
        );

        let sendSmtpEmail = {
          subject: `${companyName} - Verify your Email`,
          sender: { email: "support@sites60.com", name: companyName },
          replyTo: { email: "support@sites60.com", name: companyName },
          to: [{ name: more_info.fname, email: more_info.email }],
          htmlContent: verifyTemplate,
        };

        sendEmail(sendSmtpEmail);
      }
    } 
    
  } catch (error) {
    console.log("createUserInfo Error>>>>", error);
  }
}


