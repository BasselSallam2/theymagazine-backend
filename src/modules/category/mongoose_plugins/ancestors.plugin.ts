import type { Schema, Model, Document } from "mongoose";
import type { Types } from "mongoose";

interface IAncestor {
	id: Types.ObjectId;
	name: string;
}

export interface ICategoryAncestorsStatics {
	findWithAncestors(
		this: Model<any>,
		filter: Record<string, any>
	): Promise<(Document<any> & { ancestors: IAncestor[] })[]>;

	findOneWithAncestors(
		this: Model<any>,
		filter: Record<string, any>
	): Promise<(Document<any> & { ancestors: IAncestor[] }) | null>;
}

export function ancestorsPlugin(schema: Schema) {
	const getAncestorsPipeline = (model: Model<any>) => [
		{
			$graphLookup: {
				from: model.collection.name,
				startWith: "$parent",
				connectFromField: "parent",
				connectToField: "_id",
				as: "ancestorDocs",
				depthField: "depth",
			},
		},
		{
			$addFields: {
				ancestors: {
					$map: {
						input: { $sortArray: { input: "$ancestorDocs", sortBy: { depth: -1 } } },
						as: "anc",
						in: {
							id: "$$anc._id",
							name: "$$anc.name",
						},
					},
				},
			},
		},
		{
			$project: {
				ancestorDocs: 0,
				depth: 0,
			},
		},
	];

	schema.statics.findWithAncestors = async function (filter: Record<string, any>) {
		const pipeline = [{ $match: filter }, ...getAncestorsPipeline(this)];
		const results = await this.aggregate(pipeline);
		return results;
	};

	schema.statics.findOneWithAncestors = async function (filter: Record<string, any>) {
		const pipeline = [{ $match: filter }, { $limit: 1 }, ...getAncestorsPipeline(this)];
		const results = await this.aggregate(pipeline);
		return results[0] || null;
	};
}
