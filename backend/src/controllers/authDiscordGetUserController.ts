import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import adminModel from "../models/admin";

interface AuthDiscordGetUserResponse {
    username: string, 
    userId: string, 
    avatarUrl: string, 
    admin: boolean;
}

@Route("/auth/getUser")
@Tags("Authorization")
export default class AuthDiscordGetUserController {
  @Get("/")
  public async getUser(@Request() req: express.Request): Promise<AuthDiscordGetUserResponse> {
    const defaultData = {username: '', userId: '', avatarUrl: 'https://cdn.discordapp.com/avatars/250333162079649792/dadcf711633437dba0906726fc7da5c8?size=512', admin: false};
    if(!req.session.userId) return defaultData;

    const adminsDb = await adminModel.find({}).lean();
    const client = req.discordBot;
    const userData = await client.users.fetch(req.session.userId);
    
    if(userData && userData.hasOwnProperty('id') && userData.id) {
        const avatarUrl = userData.displayAvatarURL();
        const adminUser = adminsDb.find(a => a.userid === userData.id);

        if(adminUser && adminUser.adminDashboard) {
            return {username: userData.username, userId: userData.id, avatarUrl, admin: true};
        } else {
            return {username: userData.username, userId: userData.id, avatarUrl, admin: false};
        }
    } 
    
    return defaultData;
  }
}