import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import roleModel from "../models/role";
import roleCategoryModel from "../models/roleCategory";
import * as config from "../../config.json";

interface AdminSettingsRolesResponse {
  roles: Array<any>,
  categories: Array<{}>
  error: string | null
}

@Route("/roles/getAdminSettingsRoles")
@Tags("Roles")
export default class AdminSettingsRolesController {
  @Get("/")
  public async getAllRoles(@Request() req: express.Request): Promise<AdminSettingsRolesResponse> {
    const allCategories = await roleCategoryModel.find({}).lean();
    const allRolesFromDb = await roleModel.find({}).lean();

    const guild = req.discordBot.guilds.cache.get(config.discordGuildId);
    if(!guild) return {roles: [], categories: [], error: null};

    const guildRolesFetch = await guild.roles.fetch();

    const guildRoles = await Promise.all(guildRolesFetch.map(async r => {
      if(!guild.members.me) return null;
      if(r.managed === true || r.name === '@everyone' || r.position >= guild.members.me.roles.highest.position) return null;
      const role: any = await roleModel.find({roleId: r.id}).lean();
      let isOnDatabase = false;
      let categories = [];
      if(role.length > 0) isOnDatabase = true;
      if(role.hasOwnProperty('categories')) categories = role.categories;

      return {icon: r.icon ? r.iconURL() : null, color: r.hexColor, name: r.name, id: r.id, isOnDatabase, categories, toDelete: false}
    }));

    const rolesFiltered = guildRoles.filter(r => r ? r : null);
    const rolesSorted = rolesFiltered.sort((a: any, b: any) => a.name.localeCompare(b.name));

    for(const roleDb of allRolesFromDb) {
      if(!guildRolesFetch.find(r => r.id === roleDb.roleId)) rolesSorted.push({icon: null, color: '#C81E1E', name: `${roleDb.roleId}`, id: `${roleDb.roleId}`, isOnDatabase: true, categories: [], toDelete: true})
    }

    if(rolesSorted) return {roles: rolesSorted, categories: allCategories, error: null};
    else return {roles: [], categories: [], error: null};
  }
}