import { Router } from "express";
import clientsPrivateRoutes from "./(clients)/clients.private.features.routes";
import employeePrivateRoutes from "./(employees)/employees.private.routes";
import {
  appOriginMiddleware,
  authMiddleware,
  roleRequiredMiddleware,
} from "../global/middlewares";
import { AppOrigin, UserRole } from "../global/types/global-types";
import registerPushTokenroute from "./(global)/register_push_token/register_push_token.route";
const router = Router();

router.use(
  "/clients",
  appOriginMiddleware(AppOrigin.CLIENT),
  roleRequiredMiddleware(UserRole.client),
  clientsPrivateRoutes,
);

router.use(
  "/employees",
  appOriginMiddleware(AppOrigin.BUSINESS),
  roleRequiredMiddleware(UserRole.Employee),
  employeePrivateRoutes,
);

router.use(
  "/notifications",
  appOriginMiddleware([AppOrigin.ADMIN, AppOrigin.BUSINESS, AppOrigin.CLIENT]),
  registerPushTokenroute,
);

/* 

router.use("/appAdmin");
router.use("/business");

*/

export default router;
