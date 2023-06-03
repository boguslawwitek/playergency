import { Express } from "express-serve-static-core";
import { Client } from "discord.js";
import { Session, SessionData } from "express-session";

declare module "express-serve-static-core" {
  interface CustomSessionFields {
    userId: string
  }

  interface Request {
    discordBot: Client,
    session: Session & Partial<SessionData> & CustomSessionFields
  }
}