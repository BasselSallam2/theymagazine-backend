import type { Model } from "mongoose";
import { Schema, model, models } from "mongoose";
import type { IPOST } from "./post.interface";
import { createSlug } from "@modules/category/mongoose_plugins/slug.plugin";

const seoSchema = new Schema({
    title: { type: String },
    description: { type: String },
    keywords: { type: [String] },
})

export const postSchema = new Schema<IPOST>(
	{
		title: { type: String, required: true },
		slug: { type: String },
		content: { type: String },
		description: { type: String },
		image: { type: [String] },
		author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
		category: { type: Schema.Types.ObjectId, ref: "Category" },
		tags: { type: [String] },
		status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
		seo: { type: seoSchema },
		views: { type: Number, default: 0 },
		isFeatured: { type: Boolean, default: false },
		publishedAt: { type: Date },
		allowComments: { type: Boolean, default: false },
		deleted: { type: Boolean, default: false },
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

postSchema.index({ 
    title: 'text', 
    description: 'text', 
    content: 'text', 
    tags: 'text' 
});

postSchema.plugin(createSlug, "title");



const postModel = (models.Post || model<IPOST>("Post", postSchema)) as Model<IPOST>;

export { postModel };
