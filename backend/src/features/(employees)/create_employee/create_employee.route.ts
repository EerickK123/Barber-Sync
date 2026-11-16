import { Router } from "express";
import { createEmployeeValidator } from "./validator/create_employee.validator";
import { createEmployeeController } from "./controller/create_employee.controller";
import { upload } from "../../../global/lib/multer";

const router = Router();

router.post(
  "/",
  upload.single("user_avatar"),
  createEmployeeValidator,
  createEmployeeController,
);

export default router;
