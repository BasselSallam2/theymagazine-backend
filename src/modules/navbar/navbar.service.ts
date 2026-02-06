import GenericService from "@shared/generic.service";
import type { INAVBAR } from "./navbar.interface";
import { navbarModel } from "./navbar.schema";
import { ApiError } from "@utils/errorsHandlers/ApiError.handler";

export class NavbarService extends GenericService<INAVBAR> {
	constructor() {
		super(navbarModel);
	}

	async updateIdx(id: string, idx: number) {
		const documentsCount = await navbarModel.countDocuments();
		if(idx > documentsCount) throw new ApiError(`can't make idx = ${idx} because there are only ${documentsCount} documents`, 400)
		const currentIdx = await navbarModel.findById(id).select("idx");
	    if(currentIdx.idx === idx) return;
		const sameIdx = await navbarModel.findOne({idx});
		await navbarModel.updateOne({_id: id} , {$set: {idx}});
		await navbarModel.updateOne({_id: sameIdx._id} , {$set: {idx: currentIdx.idx}});
		return;
	}
}

export default new NavbarService();
