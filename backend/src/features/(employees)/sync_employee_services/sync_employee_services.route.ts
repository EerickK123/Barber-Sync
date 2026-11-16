import { Router } from "express";
import { syncEmployeeServicesController } from "./controller/sync_employee_services";
import { syncEmployeeServicesValidator } from "./validator/sync_employee_services.validator";

const router = Router();

router.post("/", syncEmployeeServicesValidator, syncEmployeeServicesController);

export default router;
