import { Router } from "express";
import categoryController from "./category.controller";
import { protect, allowedTo } from "@middleware/auth.middleware";
import { permissions } from "@modules/Roles/role.interface";

const router = Router();

router.route("/")
.get(categoryController.getAll)
.post(protect , allowedTo(permissions.CREATECATEGORY) , categoryController.createOne);

router
	.route("/slug/:slug")
	.get(categoryController.getOneBySlug);

router
	.route("/:id")
	.get(categoryController.getOneWithAncestors)
	.patch(protect , allowedTo(permissions.UPDATECATEGORY) ,categoryController.updateOne)
	.delete(protect , allowedTo(permissions.DELETECATEGORY) ,categoryController.deleteOne);

export { router as categoryRouter };
