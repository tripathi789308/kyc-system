import { Request, Response } from "express";
import approvalService from "./approvals.service";
import { ApprovalStatus, Role } from "@prisma/client";

async function requestKYC(req: Request, res: Response) {
  try {
    const userId = (req.user as { userId: string }).userId;
    const approval = await approvalService.requestKYC(userId, req.body);
    res.status(201).json(approval);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function requestRole(req: Request, res: Response) {
  try {
    const userId = (req.user as { userId: string }).userId;
    const approval = await approvalService.requestRole(userId, req.body);
    res.status(201).json(approval);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function approveKYC(req: Request, res: Response) {
  try {
    const userId = (req.user as { userId: string }).userId;
    const approvalId = req.body.approvalId;
    const user = req.user as { role: Role; userId: string };
    if (user.role === Role.USER) {
      return res.status(403).json({ error: "Not enough permission" });
    }
    const approval = await approvalService.approveApproval(approvalId, userId);
    res.json(approval);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function approveRole(req: Request, res: Response) {
  try {
    const userId = (req.user as { userId: string }).userId;
    const approvalId = req.body.approvalId;
    const user = req.user as { role: Role; userId: string };
    if (user.role === Role.USER) {
      return res.status(403).json({ error: "Not enough permission" });
    }
    const approval = await approvalService.approveApproval(approvalId, userId);
    res.json(approval);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function rejectKYC(req: Request, res: Response) {
  try {
    const userId = (req.user as { userId: string }).userId;
    const approvalId = req.body.approvalId;
    const user = req.user as { role: Role; userId: string };
    if (user.role === Role.USER) {
      return res.status(403).json({ error: "Not enough permission" });
    }
    const approval = await approvalService.rejectApproval(approvalId, userId);
    res.json(approval);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function rejectRole(req: Request, res: Response) {
  try {
    const userId = (req.user as { userId: string }).userId;
    const approvalId = req.body.approvalId;
    const user = req.user as { role: Role; userId: string };
    if (user.role === Role.USER) {
      return res.status(403).json({ error: "Not enough permission" });
    }
    const approval = await approvalService.rejectApproval(approvalId, userId);
    res.json(approval);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function fetchPendingRequests(req: Request, res: Response) {
  try {
    const userId = (req.user as { userId: string }).userId;
    const role = (req.user as { role: Role; userId: string }).role;
    if (role === "SUPER") res.json({ status: "Approved" });
    const pendingRequests = await approvalService.fetchPendingRequests(userId);
    res.json(pendingRequests);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function fetchApprovals(req: Request, res: Response) {
  try {
    const userId = (req.user as { userId: string }).userId;
    const role = (req.user as { role: Role; userId: string }).role;
    const status = req.query.status as ApprovalStatus | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

    const approvals = await approvalService.fetchApprovals(
      userId,
      role,
      status,
      page,
    );
    res.json(approvals);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
export default {
  requestKYC,
  requestRole,
  approveKYC,
  approveRole,
  rejectKYC,
  rejectRole,
  fetchApprovals,
  fetchPendingRequests,
};
