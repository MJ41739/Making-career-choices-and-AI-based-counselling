import { Router } from "express";
import { userLogin, userRegister } from "../Controllers/questions.controller.js";
import { getUserTestHistory } from "../Controllers/testResult.controller.js";
const router = Router()

router.route("/register").post(userRegister)
router.route("/login").post(userLogin)
router.route("/history").post(getUserTestHistory)

export default router