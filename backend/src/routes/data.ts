import express, { Request, Response } from "express";
import DataRolesController from "../controllers/dataRolesController";
import DataAdminsController from "../controllers/dataAdminsController";

const router = express.Router();

router.get("/getRoles", async (req: Request, res: Response) => {
  const controller = new DataRolesController();
  const response = await controller.getRoles(req);
  
  return res.send(response);
});

router.get("/getAdmins", async (req: Request, res: Response) => {
  const controller = new DataAdminsController();
  const response = await controller.getAdmins(req);
  
  return res.send(response);
});

export default router;