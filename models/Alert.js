import mongoose from 'mongoose'

/* OrderSchema will correspond to a collection in your MongoDB database. */
const alertSchema = new mongoose.Schema({

  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },

  parents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  ],

  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
})

export default mongoose.models.AlertModal || mongoose.model('AlertModal', alertSchema)
