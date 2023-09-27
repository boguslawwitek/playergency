# Overview
Playergency is a website created for one Discord server that allows Discord users to assign roles, view rankings and their profiles. Administrators can add roles to categories and select roles that users can assign. The owner can edit administrators. The site is integrated with the Discord bot, with more commands and features coming in the future.

Frontend: [www.playergency.com](https://www.playergency.com)
Backend: [api.playergency.com](https://api.playergency.com)

# Technologies
Frontend:
- TypeScript
- Tailwind CSS
- Font Awesome
- Next.js
- i18n

Backend:
- TypeScript
- Express
- express-session
- Discord.js
- Mongoose
- Swagger

# Installation
Frontend:
```
git clone https://github.com/boguslawwitek/playergency.git
cd playergency
npm install
npm run dev
```
Backend:
```
cd playergency/backend
npm install
npm run dev
```
#### Production
```
npm run build
npm start
```

**Before the first run, create a ".env.local" (frontend) and "config.json" (backend)**

# License
[GPL-3.0](https://github.com/boguslawwitek/Playergency/blob/main/LICENSE)

# Author
Bogusław Witek