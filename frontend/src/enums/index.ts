export enum Constants {
  TOKEN = "token",
}

export enum RoutePath {
  DASHBOARD = "/",
  KYC_FORM = "/kyc-form",
  REGISTER = "/register",
  LOGIN = "/login",
  PROFILE = "/profile",
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  SUPER = "SUPER",
}

export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
}

export enum ApprovalType {
  KYC = "KYC",
  ROLE = "ROLE",
}

export enum RequestedType {
  Submitted = "Submitted",
  NotSubmitted = "NotSubmitted",
  Approved = "Approved",
}
