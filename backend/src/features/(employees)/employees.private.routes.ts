import { Router } from "express";
import LinkEmployeeToBarbershopRoute from "./link_employee_to_barbershop/link_to_barbershop.route";
import getBarbershopServicesRoute from "./get_barbershop_services/get_barbershop_services.route";
import syncEmployeeServicesRoute from "./sync_employee_services/sync_employee_services.route";
import getOnboardingStatusRoute from "./onboarding_status/onboarding_status.route";
import getEmployeeScheduleRoute from "./get_employee_schedule/get_employee_schedule.route";
const router = Router();


router.use("/linkEmployeeToBarbershop", LinkEmployeeToBarbershopRoute);
router.use("/getBarbershopServices", getBarbershopServicesRoute);
router.use("/syncEmployeeServices", syncEmployeeServicesRoute);
router.use("/getOnboardingStatus", getOnboardingStatusRoute);

router.use("/getEmployeeSchedule", getEmployeeScheduleRoute);
export default router;
