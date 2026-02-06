import { categoryModel } from "@modules/category/category.schema";
import { getEnv } from "@utils/envHelper";

export const categorySeeder = async () => {
	const reelsCategory = await categoryModel.findOne({ name: "reels" });
	if (!reelsCategory)
		await categoryModel.create({
			name: "reels",
			description: "reels",
            type: "reels",
            seo: {
                title: "reels",
                description: "reels",
                keywords: ["reels"],
            },
		});
   const theysay = await categoryModel.findOne({ name: "بيقولو ايه ؟" });
   if (!theysay)
		await categoryModel.create({
			name: "بيقولو ايه ؟",
			description: "بيقولو ايه ؟",
			seo: {
				title: "بيقولو ايه ؟",
				description: "بيقولو ايه ؟",
				keywords: ["بيقولو ايه ؟"],
			},
		});
};
