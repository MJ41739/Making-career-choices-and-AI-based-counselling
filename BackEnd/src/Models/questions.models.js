import mongoose from 'mongoose';
// Define the Question schema
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [
    {
      type: String,
      required: true,
    }
  ],
  correctAnswer: {
    type: String,  // You could also use `Number` if you prefer using the index (0, 1, 2, 3)
    required: true,
  },
  category: {
    type: String,
    required: true,
  }
});

// Create the Question model
const Question = mongoose.model('Question', questionSchema);

// Export the model for use in other parts of the application
export default Question;
