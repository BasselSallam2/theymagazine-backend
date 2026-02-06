import { RoleValidationRules } from "./role.validation.rules";
import {validateResult} from "@middleware/validationRequest"
import { body } from "express-validator";


export const createRoleValidation = [
    RoleValidationRules.permissions(body("permissions")),
    validateResult
]