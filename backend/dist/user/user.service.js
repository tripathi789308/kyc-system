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
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const supabase_js_1 = require("@supabase/supabase-js");
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "your-bucket-name"; // Replace with your bucket name
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
function registerUser(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, role } = payload;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield db_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role,
                assignedRole: client_1.Role.USER, // Default assigned role
                kycStatus: client_1.ApprovalStatus.PENDING, // Default KYC status
            },
            select: {
                id: true,
                email: true,
                assignedRole: true,
                role: true,
                kycStatus: true,
            },
        });
        const userData = {
            id: newUser.id,
            email: newUser.email,
            assignedRole: newUser.assignedRole,
            role: newUser.role,
            kycStatus: newUser.kycStatus,
        };
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, JWT_SECRET, {
            expiresIn: "1D",
        });
        return { userData, token };
    });
}
function loginUser(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = payload;
        const user = yield db_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("User/Password is incorrect");
        }
        const userData = {
            id: user.id,
            email: user.email,
            assignedRole: user.assignedRole,
            role: user.role,
            kycStatus: user.kycStatus,
        };
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
        return { userData, token };
    });
}
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                assignedRole: true,
                role: true,
                kycStatus: true,
                name: true,
                age: true,
                createdAt: true,
                fileSource: true,
            },
        });
    });
}
function getUploadUrl(userId, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = `images/${userId}/${fileName}`;
        const { data, error } = yield supabase.storage
            .from(SUPABASE_BUCKET)
            .createSignedUploadUrl(filePath);
        if (error) {
            console.error("Error getting signed URL:", error);
            throw new Error("Failed to get signed URL from Supabase");
        }
        yield db_1.prisma.user.update({
            where: { id: userId },
            data: { fileSource: filePath },
        });
        return { signedUrl: data.signedUrl, path: filePath };
    });
}
exports.default = { registerUser, loginUser, getUserById, getUploadUrl };
