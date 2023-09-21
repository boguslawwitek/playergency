import express from "express";
import { Delete, Route, Request, Tags } from "tsoa";
import roleModel from '../models/role';

interface AdminSettingsDeleteRoleResponse {
  statusCode: string
  error: string | null
}

@Route("/admin/deleteRole")
@Tags("Admin")
export default class AdminSettingsDeleteRoleController {
  @Delete("/")
  public async deleteRole(@Request() req: express.Request): Promise<AdminSettingsDeleteRoleResponse> {
    const roleId = req.body.roleId;
    if(!roleId) return {statusCode: '404', error: null};

    try {
      await roleModel.findOneAndDelete({ roleId: roleId });
    } catch(err) {

    }

    return {statusCode: '200', error: null};
  }
}