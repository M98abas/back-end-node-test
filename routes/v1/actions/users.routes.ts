import * as express from "express";
import UserController from "../../../controller/v1/actions/user.controller";
import checkAuthMiddleware from "../../../middleware/both.middleware";
import customerMiddleware from "../../../middleware/user.middleware";
import adminMiddleware from "../../../middleware/admin.middleware";
const routes = express.Router();

// Register routes
routes.post("/register", UserController.register);

// login Routes
routes.post("/login", UserController.login);

// Validate OTP
routes.post("/validate", customerMiddleware, UserController.validateOtp);

// Get All USers
routes.get("/", UserController.getAll);

// Get All USers active and not
routes.get("/absoult", adminMiddleware, UserController.getAbsolute);

// Update Route
routes.put("/update/:id", checkAuthMiddleware, UserController.update);

// active and Deactive USer
routes.put("/active/:id", checkAuthMiddleware, UserController.activate);

// Get One USer
routes.get("/:id", UserController.getOne);

export default routes;
