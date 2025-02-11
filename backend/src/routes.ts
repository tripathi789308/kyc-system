import { Router } from "express";
import userRouter from "./user/user.routes";
import  approvalsRouter from "./approvals/approvals.routes";
import passport from 'passport';
const router = Router();

router.use('/user', userRouter);
router.use('/approvals',passport.authenticate('jwt', { session: false }), approvalsRouter);


export default router;
