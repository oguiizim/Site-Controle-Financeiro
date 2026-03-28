import { Router } from "express";
import * as userController from "./user/userController";
import * as middleware from "./middleware/middleware";

const router = Router();

router.post("/register", userController.createUser);
router.post("/login", userController.login);
router.put("/edit", middleware.AuthToken, userController.edit);
router.get("/me", middleware.AuthToken, userController.me);
router.delete("/users/:id", userController.deleteUser);

export default router;
