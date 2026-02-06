import { Router } from "express";
import navbarController from "./navbar.controller";
import { protect, allowedTo } from "@middleware/auth.middleware";
import { permissions } from "@modules/Roles/role.interface";

const router = Router();

router.route("/")
.get(navbarController.getAll)
.post(protect , allowedTo(permissions.CREATENAVBAR) ,navbarController.createOne);

router
	.route("/:id")
	.patch(protect , allowedTo(permissions.UPDATENAVBAR) ,navbarController.updateOne)
	.delete(protect , allowedTo(permissions.UPDATENAVBAR) ,navbarController.deleteOne);

router
	.route("/idx/:id")
	.patch(protect , allowedTo(permissions.UPDATENAVBAR) ,navbarController.updateIdx);	

export { router as navbarRouter };
