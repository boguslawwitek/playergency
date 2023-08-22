import express, { Request, Response } from "express";
import ProfileGetUserController from "../controllers/profileGetUserController";

const router = express.Router();

router.get("/getUser/:userId", async (req: Request, res: Response) => {
    const controller = new ProfileGetUserController();
    const response = await controller.getUser(req, req.params.userId);
    
    return res.send(response);
});

export default router;