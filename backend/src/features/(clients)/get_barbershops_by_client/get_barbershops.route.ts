import { Router } from "express";

import { getBarbershopsController } from "./controller/get_barbershops.controller";

const router = Router();

router.get("/", getBarbershopsController);

export default router;
