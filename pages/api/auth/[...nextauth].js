import NextAuth from "next-auth";
import dbConnect from "../../../lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import UserInfo from "../../../models/UserInfo";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import randomstring from "randomstring";
import {
  verificationRules,
  companyName,
  companyLogo,
} from "../../../lib/customRules";
import sendEmail from "../../../lib/emailController";
const scrypt = require("scrypt-js");

const signInUser = async ({ password, user }) => {
  await dbConnect();
  
  if (!password) {
    throw new Error("Password is required");
  }

  const isValidPassword = await verifyPassword(password, user.salt, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid password");
  }

  return true;
};

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", role: "role" },
        mobile: { label: "Mobile", type: "mobile" },
      },
      async authorize(credentials, req) {
        try {
          await dbConnect();

          const email = credentials.email;
          const password = credentials.password;
          const role = credentials.role;

          if (role == "owner") {
            const user = await User.findOne({ email: email });

            if (!user) {
              throw new Error("User not found");
            }

            await signInUser({ password, user });
            return user;
          } else {
            throw new Error("Invalid role");
          }
        } catch (error) {
          return Promise.reject(new Error(error.message));
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  database: process.env.MONGODB_URI,
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("jwt>>>>", user);
      await dbConnect();

      if (account) {
        let platform = account.provider;

        let name = "";
        let email = "";
        let image = "";
        let fname = "";
        let lname = "";

        if (platform != "credentials") {
          name = user.name;
          email = user.email;
          image = user.image;

          const count = await User.countDocuments({ email: email });

          if (count == 0) {
            const verification_key = uuidv4();
            const salt = await bcrypt.genSalt(12);

            let tempPwd = randomstring.generate({
              length: 8,
              charset: "alphanumeric",
            });

            const hash = await bcrypt.hash(tempPwd, salt);

            let role = "owner";

            let uid = randomstring.generate({
              length: 8,
              charset: "alphanumeric",
            });

            let nameList = name.split(" ");

            if (nameList.length > 0) {
              fname = nameList[0];
              lname = nameList[1];
            } else {
              fname = nameList[0];
              lname = nameList[0];
            }

            let currentDate = new Date();

            let uInfo = await User.create({
              uid: uid,
              first_name: fname,
              last_name: lname,
              email: email,
              from: platform,
              pic: image,
              role: role,
              verification_key: verification_key,
              verification_expires: currentDate.getTime() + 7200000,
              password: hash,
            });

            token.sub = uInfo._id;

            createUserInfo(uInfo._id, uInfo.role, {
              fname: fname,
              email: email,
              uuid: verification_key,
            });

            token.sub = uInfo._id;
          } else {
            const response = await fetch("/api/getUser?email=" + email);
            const data = await response.json();
            console.log("datgetUsera>>>>", data);

            token.sub = data.userInfo._id;
          }
        }

        token.accessToken = account.access_token;
      }

      if (user) {
        token.id = user.id;

     

      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // Add user ID to the session
      return session;
    },
  },
});
async function verifyPassword(password, salt, hash) {

  // console.log("password>>>>", password);
  // console.log("salt>>>>", salt);
  // console.log("hash>>>>", hash);
  // Derive the key using scrypt
  const derivedKey = await scrypt.scrypt(
    new Uint8Array(Buffer.from(password)),
    new Uint8Array(Buffer.from(salt, "hex")),
    16384,
    8,
    1,
    32
  );
  // Convert the derived key to a hexadecimal string
  const derivedHash = Buffer.from(derivedKey).toString("hex");
  // console.log("derivedHash>>>>", derivedHash);

  // Compare the derived hash to the original hash
  return derivedHash === hash;
}


async function createUserInfo(user_id, role, more_info) {
  try {
    if (role == "owner") {
      UserInfo.create({
        user_id: user_id,
      });

      let userRule = verificationRules.filter((e) => e.role === "owner")[0];

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