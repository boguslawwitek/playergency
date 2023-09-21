import express, { Request, Response } from "express";
import AdminSettingsRolesController from "../controllers/adminSettingsRolesController";
import AdminSettingsGetAdminsController from "../controllers/adminSettingsGetAdminsController";
import AdminSettingsUpdateCategoriesController from "../controllers/adminSettingsUpdateCategoriesController";
import AdminSettingsUpdateAdminsController from "../controllers/adminSettingsUpdateAdminsController";
import AdminSettingsGetNewAdminUserDataController from "../controllers/adminSettingsGetNewAdminUserData";
import AdminSettingsAddRoleController from "../controllers/adminSettingsAddRoleController";
import AdminSettingsDeleteRoleController from "../controllers/adminSettingsDeleteRoleController";
import AdminSettingsAddCategoryToRoleController from "../controllers/adminSettingsAddCategoryToRoleController";
import AdminSettingsRemoveCategoryFromRoleController from "../controllers/adminSettingsRemoveCategoryFromRoleController";
import adminModel from "../models/admin";
import * as config from "../../config.json";

const router = express.Router();

router.get("/getSettingsRoles", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', roles: [], categories: []}); return; }

  const admins = await adminModel.find({}).lean();
  const admin = admins.find(a => a.userid === req.session.userId);
  if(!admin || !admin.adminDashboard) { res.json({error: 'Not Autorized', roles: [], categories: []}); return; }

  const controller = new AdminSettingsRolesController();
  const response = await controller.getAllRoles(req);
  
  return res.send(response);
});

router.post("/addRole", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const admins = await adminModel.find({}).lean();
  const admin = admins.find(a => a.userid === req.session.userId);
  if(!admin || !admin.adminDashboard) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const controller = new AdminSettingsAddRoleController();
  const response = await controller.addRole(req);
  
  return res.send(response);
});

router.delete("/deleteRole", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const admins = await adminModel.find({}).lean();
  const admin = admins.find(a => a.userid === req.session.userId);
  if(!admin || !admin.adminDashboard) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const controller = new AdminSettingsDeleteRoleController();
  const response = await controller.deleteRole(req);
  
  return res.send(response);
});

router.post("/addCategoryToRole", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const admins = await adminModel.find({}).lean();
  const admin = admins.find(a => a.userid === req.session.userId);
  if(!admin || !admin.adminDashboard) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const controller = new AdminSettingsAddCategoryToRoleController();
  const response = await controller.addCategoryToRole(req);
  
  return res.send(response);
});

router.post("/removeCategoryFromRole", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const admins = await adminModel.find({}).lean();
  const admin = admins.find(a => a.userid === req.session.userId);
  if(!admin || !admin.adminDashboard) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const controller = new AdminSettingsRemoveCategoryFromRoleController();
  const response = await controller.removeCategoryFromRole(req);
  
  return res.send(response);
});

router.put("/updateCategories", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const admins = await adminModel.find({}).lean();
  const admin = admins.find(a => a.userid === req.session.userId);
  if(!admin || !admin.adminDashboard) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const controller = new AdminSettingsUpdateCategoriesController();
  const response = await controller.updateCategories(req);
  
  return res.send(response);
});

router.put("/updateAdmins", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }
  if(!config.ownersDiscordIds.find(o => o === req.session.userId)) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const controller = new AdminSettingsUpdateAdminsController();
  const response = await controller.updateAdmins(req);
  
  return res.send(response);
});

router.post("/getNewAdminUserData", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }
  if(!config.ownersDiscordIds.find(o => o === req.session.userId)) { res.json({error: 'Not Autorized', statusCode: '401'}); return; }

  const controller = new AdminSettingsGetNewAdminUserDataController();
  const response = await controller.getUser(req);
  
  return res.send(response);
});

router.get("/getAdmins", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', admins: []}); return; }
  if(!config.ownersDiscordIds.find(o => o === req.session.userId)) { res.json({error: 'Not Autorized', admins: []}); return; }

  const controller = new AdminSettingsGetAdminsController();
  const response = await controller.getAdmins(req);
  
  return res.send(response);
});

export default router;