import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import userModel from "../models/user";
import * as config from "../../config.json";
import { getLevelColor, truncateString } from "../utils";

interface RankingGetTop100Response {
  ranking: Array<any>,
  error: String | null
}

@Route("/ranking/top100")
@Tags("Ranking")
export default class RankingGetTop100Controller {
  @Get("/")
  public async getUsers(@Request() req: express.Request): Promise<RankingGetTop100Response> {
    const client = req.discordBot;
    const guild = await client.guilds.cache.get(config.discordGuildId);

    const allRankingUsers: any = [];
    const rankingUsers = [];
    const allUsersInDb = await userModel.find({}).sort({exp: -1}).lean();

    for(let user of allUsersInDb) {
      if(user && user.userid && user.server) {
        allRankingUsers.push(user);
        if(rankingUsers.length < 100) rankingUsers.push(user);
      }
    }

    const guildMembersIds: any = rankingUsers.map(u => u.userid);
    const guildMembers: any = await guild?.members.fetch({ user: guildMembersIds});

    const rankingMap = await Promise.all(rankingUsers.map(async user => {
      if(!guildMembers) return null;
      const guildMember = guildMembers.find((m: any) => m.id === user.userid);

      const rankingPosition = allRankingUsers.findIndex((u: any) => u.userid === user.userid) + 1;
      const levelPercentOfGoal = Math.round((user.exp / user.goal) * 100);
      const levelColor = getLevelColor(user.level);

      if(guildMember && guildMember.id) {
        return {...user, avatarUrl: guildMember.displayAvatarURL(), username: guildMember.user.username, shortUsername: truncateString(guildMember.user.username, 8), ranking: rankingPosition, levelPercentOfGoal, levelColor}
      } else {
        return null;
      }
    }));

    const rankingTop100 = rankingMap.filter(user => user);

    if(rankingTop100) return {error: null, ranking: rankingTop100}
    else return {error: 'Error', ranking: []};
  }
}