import dbConnect from "../../../lib/dbConnect";

import { getToken } from "next-auth/jwt";
import { fetchRecords, updateRecord } from "../../../lib/genericController";

const stripe = require("stripe")(process.env.STRIPE_SECRET);
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  const user_id = token.sub;

  if (token) {
    await dbConnect();
    const { method } = req;

    let url = req.url;

    switch (method) {
      case "GET":
        try {
          // Check if Stripe Customer ID exists

          let plan_id = req.query.plan_id;

          let getObj = {
            modal: "UserInfo",
            url: url,
            type: "findOne",
            selectFields: ["stripe_cust_id", "user_id"],
            populate: [
              // Incase you want to populate inner objects
              {
                path: "user_id",
                select: { first_name: 1, last_name: 2, email: 3 },
              },
            ],
            condition: { user_id: user_id },
          };

          let userInfo = await fetchRecords(getObj);

          console.log("userInfo>>>>>>", userInfo);

          let exists = false;

          if (userInfo.stripe_cust_id) {
            if (userInfo.stripe_cust_id.length > 0) {
              exists = true;
            }
          }

          console.log("Exists>>>>>", exists);

          let stripe_cust_id = "";

          if (exists == false) {
            const customer = await stripe.customers.create({
              email: userInfo.user_id.email,
              name:
                userInfo.user_id.first_name + " " + userInfo.user_id.last_name,
            });

            stripe_cust_id = customer.id;
            console.log("Stripe Customer Data>>>>", customer);

            // Update Customer ID in UserInfo

            let updateFields = [
              { key: "stripe_cust_id", value: customer.id },
              { key: "updated_at", value: new Date() },
            ];

            let updateObj = {
              modal: "UserInfo",
              url: url,
              type: "findById",
              updateFields: updateFields,
              id: userInfo._id,
              selectFields: ["stripe_cust_id"],
            };

            await updateRecord(updateObj);
          } else {
            stripe_cust_id = userInfo.stripe_cust_id;
          }

          const session = await stripe.checkout.sessions.create({
            success_url: process.env.NEXT_PUBLIC_BASE_URL + "/payment-success",
            cancel_url: process.env.NEXT_PUBLIC_BASE_URL + "/payment-failure",
            customer: stripe_cust_id,
            line_items: [{ price: plan_id, quantity: 1 }],
            mode: "subscription",
          });

          res.status(200).json({ success: true, redirect_url: session.url });
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
