import { Router } from "express";
import { refreshSessionValidator } from "./validator/refresh_session.validator";
import { refreshSessionController } from "./controller/refresh_session.controller";

const router = Router();

router.post("/refresh", refreshSessionValidator, refreshSessionController);

export default router;


