import { Router } from "express";
import authRoutes from "./(global)/auth/auth.route";
import clientPublicRoutes from "./(clients)/clients.public.feature.routes";
import employeePublicRoutes from "./(employees)/employees.public.routes";
import refreshSessionRoutes from "./(global)/refresh_session/refresh_session.route";
import { appOriginMiddleware } from "../global/middlewares";
import { AppOrigin } from "../global/types/global-types";

const router = Router();

router.use(
  "/auth",
  appOriginMiddleware([AppOrigin.ADMIN, AppOrigin.BUSINESS, AppOrigin.CLIENT]),
  authRoutes,
);

router.use(
  "/session",
  appOriginMiddleware([AppOrigin.ADMIN, AppOrigin.BUSINESS, AppOrigin.CLIENT]),
  refreshSessionRoutes,
);


router.use(
  "/clients",
  appOriginMiddleware(AppOrigin.CLIENT),
  clientPublicRoutes,
);

router.use(
  "/employees",
  appOriginMiddleware(AppOrigin.BUSINESS),
  employeePublicRoutes,
);

export default router;
