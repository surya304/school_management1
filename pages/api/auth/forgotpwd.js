import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { v4 as uuidv4 } from "uuid";
import { MailtrapClient } from "mailtrap";
import { body, validationResult } from "express-validator";
import crypto from "crypto";

const TOKEN = process.env.SMTP_PASS;
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === "POST") {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let email = sanitize(req.body.email);
    try {
      const userInfo = await User.findOne({ email: email, is_active: true });

      if (userInfo) {
        const new_verification_key = uuidv4();

        // Send this key to the user via email
        sendResetPwdEmail(userInfo.first_name, userInfo.email, new_verification_key);
e
        console.log("New Verification Key>>>>", new_verification_key);

        // Update the key in DB
        await User.findByIdAndUpdate(
          userInfo._id,
          {
            verification_key: new_verification_key,
            updated_at: new Date(),
          },
          { new: true }
        );

        res.status(200).json({ success: true });
      } else {
        res.status(403).json({ success: false, message: "Invalid Data", status: 403 });
      }
    } catch (error) {
      console.error(error, "forgotpwd error");
      res.status(500).send('An error occurred');
    }
  } else {
    res.status(400).json({ success: false });
  }
}

function sendResetPwdEmail(name, email, key) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword?key=${key}`;
  const recipients = [{ email }];
  const htmlTemplate = getTemplate(name, resetUrl);

  client.send({
    from: sender,
    to: recipients,
    subject: "Password Reset Request",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           ${resetUrl}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    html: htmlTemplate,
    category: "Password Reset",
  });
}

function sanitize(string) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  const reg = /[&<>"'/]/gi;
  return string.replace(reg, (match) => map[match]);
}

function getTemplate(name, resetUrl) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Password Reset</title>
    <style type="text/css">
        body { height: 100% !important; margin: 0; padding: 0; width: 100% !important; }
        table { border-collapse: separate; }
        img, a img { border: 0; outline: none; text-decoration: none; }
        h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; }
        p { margin: 1em 0; }
        .input_text { width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .doc_button { background-color: #616ed1; color: #fff; border-style: none; padding: 15px 50px; font-size: 14px; border-radius: 5px; font-weight: 400; font-family: 'Open Sans', Helvetica, sans-serif; text-decoration: none; }
        .border_profile { padding-right: 30px; border-right: 1px solid #ddd; }
        .ReadMsgBody { width: 100%; }
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        #outlook a { padding: 0; }
        img { -ms-interpolation-mode: bicubic; }
        body, table, td, p, a, li, blockquote { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
        img { max-width: 100%; height: auto; }
        @media only screen and (max-width: 620px) {
            .shrink_font { font-size: 62px; }
            #foxeslab-email .table1 { width: 90% !important; }
            #foxeslab-email .table1-2, .table1-3, .table1-4 { width: 98% !important; margin-left: 1%; margin-right: 1%; }
            #foxeslab-email .table1-5 { width: 90% !important; margin-left: 5%; margin-right: 5%; }
            #foxeslab-email .tablet_no_float { clear: both; width: 100% !important; margin: 0 auto !important; text-align: center !important; }
            #foxeslab-email .tablet_wise_float { clear: both; float: none !important; width: auto !important; margin: 0 auto !important; text-align: center !important; }
            #foxeslab-email .tablet_hide { display: none !important; }
            #foxeslab-email .image1 { width: 98% !important; }
            #foxeslab-email .image1-290 { width: 100% !important; max-width: 290px !important; }
            .center_content { text-align: center !important; }
            .center_image { margin: 0 auto !important; }
            .center_button { width: 50% !important; margin-left: 25% !important; max-width: 250px !important; }
            .centerize { margin: 0 auto !important; }
        }
        @media only screen and (max-width: 480px) {
            .shrink_font { font-size: 48px; }
            .safe_color { color: #6a1b9a !important; }
            body { width: 100% !important; min-width: 100% !important; }
            table[class="flexibleContainer"] { width: 100% !important; }
            img[class="flexibleImage"] { height: auto !important; width: 100% !important; }
            #foxeslab-email .table1 { width: 98% !important; }
            #foxeslab-email .no_float { clear: both; width: 100% !important; margin: 0 auto !important; text-align: center !important; }
            #foxeslab-email .wise_float { clear: both; float: none !important; width: auto !important; margin: 0 auto !important; text-align: center !important; }
            #foxeslab-email .mobile_hide { display: none !important; }
            .auto_height { height: auto !important; }
        }
    </style>
</head>
<body style="padding: 0;margin: 0; background-color: #dee7ef;" id="foxeslab-email">
    <table class="table_full editable-bg-color bg_color_ffffff editable-bg-image" bgcolor="#dee7ef" width="100%" align="center" cellspacing="0" cellpadding="0" border="0" style="background-image: url(#); background-repeat: no-repeat; background-position: center left; background-size: 100% 100%; border-collapse: collapse;">
        <tr><td height="100"></td></tr>
        <tr>
            <td>
                <table class="table1" width="600" align="center" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td bgcolor="#616ed1" style="padding-top: 30px;padding-right: 40px;padding-bottom: 0;padding-left: 40px;border: 1px solid #616ed1;">
                            <table class="no_float" align="center" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="editable-img" align="left">
                                      
                                    </td>
                                </tr>
                                <tr><td height="30"></td></tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table class="table1" width="600" align="center" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td bgcolor="#fcfcfc" style="padding: 40px 0;border: 1px solid #f2f2f2;border-radius: 5px;">
                            <table class="table1" width="480" align="center" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" mc:edit="text101" class="text_color_282828" style="line-height: 1;color: #282828; font-size: 20px; font-weight: 600; font-family: 'Open Sans', Helvetica, sans-serif;">
                                        <div class="editable-text">
                                            <span class="text_container">Hi, ${name}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr><td height="20"></td></tr>
                                <tr>
                                    <td align="center" mc:edit="text102" class="text_color_c6c6c6" style="line-height: 1.8;color: #525252; font-size: 15px; font-weight: 500; font-family: 'Open Sans', Helvetica, sans-serif;">
                                        <div class="editable-text">
                                            <span class="text_container">We received a request to reset your password for your account</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr><td height="20"></td></tr>
                                <tr>
                                    <td align="center" mc:edit="text102" class="text_color_c6c6c6" style="line-height: 1.8;color: #525252; font-size: 14px; font-weight: 400; font-family: 'Open Sans', Helvetica, sans-serif;">
                                        <div class="editable-text">
                                            <span class="text_container">Click on the button below to change your password</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr><td height="40"></td></tr>
                                <tr><td height="40"></td></tr>
                                <tr>
                                    <td align="center">
                                        <table align="center" border="0" cellspacing="0" cellspacing="0">
                                            <tr>
                                                <td>
                                                    <a href="${resetUrl}" target="_blank" class="button button-blue button-bordered doc_button">
                                                        <span class="button--inner" style="color:#fff">Change Password</span>
                                                    </a>
                                                </td> 
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr><td height="20"></td></tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr><td height="100"></td></tr>
    </table>
</body>
</html>`;
}