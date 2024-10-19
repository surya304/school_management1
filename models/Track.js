import mongoose from "mongoose";
const mediaSchema = new mongoose.Schema({
  smartsite_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Smartsite",
    required: true,
  },
  views: [
    {
      count: {
        type: Number, default: 1
      },
      date: {
        type: Date,
      },
    },
  ],
  clicks: [
    {
      count: {
        type: Number, default: 1
      },
      date: {
        type: Date,
      },
    },
  ],

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },

  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

export default mongoose.models.Track || mongoose.model("Track", mediaSchema);



