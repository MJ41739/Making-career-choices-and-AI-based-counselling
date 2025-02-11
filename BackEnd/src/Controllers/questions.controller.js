import Question from "../Models/questions.models.js";
import axios from "axios";

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

const getRandomQuestions = async (req, res) => {
    const categories = ['Numerical Ability', 'Verbal Ability', 'Logical Reasoning', 'Cognitive Ability','Spatial Reasoning'];
    const selectedQuestions = [];
    try {
        for (let category of categories) {
            const categoryQuestions = await Question.aggregate([
                { $match: { category } },  
                { $sample: { size: 1 } }  
            ]);
            
            selectedQuestions.push(...categoryQuestions); 
        }

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
// const urll = "localhost:5000"
const urll = "ml-career-path.onrender.com"
const submitTest = async (req,res) => {
    try {
        console.log("in backendddddd");
        // let scores  = [2.6,4.6,6.8,7.7,9.2,5.1,2.3,5.6,7.8,9.0]
        const { scores } = req.body;
        const response = await axios.post(`https://${urll}/api/v1/questions/submitTest`, { scores: scores });
        // console.log(response.data.prediction);
        console.log(response.data);
        return res.status(200).json({
            message: "Successfully submitted test",
            data: response.data.prediction
        });
        
    } catch (error) {
        console.log("errrorrrrrr");
        
        console.error(error);
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

export {addQuestion, getQuestionsCountByCategory, getRandomQuestions, submitTest, submit}