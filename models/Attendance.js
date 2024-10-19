import mongoose from 'mongoose'

/* OrderSchema will correspond to a collection in your MongoDB database. */
const attSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  type: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student',
  },

  status: {
    type: String,
    enum: ['present', 'absent'],
    default: 'present',
  },

  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },

  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
})

export default mongoose.models.Attendance ||
  mongoose.model('Attendance', attSchema)
