import express from "express";
import { Put, Route, Request, Tags } from "tsoa";
import roleCategoryModel from "../models/roleCategory";
import roleModel from '../models/role';

interface AdminSettingsUpdateCategoriesResponse {
  statusCode: string
  error: string | null
}

@Route("/admin/updateCategories")
@Tags("Admin")
export default class AdminSettingsUpdateCategoriesController {
  @Put("/")
  public async updateCategories(@Request() req: express.Request): Promise<AdminSettingsUpdateCategoriesResponse> {
    const categories = req.body.categories;
    const categoriesForDelete = req.body.forDelete;
    if(!categories && !categoriesForDelete) return {statusCode: '404', error: null};

    await Promise.all(categories.map(async (category: any) => {
      if(category.isNewCategory) {
        // create new category
        const newCategory = new roleCategoryModel({ iconUrl: category.iconUrl, nameEN: category.nameEN, namePL: category.namePL, index: category.index });
        await newCategory.save();
      } else {
        // update category
        await roleCategoryModel.findByIdAndUpdate(category._id, { iconUrl: category.iconUrl, nameEN: category.nameEN, namePL: category.namePL, index: category.index });
      }
    }));
    
    await Promise.all(categoriesForDelete.map(async (category: any) => {
      // delete category
      await roleCategoryModel.deleteOne({ _id: category._id });

      // remove deleted category from roles
      const roles = await roleModel.find({}).lean();
      
      await Promise.all(roles.map(async (role: any) => {

        if(role.hasOwnProperty('categories')) {
          if(role.categories.find((c: any) => c === category._id)) {
            const index = role.categories.findIndex((c: any) => c === category._id);
            const cloneArray = [...role.categories];
            cloneArray.splice(index, 1);

            await roleModel.findByIdAndUpdate(role._id, { categories: cloneArray });
          }
        }

      }));
    }));

    return {statusCode: '200', error: null};
  }
}