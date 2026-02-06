import GenericService from "@shared/generic.service";
import type { IROLE } from "./role.interface";
import { roleModel } from "./role.schema";

export class RoleService extends GenericService<IROLE> {
	constructor() {
		super(roleModel);
	}
}

export default new RoleService();
