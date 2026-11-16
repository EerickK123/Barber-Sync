import { Router } from "express";
import { updateClientProfileController } from "./controller/update_client_profile.controller";
import { updateClientProfileValidator } from "./validator/update_client_profile.validator";
import { upload } from "../../../global/lib/multer";

const router = Router();

router.patch(
  "/",
  upload.single("user_avatar"),
  updateClientProfileValidator,
  updateClientProfileController
);

export default router;