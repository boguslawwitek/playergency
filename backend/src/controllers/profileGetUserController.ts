import express from "express";
import { Post, Route, Request, Tags } from "tsoa";
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
  @Post("/")
  public async getUser(@Request() req: express.Request): Promise<ProfileGetUserResponse> {
    const userId = req.body.userId;
    if(!userId) return {error: 'Invalid body request', userData: {}}

    const userDb = await userModel.find({userid: userId}).lean();
    if(!userDb || userDb.length === 0) return {error: 'Unknown user', userData: {}}

    const allUsersInRanking = await userModel.find({}).sort({exp: -1}).lean();
    const rankingPosition = allUsersInRanking.findIndex(user => user.userid === userId) + 1;
    const levelPercentOfGoal = Math.round((userDb[0].exp / userDb[0].goal) * 100);
    
    const adminsDb = await adminModel.find({}).lean();
    const client = req.discordBot;
    const userData = await client.users.fetch(userId);
    const guild = await client.guilds.cache.get(config.discordGuildId);
    const userWalletDb: any = await walletModel.find({userid: userId}).lean();
    let wallet = 0;
    if(userWalletDb && userWalletDb.length > 0) wallet = userWalletDb[0].coins;
    
    if(userData && userData.hasOwnProperty('id') && userData.id) {
        const avatarUrl = userData.displayAvatarURL();
        const adminUser = adminsDb.find(a => a.userid === userData.id);
        let flagGuildMember = false;
        const guildMember = await guild?.members.fetch(userData.id);
        if(guildMember && guildMember.id) flagGuildMember = true;
        const levelColor = getLevelColor(userDb[0].level);

        if(adminUser) {
            return {error: null, userData: { username: userData.username, userId: userData.id, avatarUrl, admin: true, adminRolePL: adminUser.rolePL, adminRoleEN: adminUser.roleEN, guildMember: flagGuildMember, discordCreatedAt: userData.createdAt, guildMemberJoinedAt: guildMember?.joinedAt, wallet: wallet ? wallet : 0, exp: userDb[0].exp, goal: userDb[0].goal, level: userDb[0].level, ranking: rankingPosition, levelPercentOfGoal, levelColor }};
        } else {
            return {error: null, userData: { username: userData.username, userId: userData.id, avatarUrl, admin: false, adminRolePL: null, adminRoleEN: null, guildMember: flagGuildMember, discordCreatedAt: userData.createdAt, guildMemberJoinedAt: guildMember?.joinedAt, wallet: wallet ? wallet : 0, exp: userDb[0].exp, goal: userDb[0].goal, level: userDb[0].level, ranking: rankingPosition, levelPercentOfGoal, levelColor }};
        }
    }

    return {error: 'Unknown user', userData: {}}
  }
}