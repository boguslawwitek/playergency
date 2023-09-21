import express from "express";
import { Post, Route, Request, Tags } from "tsoa";

interface AdminSettingsGetNewAdminUserDataResponse {
  userData: any,
  statusCode: string
  error: string | null
}

@Route("/admin/getNewAdminUserData")
@Tags("Admin")
export default class AdminSettingsGetNewAdminUserDataController {
  @Post("/")
  public async getUser(@Request() req: express.Request): Promise<AdminSettingsGetNewAdminUserDataResponse> {
    const userid = req.body.userid;
    if(!userid) return {userData: {}, statusCode: '404', error: null};

    const client = req.discordBot;
    let userData = null;

    try {
      const fetchUser = await client.users.fetch(userid);
      userData = {avatarUrl: fetchUser.displayAvatarURL(), username: fetchUser.username, userid: fetchUser.id}
    } catch(err) {

    }

    if(userData) return {userData: userData, statusCode: '200', error: null}; 
    else return {userData: {}, statusCode: '404', error: null};
  }
}