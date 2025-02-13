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
const user_service_1 = __importDefault(require("./user.service"));
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userData, token } = yield user_service_1.default.registerUser(req.body);
            res.status(201).json({ userData, token });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Registration failed' });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield user_service_1.default.loginUser(req.body);
            if (result) {
                res.json(result);
            }
            else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Login failed' });
        }
    });
}
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const user = yield user_service_1.default.getUserById(userId);
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ error: 'User not found' });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get user' });
        }
    });
}
function uploadImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const fileName = req.query.fileName;
            if (!fileName) {
                return res.status(400).json({ error: 'Filename is required as a query parameter' });
            }
            const { signedUrl, path } = yield user_service_1.default.getUploadUrl(userId, fileName);
            res.json({ signedUrl, path });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
}
exports.default = { register, login, getUser, uploadImage };
