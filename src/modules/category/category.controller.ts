import GenericController from "@shared/generic.controller";
import categoryService from "./category.service";
import type { ICATEGORY } from "./category.interface";
import asyncHandler from "express-async-handler";
import { ErrorRes } from "@shared/responces/errors.responces";
import type { Request , Response } from "express";
import { Types } from "mongoose";
import { SucessRes } from "@shared/responces/success.responces";

class categoryController extends GenericController<ICATEGORY> {
	constructor() {
		super(categoryService);
	}

	getOneWithAncestors = asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		if (!id || !Types.ObjectId.isValid(id)) return ErrorRes.documentNotFound();
		const result = await categoryService.getOneWithAncestors(id);
		SucessRes.success(res, "Fetched successfully", 200, result);
	});

	getOneBySlug = asyncHandler(async (req: Request, res: Response) => {
		const { slug } = req.params;
		const result = await categoryService.getOneBySlug(slug);
		if (!result) return ErrorRes.documentNotFound();
		SucessRes.success(res, "Fetched successfully", 200, result);
	});

	deleteOne = asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;

		// Check if this is the reels category
		const category = await this.service.getOne(id);
		if (category && category.slug === 'reels') {
			return res.status(400).json({
				success: false,
				message: 'Cannot delete the reels category as it is required for the application.'
			});
		}

		// Proceed with normal deletion for other categories
		await this.service.deleteOne(id);
		res.redirect('/dashboard/categories');
	});
}


	

export default new categoryController();
