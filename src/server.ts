// import "@config/redis/init";
import { connectDB } from "@config/db.config";
import { footerModel } from "@modules/footer/footer.schema";
import { postModel } from "@modules/POST/post.schema";
import { devLogger } from "@utils/devLogger";
import { getEnv } from "@utils/envHelper";
import app from "app";
import { seeder } from "seeders/seeder";


const startServer = async () => {
	await connectDB();
	devLogger("Server Connected With DB Successfully");
	await seeder(); 
	app.listen(getEnv("PORT"), () => {
		devLogger(`Server started at port ${getEnv("PORT")}`);
	});
};

startServer();
