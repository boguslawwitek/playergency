import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import * as config from "../../config.json";

interface DiscordIconResponse {
  iconUrl: string
}

@Route("/discord/getPlayergencyIconUrl")
@Tags("Discord")
export default class DiscordIconController {
  @Get("/")
  public async getIconUrl(@Request() req: express.Request): Promise<DiscordIconResponse> {
    let iconUrl;
    const guild = req.discordBot.guilds.cache.get(config.discordGuildId);
    if(guild) iconUrl = guild.iconURL({size: 512});

    if(!iconUrl) return {iconUrl: ""}
    else return {iconUrl};
  }
}