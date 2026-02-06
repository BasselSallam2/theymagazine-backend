import { Router } from "express";
import usersController from "./users.controller";
import { protect, sensitiveProtect } from "@middleware/auth.middleware";

const router = Router();

router.route("/").get(usersController.getAll);

router
	.route("/:id")
	.get(usersController.getOne)
	.patch(usersController.updateOne)
	.delete(usersController.deleteOne);

export { router as usersRouter };
