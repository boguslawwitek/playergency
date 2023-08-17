import express, { Request, Response } from "express";
import ProfileGetUserController from "../controllers/profileGetUserController";

const router = express.Router();

router.post("/getUser", async (req: Request, res: Response) => {
    const controller = new ProfileGetUserController();
    const response = await controller.getUser(req);
    
    return res.send(response);
  });

export default router;