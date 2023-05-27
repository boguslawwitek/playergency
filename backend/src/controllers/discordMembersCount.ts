import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import * as config from "../../config.json";

interface DiscordMembersCountResponse {
  members: number
}

@Route("/discord/getPlayergencyMembersCount")
@Tags("Discord")
export default class DiscordMembersCountController {
  @Get("/")
  public async getMembersCount(@Request() req: express.Request): Promise<DiscordMembersCountResponse> {
    let membersCount;

    const guild = req.discordBot.guilds.cache.get(config.discordGuildId);
    if(!guild) return {members: 0};

    const members = await guild.members.fetch();
    if(members) membersCount = members.size;
    else return {members: 0};

    return {members: membersCount};
  }
}