import mongoose from "mongoose";
const mediaSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  url: { type: String, required: true },
  type: { type: String, required: true },

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },

  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

export default mongoose.models.Media || mongoose.model("Media", mediaSchema);



