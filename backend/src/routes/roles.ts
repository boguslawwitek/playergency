import express, { Request, Response } from "express";
import DashboardRolesController from "../controllers/rolesDashboardController";
import AdminSettingsRolesController from "../controllers/rolesAdminSettingsController";
import AssignRoleController from "../controllers/rolesAssignController";
import adminModel from "../models/admin";

const router = express.Router();

router.get("/getDashboardRoles", async (req: Request, res: Response) => {
  const controller = new DashboardRolesController();
  const response = await controller.getRoles(req);
  
  return res.send(response);
});

router.get("/getAdminSettingsRoles", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', roles: [], categories: []}); return; }

  const admins = await adminModel.find({}).lean();
  const admin = admins.find(a => a.userid === req.session.userId);
  if(!admin || !admin.adminDashboard) { res.json({error: 'Not Autorized', roles: [], categories: []}); return; }

  const controller = new AdminSettingsRolesController();
  const response = await controller.getAllRoles(req);
  
  return res.send(response);
});

router.post("/assignRole", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', status: null}); return; }

  const controller = new AssignRoleController();
  const response = await controller.assignRole(req);
  
  return res.send(response);
});

export default router;