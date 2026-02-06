import GenericController from "@shared/generic.controller";
import roleService from "./role.service";
import type { IROLE } from "./role.interface";

class roleController extends GenericController<IROLE> {
	constructor() {
		super(roleService);
	}
}

export default new roleController();
