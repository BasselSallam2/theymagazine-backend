import { postModel } from "@modules/POST/post.schema";
import { userModel } from "@modules/Users/users.schema";

export class SearchService {
	private userModel = userModel;
	private postModel = postModel;

	private escapeRegex(string: string) {
		return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
	}

	constructor() {}

	async search(query: string) {
		const result = {} as { users?: any[]; posts?: any[] };
		if (!query || !query.trim()) {
			result.posts = [];
			return result;
		}

		const [posts] = await Promise.all([
			this.postModel
				.find({ $text: { $search: query } })
				.select("title slug image category author description content createdAt status tags")
				.populate({ path: "category", select: "name slug" })
				.populate({ path: "author", select: "name slug email" })
				.exec(),
		]);
		if (posts) result.posts = posts;

		return result;
	}

	async autoComplete(query: string) {
		const result = {} as { posts?: any[] };
		const safeQuery = this.escapeRegex(query);
		const regexQuery = { $regex: "^" + safeQuery, $options: "i" };
		const postSearch = this.postModel
			.find({
				$or: [
					{ title: regexQuery },
					{ description: regexQuery },
					{ content: regexQuery },
					{ tags: regexQuery },
				],
			})
			.limit(5)
			.select("title slug image category").populate({path: 'category', select: 'name slug'});

		const [posts] = await Promise.all([postSearch.exec()]);

		if (posts) result.posts = posts;

		return result;
	}
}

export default new SearchService();
