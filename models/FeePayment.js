import mongoose from 'mongoose'

/* OrderSchema will correspond to a collection in your MongoDB database. */
const feeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Klass",
  },
  mode: {
    type: String, // Cash Card UPI etc
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transaction_id: {
    type: String,
  },

  payment_date: {
    type: Date, // 11/04/2023
  },

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

export default mongoose.models.FeePayment ||
  mongoose.model("FeePayment", feeSchema);