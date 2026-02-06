import { footerModel } from "@modules/footer/footer.schema";

export const footerSedder = async () => {
	const footer = await footerModel.findOne({});
	if (!footer)
		await footerModel.create({
			subtitle1:
				"Start writing, no matter what. The water does not flow until the faucet is turned on.",
			title2: "Address",
			subtitle2: `123 Main Street
New York, NY 10001`,
			title3: "Hours",
			subtitle3: `Monday—Friday: 9:00AM–5:00PM
Saturday & Sunday: 11:00AM–3:00PM`,
			facebook: "https://www.facebook.com/mokhtareon",
			instagram: "https://www.instagram.com/mokhtareon",
		});
};
