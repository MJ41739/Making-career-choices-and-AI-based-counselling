import { Router } from "express";
import { addQuestion, getQuestionsCountByCategory,getRandomQuestions, submit, submitTest } from "../Controllers/questions.controller.js";
const router = Router()

router.route("/addquestion").post(addQuestion)
router.route("/getquestionscount").get(getQuestionsCountByCategory)
router.route("/getQuestions").get(getRandomQuestions)
router.route("/submitTest").post(submitTest)
router.route("/submit").post(submit)

export default router