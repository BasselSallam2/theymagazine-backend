
import { ErrorRes } from "@shared/responces/errors.responces";
import { appUse } from "@utils/appUse";
import { globalErrorHandler } from "@utils/errorsHandlers/GlobalError.handler";
import express from "express";
import type { NextFunction, Request, Response } from "express";

const app = express();

appUse(app);

export default app;
