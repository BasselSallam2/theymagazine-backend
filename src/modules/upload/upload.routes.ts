import { Router } from "express";
import uploadController from "./upload.controller";
import {upload} from "@config/multer.config"
import { protect } from "@middleware/auth.middleware";

const router = Router();

router.route("/")
.post( upload.single("image"), uploadController.upload);



export { router as uploadRouter };
