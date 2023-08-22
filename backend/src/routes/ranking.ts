import express, { Request, Response } from "express";
import RankingGetTop100Controller from "../controllers/rankingGetTop100Controller";

const router = express.Router();

router.get("/top100", async (req: Request, res: Response) => {
    const controller = new RankingGetTop100Controller();
    const response = await controller.getUsers(req);
    
    return res.send(response);
});

export default router;