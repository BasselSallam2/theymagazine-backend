import GenericService from "@shared/generic.service";
import type { IPOST } from "./post.interface";
import { postModel } from "./post.schema";
import categoryService from "@modules/category/category.service";

export class PostService extends GenericService<IPOST> {
	constructor() {
		super(postModel);
	}

	async getOneBySlug(categorySlug: string, postSlug: string) {
		try {
			// Use aggregation to match both post slug and category slug in one query
			const posts = await postModel.aggregate([
				{
					$match: {
						slug: postSlug,
						deleted: false
					}
				},
				{
					$lookup: {
						from: 'categories', // Assuming your category collection is named 'categories'
						localField: 'category',
						foreignField: '_id',
						as: 'category'
					}
				},
				{
					$unwind: {
						path: '$category',
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$match: {
						'category.slug': categorySlug,
						'category.deleted': { $ne: true } // Make sure category is not deleted
					}
				},
				{
					$lookup: {
						from: 'users', // Assuming your user collection is named 'users'
						localField: 'author',
						foreignField: '_id',
						as: 'author'
					}
				},
				{
					$unwind: {
						path: '$author',
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$project: {
						_id: 1,
						title: 1,
						content: 1,
						description: 1,
						image: 1,
						slug: 1,
						status: 1,
						seo: 1,
						views: 1,
						isFeatured: 1,
						allowComments: 1,
						deleted: 1,
						createdAt: 1,
						updatedAt: 1,
						tags: 1,
						author: {
							_id: 1,
							name: 1,
							email: 1
						},
						category: {
							_id: 1,
							name: 1,
							slug: 1
						}
					}
				}
			]);

			return posts.length > 0 ? posts[0] : null;
		} catch (error) {
			console.error('Error fetching post by slug:', error);
			return null;
		}
	}

	async getPostsByCategorySlug(categorySlug: string, querystring?: Record<string, any>) {
		try {
			console.log('Fetching posts for category slug:', categorySlug);

			// First, find the category by slug
			const category = await categoryService.getOneBySlug(categorySlug);
			if (!category) {
				console.log('Category not found:', categorySlug);
				return { data: [], paginationResult: { count: 0, page: 1, limit: 10, pages: 0, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null, lastPage: 0 } };
			}

			console.log('Found category:', category._id, category.name);

			// Now find posts that belong to this category
			const posts = await postModel.find({
				category: category._id,
				deleted: false
			})
				.populate({
					path: 'category',
					select: 'name slug description'
				})
				.populate({
					path: 'author',
					select: 'name email slug'
				})
				.sort({ createdAt: -1 });

			console.log('Found posts:', posts.length);

			// Apply pagination
			const page = parseInt(querystring?.page) || 1;
			const limit = parseInt(querystring?.limit) || 10;
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedPosts = posts.slice(startIndex, endIndex);

			const totalPages = Math.ceil(posts.length / limit);

			return {
				paginationResult: {
					count: posts.length,
					page,
					limit,
					pages: totalPages,
					hasNextPage: page < totalPages,
					hasPrevPage: page > 1,
					nextPage: page < totalPages ? page + 1 : null,
					prevPage: page > 1 ? page - 1 : null,
					lastPage: totalPages
				},
				data: paginatedPosts
			};
		} catch (error) {
			console.error('Error fetching posts by category slug:', error);
			return { data: [], paginationResult: { count: 0, page: 1, limit: 10, pages: 0, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null, lastPage: 0 } };
		}
	}

}

export default new PostService();
