import express, { Request, Response } from "express";
import DataRolesController from "../controllers/dataRolesController";

const router = express.Router();

router.get("/getRoles", async (req: Request, res: Response) => {
  const controller = new DataRolesController();
  const response = await controller.getRoles(req);
  
  return res.send(response);
});

export default router;