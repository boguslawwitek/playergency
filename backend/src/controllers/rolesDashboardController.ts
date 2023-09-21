import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import roleModel from "../models/role";
import roleCategoryModel from "../models/roleCategory";
import * as config from "../../config.json";

interface DashboardRolesResponse {
  roles: Array<any>,
  categories: Array<{}>
}

@Route("/roles/getDashboardRoles")
@Tags("Roles")
export default class DashboardRolesController {
  @Get("/")
  public async getRoles(@Request() req: express.Request): Promise<DashboardRolesResponse> {
    const allCategories = await roleCategoryModel.find({}).lean();
    const sortedAllCategories = allCategories.sort((a: any, b: any) => a.index - b.index).map((cat: any) => cat);
    const roles = await roleModel.find({}).lean();
    const guild = req.discordBot.guilds.cache.get(config.discordGuildId);
    if(!guild) return {roles: [], categories: []};
    let guildMember: any;

    if(req.session.userId) {
      guildMember = await guild.members.cache.get(req.session.userId);
    }

    const dashboardRoles = await Promise.all(roles.map(async r => {
        const guildRole = await guild.roles.cache.get(`${r.roleId}`);
        let categories = [];
        if(r.hasOwnProperty('categories')) categories = r.categories;
        if(guildRole && guildRole.id) {
          let memberHasRole = false;

          if(guildMember && guildMember.id) {
              const memberRole = await guildMember.roles.cache.get(guildRole.id);
              if(memberRole) memberHasRole = true;
          }

          return {...r, icon: guildRole.icon ? guildRole.iconURL() : null, color: guildRole.hexColor, name: guildRole.name, categories, memberHasRole: memberHasRole};
        }
    }));

    const dashboardRolesFiltered = dashboardRoles.filter(r => r ? r : null);
    const dashboardRolesSorted = dashboardRolesFiltered.sort((a: any, b: any) => a.name.localeCompare(b.name));

    if(dashboardRolesSorted) return {roles: dashboardRolesSorted, categories: sortedAllCategories}
    else return {roles: [], categories: []};
  }
}