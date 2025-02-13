import express from "express";
import userController from "./user.controller";
import passport from "passport";

const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.getUser,
);
userRouter.get(
  "/upload-image",
  passport.authenticate("jwt", { session: false }),
  userController.uploadImage,
);

export default userRouter;
