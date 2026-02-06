    import GenericController from "@shared/generic.controller";
    import  usersService from "./users.service";
    import type { IUser } from "./users.interface";

    class userController extends GenericController<IUser> {
    constructor() {
        super(usersService);
    }

    }

    export default new userController();