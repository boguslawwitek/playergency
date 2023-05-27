import express from "express";
import { Get, Route, Request, Tags } from "tsoa";
import roleModel from "../models/role";

interface DataRolesResponse {
  roles: Array<{}>
}

@Route("/data/getRoles")
@Tags("Data")
export default class DataRolesController {
  @Get("/")
  public async getRoles(@Request() req: express.Request): Promise<DataRolesResponse> {
    const roles = await roleModel.find({}).lean();

    if(roles) return {roles}
    else return {roles: []};
  }
}