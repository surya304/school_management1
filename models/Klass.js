import mongoose from "mongoose";

/* OrderSchema will correspond to a collection in your MongoDB database. */
const KlassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // ex XA, XB
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },

  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],

  optional_subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],

  // Time Table Related Fields

  monday: [
    {
      teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: false },
      subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: false },
      from_time: {
        type: String,
      },
      to_time: {
        type: String,
      },
      type: {
        type: String,
        default: "period", // break
      },
      name: {
        type: String, // will use this for break object ex :lunch break , short break ,snacks
      },
      is_del: { type: Boolean, default: false },
      is_active: { type: Boolean, default: true },
    },
  ],
  tuesday: [
    {
      teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: false },
      subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: false },
      from_time: {
        type: String,
      },
      to_time: {
        type: String,
      },
      type: {
        type: String,
        default: "period", // break
      },
      name: {
        type: String, // will use this for break object ex :lunch break , short break ,snacks
      },

      is_del: { type: Boolean, default: false },
      is_active: { type: Boolean, default: true },
    },
  ],
  wednesday: [
    {
      time: { type: String },
      teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: false },
      subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: false },
      from_time: {
        type: String,
      },
      to_time: {
        type: String,
      },
      type: {
        type: String,
        default: "period", // break
      },
      name: {
        type: String, // will use this for break object ex :lunch break , short break ,snacks
      },
      is_del: { type: Boolean, default: false },
      is_active: { type: Boolean, default: true },
    },
  ],
  thursday: [
    {
      time: { type: String },
      teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: false },
      subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: false },
      from_time: {
        type: String,
      },
      to_time: {
        type: String,
      },
      type: {
        type: String,
        default: "period", // break
      },
      name: {
        type: String, // will use this for break object ex :lunch break , short break ,snacks
      },
      is_del: { type: Boolean, default: false },
      is_active: { type: Boolean, default: true },
    },
  ],
  friday: [
    {
      time: { type: String },
      teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: false },
      subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: false },
      from_time: {
        type: String,
      },
      to_time: {
        type: String,
      },
      type: {
        type: String,
        default: "period", // break
      },
      name: {
        type: String, // will use this for break object ex :lunch break , short break ,snacks
      },
      is_del: { type: Boolean, default: false },
      is_active: { type: Boolean, default: true },
    },
  ],
  saturday: [
    {
      time: { type: String },
      teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: false },
      subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: false },
      from_time: {
        type: String,
      },
      to_time: {
        type: String,
      },
      type: {
        type: String,
        default: "period", // break
      },
      name: {
        type: String, // will use this for break object ex :lunch break , short break ,snacks
      },
      is_del: { type: Boolean, default: false },
      is_active: { type: Boolean, default: true },
    },
  ],
  sunday: [
    {
      time: { type: String },
      teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: false },
      subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: false },
      from_time: {
        type: String,
      },
      to_time: {
        type: String,
      },
      type: {
        type: String,
        default: "period", // break
      },
      name: {
        type: String, // will use this for break object ex :lunch break , short break ,snacks
      },
      is_del: { type: Boolean, default: false },
      is_active: { type: Boolean, default: true },
    },
  ],

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

export default mongoose.models.Klass || mongoose.model("Klass", KlassSchema);
