import { Router } from "express";
import { protect, allowedTo } from "@middleware/auth.middleware";
import { permissions } from "@modules/Roles/role.interface";
import { upload } from "@config/multer.config";
import dashboardController from "./dashboard.controller";

const router = Router();

// Public routes (no authentication required)
router.get('/login', dashboardController.loginPage);
router.post('/login', dashboardController.login);

// Logout route
router.post('/logout', dashboardController.logout);

// Protect all other dashboard routes
router.use(protect);

// Dashboard home
router.get('/', dashboardController.dashboard);

// Navbar management
router.get('/navbar', allowedTo(permissions.READNAVBAR), dashboardController.navbarList);
router.get('/navbar/create', allowedTo(permissions.CREATENAVBAR), dashboardController.navbarCreate);
router.post('/navbar/create', allowedTo(permissions.CREATENAVBAR), dashboardController.navbarStore);
router.get('/navbar/edit/:id', allowedTo(permissions.UPDATENAVBAR), dashboardController.navbarEdit);
router.post('/navbar/edit/:id', allowedTo(permissions.UPDATENAVBAR), dashboardController.navbarUpdate);
router.post('/navbar/update-idx/:id', allowedTo(permissions.UPDATENAVBAR), dashboardController.navbarUpdateIdx);
router.post('/navbar/delete/:id', allowedTo(permissions.UPDATENAVBAR), dashboardController.navbarDelete);

// Categories management
router.get('/categories', allowedTo(permissions.READCATEGORY), dashboardController.categoriesList);
router.get('/categories/create', allowedTo(permissions.CREATECATEGORY), dashboardController.categoriesCreate);
router.post('/categories/create', allowedTo(permissions.CREATECATEGORY), dashboardController.categoriesStore);
router.get('/categories/edit/:id', allowedTo(permissions.UPDATECATEGORY), dashboardController.categoriesEdit);
router.post('/categories/edit/:id', allowedTo(permissions.UPDATECATEGORY), dashboardController.categoriesUpdate);
router.post('/categories/delete/:id', allowedTo(permissions.DELETECATEGORY), dashboardController.categoriesDelete);

// Posts management
router.get('/posts', allowedTo(permissions.READPOST), dashboardController.postsList);
router.get('/posts/create', allowedTo(permissions.CREATEPOST), dashboardController.postsCreate);
router.post('/posts/create', allowedTo(permissions.CREATEPOST), upload.single('imageFile'), dashboardController.postsStore);
router.get('/posts/edit/:id', allowedTo(permissions.UPDATEPOST), dashboardController.postsEdit);
router.post('/posts/edit/:id', allowedTo(permissions.UPDATEPOST), dashboardController.postsUpdate);
router.post('/posts/delete/:id', allowedTo(permissions.DELETEPOST), dashboardController.postsDelete);

// Users management
router.get('/users', allowedTo(permissions.READUSER), dashboardController.usersList);
router.get('/users/create', allowedTo(permissions.CREATEUSER), dashboardController.usersCreate);
router.post('/users/create', allowedTo(permissions.CREATEUSER), dashboardController.usersStore);
router.get('/users/edit/:id', allowedTo(permissions.UPDATEUSER), dashboardController.usersEdit);
router.post('/users/edit/:id', allowedTo(permissions.UPDATEUSER), dashboardController.usersUpdate);
router.post('/users/delete/:id', allowedTo(permissions.DELETEUSER), dashboardController.usersDelete);

// Roles management
router.get('/roles', allowedTo(permissions.READROLE), dashboardController.rolesList);
router.get('/roles/create', allowedTo(permissions.CREATEROLE), dashboardController.rolesCreate);
router.post('/roles/create', allowedTo(permissions.CREATEROLE), dashboardController.rolesStore);
router.get('/roles/edit/:id', allowedTo(permissions.UPDATEROLE), dashboardController.rolesEdit);
router.post('/roles/edit/:id', allowedTo(permissions.UPDATEROLE), dashboardController.rolesUpdate);
router.post('/roles/delete/:id', allowedTo(permissions.DELETEROLE), dashboardController.rolesDelete);

// Footer management
router.get('/footer', allowedTo(permissions.UPDATEFOOTER), dashboardController.footerEdit);
router.post('/footer', allowedTo(permissions.UPDATEFOOTER), dashboardController.footerUpdate);

export { router as dashboardRouter };
