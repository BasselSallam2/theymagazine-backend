import { roleModel } from "@modules/Roles/role.schema";
const roles = { ADMIN: "admin", MEMBER: "member" };
import { permissions } from "@modules/Roles/role.interface";

export const rolesSeeder = async () => {
	const permissionsArray = Object.values(permissions);
	const adminRole = await roleModel.findOne({ name: roles.ADMIN });
	if (!adminRole) {
		await roleModel.create({
			name: roles.ADMIN,
			permissions: permissionsArray,
			canDelete: false,
			isDefault: true,
		});
	} else {
		if (!permissionsArray.every((role) => adminRole.permissions.includes(role))) {
			await roleModel.updateOne({ name: roles.ADMIN }, { $set: { permissions: permissionsArray } });
		}
	}

	const memberRole = await roleModel.findOne({ name: roles.MEMBER });
	if (!memberRole) {
		await roleModel.create({
			name: roles.MEMBER,
			permissions: [permissions.READPOST, permissions.READCOMMENT, permissions.CREATECOMMENT],
			canDelete: false,
			isDefault: true,
		});
	}
};
