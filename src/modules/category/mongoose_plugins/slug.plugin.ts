import type { NextFunction } from "express";
import type { HydratedDocument, Schema } from "mongoose";
import slugify from "slugify";

export function createSlug(schema: Schema, target: string) {
	schema.pre("save", async function (this: HydratedDocument<any>, next: NextFunction) {
		try {
			if (this.isNew || this.isModified(target)) {
				this.slug = (slugify(this[target])).toLowerCase();
			}

			next();
		} catch (error) {
			next(error);
		}
	});
}