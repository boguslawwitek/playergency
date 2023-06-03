import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import * as config from "../../config.json";

interface AuthDiscordLogoutResponse {
  status: string
}

@Route("/auth/logout")
@Tags("Authorization")
export default class AuthDiscordLogoutController {
  @Get("/")
  public async logout(@Request() req: express.Request): Promise<AuthDiscordLogoutResponse> {
    req.session.destroy(err => null);
    return {status: 'session destroy'};
  }
}