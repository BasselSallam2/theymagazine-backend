import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import type { Types } from "mongoose";

// Extend Request interface to include multer file property
declare global {
	namespace Express {
		interface Request {
			file?: {
				fieldname: string;
				originalname: string;
				encoding: string;
				mimetype: string;
				buffer: Buffer;
				size: number;
			};
		}
	}
}

// Import services
import navbarService from "@modules/navbar/navbar.service";
import categoryService from "@modules/category/category.service";
import postService from "@modules/POST/post.service";
import userService from "@modules/Users/users.service";
import roleService from "@modules/Roles/role.service";
import footerService from "@modules/footer/footer.service";

// Import interfaces
import type { INAVBAR } from "@modules/navbar/navbar.interface";
import type { ICATEGORY } from "@modules/category/category.interface";
import type { IPOST } from "@modules/POST/post.interface";
import type { IUser } from "@modules/Users/users.interface";
import type { IROLE } from "@modules/Roles/role.interface";
import type { IFOOTER } from "@modules/footer/footer.interface";

// Import auth service for login
import { authService } from "@modules/Auth/auth.service";

// Import upload service for file uploads
import uploadService from "@modules/upload/upload.service";

const dashboardController = {
	// Login Page
	loginPage: asyncHandler(async (req: Request, res: Response) => {
		// If already logged in, redirect to dashboard
		if (req.cookies?.token) {
			return res.redirect('/dashboard');
		}
		res.render('dashboard/login', {
			title: 'Dashboard Login',
			error: req.query.error,
		});
	}),

	// Login Process
	login: asyncHandler(async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.redirect('/dashboard/login?error=Email and password are required');
		}

		try {
			const result = await authService.signin({ email, password }) as { token: string };

			// Set JWT token in cookie
			res.cookie('token', result.token, {
				httpOnly: true,
				secure: false, // Allow HTTP in development
				sameSite: 'lax', // Allow cross-site requests
				path: '/', // Send for all routes (needed for API calls)
				maxAge: 24 * 60 * 60 * 1000, // 24 hours
			});

			res.redirect('/dashboard');
		} catch (error) {
			res.redirect('/dashboard/login?error=Invalid credentials');
		}
	}),

	// Logout
	logout: asyncHandler(async (req: Request, res: Response) => {
		res.clearCookie('token', { path: '/' });
		res.redirect('/dashboard/login');
	}),

	// Dashboard Home
	dashboard: asyncHandler(async (req: Request, res: Response) => {
		// Get some basic stats
		const [navbarCount, categoryCount, postCount, userCount] = await Promise.all([
			navbarService.getAll().then(result => result.data.length),
			categoryService.getAll().then(result => result.data.length),
			postService.getAll().then(result => result.data.length),
			userService.getAll().then(result => result.data.length),
		]);

		res.render('dashboard/layout', {
			title: 'Dashboard',
			template: 'dashboard/index',
			user: req.user,
			stats: {
				navbar: navbarCount,
				categories: categoryCount,
				posts: postCount,
				users: userCount,
			},
		});
	}),

	// ===== NAVBAR MANAGEMENT =====
	navbarList: asyncHandler(async (req: Request, res: Response) => {
		const result = await navbarService.getAll({ populate: 'category' });
		res.render('dashboard/layout', {
			title: 'Navbar Management',
			template: 'dashboard/navbar/list',
			user: req.user,
			navbarItems: result.data,
			success: req.query.success,
			error: req.query.error,
		});
	}),

	navbarCreate: asyncHandler(async (req: Request, res: Response) => {
		const categoriesResult = await categoryService.getAll();
		res.render('dashboard/layout', {
			title: 'Create Navbar Item',
			template: 'dashboard/navbar/create',
			user: req.user,
			categories: categoriesResult.data,
		});
	}),

	navbarStore: asyncHandler(async (req: Request, res: Response) => {
		const navbarData: Partial<INAVBAR> = req.body;

		// Filter out empty strings for ObjectId fields
		if (!navbarData.category || (typeof navbarData.category === 'string' && navbarData.category === '')) {
			delete navbarData.category;
		}

		await navbarService.createOne(navbarData);
		res.redirect('/dashboard/navbar');
	}),

	navbarEdit: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const [navbarItem, categoriesResult] = await Promise.all([
			navbarService.getOne(id, { populate: 'category' }),
			categoryService.getAll(),
		]);
		res.render('dashboard/layout', {
			title: 'Edit Navbar Item',
			template: 'dashboard/navbar/edit',
			user: req.user,
			navbarItem,
			categories: categoriesResult.data,
		});
	}),

	navbarUpdate: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const navbarData: Partial<INAVBAR> = req.body;

		// Filter out empty strings for ObjectId fields
		if (!navbarData.category || (typeof navbarData.category === 'string' && navbarData.category === '')) {
			delete navbarData.category;
		}

		await navbarService.updateOne(id, navbarData);
		res.redirect('/dashboard/navbar');
	}),

	navbarUpdateIdx: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const { idx } = req.body;

		// Validate idx is a number
		const idxNumber = parseInt(idx);
		if (isNaN(idxNumber) || idxNumber < 0) {
			// For form submissions, redirect with error message
			return res.redirect('/dashboard/navbar?error=Invalid display order value');
		}

		try {
			await navbarService.updateIdx(id, idxNumber);
			res.redirect('/dashboard/navbar?success=Display order updated successfully');
		} catch (error) {
			res.redirect('/dashboard/navbar?error=' + error.message);
		}
	}),

	navbarDelete: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		await navbarService.deleteOne(id);
		res.redirect('/dashboard/navbar');
	}),

	// ===== CATEGORIES MANAGEMENT =====
	categoriesList: asyncHandler(async (req: Request, res: Response) => {
		const result = await categoryService.getAll({ populate: 'parent' });
		res.render('dashboard/layout', {
			title: 'Categories Management',
			template: 'dashboard/categories/list',
			user: req.user,
			categories: result.data,
		});
	}),

	categoriesCreate: asyncHandler(async (req: Request, res: Response) => {
		const result = await categoryService.getAll({ populate: 'parent' }); // For parent selection
		res.render('dashboard/layout', {
			title: 'Create Category',
			template: 'dashboard/categories/create',
			user: req.user,
			categories: result.data,
		});
	}),

	categoriesStore: asyncHandler(async (req: Request, res: Response) => {
		const categoryData: Partial<ICATEGORY> = req.body;

		// Filter out empty strings and set them to undefined for ObjectId fields
		if (!categoryData.parent || (typeof categoryData.parent === 'string' && categoryData.parent === '')) {
			delete categoryData.parent;
		}

		await categoryService.createOne(categoryData);
		res.redirect('/dashboard/categories');
	}),

	categoriesEdit: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const [category, categoriesResult] = await Promise.all([
			categoryService.getOne(id, { populate: 'parent' }),
			categoryService.getAll({ populate: 'parent' }),
		]);
		res.render('dashboard/layout', {
			title: 'Edit Category',
			template: 'dashboard/categories/edit',
			user: req.user,
			category,
			categories: categoriesResult.data,
		});
	}),

	categoriesUpdate: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const categoryData: Partial<ICATEGORY> = req.body;

		// Check if this is the reels category
		const existingCategory = await categoryService.getOne(id);
		if (existingCategory && existingCategory.slug === 'reels') {
			// Prevent changes to name and slug for reels category
			delete categoryData.name;
			delete categoryData.slug;
			// Allow other changes like description, parent, etc.
		}

		// Filter out empty strings and set them to undefined for ObjectId fields
		if (!categoryData.parent || (typeof categoryData.parent === 'string' && categoryData.parent === '')) {
			delete categoryData.parent;
		}

		await categoryService.updateOne(id, categoryData);
		res.redirect('/dashboard/categories');
	}),

	categoriesDelete: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		await categoryService.deleteOne(id);
		res.redirect('/dashboard/categories');
	}),

	// ===== POSTS MANAGEMENT =====
	postsList: asyncHandler(async (req: Request, res: Response) => {
		const result = await postService.getAll({
			...req.query,
			populate: JSON.stringify(['author', 'category'])
		});
		res.render('dashboard/layout', {
			title: 'Posts Management',
			template: 'dashboard/posts/list',
			user: req.user,
			posts: result.data,
			pagination: result.paginationResult,
		});
	}),

	postsCreate: asyncHandler(async (req: Request, res: Response) => {
		const [categoriesResult, usersResult] = await Promise.all([
			categoryService.getAll(),
			userService.getAll(),
		]);
		res.render('dashboard/layout', {
			title: 'Create Post',
			template: 'dashboard/posts/create',
			user: req.user,
			categories: categoriesResult.data,
			users: usersResult.data,
		});
	}),

	postsStore: asyncHandler(async (req: Request, res: Response) => {
		const postData: Partial<IPOST> = req.body;
		postData.author = req.user.id; // Set current user as author

		// Filter out empty strings for ObjectId fields
		if (!postData.category || (typeof postData.category === 'string' && postData.category === '')) {
			delete postData.category;
		}

		// Check if this is a reels post (by category)
		let isReelsPost = false;
		if (postData.category) {
			try {
				// We need to get the category to check its slug
				const category = await categoryService.getOne(postData.category.toString());
				isReelsPost = category && category.slug === 'reels';
			} catch (error) {
				console.log('Could not determine if this is a reels post:', error);
			}
		}

		if (isReelsPost) {
			// For reels posts, use videoUrl as content and reelsImageUrl as image
			if (postData.videoUrl && typeof postData.videoUrl === 'string' && postData.videoUrl.trim()) {
				postData.content = postData.videoUrl.trim();
			} else {
				postData.content = '';
			}

			// Handle video title override
			if (postData.videoTitleOverride && typeof postData.videoTitleOverride === 'string' && postData.videoTitleOverride.trim()) {
				postData.title = postData.videoTitleOverride.trim();
			}

			// Handle reels thumbnail image
			if (postData.reelsImageUrl && postData.reelsImageUrl !== '') {
				postData.image = [postData.reelsImageUrl];
			} else {
				// If no custom thumbnail, leave empty - frontend will use video thumbnail
				postData.image = [];
			}

			// Clean up fields not needed for reels
			delete postData.videoUrl;
			delete postData.videoTitleOverride;
			delete postData.reelsImageUrl;
		} else {
			// Process content for regular posts - HTML content from editor
			if (postData.content && typeof postData.content === 'string') {
				let content = postData.content.trim();

				// Decode Unicode escapes by replacing them directly
				content = content.replace(/\\u003C/g, '<').replace(/\\u003E/g, '>').replace(/\\u0026/g, '&');

				// Clean up unwanted HTML
				content = content.replace(/<p>\s*<\/p>/gi, '');
				content = content.replace(/<div>\s*<br\s*\/?>\s*<\/div>/gi, '');
				content = content.replace(/\s+/g, ' ').trim();

				postData.content = content;
			} else {
				postData.content = ''; // No content provided
			}

			// Handle regular post image
			if (!postData.imageUrl || postData.imageUrl === '') {
				postData.image = []; // Default to empty array
			} else if (postData.imageUrl === 'REMOVE_IMAGE') {
				// User clicked remove image button
				postData.image = [];
			} else if (typeof postData.imageUrl === 'string') {
				// Single URL, convert to array
				postData.image = [postData.imageUrl];
			} else if (Array.isArray(postData.imageUrl)) {
				// Filter out empty strings from array
				postData.image = postData.imageUrl.filter(url => url && url.trim() !== '');
			}

			// Remove imageUrl field
			delete postData.imageUrl;
		}

		// Process tags if present - should be array from frontend
		if (postData.tags && typeof postData.tags === 'string') {
			postData.tags = (postData.tags as any).split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
		}

		// Process excerpt (description)
		if (postData.excerpt && typeof postData.excerpt === 'string') {
			postData.description = postData.excerpt.trim();
			delete postData.excerpt;
		} else if (!postData.description) {
			postData.description = '';
		}

		// Process SEO fields
		if (postData.metaTitle || postData.metaDescription) {
			postData.seo = {
				title: (postData.metaTitle && typeof postData.metaTitle === 'string') ? postData.metaTitle.trim() : '',
				description: (postData.metaDescription && typeof postData.metaDescription === 'string') ? postData.metaDescription.trim() : '',
				keywords: []
			};
			delete postData.metaTitle;
			delete postData.metaDescription;
		}

		// Handle checkbox values
		if (postData.isFeatured === 'true') {
			postData.isFeatured = true;
		} else if (!postData.isFeatured) {
			postData.isFeatured = false;
		}

		if (postData.allowComments === 'true') {
			postData.allowComments = true;
		} else if (!postData.allowComments) {
			postData.allowComments = true; // Default to true
		}

		// Set default values for required fields if not provided
		if (!postData.status) {
			postData.status = 'published';
		}

		if (!postData.views) {
			postData.views = 0;
		}

		// Remove imageFile field if it exists (shouldn't be there)
		if (postData.imageFile) {
			delete postData.imageFile;
		}

		console.log('Final postData to save:', postData); // Debug logging
		console.log('Content after processing:', postData.content);

		await postService.createOne(postData);
		res.redirect('/dashboard/posts');
	}),

	postsEdit: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const [post, categoriesResult, usersResult] = await Promise.all([
			postService.getOne(id, { populate: 'author category' }),
			categoryService.getAll(),
			userService.getAll(),
		]);

		// Ensure description and seo fields exist for editing
		if (!post.description) {
			post.description = '';
		}
		if (!post.seo) {
			post.seo = { title: '', description: '', keywords: [] };
		}

		console.log('Post data for editing:', JSON.stringify(post, null, 2)); // Debug logging
		res.render('dashboard/layout', {
			title: 'Edit Post',
			template: 'dashboard/posts/edit',
			user: req.user,
			post,
			categories: categoriesResult.data,
			users: usersResult.data,
		});
	}),

	postsUpdate: asyncHandler(async (req: Request, res: Response) => {
		console.log('Post update req.body:', req.body);
		console.log('Post update req.files:', req.files);
		console.log('Post update req.file:', req.file); // Debug logging

		const { id } = req.params;
		const postData: Partial<IPOST> = req.body;

		// Filter out empty strings for ObjectId fields
		if (!postData.category || (typeof postData.category === 'string' && postData.category === '')) {
			delete postData.category;
		}

		// Handle image - should come as string URL from upload API
		console.log('Processing imageUrl field for update:', postData.imageUrl, typeof postData.imageUrl);
		if (!postData.imageUrl || postData.imageUrl === '') {
			// Don't modify existing image if not provided
			delete postData.image;
		} else if (postData.imageUrl === 'REMOVE_IMAGE') {
			// User clicked remove image button
			postData.image = [];
		} else if (typeof postData.imageUrl === 'string') {
			// Single URL, convert to array
			postData.image = [postData.imageUrl];
		} else if (Array.isArray(postData.imageUrl)) {
			// Filter out empty strings from array
			postData.image = postData.imageUrl.filter(url => url && url.trim() !== '');
		}

		// Remove imageUrl field
		delete postData.imageUrl;

		// Process tags if present
		if (postData.tags && typeof postData.tags === 'string') {
			postData.tags = (postData.tags as any).split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
		}

		// Process content - ensure it's properly formatted HTML from the editor
		if (postData.content && typeof postData.content === 'string') {
			let content = postData.content.trim();

			// Decode Unicode escapes by replacing them directly
			content = content.replace(/\\u003C/g, '<').replace(/\\u003E/g, '>').replace(/\\u0026/g, '&');

			// Clean up unwanted HTML
			content = content.replace(/<p>\s*<\/p>/gi, '');
			content = content.replace(/<div>\s*<br\s*\/?>\s*<\/div>/gi, '');
			content = content.replace(/\s+/g, ' ').trim();

			postData.content = content;
		} else {
			// Don't modify content if not provided
			delete postData.content;
		}

		// Process excerpt (description)
		if (postData.excerpt && typeof postData.excerpt === 'string') {
			postData.description = postData.excerpt.trim();
			delete postData.excerpt;
		} else if (postData.excerpt === '') {
			postData.description = '';
		} else {
			// Don't modify description if excerpt not provided
			delete postData.description;
		}

		// Process SEO fields
		if (postData.metaTitle !== undefined || postData.metaDescription !== undefined) {
			postData.seo = {
				title: (postData.metaTitle && typeof postData.metaTitle === 'string') ? postData.metaTitle.trim() : '',
				description: (postData.metaDescription && typeof postData.metaDescription === 'string') ? postData.metaDescription.trim() : '',
				keywords: []
			};
			delete postData.metaTitle;
			delete postData.metaDescription;
		}

		// Handle checkbox values
		if (postData.isFeatured === 'true') {
			postData.isFeatured = true;
		} else if (postData.isFeatured === undefined) {
			// Don't modify isFeatured if not provided in form
			delete postData.isFeatured;
		}

		if (postData.allowComments === 'true') {
			postData.allowComments = true;
		} else if (postData.allowComments === undefined) {
			// Don't modify allowComments if not provided in form
			delete postData.allowComments;
		}

		console.log('Final postData to update:', postData); // Debug logging

		await postService.updateOne(id, postData);
		res.redirect('/dashboard/posts');
	}),

	postsDelete: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		await postService.deleteOne(id);
		res.redirect('/dashboard/posts');
	}),

	// ===== USERS MANAGEMENT =====
	usersList: asyncHandler(async (req: Request, res: Response) => {
		const result = await userService.getAll({ populate: 'role' });
		res.render('dashboard/layout', {
			title: 'Users Management',
			template: 'dashboard/users/list',
			user: req.user,
			users: result.data,
		});
	}),

	usersCreate: asyncHandler(async (req: Request, res: Response) => {
		const result = await roleService.getAll();
		res.render('dashboard/layout', {
			title: 'Create User',
			template: 'dashboard/users/create',
			user: req.user,
			roles: result.data,
		});
	}),

	usersStore: asyncHandler(async (req: Request, res: Response) => {
		const userData: Partial<IUser> = req.body;

		// Filter out empty strings for ObjectId fields
		if (!userData.role || (typeof userData.role === 'string' && userData.role === '')) {
			delete userData.role;
		}

		await userService.createOne(userData);
		res.redirect('/dashboard/users');
	}),

	usersEdit: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const [user, rolesResult] = await Promise.all([
			userService.getOne(id),
			roleService.getAll(),
		]);
		res.render('dashboard/layout', {
			title: 'Edit User',
			template: 'dashboard/users/edit',
			user: req.user,
			editUser: user,
			roles: rolesResult.data,
		});
	}),

	usersUpdate: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const userData: Partial<IUser> = req.body;

		// Filter out empty strings for ObjectId fields
		if (!userData.role || (typeof userData.role === 'string' && userData.role === '')) {
			delete userData.role;
		}

		await userService.updateOne(id, userData);
		res.redirect('/dashboard/users');
	}),

	usersDelete: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		await userService.deleteOne(id);
		res.redirect('/dashboard/users');
	}),

	// ===== ROLES MANAGEMENT =====
	rolesList: asyncHandler(async (req: Request, res: Response) => {
		const result = await roleService.getAll();
		res.render('dashboard/layout', {
			title: 'Roles Management',
			template: 'dashboard/roles/list',
			user: req.user,
			roles: result.data,
		});
	}),

	rolesCreate: asyncHandler(async (req: Request, res: Response) => {
		res.render('dashboard/layout', {
			title: 'Create Role',
			template: 'dashboard/roles/create',
			user: req.user,
		});
	}),

	rolesStore: asyncHandler(async (req: Request, res: Response) => {
		const roleData: Partial<IROLE> = req.body;
		await roleService.createOne(roleData);
		res.redirect('/dashboard/roles');
	}),

	rolesEdit: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const role = await roleService.getOne(id);
		res.render('dashboard/layout', {
			title: 'Edit Role',
			template: 'dashboard/roles/edit',
			user: req.user,
			role,
		});
	}),

	rolesUpdate: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const roleData: Partial<IROLE> = req.body;
		await roleService.updateOne(id, roleData);
		res.redirect('/dashboard/roles');
	}),

	rolesDelete: asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		await roleService.deleteOne(id);
		res.redirect('/dashboard/roles');
	}),

	// ===== FOOTER MANAGEMENT =====
	footerEdit: asyncHandler(async (req: Request, res: Response) => {
		// Get all footer items and use the first one (should only be one)
		const result = await footerService.getAll();
		let footer = result.data && result.data.length > 0 ? result.data[0] : null;

		// If no footer exists, create a default one
		if (!footer) {
			footer = await footerService.createOne({
				subtitle1: '',
				title2: '',
				subtitle2: '',
				title3: '',
				subtitle3: '',
				facebook: '',
				twitter: '',
				instagram: ''
			});
		}

		res.render('dashboard/layout', {
			title: 'Edit Footer',
			template: 'dashboard/footer/edit',
			user: req.user,
			footer,
		});
	}),

	footerUpdate: asyncHandler(async (req: Request, res: Response) => {
		// Get all footer items and update the first one (should only be one)
		const result = await footerService.getAll();
		let footer = result.data && result.data.length > 0 ? result.data[0] : null;

		if (!footer) {
			// Create footer if it doesn't exist
			await footerService.createOne(req.body);
		} else {
			// Update existing footer
			await footerService.updateOne(footer._id, req.body);
		}

		res.redirect('/dashboard/footer?success=1');
	}),
};

export default dashboardController;
