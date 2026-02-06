import GenericService from "@shared/generic.service";
import type { ICATEGORY } from "./category.interface";
import { categoryModel } from "./category.schema";
import { ErrorRes } from "@shared/responces/errors.responces";
import { Types } from "mongoose";



export class CategoryService extends GenericService<ICATEGORY> {
	constructor() {
		super(categoryModel);
	}

	 async getOneWithAncestors(id: string ) {
		const query = await categoryModel.findOneWithAncestors({_id: new Types.ObjectId(id)});
		const document = await query;
		if (!document) ErrorRes.documentNotFound();
		return document;
	}

	async getOneBySlug(slug: string) {
		const document = await categoryModel.findOne({ slug, deleted: false });
		return document;
	}
}

export default new CategoryService();
