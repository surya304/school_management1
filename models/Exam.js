import mongoose from 'mongoose'

/* This is Master data of all Subjects linked to a Specific Category */
const ExamsSchema = new mongoose.Schema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,

  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  name: {
    type: String, // Quarterly Exams, Unit Test
  },
  date_range:
    {
      type: String, //  11/04/2023 - 14 /04/2023
  
    },

    from_date: {
      type: Date, // 11/04/2023
    },
    to_date: { 
      type: Date
    
    },  
  
    from_time: {
      type: Date, // 11/04/2023
    },
    to_time: { 
      type: Date
    
    },  

  classes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classes',
    }
  ],

  rowdata : [
    {

      class_id: {
        type: mongoose.Schema.Types.ObjectId,
        
        ref: 'Classes',
      },

      rows : [{
        date: {
          type: Date, // 11/04/2023
        },
        from_time: { type: Date },
        to_time: { type: Date },
  
        syllabus: { type: String },
  
        subject_id: [{
          type: mongoose.Schema.Types.ObjectId,
          
          ref: 'Subjects',
        }],
      }
        
      ]


    },
  ],
  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
})

export default mongoose.models.Exams || mongoose.model('Exams', ExamsSchema)
