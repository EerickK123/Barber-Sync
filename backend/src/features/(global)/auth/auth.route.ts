import { Router } from "express";
import { authValidator } from "./validator/auth.validator";
import { authController } from "./controller/auth.controller";

const router = Router();

router.post("/login", authValidator, authController);

export default router;
