import express from "express";
import { createPaymentSession, loginAgent, registerUser, webHooks } from "../Controller/auth.agent.controller.js";
import { protectAgentRoute } from "../middleware/protectAgentRoute.js";

const agentRouter = express.Router();

agentRouter.post("/register", registerUser);
agentRouter.post("/login", loginAgent);

agentRouter.post("/payment", protectAgentRoute, createPaymentSession);
agentRouter.post("/hooks", express.raw({ type: "application/json" }), webHooks);

export default agentRouter;