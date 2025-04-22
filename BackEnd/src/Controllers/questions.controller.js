import { response } from "express";
import User from "../Models/users.models.js";
import Question from "../Models/questions.models.js";
import TestResult from "../Models/testResults.models.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userRegister = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, "your_secret_key", { expiresIn: "7d" });
  
      res.json({ token, userId: user._id, email});
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
const getQuestionsCountByCategory = async (req, res) => {
    try {
        // Aggregate the questions by category and count the number of questions in each category
        const questionCountByCategory = await Question.aggregate([
            {
                $group: {
                    _id: "$category", // Group by the 'category' field
                    count: { $sum: 1 } // Count the number of questions in each category
                }
            },
            {
                $sort: { count: -1 } // Optional: Sort by the count in descending order
            }
        ]);

        return res.status(200).json({
            message: "Successfully fetched question count by category",
            data: questionCountByCategory
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error while fetching question counts",
            error: error.message
        });
    }
};

const submit = async (req, res) => {
    try {
      const { answers } = req.body; // { "q1": "A", "q2": "B", ... }
  
      if (!answers || Object.keys(answers).length === 0) {
        return res.status(400).json({ error: "No answers provided" });
      }
  
      // Fetch all questions from the database
      const questions = await Question.find();
  
      let score = 0;
      let totalQuestions = questions.length;
  
      // Compare submitted answers with correct answers
      questions.forEach((question) => {
        const questionId = question._id.toString(); // Convert ObjectId to string
        if (answers[questionId] && answers[questionId] === question.correctAnswer) {
          score += 1; // Increase score if the answer is correct
        }
      });
  
      const percentage = ((score / totalQuestions) * 100).toFixed(2);
  
      res.json({ score, totalQuestions, percentage, message: "Test submitted successfully!" });
    } catch (error) {
      console.error("Error processing test:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  const submitAnswer = async (req, res) => {
    try {
      const { questionId, selectedOption } = req.body;
  
      // Store answer to the database (e.g., UserAnswers collection)
      const userAnswer = await UserAnswers.findOneAndUpdate(
        { userId: req.user.id, questionId },
        { selectedOption },
        { upsert: true }
      );
  
      // Optionally store the current question index as well to track progress
      await UserProgress.findOneAndUpdate(
        { userId: req.user.id },
        { currentQuestionIndex: req.body.currentQuestionIndex },
        { upsert: true }
      );
  
      res.status(200).json({ message: "Answer saved successfully!" });
    } catch (error) {
      console.error("Error saving answer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

const addQuestion = async (req,res) =>{
    const { questions } = req.body;

    if (!questions || questions.length == 0){
        return res.status(400).json({
            message:"Questions are required!"
        })
    }

    for (let i=0; i<questions.length; i++){
        const {question,options,correctAnswer,category} = questions[i];

        if (!question || !options || !correctAnswer || !category || options.length == 0){
            return res.status(400).json({
                message:"All fields are required!"
            })
        }

        const existingQuestion = await Question.findOne({question});
        if (existingQuestion){
            return res.status(400).json({
                message:"Question already exists!"
            })
        }


    }

    try {
        const savedQuestions = await Question.insertMany(questions)
        return res.status(200).json({
            message:"Questions added succesfully!",
            questions:savedQuestions
        })
    } catch (error) {
         console.error(error);
         res.status(500).json({
            message:"Error while adding question!",
            error:error.message
        })
        
    }
    

}
let fetchedquestions = 0;
const getRandomQuestions = async (req, res) => {
    const categories = ['Numerical Ability', 'Verbal Ability', 'Logical Reasoning', 'Cognitive Ability','Spatial Reasoning'];
    const selectedQuestions = [];
    try {
        for (let category of categories) {
            const categoryQuestions = await Question.aggregate([
                { $match: { category } },  
                { $sample: { size: 10 } }  
            ]);
            
            selectedQuestions.push(...categoryQuestions); 
        }
        fetchedquestions = selectedQuestions.length;
        return res.status(200).json({
            message: "Successfully fetched random questions",
            data: selectedQuestions
        });
    } catch (err) {
        console.error("Error fetching questions:", err);
        return res.status(500).json({
            message: "Error fetching questions",
            error: err
        });
    }
};
const urll = "localhost:5000"
// const urll = "ml-career-path.onrender.com"
const submitTest = async (req, res) => {
  try {
    const { answers } = req.body; // { "questionId1": "A", "questionId2": "B", ... }

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ error: "No answers provided" });
    }

    // Fetch all questions from the database
    const questions = await Question.find();

    let scores = {}; // Object to store category-wise scores
    let categoryTotals = {}; // Object to store total questions per category

    let totalQuestions = fetchedquestions;
    let attemptedQuestions = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    // Initialize category totals
    questions.forEach((question) => {
      const category = question.category;
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
        scores[category] = 0;
      }
      categoryTotals[category]++;
    });

    // Compare submitted answers with correct answers
    questions.forEach((question) => {
      const category = question.category;
      const questionId = question._id.toString();

      if (answers[questionId]) {
        attemptedQuestions++; // Count attempted questions
        if (answers[questionId] === question.correctAnswer) {
          scores[category]++; // Increase category score if correct
          correctAnswers++;
        } else {
          wrongAnswers++;
        }
      }
    });

    // Calculate percentages for each category
    let categoryPercentages = {};
    let totalScore = 0;

    for (const category in scores) {
      const score = scores[category];
      const total = categoryTotals[category];
      
      // Calculate percentage for each category
      categoryPercentages[category] = ((score / total) * 100).toFixed(2);

      // Add to total score
      totalScore += score;
    }

    // Calculate overall percentage
    const overallPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    console.log("Category Scores:", scores);
    console.log("Category Percentages:", categoryPercentages);
    console.log("Overall Percentage:", overallPercentage);
    console.log("Total Questions:", totalQuestions);
    console.log("Attempted Questions:", attemptedQuestions);
    console.log("Correct Answers:", correctAnswers);
    console.log("Wrong Answers:", wrongAnswers);

    // Send scores to the ML Model API
    const response = await axios.post("https://ml-career-path.onrender.com/api/v1/questions/submitTest", {
      scores: scores,
    });
    console.log("ML Model Response:", response.data);

    // Return the final result
    res.json({
      message: "Test submitted successfully!",
      data: {
        prediction: response.data.prediction,
        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        wrongAnswers,
        overallPercentage,
        categoryPercentages,
      },
    });

    const testResult = new TestResult({
      email: req.body.email,
      totalQuestions: totalQuestions,
      attemptedQuestions: attemptedQuestions,
      correctAnswers: correctAnswers,
      wrongAnswers: wrongAnswers,
      categoryScores: scores, // from your logic
      overallPercentage: overallPercentage,
      careerPrediction: response.data.prediction, // from ML model
    });

    await testResult.save();

  } catch (error) {
    console.error("Error processing test:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





// const addQuestion = async(req,res)=>{
//     const {question,options,correctAnswer,category} = req.body;

//     if (!question || !options || !correctAnswer || !category || options.length == 0){
//         return res.status(400).json({
//             message:"All fields are required!"
//         })
//     }

//     const existingQuestion = await Question.findOne({question});
//     if (existingQuestion){
//         return res.status(400).json({
//             message:"Question already exists!"
//         })
//     }

//     const newQuestion = new Question({
//         question,
//         options,
//         correctAnswer,
//         category
//     })    

//     try {
//         const savedQuestion = await newQuestion.save();

//         return res.status(200).json({
//             message:"Question added succesfully!",
//             question:savedQuestion
//         })
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message:"Error while adding question!",
//             error:error.message
//         })
        
        
        
//     }

// }

export {userRegister, userLogin, addQuestion, getQuestionsCountByCategory, getRandomQuestions, submitTest, submit, submitAnswer}