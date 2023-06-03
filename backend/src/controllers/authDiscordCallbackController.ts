import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import { URLSearchParams } from "url";
import * as config from "../../config.json";

interface AuthDiscordCallbackResponse {
  status: string
}

interface ReqQuery {
  code: string;
}

@Route("/auth/login/callback")
@Tags("Authorization")
export default class AuthDiscordCallbackController {
  @Get("/")
  public async loginUser(@Request() req: express.Request<any, any, any, ReqQuery>): Promise<AuthDiscordCallbackResponse> {
    try {
      const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: config.discordClientId,
            client_secret: config.discordClientSecret,
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: config.LoginOAuth2RedirectURI,
            scope: config.LoginOAuth2Scopes.join(' '),
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const oauthData:any = await oauthResult.json();

      if(oauthData && oauthData.hasOwnProperty('access_token') && oauthData.access_token) {
        const userFetch = await fetch('https://discord.com/api/users/@me', {
          headers: {
            authorization: `Bearer ${oauthData.access_token}`,
          },
        });

        const userData: any = await userFetch.json();

        if(userData.hasOwnProperty('id') && userData.id) {
          req.session.userId = userData.id;
          return {status: 'logged'};
        } else {
          req.session.destroy(err => null);
          return {status: 'not logged'};
        }
      } else {
        req.session.destroy(err => null);
        return {status: 'not logged'};
      }
    } catch(err) {
      // console.log(err);
      req.session.destroy(err => null);
      return {status: 'not logged'};
    }
  }
}