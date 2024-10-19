import mongoose from "mongoose";

/* UserBillingSchema will correspond to a collection in your MongoDB database. */
const UserBillingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: { type: String, default: "pending" },
  provider: { type: String }, // Payment Gateway
  provider_id: { type: String }, // Payment Gateway Unique Transaction ID
  mode: { type: String }, // Credit Card or Debit Card or UPI or Netbanking
  amount: { type: Number },
  currency: { type: String },
  plan_id: { type: String },

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

export default mongoose.models.UserBilling ||
  mongoose.model("UserBilling", UserBillingSchema);
