import { Router } from "express";
import { updateReservationController } from "./controller/update_reservations.controller";
import { updateReservationValidator } from "./validator/update_reservations.validator";

const router = Router();

router.patch("/", updateReservationValidator, updateReservationController);

export default router;