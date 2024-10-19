import mongoose from 'mongoose'

/* OrderSchema will correspond to a collection in your MongoDB database. */
const schoolSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true },
  logo: { type: String },
  cover_pic: { type: String },
  description: { type: String },
  address: { type: String },
  phone1: { type: String }, 
  phone2: { type: String },
  phone3: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  googleMaps_url: { type: String },
  email: { type: String },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
})

export default mongoose.models.School || mongoose.model('School', schoolSchema)