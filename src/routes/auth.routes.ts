import { Router } from "express";
import { checkEmail, firstAccess, login } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.get("/check-email", checkEmail);
router.post("/first-access", firstAccess);
export default router;