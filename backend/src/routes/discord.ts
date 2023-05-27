import express, { Request, Response } from "express";
import DiscordIconController from "../controllers/discordIcon";
import DiscordMembersCountController from "../controllers/discordMembersCount";

const router = express.Router();

router.get("/getPlayergencyIconUrl", async (req: Request, res: Response) => {
  const controller = new DiscordIconController();
  const response = await controller.getIconUrl(req);
  
  return res.send(response);
});

router.get("/getPlayergencyMembersCount", async (req: Request, res: Response) => {
  const controller = new DiscordMembersCountController();
  const response = await controller.getMembersCount(req);
  
  return res.send(response);
});

export default router;