import { appUse } from "@utils/appUse";
import { globalErrorHandler } from "@utils/errorsHandlers/GlobalError.handler";
import express from "express";

const app = express();

appUse(app);
app.use(globalErrorHandler);

export default app;
