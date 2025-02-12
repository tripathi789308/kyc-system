import { Role } from '@prisma/client';

export interface RequestKYCPayload {
  name: string;
  age: number;
  fileSource: string;
}

export interface RequestRolePayload {
  requiredRole: Role;
}