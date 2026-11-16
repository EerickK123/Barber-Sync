import { Router } from "express";
import { joinBarbershopCodeValidator } from "./validator/join_barbershop.validator";
import { joinBarbershopByCodeController } from "./controller/join_barbershop.controller";

const router = Router();

router.post("/", joinBarbershopCodeValidator, joinBarbershopByCodeController);

export default router;
