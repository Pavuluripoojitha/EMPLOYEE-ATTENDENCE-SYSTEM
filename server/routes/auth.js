// eas/server/routes/auth.js
import { Router } from "express";
import * as c from "../controllers/authController.js";

const router = Router();

router.post("/register", c.register);
router.post("/login", c.login);
router.get("/me", c.me);

export default router;
