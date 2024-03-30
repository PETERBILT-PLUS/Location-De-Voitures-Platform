"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_agent_controller_js_1 = require("../Controller/auth.agent.controller.js");
const protectAgentRoute_js_1 = require("../middleware/protectAgentRoute.js");
const agentRouter = express_1.default.Router();
agentRouter.post("/register", auth_agent_controller_js_1.registerUser);
agentRouter.post("/login", auth_agent_controller_js_1.loginAgent);
agentRouter.post("/payment", protectAgentRoute_js_1.protectAgentRoute, auth_agent_controller_js_1.createPaymentSession);
agentRouter.post("/hooks", express_1.default.raw({ type: "application/json" }), auth_agent_controller_js_1.webHooks);
exports.default = agentRouter;
