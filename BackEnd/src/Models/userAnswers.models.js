import { Schema, model } from "mongoose";

const UserAnswerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model
  },
  questionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Question", // Reference to the Question model
  },
  selectedOption: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserAnswer = model("UserAnswer", UserAnswerSchema);
export default UserAnswer;
