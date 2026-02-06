import { rolesSeeder } from "./defult/role.seeder";
import { adminCredentialsSeeder } from "./defult/admin.seeder";
import { footerSedder } from "./defult/footer.seeder";
import { categorySeeder } from "./defult/category.seeder";

export const seeder = async () => {
   await rolesSeeder();
   await adminCredentialsSeeder();
   await footerSedder();
   await categorySeeder();
}