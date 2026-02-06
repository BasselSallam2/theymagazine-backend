import type { Document, Types } from "mongoose";

export interface INAVBAR extends Document {
	title: string;
	idx: number;
	category: Types.ObjectId;
	items: {title: string, idx: number, category: Types.ObjectId}[]
}
