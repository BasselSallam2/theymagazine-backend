import GenericController from "@shared/generic.controller";
import postService from "./post.service";
import { POST_DTO_KEYS, type IPOST, type IPOSTDTO } from "./post.interface";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { SucessRes } from "@shared/responces/success.responces";
import { dtoHandler } from "@utils/dtoHandler";
import usersService from "@modules/Users/users.service";
import type { tokenDecode } from "@modules/Auth/auth.interface";
import { permissions } from "@modules/Roles/role.interface";

class postController extends GenericController<IPOST> {
	constructor() {
		super(postService);
	}

	override createOne = asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.user as tokenDecode;
		let inputs = dtoHandler<IPOSTDTO>(req.body, POST_DTO_KEYS) as unknown as Partial<IPOST>;
		inputs.author = id;
		const userPermessions = await usersService.getUserPermessions(id);
		if (userPermessions.includes(permissions.PUBLISHPOST)) {
			inputs = { ...inputs, status: inputs.status || "published" };
		} else {
			inputs = { ...inputs, status: inputs.status || "draft" };
		}
		 await postService.createOne(inputs);
		SucessRes.success(res, "Post created successfully", 201);
	});

	getOneBySlug = asyncHandler(async (req: Request, res: Response) => {
		const { categorySlug, postSlug } = req.params;
		const post = await postService.getOneBySlug(categorySlug, postSlug);
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found"
			});
		}
		SucessRes.success(res, "Post fetched successfully", 200, { data: post });
	});

	getPostsByCategorySlug = asyncHandler(async (req: Request, res: Response) => {
		const { categorySlug } = req.params;
		const result = await postService.getPostsByCategorySlug(categorySlug, req.query);
		SucessRes.success(res, "Posts fetched successfully", 200, {
			data: result.data,
			pagination: result.paginationResult,
		});
	});
}

export default new postController();
