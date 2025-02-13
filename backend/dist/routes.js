"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user/user.routes"));
const approvals_routes_1 = __importDefault(require("./approvals/approvals.routes"));
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.use('/user', user_routes_1.default);
router.use('/approvals', passport_1.default.authenticate('jwt', { session: false }), approvals_routes_1.default);
exports.default = router;
