import type { tokenDecode } from "@modules/Auth/auth.interface";
import { ErrorRes } from "@shared/responces/errors.responces";
import { getEnv } from "@utils/envHelper";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { IUser } from "@modules/Users/users.interface";
import type { Types } from "mongoose";
import { devLogger } from "@utils/devLogger";
import asyncHandler from "express-async-handler";
import { userModel } from "@modules/Users/users.schema";
import type { IROLE } from "@modules/Roles/role.interface";
import { ApiError } from "@utils/errorsHandlers/ApiError.handler";

const getToken = (req: Request) => {
	// Check Authorization header first
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		return req.headers.authorization.split(" ")[1];
	}

	// Check cookies for dashboard login
	if (req.cookies?.token) {
		return req.cookies.token;
	}

	// Return null for missing token - let protect middleware handle redirect
	return null;
};

const verifyToken = (token: string) => {
	try {
		return jwt.verify(token, getEnv("JWT_SECRET_KEY"));
	} catch (error) {
		devLogger(error);
		ErrorRes.invalidToken();
	}
};

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const token = getToken(req);

	// If no token found, redirect to login for dashboard routes
	if (!token && req.originalUrl.startsWith('/dashboard')) {
		return res.redirect('/dashboard/login');
	}

	// If no token found for API routes, return error
	if (!token) {
		return next(ErrorRes.tokenNotFound());
	}

	try {
		const decoded = verifyToken(token) as tokenDecode;
		const userWithRole = await userModel.findById(decoded.id).populate('role');
		if (!userWithRole) return next(ErrorRes.userNotFound());
		if (!userWithRole.active) return next(ErrorRes.userNotActive());
		if (userWithRole.deleted) return next(ErrorRes.userDeleted());

		// If role is not populated (doesn't exist), create a default admin role
		let role = userWithRole.role;
		if (!role) {
			role = {
				_id: userWithRole.role as any,
				name: 'admin',
				permissions: [
					"user:create", "user:update", "user:delete", "user:read",
					"post:create", "post:update", "post:delete", "post:publish", "post:read",
					"comment:create", "comment:update", "comment:delete", "comment:read",
					"role:read", "role:delete", "role:update", "role:create",
					"category:create", "category:update", "category:delete", "category:read",
					"seo:update", "navbar:read", "navbar:create", "navbar:update", "navbar:delete",
					"footer:read", "footer:create", "footer:update", "footer:delete",
					"comment:publish"
				],
				canDelete: false,
				isDefault: true
			} as IROLE;
		}

		req.user = {
			id: userWithRole._id as Types.ObjectId,
			role: role
		};
		next();
	} catch (error) {
		// Token verification failed
		if (req.originalUrl.startsWith('/dashboard')) {
			return res.redirect('/dashboard/login');
		}
		next(error);
	}
});

export const allowedTo = (...permissions: string[]) =>
	asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		const userPermissions = req.user.role.permissions;
		if (!userPermissions) {
			return next(new ApiError("User has no permissions", 401));
		}
		const hasPermission = permissions.every((p) => userPermissions.includes(p));
		if (!hasPermission) {
			return next(new ApiError("You are not authorized to perform this action", 403));
		}

		next();
	});
