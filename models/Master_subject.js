import mongoose from 'mongoose'

/* OrderSchema will correspond to a collection in your MongoDB database. */
const Master_subjectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },


  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
})

export default mongoose.models.Master_subjects ||
  mongoose.model('Master_subjects', Master_subjectsSchema)