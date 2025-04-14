
import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobRole: { type: String, required: true },
    jobDescription: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    eyecontact: { type: Number ,default: 0},
    confidence: { type: Number ,default: 0},
    questions: [
      {
        questionText: { type: String},
        aiAnswer: { type: String },
        userAnswer: { type: String },
        aiFeedback: { type: String },
        score: { type: Number, default: 0 }
      }
    ],
    finalScore: { type: Number, default: 0 }
  }, { timestamps: true });
  

const Interview =  mongoose.model('Interview', InterviewSchema);    

export default Interview;

  