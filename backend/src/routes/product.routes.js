import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticateSeller);

export default router;
