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
                { $sample: { size: 10 } }  
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

const submitTest = async (req,res) => {
    try {
        // let scores  = [2.6,4.6,6.8,7.7,9.2,5.1,2.3,5.6,7.8,9.0]
        const { scores } = req.body;
        const response = await axios.post('https://ml-career-path.onrender.com/api/v1/questions/submitTest', { scores: scores });
        // console.log(response.data.prediction);
        console.log(response);
        return res.status(200).json({
            message: "Successfully submitted test",
            data: response.data.prediction
        });
        
    } catch (error) {
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

export {addQuestion, getQuestionsCountByCategory, getRandomQuestions, submitTest}