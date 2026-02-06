import type { Document, Types } from "mongoose";

export interface ICATEGORY extends Document {
	name: string;
	slug: string;
	description: string;
	parent: Types.ObjectId;
	image: string;
	active: boolean;
	seo: {title: string, description: string, keywords: string[]};
	type: string;
	deleted: boolean;	
}
