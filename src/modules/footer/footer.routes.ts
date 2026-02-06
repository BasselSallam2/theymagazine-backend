import { Router } from "express";
import footerController from "./footer.controller";
import { protect } from "@middleware/auth.middleware";

const router = Router();


router.route("/")
.get(footerController.getAll)

router
    .route("/:id")
    .patch(protect , footerController.updateOne);

export { router as footerRouter };
