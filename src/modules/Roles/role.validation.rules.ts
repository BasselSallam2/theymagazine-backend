import { CommonValidator } from "@shared/generic.validator";
import type { ValidationChain } from "express-validator";
import { permissions } from "./role.interface";

export class RoleValidationRules extends CommonValidator {
	static permissions(chain: ValidationChain): ValidationChain {
		const permissionsArray = Object.values(permissions);
		return chain
			.custom((value: string[]) =>
				value.every((permission) => permissionsArray.includes(permission))
			)
			.withMessage("Invalid permissions , available permissions are " + permissionsArray);
	}
}
