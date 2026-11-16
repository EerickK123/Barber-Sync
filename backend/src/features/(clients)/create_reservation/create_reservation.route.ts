import { Router } from "express";
import { createReservationValidator } from "./validator/create_reservation.validator";
import { createReservationController } from "./controller/create_reservation.controller";

const router = Router();

router.post("/", createReservationValidator, createReservationController);

export default router;
