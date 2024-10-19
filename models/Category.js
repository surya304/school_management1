import mongoose from 'mongoose'

/* OrderSchema will correspond to a collection in your MongoDB database. */
const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true, // ex Primary School, Middle School, High School etc 
    },

    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true,
    },    
   
    is_del: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() },
});

export default mongoose.models.Category ||
  mongoose.model('Category', categorySchema)