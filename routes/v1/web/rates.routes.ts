import * as express from "express";
import RatesController from "../../../controller/v1/web/rates.controller";
import adminMiddleware from "../../../middleware/admin.middleware";
const routes = express.Router();

// Add routes
routes.post("/add", adminMiddleware, RatesController.add);

// Update All
routes.get("/update/:id", adminMiddleware, RatesController.update);

export default routes;
