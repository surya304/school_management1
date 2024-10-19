import mongoose from 'mongoose'

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema({
  uid: { type: String, minlength: 6, unique: true },
  first_name: { type: String, trim: true, minlength: 3 },
  last_name: { type: String, trim: true, minlength: 1 },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/,
      "Please enter a valid email address",
    ],
  },

  password: { type: String, minlength: 6 },
  salt: { type: String, minlength: 10 },
  pic: { type: String },
  verification_key: { type: String},
  verification_expires: { type: Date },

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



export default mongoose.models.User || mongoose.model('User', UserSchema)