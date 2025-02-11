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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db"); // Import the connection function
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = process.env.PORT || 3001;
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        // Example route to check DB connection
        app.get('/api/health', (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(200).send('OK');
        }));
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        yield (0, db_1.connectToDatabase)(); // Await the database connection before starting the server
    });
}
main();
