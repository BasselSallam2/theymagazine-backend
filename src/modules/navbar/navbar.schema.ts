import type { Model } from "mongoose";
import { Schema, model, models } from "mongoose";
import type { INAVBAR } from "./navbar.interface";
import { idxIncrementPlugin } from "./mongoose_plugins/idx_increment.plugin";


const itemSchema = new Schema(
	{
		title: { type: String, required: true },
		category: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
		idx: { type: Number},
	},
	{ _id: false }
);

export const navbarSchema = new Schema<INAVBAR>(
	{
		title: { type: String, required: true },
		idx: { type: Number},
		category: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
		items: { type: [itemSchema], default: null },
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


navbarSchema.plugin(idxIncrementPlugin);
const navbarModel = (models.Navbar || model<INAVBAR>("Navbar", navbarSchema)) as Model<INAVBAR>;

export { navbarModel };
