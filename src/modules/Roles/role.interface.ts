import type { Document, Types } from "mongoose";

export interface IROLE extends Document {
	name: string;
	permissions: string[];
	canDelete: boolean;
	isDefault: boolean;
}

export const permissions = {
	CREATEUSER: "user:create",
	UPDATEUSER: "user:update",
	DELETEUSER: "user:delete",
	READUSER: "user:read",
	CREATEPOST: "post:create",
	UPDATEPOST: "post:update",
	DELETEPOST: "post:delete",
	PUBLISHPOST: "post:publish",
	READPOST: "post:read",
	CREATECOMMENT: "comment:create",
	UPDATECOMMENT: "comment:update",
	DELETECOMMENT: "comment:delete",
	READCOMMENT: "comment:read",
	READROLE: "role:read",
	DELETEROLE: "role:delete",
	UPDATEROLE: "role:update",
	CREATEROLE: "role:create",
	CREATECATEGORY: "category:create",
	UPDATECATEGORY: "category:update",
	DELETECATEGORY: "category:delete",
	READCATEGORY: "category:read",
	UPDATESEO: "seo:update",
	READNAVBAR: "navbar:read",
	CREATENAVBAR: "navbar:create",
	UPDATENAVBAR: "navbar:update",
	DELETENAVBAR: "navbar:delete",
	READFOOTER: "footer:read",
	CREATEFOOTER: "footer:create",
	UPDATEFOOTER: "footer:update",
	DELETEFOOTER: "footer:delete",
	PUBLICHCOMMENT: "comment:publish",

};
