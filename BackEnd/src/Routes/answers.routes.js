import { Router } from "express";
import { submitAnswer } from "../Controllers/questions.controller.js";
const router = Router()

router.route("/submitAnswer").post(submitAnswer)

export default router