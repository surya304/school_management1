import dbConnect from "../../../lib/dbConnect";
import { getToken } from "next-auth/jwt";
import {
  fetchRecords
} from "../../../lib/genericController";

const secret = process.env.NEXTAUTH_SECRET;

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET);

export default async function handler(req, res) {
  await dbConnect();

   const token = await getToken({ req, secret });
   const user_id = token.sub;

   if (token) {
     const { method } = req;

     switch (method) {
       case "GET":
         try {
           let url = req.url;

           let getObj = {
             modal: "UserInfo",
             url: url,
             type: "findOne",
             selectFields: ["is_paid_user", "stripe_cust_id"],
             condition: { user_id: user_id },
           };

           let userSubInfo = JSON.parse(
             JSON.stringify(await fetchRecords(getObj))
           );

           console.log("userSubInfo>>>>>", userSubInfo);

           let stripeCustomerId = userSubInfo.stripe_cust_id;

           if (stripeCustomerId) {
             const session = await stripe.billingPortal.sessions.create({
               customer: stripeCustomerId,
               return_url: process.env.NEXT_PUBLIC_BASE_URL + "/billing",
             });

             res.status(200).json({ success: true, url: session.url });
           } else {
             res.status(400).json({ success: false });
           }
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
