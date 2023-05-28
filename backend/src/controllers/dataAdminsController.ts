import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import adminModel from "../models/admin";
import * as config from "../../config.json";

interface DataRolesResponse {
  admins: Array<{}>
}

@Route("/data/getAdmins")
@Tags("Data")
export default class DataRolesController {
  @Get("/")
  public async getAdmins(@Request() req: express.Request): Promise<DataRolesResponse> {
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