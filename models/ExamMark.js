import mongoose from 'mongoose'

/* OrderSchema will correspond to a collection in your MongoDB database. */
const marksSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },

  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },

  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },

  grade: {
    type: String,
  },

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
})

export default mongoose.models.ExamMark ||
  mongoose.model('ExamMark', marksSchema)
