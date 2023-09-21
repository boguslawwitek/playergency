import express from "express";
import { Post, Route, Request, Tags } from "tsoa";
import roleModel from '../models/role';

interface AdminSettingsRemoveCategoryFromRoleResponse {
  statusCode: string
  error: string | null
}

@Route("/admin/removeCategoryFromRole")
@Tags("Admin")
export default class AdminSettingsRemoveCategoryFromRoleController {
  @Post("/")
  public async removeCategoryFromRole(@Request() req: express.Request): Promise<AdminSettingsRemoveCategoryFromRoleResponse> {
    const roleId = req.body.roleId;
    const categoryId = req.body.categoryId;
    if(!roleId && !categoryId) return {statusCode: '404', error: null};

    const role = await roleModel.find({roleId: roleId}).lean();

    if(role.length > 0 && role[0].hasOwnProperty('categories') && role[0].categories.includes(categoryId)) {
      const cloneArray = [...role[0].categories];
      const index = cloneArray.findIndex(c => c === categoryId);
      cloneArray.splice(index, 1);
      await roleModel.findByIdAndUpdate(role[0]._id, { categories: cloneArray });
    }

    return {statusCode: '200', error: null};
  }
}