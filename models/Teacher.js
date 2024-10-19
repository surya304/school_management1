import mongoose from 'mongoose'

/* OrderSchema will correspond to a collection in your MongoDB database. */
const teacherSchema = new mongoose.Schema({


  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
  },
  key: {
    type: String,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  
  description: {
    type: String,
    required: true,
  },

  address: {
    type: String,
  },
  profile_pic: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'male',
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
  ],

  attendance_data: [{

    is_present: {
      type: Boolean,
    },
    date_data: {
      type: String,
    },
    reason : {
      type: String,

    }


  }],
  password: { type: String, minlength: 6 },
  salt: { type: String, minlength: 10 },
  otp: { type: String },
  otp_expires: { type: Date },
  verification_key: { type: String, unique: true },
  verification_expires: { type: Date },
  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
})

export default mongoose.models.Teacher ||
  mongoose.model('Teacher', teacherSchema)

  
