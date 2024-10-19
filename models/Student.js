import mongoose from 'mongoose'



/* OrderSchema will correspond to a collection in your MongoDB database. */
const studentSchema = new mongoose.Schema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,

  },
    key: {
    type: String,
    required: true, // Unique to the school
  },

  student_personal_id: {
    type: String,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },

  optional_subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],

  description: {
    type: String,
  },

  phone: {
    type: String,
  },
  address: {
    type: String,
  },
    gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
  },
    profile_pic: {
    type: String,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  father_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyData',
  },
  mother_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyData',
  },
  guardian_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyData',
  },
  siblings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Klass',
  },
  blood_group: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  },
  profile_image: {
    type: String,
  },

  marks_data: [{
    "exam_id": {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exams',
    },
    'marks_data': [
      {
        subject_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
        marks: {
          type: String,
        },

      }
    ]
  }],
  attendance_data: [{

    is_present: {
      type: Boolean,
    },
    date_data: {
      type: String,
    },


  }],



 
  is_del: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
})

export default mongoose.models.Student ||
  mongoose.model('Student', studentSchema)
