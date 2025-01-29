import { Router } from "express";
import { addQuestion, getQuestionsCountByCategory,getRandomQuestions, submitTest } from "../Controllers/questions.controller.js";
const router = Router()

router.route("/addquestion").post(addQuestion)
router.route("/getquestionscount").get(getQuestionsCountByCategory)
router.route("/getQuestions").get(getRandomQuestions)
router.route("/submitTest").post(submitTest)

export default router