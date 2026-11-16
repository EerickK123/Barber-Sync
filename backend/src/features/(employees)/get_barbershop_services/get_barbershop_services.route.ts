import { Router } from "express";
import { getBarbershopServicesController } from "./controller/get_barbershop_services.controller";

const router = Router();

router.get("/", getBarbershopServicesController);

export default router;
