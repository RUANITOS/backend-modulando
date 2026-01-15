import { Router } from "express";
import { getModuloAtual } from "../controllers/modules.Controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/atual", authMiddleware, getModuloAtual);


export default router;
