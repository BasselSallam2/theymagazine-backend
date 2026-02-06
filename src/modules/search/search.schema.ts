import type { Model } from "mongoose";
import { Schema, model, models } from "mongoose";
import type { ISEARCH } from "./search.interface";


export const searchSchema = new Schema<ISEARCH>(
	{
		
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

const searchModel = (models.Search || model<ISEARCH>("Search", searchSchema)) as Model<ISEARCH>;

export { searchModel };
