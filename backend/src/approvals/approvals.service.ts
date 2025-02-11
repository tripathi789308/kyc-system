import {prisma} from '../db';
import { ApprovalStatus, ApprovalTypes, Role } from '@prisma/client';
import { RequestKYCPayload, RequestRolePayload } from './approvals.interface';

async function requestKYC(userId: string, payload: RequestKYCPayload) {
  const { name, age, fileSource } = payload;

  const [approval] = await prisma.$transaction([
      prisma.approval.create({
    data: {
      userId,
      approval_type: ApprovalTypes.KYC,
    },
  }),
      prisma.user.update({
    where: { id: userId },
    data: {
      name: name,
      age: age,
      fileSource: fileSource,
      kycStatus : ApprovalStatus.PENDING,
    },
  }),
    ]);
  return approval;
}

async function requestRole(userId: string, payload: RequestRolePayload) {
  const { requiredRole } = payload;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error('User not found');
  }

  if (requiredRole === Role.SUPER) {
    throw new Error('Cannot request SUPER role');
  }

  if (requiredRole === Role.ADMIN) {
    if (user.kycStatus !== ApprovalStatus.APPROVED) {
      throw new Error('KYC must be approved to request ADMIN role');
    }
    const approval = await prisma.approval.create({
      data: {
        userId,
        approval_type: ApprovalTypes.ROLE,
        requiredRole: Role.ADMIN,
      },
    });

    return approval;
  }

  if (requiredRole === Role.USER) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: Role.USER,
        assignedRole: Role.USER,
      },
    });
    return { message: 'Role updated to USER' };
  }

  throw new Error('Invalid role requested');
}

async function approveApproval(approvalId: string, userId: string) {
  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
    include: { user: true },
  });

  if (!approval) {
    throw new Error('Approval not found');
  }

  const userWhoIsApproving = await prisma.user.findUnique({ where : {id : userId}});
  if(!userWhoIsApproving || userWhoIsApproving?.kycStatus !== ApprovalStatus.APPROVED){
    throw new Error('Not have enough permissions to approve');
  }

  if (approval.approval_type === ApprovalTypes.KYC) {
    await prisma.$transaction([
      prisma.approval.update({
        where: { id: approvalId },
        data: { status: ApprovalStatus.APPROVED,rejectedBy : '', approvedBy: userId },
      }),
      prisma.user.update({
        where: { id: approval.userId },
        data: { kycStatus: ApprovalStatus.APPROVED },
      }),
    ]);
    return { message: 'KYC approved' };
  }

  if (approval.approval_type === ApprovalTypes.ROLE) {
    await prisma.$transaction([
      prisma.approval.update({
        where: { id: approvalId },
        data: { status: ApprovalStatus.APPROVED, approvedBy: userId },
      }),
      prisma.user.update({
        where: { id: approval.userId },
        data: { role: Role.ADMIN, assignedRole: Role.ADMIN },
      }),
    ]);
    return { message: 'Role approved' };
  }

  throw new Error('Invalid approval type');
}

async function rejectApproval(approvalId: string, userId: string) {
  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
    include: { user: true },
  });

  if (!approval) {
    throw new Error('Approval not found');
  }

  const userWhoIsApproving = await prisma.user.findUnique({ where : {id : userId}});
  if(!userWhoIsApproving || userWhoIsApproving?.kycStatus !== ApprovalStatus.APPROVED){
    throw new Error('Not have enough permissions to approve');
  }

  if (approval.approval_type === ApprovalTypes.KYC) {
    await prisma.$transaction([
      prisma.approval.update({
        where: { id: approvalId },
        data: { status: ApprovalStatus.REJECTED,approvedBy: '', rejectedBy: userId },
      }),
      prisma.user.update({
        where: { id: approval.userId },
        data: { kycStatus: ApprovalStatus.REJECTED},
      }),
    ]);
    return { message: 'KYC rejected' };
  }

  if (approval.approval_type === ApprovalTypes.ROLE) {
    await prisma.approval.update({
      where: { id: approvalId },
      data: { status: ApprovalStatus.REJECTED, rejectedBy: userId },
    });
    return { message: 'Role rejected' };
  }

  throw new Error('Invalid approval type');
}

async function fetchApprovals(userId: string, role: Role, status?: ApprovalStatus, page: number = 1) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  let whereClause: any = {};

  if (status) {
    whereClause.status = status;
  }

  if (role === Role.USER) {
    return { approvals: [], totalPages: 0 };
  } else if (role === Role.ADMIN) {
    whereClause.approval_type = ApprovalTypes.KYC;
  }

  const totalApprovals = await prisma.approval.count({
    where: whereClause,
  });
  const totalPages = Math.ceil(totalApprovals / pageSize);

  const approvals = await prisma.approval.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: pageSize,
    include: {
      user: true,
      approvedByUser: { select: { email: true } },
      rejectedByUser: { select: { email: true } },
    },
  });

  const transformedApprovals = approvals.map((approval) => ({
    ...approval,
    approvedByEmail: approval.approvedByUser ? approval.approvedByUser.email : null,
    rejectedByEmail: approval.rejectedByUser ? approval.rejectedByUser.email : null,
    approvedByUser: undefined,
    rejectedByUser: undefined,
  }));
  return { approvals: transformedApprovals, totalPages };
}
export default { requestKYC, requestRole, approveApproval, rejectApproval,fetchApprovals };