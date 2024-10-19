import mongoose from 'mongoose'

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserInfoSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  onboarded: { type: Boolean, default: false },
  verified_email: { type: Boolean, default: false },
  verified_phone: { type: Boolean, default: false },
  is_paid_user: { type: Boolean, default: false },
  platform: { type: String },
  stripe_cust_id: { type: String },
  plan_id: { type: String, default: "free" },
  subscription_type: { type: String, default: "monthly" },
  is_team_member: { type: Boolean, default: false },
  invited_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  invite_accepted: { type: Boolean, default: false },
  trial_expires: {
    type: Date,
    default: () => Date.now() + 14 * 24 * 60 * 60 * 1000, // add 14 days to current date
  },

  // Waiter Related Fields
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  tables: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    },
  ],

  revoked_access: { type: Boolean, default: false },

  otp: { type: String },
  otp_expires: { type: Date },

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

export default mongoose.models.UserInfo ||
  mongoose.model("UserInfo", UserInfoSchema);