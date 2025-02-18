import { Schema, model } from "mongoose";

const UserProgressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model
  },
  currentQuestionIndex: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const UserProgress = model("UserProgress", UserProgressSchema);
export default UserProgress;
