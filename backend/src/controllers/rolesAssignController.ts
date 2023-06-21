import express from "express";
import { Post, Route, Request, Tags } from "tsoa";
import roleModel from "../models/role";
import * as config from "../../config.json";

interface AssignRoleResponse {
  status: string | null,
  error: string | null
}

@Route("/roles/assignRole")
@Tags("Roles")
export default class AssignRoleController {
  @Post("/")
  public async assignRole(@Request() req: express.Request): Promise<AssignRoleResponse> {
    const action = req.body.action;
    const role = req.body.role;
    if(!action || !role) return {error: 'Invalid body request', status: null}

    const guild = req.discordBot.guilds.cache.get(config.discordGuildId);
    if(!guild) return {error: 'Guild not found!', status: null};

    const checkRoleDb = await roleModel.find({roleId: role}).lean();
    const checkGuildRole = await guild.roles.cache.get(role);
    const checkGuildMember = await guild.members.cache.get(req.session.userId);
    if(!checkRoleDb || !checkGuildRole || !checkGuildMember) return {error: 'Role is not in database or GuildMember not found or GuildRole not found!', status: null};

    if(action === 'add') {
      if (!checkGuildMember.roles.cache.has(checkGuildRole.id)) {
        checkGuildMember.roles.add(checkGuildRole);
      }
    } else if(action === 'remove') {
      if (checkGuildMember.roles.cache.has(checkGuildRole.id)) {
        checkGuildMember.roles.remove(checkGuildRole);
      }
    }

    return {error: null, status: 'done'};
  }
}