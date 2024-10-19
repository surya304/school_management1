import mongoose from 'mongoose'

/* UserSchema will correspond to a collection in your MongoDB database. */
const FamilyUserSchema = new mongoose.Schema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
  },

  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },

  name: { type: String, trim: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/,
      "Please enter a valid email address",
    ],
  },
  mobile: {
    type: String,
    sparse: true,
  },
  mobile_country: { type: String },
  password: { type: String, minlength: 6 },
  pic: { type: String },
  role: { type: String, default: "father" }, // father mother guardian 

  // verification_key: { type: String, unique: true },
  // verification_expires: { type: Date },

  signup_from: { type: String, default: "form" }, // form google facebook instagram
  country: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  profile_pic: { type: String },
  access_revoke: { type: Boolean, default: false },

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});



export default mongoose.models.FamilyData || mongoose.model('FamilyData', FamilyUserSchema)