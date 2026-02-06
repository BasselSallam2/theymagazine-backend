import type { IROLE } from "@modules/Roles/role.interface";
import type { Document, Types } from "mongoose";
export interface IAuth extends Document {
	email: string;
	password: string;
	phoneNumber: string;
	name: string;
}

export interface IAuthdto {
	email: string;
	password: string;
	phoneNumber: string;
	name: string;
}

export const signupDTOKeys = {
	required: ["email", "password", "phoneNumber", "name"],
	optional: [],
};

export interface OtpVerifyDTO {
	phoneNumber: string;
	otp: string;
}

export const OtpVerifyDTOKeys = {
	required: ["phoneNumber", "otp"],
	optional: [],
};

export interface SigninDTO {
	email: string;
	password: string;
}

export const SigninDTOKeys = {
	required: ["email", "password"],
	optional: [],
};

export interface tokenDecode {
	id: Types.ObjectId;
	role: IROLE;
}
