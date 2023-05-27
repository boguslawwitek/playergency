import express from "express";
import DiscordRouter from "./discord";

const router = express.Router();
router.use("/discord", DiscordRouter);

export default router;