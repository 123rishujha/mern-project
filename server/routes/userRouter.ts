import express from "express";
import auth from "../middleware/auth";
import userCtrl from "../controllers/userCtrl";

const router = express.Router();

router.patch("/user", auth, userCtrl.updateUser);
router.get('/user/:id', userCtrl.getUser)
router.patch("/reset_password", auth, userCtrl.resetPassword);

export default router;
