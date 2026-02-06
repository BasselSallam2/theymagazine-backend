import { Router } from "express";
import { usersRouter } from "@modules/Users/users.routes";
import { authRouter } from "@modules/Auth/auth.route";
// import { Cache } from "@config/redis/init";
import { postRouter } from "@modules/POST/post.routes";
import { roleRouter } from "@modules/Roles/role.routes";
import { categoryRouter } from "@modules/category/category.routes";
import { navbarRouter } from "@modules/navbar/navbar.routes";
import { uploadRouter } from "@modules/upload/upload.routes";
import { searchRouter } from "@modules/search/search.routes";
import { footerRouter } from "@modules/footer/footer.routes";
import { dashboardRouter } from "@modules/dashboard/dashboard.routes";

const router = Router();

	router.use("/user", usersRouter);
	router.use("/auth", authRouter);
	router.use("/post", postRouter);
	router.use("/role", roleRouter);
	router.use("/category", categoryRouter);
	router.use("/footer", footerRouter);
	router.use("/navbar", navbarRouter);
	router.use("/upload" , uploadRouter);
	router.use("/search", searchRouter);
// router.get("/clearCache", (req, res) => {
// 	Cache.clear();
// 	res.status(200).json({ message: "Cache cleared" });
// });

router.get("/health", (req, res) => {
	res.status(200).json({ status: "OK" });
});

export default router;
