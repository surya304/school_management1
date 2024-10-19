import mongoose from 'mongoose'

/* OrderSchema will correspond to a collection in your MongoDB database. */
const eventSchema = new mongoose.Schema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,

  },

  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true, // Exam or General.
  },

  exam_id: { // if exam type 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
  },

  from_date: {
    type: Date,
    required: true,
  },

  to_date: {
    type: Date,
    required: true,
  },
  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
})

export default mongoose.models.Event || mongoose.model('Event', eventSchema)
