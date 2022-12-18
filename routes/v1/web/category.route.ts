import * as express from "express";
import CategoryController from "../../../controller/v1/web/category.controller";
import adminMiddleware from "../../../middleware/admin.middleware";
const routes = express.Router();

// Get All
routes.get("/", CategoryController.getAll);

// Add routes
routes.post("/", adminMiddleware, CategoryController.add);

// All with Brands Routes
routes.get("/all/:id", CategoryController.getOneWithBrands);

// Update All
routes.get("/update/:id", adminMiddleware, CategoryController.update);

// active
routes.post("/active/:id", adminMiddleware, CategoryController.activate);

// Get One USer
routes.get("/:id", CategoryController.getOne);

export default routes;
