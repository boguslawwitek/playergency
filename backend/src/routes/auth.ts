import express, { Request, Response } from "express";
import AuthDiscordController from "../controllers/authDiscordController";
import AuthDiscordCallbackController from "../controllers/authDiscordCallbackController";
import AuthDiscordLogoutController from "../controllers/authDiscordLogoutController";
import AuthDiscordGetUserController from "../controllers/authDiscordGetUserController";
import * as config from "../../config.json";

interface ReqQuery {
    code: string;
}

const router = express.Router();

router.get("/login", async (req: Request, res: Response) => {
    if(req.session && req.session.userId) {res.redirect(`${config.frontendUrl}/dashboard`); return;}

    const controller = new AuthDiscordController();
    const response = await controller.getLoginUrl(req);
    
    return res.redirect(response.loginUrl);
});
  
router.get("/login/callback", async (req: Request<any, any, any, ReqQuery>, res: Response) => {
    if((req.session && req.session.userId) || !req.query.code) {res.redirect(config.frontendUrl); return;}

    const controller = new AuthDiscordCallbackController();
    const response = await controller.loginUser(req);
    
    if(response.status === 'logged') res.redirect(`${config.frontendUrl}/dashboard`);
    else res.redirect(config.frontendUrl);
});

router.get('/getUser', async function(req, res, next) {
    const controller = new AuthDiscordGetUserController();
    const response = await controller.getUser(req);
    
    return res.send(response);
});

router.get('/logout', async function(req, res, next) {
    const controller = new AuthDiscordLogoutController();
    await controller.logout(req);
    
    return res.redirect(config.frontendUrl);
});

export default router;