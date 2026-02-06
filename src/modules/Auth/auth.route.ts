import { Router } from "express";
import { authController } from "./auth.controller";
import { createUserValidation } from "./auth.validator";

const router = Router();

router.route("/signin").post(authController.signin);
router.route("/signup").post(createUserValidation, authController.signup);
router.route("/verifyOtp").post(authController.verifyOtp);

export { router as authRouter };
