"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const approvals_service_1 = __importDefault(require("./approvals.service"));
const client_1 = require("@prisma/client");
function requestKYC(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const approval = yield approvals_service_1.default.requestKYC(userId, req.body);
            res.status(201).json(approval);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
}
function requestRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const approval = yield approvals_service_1.default.requestRole(userId, req.body);
            res.status(201).json(approval);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
}
function approveKYC(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const approvalId = req.body.approvalId;
            const user = req.user;
            if (user.role === client_1.Role.USER) {
                return res.status(403).json({ error: "Not enough permission" });
            }
            const approval = yield approvals_service_1.default.approveApproval(approvalId, userId);
            res.json(approval);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
}
function approveRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const approvalId = req.body.approvalId;
            const user = req.user;
            if (user.role === client_1.Role.USER) {
                return res.status(403).json({ error: "Not enough permission" });
            }
            const approval = yield approvals_service_1.default.approveApproval(approvalId, userId);
            res.json(approval);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
}
function rejectKYC(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const approvalId = req.body.approvalId;
            const user = req.user;
            if (user.role === client_1.Role.USER) {
                return res.status(403).json({ error: "Not enough permission" });
            }
            const approval = yield approvals_service_1.default.rejectApproval(approvalId, userId);
            res.json(approval);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
}
function rejectRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const approvalId = req.body.approvalId;
            const user = req.user;
            if (user.role === client_1.Role.USER) {
                return res.status(403).json({ error: "Not enough permission" });
            }
            const approval = yield approvals_service_1.default.rejectApproval(approvalId, userId);
            res.json(approval);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
}
function fetchPendingRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const role = req.user.role;
            if (role === "SUPER")
                res.json({ status: "Approved" });
            const pendingRequests = yield approvals_service_1.default.fetchPendingRequests(userId);
            res.json(pendingRequests);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
}
function fetchApprovals(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const role = req.user.role;
            const status = req.query.status;
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const approvals = yield approvals_service_1.default.fetchApprovals(userId, role, status, page);
            res.json(approvals);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
}
exports.default = {
    requestKYC,
    requestRole,
    approveKYC,
    approveRole,
    rejectKYC,
    rejectRole,
    fetchApprovals,
    fetchPendingRequests,
};
