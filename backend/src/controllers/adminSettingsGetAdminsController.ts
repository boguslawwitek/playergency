import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import adminModel from "../models/admin";
import * as config from "../../config.json";

interface AdminSettingsGetAdminsResponse {
  admins: Array<{}>
  error: string | null
}

@Route("/admin/getAdmins")
@Tags("Admin")
export default class AdminSettingsGetAdminsController {
  @Get("/")
  public async getAdmins(@Request() req: express.Request): Promise<AdminSettingsGetAdminsResponse> {
    const allAdmins = await adminModel.find({}).lean();
    const sortedAllAdmins = allAdmins.sort((a: any, b: any) => a.index - b.index).map((admin: any) => admin);
    const client = req.discordBot;

    const sortedAllAdminsMap = await Promise.all(sortedAllAdmins.map(async admin => {
      const userData = await client.users.fetch(admin.userid);
      admin.username = userData.username;
      admin.avatarUrl = userData.displayAvatarURL();
      
      if(config.ownersDiscordIds.find(o => o === admin.userid)) admin.owner = true;
      else admin.owner = false;

      return admin;
    }));

    if(allAdmins && sortedAllAdmins && sortedAllAdminsMap) return {admins: sortedAllAdminsMap, error: null};
    else return {admins: [], error: null};
  }
}