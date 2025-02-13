import { ApprovalStatus, ApprovalType, Role, Status } from "../enums";

export interface ILoggedUserData {
  assignedRole: Role;
  email: string;
  id: string;
  kycStatus: Status;
  role: Role;
  name?: string;
  fileSource?: string;
  age?: number;
}

export interface Approval {
  id: string;
  createdAt: Date;
  userId: string;
  status: ApprovalStatus;
  requiredRole: ApprovalStatus | null;
  approval_type: ApprovalType;
  approvedByEmail?: string | null; // Use email if populated.
  rejectedByEmail?: string | null;
  user: { email: string }; // Added the user object with email
}
