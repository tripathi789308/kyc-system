"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const passport_1 = __importDefault(require("passport"));
const userRouter = express_1.default.Router();
userRouter.post("/register", user_controller_1.default.register);
userRouter.post("/login", user_controller_1.default.login);
userRouter.get("/", passport_1.default.authenticate("jwt", { session: false }), user_controller_1.default.getUser);
userRouter.get("/upload-image", passport_1.default.authenticate("jwt", { session: false }), user_controller_1.default.uploadImage);
exports.default = userRouter;
