import { Router } from "express";
import { registerPushTokenValidator } from "./validator/register_push_token.validator";
import { registerPushTokenController } from "./controller/register_push_token.controller";

const router = Router();

router.post("/registerPushToken", registerPushTokenValidator, registerPushTokenController);

export default router;
