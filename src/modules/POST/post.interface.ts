import type { Document, Types } from "mongoose";

export interface IPOST extends Document {
	title: string; 
	slug: string;
	content: string;
	description?: string;
	image: string[];
	author: Types.ObjectId;
	category: Types.ObjectId;
	tags: string[];
	status: "draft" | "published" | "archived";
	seo: {title: string, description: string, keywords: string[]};
	views: number;
	isFeatured: boolean;
	publishedAt: Date;
	allowComments: boolean;
	deleted: boolean;
}

export interface IPOSTDTO  {
	title: string; 
	author: Types.ObjectId;
	content: string;
	description?: string;
	image?: string[];
	category: Types.ObjectId;
	tags: string[];
	status?: "draft" | "published" | "archived";
	seo?: {title: string, description: string, keywords: string[]};
	isFeatured?: boolean;
	allowComments?: boolean;
}

export const POST_DTO_KEYS = {
    required: ['title', 'content', 'category', 'tags'],
    optional: ['image', 'status', 'seo', 'isFeatured', 'allowComments','description']
};
