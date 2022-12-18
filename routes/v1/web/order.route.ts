import * as express from "express";
import OrdersController from "../../../controller/v1/web/orders.controller";
import adminMiddleware from "../../../middleware/admin.middleware";
import checkAuthMiddleware from "../../../middleware/both.middleware";

const routes = express.Router();

// Get All
routes.get("/", OrdersController.getAll);

// Add routes
routes.post("/", checkAuthMiddleware, OrdersController.add);

// Update All
routes.get("/update/:id", adminMiddleware, OrdersController.update);

// active
routes.post("/active/:id", adminMiddleware, OrdersController.activate);


// Get All
routes.get("/invoic", OrdersController.getAll);

// Get One Order
routes.get("/:id", OrdersController.getOne);

export default routes;
