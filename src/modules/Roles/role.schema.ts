import type { Model } from "mongoose";
import { Schema, model, models } from "mongoose";
import type { IROLE } from "./role.interface";

export const roleSchema = new Schema<IROLE>(
	{
	name: { type: String, required: true , unique: true },
	permissions: { type: [String], required: true },
	canDelete: { type: Boolean, default: true },
	isDefault: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				delete ret.__v;
			},
		},
	}
);

const roleModel = (models.Role || model<IROLE>("Role", roleSchema)) as Model<IROLE>;

export { roleModel };
