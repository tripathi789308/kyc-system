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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const client_1 = require("@prisma/client");
function requestKYC(userId, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, age, fileSource } = payload;
        const [approval] = yield db_1.prisma.$transaction([
            db_1.prisma.approval.create({
                data: {
                    userId,
                    approval_type: client_1.ApprovalTypes.KYC,
                },
            }),
            db_1.prisma.user.update({
                where: { id: userId },
                data: {
                    name: name,
                    age: age,
                    fileSource: fileSource,
                    kycStatus: client_1.ApprovalStatus.PENDING,
                },
            }),
        ]);
        return approval;
    });
}
function requestRole(userId, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { requiredRole } = payload;
        const user = yield db_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error("User not found");
        }
        if (requiredRole === client_1.Role.SUPER) {
            throw new Error("Cannot request SUPER role");
        }
        if (requiredRole === client_1.Role.ADMIN) {
            if (user.kycStatus !== client_1.ApprovalStatus.APPROVED) {
                throw new Error("KYC must be approved to request ADMIN role");
            }
            const approval = yield db_1.prisma.approval.create({
                data: {
                    userId,
                    approval_type: client_1.ApprovalTypes.ROLE,
                    requiredRole: client_1.Role.ADMIN,
                },
            });
            return approval;
        }
        if (requiredRole === client_1.Role.USER) {
            yield db_1.prisma.user.update({
                where: { id: userId },
                data: {
                    role: client_1.Role.USER,
                    assignedRole: client_1.Role.USER,
                },
            });
            return { message: "Role updated to USER" };
        }
        throw new Error("Invalid role requested");
    });
}
function approveApproval(approvalId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const approval = yield db_1.prisma.approval.findUnique({
            where: { id: approvalId },
            include: { user: true },
        });
        if (!approval) {
            throw new Error("Approval not found");
        }
        const userWhoIsApproving = yield db_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!userWhoIsApproving ||
            (userWhoIsApproving === null || userWhoIsApproving === void 0 ? void 0 : userWhoIsApproving.kycStatus) !== client_1.ApprovalStatus.APPROVED) {
            throw new Error("Not have enough permissions to approve");
        }
        if (approval.approval_type === client_1.ApprovalTypes.KYC) {
            yield db_1.prisma.$transaction([
                db_1.prisma.approval.update({
                    where: { id: approvalId },
                    data: {
                        status: client_1.ApprovalStatus.APPROVED,
                        approvedBy: userId,
                    },
                }),
                db_1.prisma.user.update({
                    where: { id: approval.userId },
                    data: { kycStatus: client_1.ApprovalStatus.APPROVED },
                }),
            ]);
            return { message: "KYC approved" };
        }
        if ((userWhoIsApproving === null || userWhoIsApproving === void 0 ? void 0 : userWhoIsApproving.assignedRole) !== client_1.Role.SUPER) {
            throw new Error("Not have enough permissions to approve");
        }
        if (approval.approval_type === client_1.ApprovalTypes.ROLE) {
            yield db_1.prisma.$transaction([
                db_1.prisma.approval.update({
                    where: { id: approvalId },
                    data: { status: client_1.ApprovalStatus.APPROVED, approvedBy: userId },
                }),
                db_1.prisma.user.update({
                    where: { id: approval.userId },
                    data: { role: client_1.Role.ADMIN, assignedRole: client_1.Role.ADMIN },
                }),
            ]);
            return { message: "Role approved" };
        }
        throw new Error("Invalid approval type");
    });
}
function rejectApproval(approvalId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const approval = yield db_1.prisma.approval.findUnique({
            where: { id: approvalId },
            include: { user: true },
        });
        if (!approval) {
            throw new Error("Approval not found");
        }
        const userWhoIsApproving = yield db_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!userWhoIsApproving ||
            (userWhoIsApproving === null || userWhoIsApproving === void 0 ? void 0 : userWhoIsApproving.kycStatus) !== client_1.ApprovalStatus.APPROVED) {
            throw new Error("Not have enough permissions to approve");
        }
        if (approval.approval_type === client_1.ApprovalTypes.KYC) {
            yield db_1.prisma.$transaction([
                db_1.prisma.approval.update({
                    where: { id: approvalId },
                    data: {
                        status: client_1.ApprovalStatus.REJECTED,
                        rejectedBy: userId,
                    },
                }),
                db_1.prisma.user.update({
                    where: { id: approval.userId },
                    data: { kycStatus: client_1.ApprovalStatus.REJECTED },
                }),
            ]);
            return { message: "KYC rejected" };
        }
        if (approval.approval_type === client_1.ApprovalTypes.ROLE) {
            yield db_1.prisma.approval.update({
                where: { id: approvalId },
                data: { status: client_1.ApprovalStatus.REJECTED, rejectedBy: userId },
            });
            return { message: "Role rejected" };
        }
        throw new Error("Invalid approval type");
    });
}
function fetchApprovals(userId_1, role_1, status_1) {
    return __awaiter(this, arguments, void 0, function* (userId, role, status, page = 1) {
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        let whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        if (role === client_1.Role.USER) {
            return { approvals: [], totalPages: 0 };
        }
        else if (role === client_1.Role.ADMIN) {
            whereClause.approval_type = client_1.ApprovalTypes.KYC;
        }
        const totalApprovals = yield db_1.prisma.approval.count({
            where: whereClause,
        });
        const totalPages = Math.ceil(totalApprovals / pageSize);
        const approvals = yield db_1.prisma.approval.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip: skip,
            take: pageSize,
            include: {
                user: true,
                approvedByUser: { select: { email: true } },
                rejectedByUser: { select: { email: true } },
            },
        });
        const transformedApprovals = approvals.map((approval) => (Object.assign(Object.assign({}, approval), { approvedByEmail: approval.approvedByUser
                ? approval.approvedByUser.email
                : null, rejectedByEmail: approval.rejectedByUser
                ? approval.rejectedByUser.email
                : null, approvedByUser: undefined, rejectedByUser: undefined })));
        return { approvals: transformedApprovals, totalPages };
    });
}
function fetchPendingRequests(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const approval = yield db_1.prisma.approval.findFirst({
            where: {
                userId: userId,
                approval_type: client_1.ApprovalTypes.KYC,
            },
        });
        if (!approval) {
            return { status: "NotSubmitted" };
        }
        switch (approval.status) {
            case client_1.ApprovalStatus.PENDING:
                return { status: "Submitted" };
            case client_1.ApprovalStatus.APPROVED:
                return { status: "Approved" };
            default:
                throw new Error("Unexpected approval status");
        }
    });
}
exports.default = {
    requestKYC,
    requestRole,
    approveApproval,
    rejectApproval,
    fetchApprovals,
    fetchPendingRequests,
};
