import express from "express";
import DiscordRouter from "./discord";
import AuthRouter from './auth';
import DataRouter from './data';
import RankingRouter from './ranking';

const router = express.Router();
router.use("/auth", AuthRouter);
router.use("/discord", DiscordRouter);
router.use("/data", DataRouter);
router.use("/ranking", RankingRouter);

export default router;