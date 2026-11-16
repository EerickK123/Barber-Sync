import { Router } from "express";
import createEmployeeRoute from "./create_employee/create_employee.route";

const router = Router();

router.use("/register", createEmployeeRoute);

export default router;
