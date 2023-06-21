import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import adminModel from "../models/admin";

interface HomepageAdminsResponse {
  admins: Array<{}>
}

@Route("/homepage/getAdmins")
@Tags("Homepage")
export default class HomepageAdminsController {
  @Get("/")
  public async getAdmins(@Request() req: express.Request): Promise<HomepageAdminsResponse> {
    const adminsDb = await adminModel.find({}).lean();
    const admins = await Promise.all(adminsDb.map(async a => {
        if(!a.visibilityOnHomepage) return a;
        const user = await req.discordBot.users.fetch(a.userid);
        return {...a, username: user.username, avatarUrl: user.displayAvatarURL()};
    }));

    if(admins) return {admins}
    else return {admins: []};
  }
}