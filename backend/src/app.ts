import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import swaggerUi from "swagger-ui-express";
import { SwaggerTheme } from 'swagger-themes';
import client from './discordbot';
import clientP from './database';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import * as config from "../config.json";

import Router from "./routes";

const app: Express = express();
const port = config.PORT || 3001;
const theme = new SwaggerTheme('v3');

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.set('trust proxy', 1);

app.use(session({
    resave: false,
    saveUninitialized: false,
    name: 'playergency',
    secret: config.sessionSecret,
    store: MongoStore.create({
        ttl: 15552000000,
        clientPromise: clientP,
        dbName: "playergency",
        stringify: false
    }),
    cookie: { 
        maxAge: 15552000000,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        httpOnly: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : false
    }
}));

app.use(cors({
    origin: config.frontendUrl,
    credentials: true
}));

app.use(function(req: Request, res: Response, next: NextFunction): void {
  res.setHeader( 'X-Powered-By', 'BWitek.dev' );
  req.discordBot = client;
  next();
});

app.use(Router);

app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json"
    },
    explorer: false,
    customCss: theme.getBuffer('dark'),
    customSiteTitle: "Playergency API",
  })
);

app.listen(port, () => {
  console.log(`⚡️[backend]: Server is running at http://localhost:${port}`);
});