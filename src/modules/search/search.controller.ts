import asyncHandler from "express-async-handler";
import searchService from "./search.service";
import { devLogger } from "@utils/devLogger";


class searchController {
	private service = searchService;
	constructor() {}

	search = asyncHandler(async (req: any, res: any) => {
		const { query } = req.query;
		devLogger(query);
		const result = await this.service.search(query);
		res.status(200).json(result);
	});


	autoComplete = asyncHandler(async (req: any, res: any) => {
		const { query } = req.query;
		const result = await this.service.autoComplete(query);
		res.status(200).json(result);
	});

}

export default new searchController();
