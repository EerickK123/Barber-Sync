import { Router } from "express";
import { getClientProfileController } from "./controller/client_profile.controller";

const router = Router();


router.get("/", getClientProfileController);

export default router;
