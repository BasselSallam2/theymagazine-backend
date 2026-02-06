import GenericService from "@shared/generic.service";
import type { IFOOTER } from "./footer.interface";
import { footerModel } from "./footer.schema";

export class FooterService extends GenericService<IFOOTER> {
	constructor() {
		super(footerModel);
	}
}

export default new FooterService();
