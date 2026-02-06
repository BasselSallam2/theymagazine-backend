import { Router } from "express";
import searchController from "./search.controller";


const router = Router();


router.route("/")
.get(searchController.search)

router.route("/autocomplete")
.get(searchController.autoComplete)


export { router as searchRouter };
