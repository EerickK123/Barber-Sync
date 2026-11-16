import { Router } from "express";
import { joinEmployeeToBarbershopbyCodeValidator } from "./validator/link_to_barbershop.validator";
import { joinEmployeeToBarbershopByCodeController } from "./controller/link_to_barbershop.controller";

const router = Router();

router.post(
  "/",
  joinEmployeeToBarbershopbyCodeValidator,
  joinEmployeeToBarbershopByCodeController,
);

export default router;
