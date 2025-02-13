"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const approvals_controller_1 = __importDefault(require("./approvals.controller"));
const approvalsRouter = express_1.default.Router();
approvalsRouter.post("/requestKYC", approvals_controller_1.default.requestKYC);
approvalsRouter.post("/requestRole", approvals_controller_1.default.requestRole);
approvalsRouter.put("/approveKYC", approvals_controller_1.default.approveKYC);
approvalsRouter.put("/approveRole", approvals_controller_1.default.approveRole);
approvalsRouter.put("/rejectKYC", approvals_controller_1.default.rejectKYC);
approvalsRouter.put("/rejectRole", approvals_controller_1.default.rejectRole);
approvalsRouter.get("/getSubmittedRequest", approvals_controller_1.default.fetchPendingRequests);
approvalsRouter.get("/fetch", approvals_controller_1.default.fetchApprovals);
exports.default = approvalsRouter;
