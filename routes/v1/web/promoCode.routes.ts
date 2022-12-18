import * as express from "express";
import PromoCodeController from "../../../controller/v1/web/promoCode.controller";
import adminMiddleware from "../../../middleware/admin.middleware";
const routes = express.Router();

// Get All
routes.get("/", PromoCodeController.getAll);

// Add routes
routes.post("/", adminMiddleware, PromoCodeController.add);

// Update All
routes.get("/update/:id", adminMiddleware, PromoCodeController.update);

// active
routes.post("/active/:id", adminMiddleware, PromoCodeController.activate);

// Get One USer
routes.get("/:id", PromoCodeController.getOne);

export default routes;
