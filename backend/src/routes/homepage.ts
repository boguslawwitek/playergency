import express, { Request, Response } from "express";
import HomepageAdminsController from "../controllers/homepageAdminsController";

const router = express.Router();

router.get("/getAdmins", async (req: Request, res: Response) => {
  const controller = new HomepageAdminsController();
  const response = await controller.getAdmins(req);
  
  return res.send(response);
});

export default router;