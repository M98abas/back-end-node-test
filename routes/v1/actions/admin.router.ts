import * as express from "express";
import AdminController from "../../../controller/v1/actions/admin.controller";
import adminMiddleware from "../../../middleware/admin.middleware";

const routes = express.Router();

// Register routes
routes.post("/register", AdminController.register);

// login Routes
routes.post("/login", AdminController.login);

// Get All USers
routes.get("/", AdminController.getAll);

// Get All USers
routes.get("/:id", AdminController.getOne);

// Get All USers
routes.post("/update", adminMiddleware, AdminController.update);

// Get All USers
routes.post("/active", adminMiddleware, AdminController.activate);

export default routes;
