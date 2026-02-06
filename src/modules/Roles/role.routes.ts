import { Router } from "express";
import RoleController from "./role.controller";
import { createRoleValidation } from "./role.validator";
import { protect , allowedTo } from "@middleware/auth.middleware";
import { permissions } from "./role.interface";

const router = Router();

router.route("/")
.get(protect , allowedTo(permissions.READROLE) ,  RoleController.getAll)
.post(protect , allowedTo(permissions.CREATEROLE) ,createRoleValidation ,RoleController.createOne);

router
	.route("/:id")
	.patch(protect , allowedTo(permissions.UPDATEROLE) ,RoleController.updateOne)
	.delete(protect , allowedTo(permissions.DELETEROLE) , RoleController.deleteOne);

export { router as roleRouter };
