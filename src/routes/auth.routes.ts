import { Router } from "express";
import { checkEmail, login } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.get("/check-email", checkEmail);
export default router;