import { Router } from "express";
import { OnboardingStatusController } from "./controller/onboarding_status.controller";

const router = Router();

router.get("/", OnboardingStatusController);

export default router;

