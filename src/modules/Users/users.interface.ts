import type { Document, Types } from "mongoose";

export interface IUser extends Document {
	phoneNumber: string;
	password: string;
	name: string;
	email: string;
	role: Types.ObjectId;
	active: boolean;
	verified: boolean;
	lastSignin: Date;
	lockedUntil: Date;
	avatar: string;
	phoneVerified: boolean;
	premium: boolean;
	otp: string;
	otpExpireDate: Date;
	resetPasswordCode: string;
	resetPasswordExpirDate: Date;
	resetPasswordVerified: boolean;
	deleted: boolean;
}
