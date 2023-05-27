import * as config from "../config.json";
import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.on('ready', () => {
    if (!client.user || !client.application) return;

    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.discordBotToken);
export default client; 