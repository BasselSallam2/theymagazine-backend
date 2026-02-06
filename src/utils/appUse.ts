import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongooseSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";

import appRoutes from "@utils/appRoutes";
import { dashboardRouter } from "@modules/dashboard/dashboard.routes";
import { morganStream } from "@config/logger.config";
import { ErrorRes } from "@shared/responces/errors.responces";

// const rateLimiter = rateLimit({
// 	windowMs: 15 * 60 * 1000,
// 	max: 100,
// 	message: "Too many requests from this IP, please try again after 15 minutes",
// });

// const speedLimiter = slowDown({
// 	windowMs: 60 * 1000,
// 	delayAfter: 50,
// 	delayMs: () => 500,
// });

export const appUse = (app: Express): void => {
	app.use(express.json({ limit: "10Kb" }));
	app.use(express.urlencoded({ extended: true, limit: "10Kb" }));
	app.use(cookieParser());
	app.use(compression());
	app.use(helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
				scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
				fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
				imgSrc: ["'self'", "data:", "https:", "http:"],
				connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
				scriptSrcAttr: ["'unsafe-inline'"],
			},
		},
	}));
	app.use(cors());
	// app.use(rateLimiter);
	// app.use(speedLimiter);
	app.use(mongooseSanitize());
	app.use(morgan('combined' , {stream: morganStream}));

	// EJS Configuration for Dashboard
	app.set('view engine', 'ejs');
	app.set('views', path.join(process.cwd(), 'src', 'views'));

	// Mount dashboard routes first (this will handle both /dashboard and /dashboard/)
	app.use('/dashboard', dashboardRouter);

	// Static files for dashboard
	app.use('/css', express.static(path.join(process.cwd(), 'src', 'views', 'public', 'css')));
	app.use('/js', express.static(path.join(process.cwd(), 'src', 'views', 'public', 'js')));
	app.use('/images', express.static(path.join(process.cwd(), 'src', 'views', 'public', 'images')));

	app.use("/api", appRoutes);

	// Catch-all route for invalid URLs (must be last)
	app.all("*", (req: Request, res: Response, next: NextFunction) => next(ErrorRes.invalidURL(req.originalUrl)));
};
