import express from "express";
import { Post, Route, Request, Tags } from "tsoa";
import roleModel from '../models/role';

interface AdminSettingsAddRoleResponse {
  statusCode: string
  error: string | null
}

@Route("/admin/addRole")
@Tags("Admin")
export default class AdminSettingsAddRoleController {
  @Post("/")
  public async addRole(@Request() req: express.Request): Promise<AdminSettingsAddRoleResponse> {
    const roleId = req.body.roleId;
    if(!roleId) return {statusCode: '404', error: null};

    const newRole = new roleModel({ roleId: roleId });
    await newRole.save();

    return {statusCode: '200', error: null};
  }
}