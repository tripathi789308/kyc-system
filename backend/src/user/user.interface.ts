export interface CreateUserDTO {
  email: string;
  password: string;
  role: "SUPER" | "ADMIN" | "USER";
}

import { Role, ApprovalStatus } from "@prisma/client";

export interface UserData {
  id: string;
  email: string;
  assignedRole: Role;
  role: Role;
  kycStatus: ApprovalStatus;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}
