import GenericController from "@shared/generic.controller";
import navbarService from "./navbar.service";
import type { INAVBAR } from "./navbar.interface";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { SucessRes } from "@shared/responces/success.responces";

class navbarController extends GenericController<INAVBAR> {
	constructor() {
		super(navbarService);
	}

	 updateIdx = asyncHandler(async (req: Request, res: Response) => {
		const {id} = req.params;
		const {idx} = req.body;
		await navbarService.updateIdx(id, idx);
		SucessRes.success(res, "Idx updated successfully", 200);
	})
}

export default new navbarController();
