import { authService } from "./auth.service";
import { SucessRes } from "@shared/responces/success.responces";
import type { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import {
	type IAuthdto,
	signupDTOKeys,
	type OtpVerifyDTO,
	OtpVerifyDTOKeys,
	type SigninDTO,
	SigninDTOKeys,
} from "./auth.interface";
import { dtoHandler } from "@utils/dtoHandler";

class AuthController {
	private authService: typeof authService;
	constructor() {
		this.authService = authService;
	}

	signin = asyncHandler(async (req: Request, res: Response) => {
		const input = dtoHandler<SigninDTO>(req.body, SigninDTOKeys, { strict: true });
		const result = await this.authService.signin(input);
		SucessRes.success(res, "Signin successful", 200, result);
	});

	signup = asyncHandler(async (req: Request, res: Response) => {
		const input = dtoHandler<IAuthdto>(req.body, signupDTOKeys, { strict: true });
		const result = await this.authService.signup(input);
		SucessRes.success(res, "Signup successful", 201, result);
	});

	verifyOtp = asyncHandler(async (req: Request, res: Response) => {
		const input = dtoHandler<OtpVerifyDTO>(req.body, OtpVerifyDTOKeys, { strict: true });
		const result = await this.authService.verifyOtp(input);
		SucessRes.success(res, "Otp verified successfully", 200, result);
	});
}

export const authController = new AuthController();
