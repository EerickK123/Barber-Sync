import { Router } from "express";
import { getClientReservationsController } from "./controller/get_client_reservations.controller";
import { getClientReservationsValidator } from "./validator/get_client_reservations.validator";


const router = Router();

router.get("/", getClientReservationsValidator, getClientReservationsController);

export default router;