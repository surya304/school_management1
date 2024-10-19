import dbConnect from "../../../lib/dbConnect";
import { fetchRecords, updateRecord } from "../../../lib/genericController";
import { buffer } from "micro";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

// const buffer = (req) => {
//   return new Promise((resolve, reject) => {
//     const chunks = [];

//     req.on("data", (chunk) => {
//       chunks.push(chunk);
//     });

//     req.on("end", () => {
//       resolve(Buffer.concat(chunks));
//     });

//     req.on("error", reject);
//   });
// };


export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  let url = req.url;

  switch (method) {
    case "POST":
      
      // const sig = req.headers["stripe-signature"];
      // const body = await buffer(req);
            
      //  let event;

      //  try {
      //    event = stripe.webhooks.constructEvent(
      //      body,
      //      sig,
      //      process.env.STRIPE_ENDPOINT
      //    );
      //  } catch (err) {
      //    console.log("Stripe Error>>>", err);
      //    res.status(400).send(`Webhook Error: ${err.message}`);
      //    return;
      //  }
      
       const requestBuffer = await buffer(req);
       const signature = req.headers["stripe-signature"];
      
      console.log("requestBuffer>>>>", requestBuffer.toString());
      console.log("signature>>>>", signature);
      
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          requestBuffer.toString(), // Stringify the request for the Stripe library
          signature,
          process.env.STRIPE_ENDPOINT // you get this secret when you register a new webhook endpoint
        );
      } catch (error) {
        console.log("Event Error>>>>", error);
      }

      console.log("Event details>>>>>", event.type);

      // Handle the event
      switch (event.type) {

        case "customer.subscription.updated":
        case "customer.subscription.created":
          const subscriptionIntent = event.data.object;
          // console.log(
          //   "subscriptionIntent>>>>\n",
          //   JSON.stringify(subscriptionIntent) + "\n"
          // );

          // Get User Info

          let getObj = {
            modal: "UserInfo",
            url: url,
            type: "findOne",
            selectFields: ["stripe_cust_id", "user_id"],
            condition: { stripe_cust_id: subscriptionIntent.customer },
          };

          let userInfo = await fetchRecords(getObj);

          let subscriptionType = "monthly"

          console.log("userInfo fetch>>>>>", userInfo);

          if (!Array.isArray(userInfo)) {
            // Update User Info


            if (
              subscriptionIntent.items.data[0].price.id ===
                "price_1NM6aYSA7KKTO1VwsEcSIc35" ||
              subscriptionIntent.items.data[0].price.id ===
                "price_1NM7LMSA7KKTO1VwHdmtoBAL"
              
              // || subscriptionIntent.items.data[0].price.id === "price_1NM6aYSA7KKTO1VwsEcSIc35"
            ) {
              subscriptionType = "yearly";
            }

            let updateFields = [
              { key: "is_paid_user", value: true },
              { key: "platform", value: "stripe" },
              {
                key: "plan_id",
                value: subscriptionIntent.items.data[0].price.id,
              },
              {
                key: "subscription_type",
                value: subscriptionType,
              },
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

            let x = await updateRecord(updateObj);

            console.log("update>>>>>", x);
          }

          res.status(200).json({ success: true });
          break;

        case "customer.subscription.deleted":
          const abortIntent = event.data.object;
          console.log("abortIntent>>>>\n", abortIntent + "\n");

          // Get User Info

          let getCancelObj = {
            modal: "UserInfo",
            url: url,
            type: "findOne",
            selectFields: ["stripe_cust_id", "user_id"],
            condition: { stripe_cust_id: abortIntent.customer },
          };

          let userCancelInfo = await fetchRecords(getCancelObj);

          if (!Array.isArray(userCancelInfo)) {
            // Update User Info

            let updateFields = [
              { key: "is_paid_user", value: false },
              { key: "platform", value: "stripe" },
              { key: "plan_id", value: abortIntent.items.data[0].price.id },
              { key: "updated_at", value: new Date() },
            ];

            let updateObj = {
              modal: "UserInfo",
              url: url,
              type: "findById",
              updateFields: updateFields,
              id: userCancelInfo._id,
              selectFields: ["stripe_cust_id"],
            };

            await updateRecord(updateObj);
          }

          res.status(200).json({ success: true });

          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
          res.status(400).json({ success: false, error: event.type });
      }

      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
