import type { Model } from "mongoose";
import { Schema, model, models } from "mongoose";
import type { IUser } from "./users.interface";
import { hashOTPPlugin, hashPasswordPlugin } from "@modules/Auth/mongoose_plugins/auth.plugin";

export const userSchema = new Schema<IUser>(
	{
		phoneNumber: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		role: { type: Schema.Types.ObjectId, required: true, ref: "Role" },
		active: { type: Boolean, default: true },
		verified: { type: Boolean, default: false },
		lastSignin: { type: Date },
		lockedUntil: { type: Date },
		avatar: { type: String },
		phoneVerified: { type: Boolean, default: false },
		premium: { type: Boolean, default: false },
		deleted: { type: Boolean, default: false },
		otp: { type: String },
		otpExpireDate: { type: Date },
		resetPasswordCode: { type: String },
		resetPasswordExpirDate: { type: Date },
		resetPasswordVerified: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				delete ret.__v;
				delete ret.password;
				delete ret.resetPasswordCode;
				delete ret.resetPasswordExpirDate;
				delete ret.resetPasswordVerified;
				delete ret.otp;
				delete ret.otpExpireDate;
				delete ret.lockedUntil;
				delete ret.lastSignin;
				delete ret.deleted;
			},
		},
	}
);

userSchema.index({ 
    name: 'text',
	phoneNumber: 'text'
});

userSchema.plugin(hashPasswordPlugin);
userSchema.plugin(hashOTPPlugin);

const userModel = (models.User || model<IUser>("User", userSchema)) as Model<IUser>;

export { userModel };
