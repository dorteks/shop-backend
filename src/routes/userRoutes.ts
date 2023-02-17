import { Router } from "express";
const userController = require("../controllers/userControllers");

const router = Router();

router.get("/", userController.getUsers);

router.post("/signup", userController.createUser);

router.post("/login", userController.loginUser);

router.post("/forgot-password", userController.forgotPassword);

router.post("/set-new-password", userController.passwordReset);

router.post("/update-user", userController.updateUser);

router.post("/delete-user", userController.deleteUser);

module.exports = router;
