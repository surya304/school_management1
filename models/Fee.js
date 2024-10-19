import mongoose from 'mongoose'

/* OrderSchema will correspond to a collection in your MongoDB database. */
const feeSchema = new mongoose.Schema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  categories: {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classes',
      }
    ],

    fees: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        type: {
          type: String, // Quarterly, One Time, Yearly etc
          required: true,
        },
        due_date: {
          type: Date,
        },
      }
    ]
  },



  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
})

export default mongoose.models.Fee || mongoose.model('Fee', feeSchema)
