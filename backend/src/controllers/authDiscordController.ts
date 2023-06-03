import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import * as config from "../../config.json";

interface AuthDiscordResponse {
  loginUrl: string
}

@Route("/auth/login")
@Tags("Authorization")
export default class AuthDiscordController {
  @Get("/")
  public async getLoginUrl(@Request() req: express.Request): Promise<AuthDiscordResponse> {
    const loginUrl = `https://discord.com/api/oauth2/authorize?client_id=${config.discordClientId}&redirect_uri=${encodeURIComponent(config.LoginOAuth2RedirectURI)}&response_type=code&scope=${config.LoginOAuth2Scopes.join('%20')}`;

    if(loginUrl) return {loginUrl}
    else return {loginUrl: ''};
  }
}