import express from "express";
import approvalController from "./approvals.controller";

const approvalsRouter = express.Router();

approvalsRouter.post("/requestKYC", approvalController.requestKYC);
approvalsRouter.post("/requestRole", approvalController.requestRole);
approvalsRouter.put("/approveKYC", approvalController.approveKYC);
approvalsRouter.put("/approveRole", approvalController.approveRole);
approvalsRouter.put("/rejectKYC", approvalController.rejectKYC);
approvalsRouter.put("/rejectRole", approvalController.rejectRole);
approvalsRouter.get(
  "/getSubmittedRequest",
  approvalController.fetchPendingRequests,
);
approvalsRouter.get("/fetch", approvalController.fetchApprovals);

export default approvalsRouter;
