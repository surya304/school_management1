import mongoose from 'mongoose'

/* OrderSchema will correspond to a collection in your MongoDB database. */
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
})

export default mongoose.models.Subject ||
  mongoose.model('Subject', subjectSchema)