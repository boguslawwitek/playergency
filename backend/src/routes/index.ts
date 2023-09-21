import express from "express";
import DiscordRouter from "./discord";
import AuthRouter from './auth';
import HomepageRouter from './homepage';
import RolesRouter from './roles';
import RankingRouter from './ranking';
import ProfileRouter from './profile';
import AdminRouter from './admin';

const router = express.Router();
router.use("/auth", AuthRouter);
router.use("/homepage", HomepageRouter);
router.use("/discord", DiscordRouter);
router.use("/roles", RolesRouter);
router.use("/ranking", RankingRouter);
router.use("/profile", ProfileRouter);
router.use("/admin", AdminRouter);

export default router;