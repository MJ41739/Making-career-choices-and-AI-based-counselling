import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  attemptedQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  wrongAnswers: {
    type: Number,
    required: true,
  },
  categoryScores: {
    type: Map,
    of: Number, // Each category has a numeric score
    required: true,
  },
  overallPercentage: {
    type: Number,
    required: true,
  },
  careerPrediction: {
    type: String,
    required: true,
  },
  takenAt: {
    type: Date,
    default: Date.now,
  },
});

const TestResult = mongoose.model("TestResult", testResultSchema);
export default TestResult;
