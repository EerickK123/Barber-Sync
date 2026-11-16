import { Router } from "express";
import getBarbershopsRoute from "./get_barbershops_by_client/get_barbershops.route";
import joinBarbershopRoute from "./join_barbershop/join_barbershop.route";
import getBarbershopProfileroute from "./barbershop_profile/barbershop_profile.route";
import createReservationroute from "./create_reservation/create_reservation.route";
import getClientProfile from "./client_profile/client_profile.route";
import getClientReservations from "./get_client_reservations/get_reservations.route";
import updateClientProfileRoute from "./update_client_profile/update_client_profile.route";
import updateReservationRoute from "./update_reservations/update_reservation.route";
const router = Router();

router.use("/getBarbershopProfile", getBarbershopProfileroute); // funciona
router.use("/getClientProfile", getClientProfile); //funciona

router.use("/createReservation", createReservationroute); // funciona, corregir validacion zod del uuid del empleado
router.use("/getBarbershops", getBarbershopsRoute); // funciona
router.use("/getClientReservations", getClientReservations); // funciona
router.use("/joinBarbershop", joinBarbershopRoute); //funciona

router.use("/updateClientProfile", updateClientProfileRoute); // (revisar si funciona, probable que si)
router.use("/updateReservation", updateReservationRoute); // revisar si funciona, corregir validacion zod del uuid del empleado

export default router;
