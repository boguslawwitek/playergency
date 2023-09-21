import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import adminModel from "../models/admin";
import * as config from "../../config.json";

interface AuthDiscordGetUserResponse {
    username: string, 
    userId: string, 
    avatarUrl: string, 
    admin: boolean,
    guildMember: boolean,
    owner: boolean
}

@Route("/auth/getUser")
@Tags("Authorization")
export default class AuthDiscordGetUserController {
  @Get("/")
  public async getUser(@Request() req: express.Request): Promise<AuthDiscordGetUserResponse> {
    const defaultData = {username: '', userId: '', avatarUrl: 'https://cdn.discordapp.com/avatars/250333162079649792/dadcf711633437dba0906726fc7da5c8?size=512', admin: false, guildMember: false, owner: false};
    if(!req.session.userId) return defaultData;

    const adminsDb = await adminModel.find({}).lean();
    const client = req.discordBot;
    const userData = await client.users.fetch(req.session.userId);
    const guild = await client.guilds.cache.get(config.discordGuildId);
    
    if(userData && userData.hasOwnProperty('id') && userData.id) {
        const avatarUrl = userData.displayAvatarURL();
        const adminUser = adminsDb.find(a => a.userid === userData.id);
        let flagGuildMember = false;
        const guildMember = await guild?.members.fetch(userData.id);
        if(guildMember && guildMember.id) flagGuildMember = true;

        if((adminUser && adminUser.adminDashboard) || config.ownersDiscordIds.find(o => o === req.session.userId)) {
            return {username: userData.username, userId: userData.id, avatarUrl, admin: true, guildMember: flagGuildMember, owner: config.ownersDiscordIds.find(o => o === req.session.userId) ? true : false};
        } else {
            return {username: userData.username, userId: userData.id, avatarUrl, admin: false, guildMember: flagGuildMember, owner: false};
        }
    } 
    
    return defaultData;
  }
}