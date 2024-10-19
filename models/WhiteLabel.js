import mongoose from "mongoose";
const whiteabelSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  smartsite_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Smartsite",
  },
  whitelabelurl: { type: String, required: true, unique: true, minlength: 5 },
  cloudflare_id: { type: String },
  txt_name: { type: String },
  txt_value: { type: String },
  txt_status: { type: String, default: "pending" },
  ver_name: { type: String },
  ver_value: { type: String },
  ver_status: { type: String, default: "pending" },

  is_active: { type: Boolean, default: true },
  is_del: { type: Boolean, default: false },

  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

export default mongoose.models.WhiteLabel ||
  mongoose.model("WhiteLabel", whiteabelSchema);
