import express from "express";
import { createPaymentSession, loginAgent, registerUser } from "../Controller/auth.agent.controller.js";
import { protectAgentRoute } from "../middleware/protectAgentRoute.js";

const agentRouter = express.Router();

agentRouter.post("/register", registerUser);
agentRouter.post("/login", loginAgent);
agentRouter.post("/payment", protectAgentRoute, createPaymentSession);

export default agentRouter;