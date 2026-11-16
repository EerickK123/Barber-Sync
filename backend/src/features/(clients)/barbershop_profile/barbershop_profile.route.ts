import { Router } from "express";
import { getAllBarbershopInfoController } from "./controller/barbershop_profile.controller";
import { barbershopProfileCodeValidator } from "./validator/barbershop_profile.validator";

const router = Router();

router.post(
  "/",
  barbershopProfileCodeValidator,
  getAllBarbershopInfoController,
);

export default router;
