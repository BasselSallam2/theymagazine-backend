import GenericController from "@shared/generic.controller";
import footerService from "./footer.service";
import type { IFOOTER } from "./footer.interface";

class footerController extends GenericController<IFOOTER> {
	constructor() {
		super(footerService);
	}
}

export default new footerController();
