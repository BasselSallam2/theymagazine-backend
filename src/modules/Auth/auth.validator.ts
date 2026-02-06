import { AuthValidationRules } from "./auth.validation.rules";
import { validateResult } from "@middleware/validationRequest";
import { body } from "express-validator";

export const createUserValidation = [
	AuthValidationRules.email(body("email")),
	AuthValidationRules.password(body("password")),
	AuthValidationRules.text(body("name"), 3, 50),
	AuthValidationRules.text(body("phoneNumber"), 10, 20),
	validateResult,
];
