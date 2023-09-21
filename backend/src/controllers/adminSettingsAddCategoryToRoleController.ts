import express from "express";
import { Post, Route, Request, Tags } from "tsoa";
import roleCategoryModel from "../models/roleCategory";
import roleModel from '../models/role';
import mongoose from "mongoose";

interface AdminSettingsAddCategoryToRoleResponse {
  statusCode: string
  error: string | null
}

@Route("/admin/addCategoryToRole")
@Tags("Admin")
export default class AdminSettingsAddCategoryToRoleController {
  @Post("/")
  public async addCategoryToRole(@Request() req: express.Request): Promise<AdminSettingsAddCategoryToRoleResponse> {
    const roleId = req.body.roleId;
    const categoryId = req.body.categoryId;
    if(!roleId && !categoryId) return {statusCode: '404', error: null};

    const categoryDb = await roleCategoryModel.findById(categoryId).lean();
    const role = await roleModel.find({roleId: roleId}).lean();

    if(role.length > 0) {
      if(role[0].hasOwnProperty('categories')) {
        if(!role[0].categories.includes(categoryId) && categoryDb) {
          const cloneArray = [...role[0].categories];
          cloneArray.push(categoryId);
          await roleModel.findByIdAndUpdate(role[0]._id, { categories: cloneArray });
        }
      } else if(categoryDb) {
        const categories = [categoryId];
        await roleModel.findByIdAndUpdate(role[0]._id, { categories: categories });
      }
    }

    return {statusCode: '200', error: null};
  }
}