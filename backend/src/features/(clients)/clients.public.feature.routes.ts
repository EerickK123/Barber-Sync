import { Router } from "express";
import createClientRoutes from "./create_client/create_client.route";

const router = Router();

router.use("/register", createClientRoutes);

export default router;
