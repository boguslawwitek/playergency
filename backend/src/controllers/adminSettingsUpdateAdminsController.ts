import express from "express";
import { Put, Route, Request, Tags } from "tsoa";
import adminModel from "../models/admin";

interface AdminSettingsUpdateAdminsResponse {
  statusCode: string
  error: string | null
}

@Route("/admin/updateAdmins")
@Tags("Admin")
export default class AdminSettingsUpdateAdminsController {
  @Put("/")
  public async updateAdmins(@Request() req: express.Request): Promise<AdminSettingsUpdateAdminsResponse> {
    const admins = req.body.admins;
    const adminsForDelete = req.body.forDelete;
    if(!admins && !adminsForDelete) return {statusCode: '404', error: null};

    await Promise.all(admins.map(async (admin: any) => {
      if(admin.isNewAdmin) {
        // create new admin
        const newAdmin = new adminModel({ userid: admin.userid, rolePL: admin.rolePL, roleEN: admin.roleEN, descPL: admin.descPL, descEN: admin.descEN, adminDashboard: admin.adminDashboard, visibilityOnHomepage: admin.visibilityOnHomepage, index: admin.index });
        await newAdmin.save();
      } else {
        // update admin
        await adminModel.findByIdAndUpdate(admin._id, { userid:  admin.userid, rolePL: admin.rolePL, roleEN: admin.roleEN, descPL: admin.descPL, descEN: admin.descEN, adminDashboard: admin.adminDashboard, visibilityOnHomepage: admin.visibilityOnHomepage, index: admin.index });
      }
    }));
    
    await Promise.all(adminsForDelete.map(async (admin: any) => {
      // delete admin
      await adminModel.deleteOne({ _id: admin._id });
    }));

    return {statusCode: '200', error: null};
  }
}