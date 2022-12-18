import * as express from "express";
import BrandsController from "../../../controller/v1/web/brands.controller";
import adminMiddleware from "../../../middleware/admin.middleware";
const routes = express.Router();

// Get All
routes.get("/", BrandsController.getAll);

// Add routes
routes.post("/", adminMiddleware, BrandsController.add);

// All with product Routes
routes.get("/all/:id", BrandsController.getOneWithProduct);

// Update All
routes.get("/update/:id", adminMiddleware, BrandsController.update);

// active
routes.post("/active/:id", adminMiddleware, BrandsController.activate);

// Get One USer
routes.get("/:id", BrandsController.getOne);

export default routes;
