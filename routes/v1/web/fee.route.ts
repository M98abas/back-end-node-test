import * as express from "express";
import FeeController from "../../../controller/v1/web/fee.constroller";
import adminMiddleware from "../../../middleware/admin.middleware";
const routes = express.Router();

// Get All
routes.get("/", FeeController.getAll);

// Add routes
routes.post("/", adminMiddleware, FeeController.add);

// Update All
routes.get("/update/:id", adminMiddleware, FeeController.update);

// active
routes.post("/active/:id", adminMiddleware, FeeController.activate);

// Get One USer
routes.get("/:id", FeeController.getOne);

export default routes;
