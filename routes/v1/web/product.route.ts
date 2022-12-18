import * as express from "express";
import ProductController from "../../../controller/v1/web/product.controller";
import adminMiddleware from "../../../middleware/admin.middleware";
const routes = express.Router();

// Get All
routes.get("/", ProductController.getAll);

// Add routes
routes.post("/", adminMiddleware, ProductController.add);

// add Description
routes.post(
  "/add-description",
  adminMiddleware,
  ProductController.addProductDescription
);

// Update All
routes.put("/update/:id", adminMiddleware, ProductController.update);

// active
routes.put("/active/:id", adminMiddleware, ProductController.activate);

// Get One Order
routes.get("/:id", ProductController.getOne);

export default routes;
