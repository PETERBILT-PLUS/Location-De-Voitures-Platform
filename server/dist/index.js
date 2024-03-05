"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./Routes/auth.router"));
const app = (0, express_1.default)();
const PORT = 5000;
app.use("/", auth_router_1.default);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
