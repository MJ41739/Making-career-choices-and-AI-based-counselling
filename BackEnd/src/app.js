import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import cors from "cors";
import connectDB from "./DB/index.js";
import express from "express";
import Question from "./Models/questions.models.js";

const app = express();
app.use(express.json());
app.use(cors({//http://localhost:3000
    origin: '*',  // allow frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // allow needed methods
    credentials: true, // optional if you're using cookies or auth
  }));
app.options('*', cors());  

// const questionData = {
//     question: 'What is the capital of France?',
//     options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
//     correctAnswer: 'Paris',
//   };
  
import questionRouter from "./Routes/questions.routes.js";
app.use("/api/v1/questions",questionRouter)
import answerRouter from "./Routes/answers.routes.js";
app.use("/api/v1/answers", answerRouter)
import userRouter from "./Routes/users.routes.js";
app.use("/api/v1/users", userRouter)
  

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000,()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed !!!",error);
})


export {app}
