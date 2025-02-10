import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import cors from "cors";
import connectDB from "./DB/index.js";
import express from "express";
import Question from "./Models/questions.models.js";
const app = express();
app.use(express.json());
app.use(cors());

// const questionData = {
//     question: 'What is the capital of France?',
//     options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
//     correctAnswer: 'Paris',
//   };
  
import questionRouter from "./Routes/questions.routes.js";
app.use("/api/v1/questions",questionRouter)
  

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
