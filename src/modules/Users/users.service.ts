import GenericService from "@shared/generic.service";
import type { IUser } from "./users.interface";
import { userModel } from "./users.schema";
import type { Types } from "mongoose";
import { ApiError } from "@utils/errorsHandlers/ApiError.handler";

type PopulatedUserRole = Omit<IUser, 'role'> & {
    role: { permissions: string[] } | null; 
};

export class UsersService extends GenericService<IUser> {
	constructor() {
		super(userModel);
	}

	async getUserPermessions(userId: Types.ObjectId) {
		try {
			const user = (await userModel
				.findById(userId)
				.populate({ path: "role", select: "permissions" })
				.lean()
				.exec()) as unknown as PopulatedUserRole;

			if (!user) throw new ApiError("User not found", 404);
			if (!user.role) throw new ApiError("User has no role", 404);
			return user.role.permissions;
		} catch (error) {
			throw new error();
		}
	}
}

export default new UsersService();
