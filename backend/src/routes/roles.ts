import express, { Request, Response } from "express";
import DashboardRolesController from "../controllers/rolesDashboardController";
import AssignRoleController from "../controllers/rolesAssignController";

const router = express.Router();

router.get("/getDashboardRoles", async (req: Request, res: Response) => {
  const controller = new DashboardRolesController();
  const response = await controller.getRoles(req);
  
  return res.send(response);
});

router.post("/assignRole", async (req: Request, res: Response) => {
  if(!req.session || !req.session.userId) { res.json({error: 'Not Autorized', status: null}); return; }

  const controller = new AssignRoleController();
  const response = await controller.assignRole(req);
  
  return res.send(response);
});

export default router;