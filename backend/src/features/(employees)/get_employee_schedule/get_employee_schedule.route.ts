import { Router } from "express";
import { getEmployeeAgendaController } from "./controller/get_employee_schedule.controller";
import { getEmployeeAgendaValidator } from "./validator/get_employee_schedule.validator";

const router = Router();

router.get("/", getEmployeeAgendaValidator, getEmployeeAgendaController);

export default router;
