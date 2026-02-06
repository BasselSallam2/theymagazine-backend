import { Router } from "express";
import postController from "./post.controller";
import { protect , allowedTo } from "@middleware/auth.middleware";
import { permissions } from "@modules/Roles/role.interface";

const router = Router();

router.route("/")
.get(postController.getAll)
.post(protect , allowedTo(permissions.CREATEPOST) ,postController.createOne);

router
	.route("/:id")
	.get(postController.getOne)
	.patch(protect , allowedTo(permissions.UPDATEPOST) ,postController.updateOne)
	.delete(protect , allowedTo(permissions.DELETEPOST) ,postController.deleteOne);

router
	.route("/status/:id")
	.patch(protect , allowedTo(permissions.PUBLISHPOST) ,postController.updateOne);

router
	.route("/category/:categorySlug")
	.get(postController.getPostsByCategorySlug);

router
	.route("/:categorySlug/:postSlug")
	.get(postController.getOneBySlug);

export { router as postRouter };
