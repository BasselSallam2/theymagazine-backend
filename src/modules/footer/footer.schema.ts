import type { Model } from "mongoose";
import { Schema, model, models } from "mongoose";
import type { IFOOTER } from "./footer.interface";


export const footerSchema = new Schema<IFOOTER>(
	{
		subtitle1: { type: String},
		title2: { type: String},	
		subtitle2: { type: String},
		title3: { type: String},
		subtitle3: { type: String},	
		facebook: { type: String},
		twitter : { type: String},
		instagram: { type: String},
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

const footerModel = (models.Footer || model<IFOOTER>("Footer", footerSchema)) as Model<IFOOTER>;

export { footerModel };
