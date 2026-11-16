import { Router } from "express";
import { createClientValidator } from "./validator/create_client.validator";
import { createClientController } from "./controller/create_client.controller";
import { upload } from "../../../global/lib/multer";

const router = Router();

router.post(
  "/", 
  upload.single("user_avatar"), 
  createClientValidator, 
  createClientController
);

export default router;