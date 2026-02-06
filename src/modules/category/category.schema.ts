import type { Model } from "mongoose";
import { Schema, model, models } from "mongoose";
import type { ICATEGORY } from "./category.interface";
import { createSlug } from "./mongoose_plugins/slug.plugin";


import { ancestorsPlugin, type ICategoryAncestorsStatics } from "./mongoose_plugins/ancestors.plugin";

const seoSchema = new Schema({
    title: { type: String },
    description: { type: String },
    keywords: { type: [String] },
})

export const categorySchema = new Schema<ICATEGORY>(
    {
        name: { type: String, required: true },
        slug: { type: String },
        description: { type: String },
        parent: { type: Schema.Types.ObjectId, ref: "Category" },
        image: { type: String },
        active: { type: Boolean, default: true },
        seo: {type: seoSchema},
        type: { type: String },
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

categorySchema.plugin(ancestorsPlugin);
categorySchema.plugin(createSlug, "name");


type CategoryModelType = Model<ICATEGORY> & ICategoryAncestorsStatics;

const categoryModel = (models.Category ||
    model<ICATEGORY, CategoryModelType>("Category", categorySchema)) as CategoryModelType;

export { categoryModel };