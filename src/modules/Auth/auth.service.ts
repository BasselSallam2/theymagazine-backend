import type { Model } from "mongoose";
import crypto from "crypto";
import type { IUser } from "@modules/Users/users.interface";
import { ErrorRes } from "@shared/responces/errors.responces";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEnv } from "@utils/envHelper";
import { userModel } from "@modules/Users/users.schema";
import type { IAuth, IAuthdto, SigninDTO, OtpVerifyDTO } from "./auth.interface";
import { roleModel } from "@modules/Roles/role.schema";
import { devLogger } from "@utils/devLogger";

class AuthService {
	private authModel: Model<IUser>;
	constructor() {
		this.authModel = userModel;
	}

	async signin(data: SigninDTO) {
		const { email, password } = data;
		const user = await this.authModel.findOne({ email }).populate("role");
		if (!user) {
			return ErrorRes.userNotFound();
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return ErrorRes.invalidPassword();
		}
		const payload = { id: user._id, role: user.role };
		const token = jwt.sign(payload, getEnv("JWT_SECRET_KEY"));
		return { token };
	}

	async signup(data: IAuthdto) {
		const { phoneNumber, name, email, password } = data;
		const isRegistred = await this.authModel.findOne({ $or: [{ email }, { phoneNumber }] });
		if (isRegistred) ErrorRes.userAlreadyExists();
		const otp = crypto.randomInt(100000, 999999).toString();
		devLogger(otp);
		const otpExpireDate = new Date(Date.now() + 10 * 60 * 1000);
		const memberRole = await roleModel.findOne({ name: "member" });
		if (!memberRole) ErrorRes.roleNotFound("member");
		const newUser = await this.authModel.create({
			phoneNumber,
			name,
			email,
			password,
			otp,
			otpExpireDate,
			role: memberRole._id,
		});
		const UserWithPermessions = await newUser.populate("role");
		const payload = { id: UserWithPermessions._id, role: UserWithPermessions.role };
		const token = jwt.sign(payload, getEnv("JWT_SECRET_KEY"));
		return { token };
	}

	async verifyOtp(data: OtpVerifyDTO) {
		const { phoneNumber, otp } = data;
		const user = await this.authModel.findOne({ phoneNumber });
		if (!user) ErrorRes.userNotFound();
		const isValidOTP = bcrypt.compare(otp, user.otp);
		if (!isValidOTP) ErrorRes.invalidOTP();
		if (user.otpExpireDate.getTime() < Date.now()) ErrorRes.otpExpired();
		await this.authModel.updateOne(
			{ _id: user._id },
			{ $set: { otp: null, otpExpirDate: null, phoneVerified: true } }
		);
	}
}

export const authService = new AuthService();
