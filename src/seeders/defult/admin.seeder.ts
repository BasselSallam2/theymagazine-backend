import { userModel } from "@modules/Users/users.schema";
import { roleModel } from "@modules/Roles/role.schema";
import { getEnv } from "@utils/envHelper";

export const adminCredentialsSeeder = async () => {
	const adminRole = await roleModel.findOne({ name: "admin" });
	const admin = await userModel.findOne({ email: getEnv("DASHBOARD_EMAIL"), role: adminRole._id });
	if (!admin)
		await userModel.create({
			email: getEnv("DASHBOARD_EMAIL"),
			role: adminRole._id,
			name: "admin",
			password: getEnv("DASHBOARD_PASSWORD"),
			phoneNumber: "+201096072229",
			phoneVerified: true,
			premium: true,
			verified: true,
		});
};
