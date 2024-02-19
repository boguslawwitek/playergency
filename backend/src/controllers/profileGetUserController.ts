import express from "express";
import { Get, Route, Request, Tags, Path } from "tsoa";
import userModel from "../models/user";
import adminModel from "../models/admin";
import walletModel from "../models/wallet";
import * as config from "../../config.json";
import { getLevelColor } from "../utils";

interface ProfileGetUserResponse {
  userData: {},
  error: String | null
}

@Route("/profile/getUser")
@Tags("Profile")
export default class ProfileGetUserController {
  @Get("{userId}")
  public async getUser(@Request() req: express.Request, @Path() userId: string): Promise<ProfileGetUserResponse> {
    if(!userId) return {error: 'Unknown user', userData: {}}

    const userDb = await userModel.find({userid: userId}).lean();
    if(!userDb || userDb.length === 0) return {error: 'Unknown user', userData: {}}

    const client = req.discordBot;
    const guild = await client.guilds.cache.get(config.discordGuildId);

    const rankingUsers = [];
    const allUsersInDb = await userModel.find({}).sort({exp: -1}).lean();

    for(let user of allUsersInDb) {
      if(user && user.userid && user.server) {
        rankingUsers.push(user);
      }
    }

    const rankingPosition = rankingUsers.findIndex(user => user.userid === userId) + 1;
    const levelPercentOfGoal = Math.round((userDb[0].exp / userDb[0].goal) * 100);
    
    const adminsDb = await adminModel.find({}).lean();
    const userData = await client.users.fetch(userId);
    const userWalletDb: any = await walletModel.find({userid: userId}).lean();
    let wallet = 0;
    if(userWalletDb && userWalletDb.length > 0) wallet = userWalletDb[0].coins;
    
    if(userData && userData.hasOwnProperty('id') && userData.id) {
        const avatarUrl = userData.displayAvatarURL();
        const adminUser = adminsDb.find(a => a.userid === userData.id);
        const guildMember: any = await guild?.members.fetch(userData.id);
        if(!guildMember || !guildMember.id) return {error: 'Unknown user', userData: {}}
        const levelColor = getLevelColor(userDb[0].level);

        let dateNow = new Date();
        const discordCreatedAtDays = userData ? Math.round((dateNow.getTime() - userData.createdAt.getTime()) / (1000 * 3600 * 24)) : null;
        const guildMemberJoinedAtDays: any = guildMember ? Math.round((dateNow.getTime() - guildMember.joinedAt.getTime()) / (1000 * 3600 * 24)) : null;

        return {error: null, userData: { username: userData.username, userId: userData.id, avatarUrl, admin: true, adminRolePL: adminUser ? adminUser.rolePL : null, adminRoleEN: adminUser ? adminUser.roleEN : null, discordCreatedAt: userData.createdAt, discordCreatedAtDays, guildMemberJoinedAt: guildMember?.joinedAt, guildMemberJoinedAtDays, wallet: wallet ? wallet : 0, exp: userDb[0].exp, goal: userDb[0].goal, level: userDb[0].level, ranking: rankingPosition, levelPercentOfGoal, levelColor }};
    }

    return {error: 'Unknown user', userData: {}}
  }
}