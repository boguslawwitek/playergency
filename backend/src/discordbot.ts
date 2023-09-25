import * as config from "../config.json";
import { REST, Routes, Client, GatewayIntentBits, ActivityType, ChannelType } from 'discord.js';
import { addExp } from './utils';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });
import userModel from './models/user';
import walletModel from './models/user';
const polishChars = ['ż','ź','ś','ó','ł','ę','ć','ą'];

const commands = [
  {
    name: 'profil',
    description: 'Wysyłam link do profilu',
  },
];

const rest = new REST({ version: '10' }).setToken(config.discordBotToken);

client.on('ready', async () => {
    if (!client.user || !client.application) return;

    console.log(`Zalogowano jako ${client.user.tag}!`);

    client.user.setPresence({
        activities: [{ name: `Playergency.com`, type: ActivityType.Watching }],
        status: 'online',
    });

    const guild = client.guilds.cache.get(config.discordGuildId);
    if(!guild?.available) return;
    const members = await guild.members.fetch();
    const databaseMembers = await userModel.find({}).lean();
    const toInsert: any = [];

    //Adds new memebrs to database
    await Promise.all(members.map(async (member: any) => {
        if(member && !member.user.bot && !databaseMembers.find(dbm => member.user.id == dbm.userid)) {
            toInsert.push({userid: member.id});
        }
    }));

    if(toInsert && toInsert.length > 0) {
        console.log(toInsert);
        await userModel.insertMany(toInsert);
        console.log('Dodano wszystkich użytkowników.');
    } else {
        console.log('Brak nowych osób!');
    }

    //Checking if a member has left the server
    await Promise.all(databaseMembers.map(async (member: any) => {
        if(member && !members.find(u => u.id === member.userid)) {
            await userModel.findOneAndUpdate({userid: member.userid}, {server: false});
        }
    }));

    //Checking if the member is on the server
    await Promise.all(members.map(async (member: any) => {
        if(member && !member.user.bot) {
            const databaseMember = databaseMembers.find(dbm => member.id == dbm.userid);
            if(databaseMember && databaseMember.server === false) {
                console.log(`Użytkownik ${member.id} musiał wrócić na serwer!`);
                await userModel.findOneAndUpdate({userid: member.id}, {server: true});
            }
        }
    }));

    try {
        console.log('Odświeżanie komend Discorda (/)...');
      
        await rest.put(Routes.applicationGuildCommands(config.discordClientId, config.discordGuildId), { body: commands });
      
        console.log('Pomyślnie odświeżono komendy (/) Discorda.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'profil') {
        await interaction.reply(`https://www.playergency.com/dashboard/profiles/${interaction.user.id}`);
    }
});

client.on('messageCreate', message => {
    if(message.author.bot || message.channel.type === ChannelType.DM || !message.member) return;
    const msg = message.content.toLowerCase();

	let polishCharsFlag = false;
	polishChars.forEach(item => {
		if(msg.indexOf(item) !== -1) {
			polishCharsFlag = true;
		}
	});

	const words = msg.split(' ');
	if(msg.length < 5) return;
	else if(words.length > 4 && msg.length > 22 && polishCharsFlag) addExp(client, message.member.id, 3, message.member.user.username, message.channel.id);
	else if((words.length > 4 && msg.length > 22) || (polishCharsFlag)) addExp(client, message.member.id, 2, message.member.user.username, message.channel.id);
	else addExp(client, message.member.id, 1, message.member.user.username, message.channel.id);
});

client.on('guildBanAdd', async ban => {
    if(ban.guild.id !== config.discordGuildId) return;

    await walletModel.findOneAndDelete({userid: ban.user.id});
    await userModel.findOneAndDelete({userid: ban.user.id});

    console.log(`Użytkownik ${ban.user.username} został zbanowany i usunięty z bazy danych.`);
});

client.on('guildMemberAdd', async member => {
    console.log(`Nowy użytkownik "${member.user.username}" dołączył do "${member.guild.name}".`);
    if(member.guild.id !== config.discordGuildId || member.user.bot) return;
    const memberDb = await userModel.findOne({userid: member.id}).lean();

    if(!memberDb) {
        await userModel.create({ userid: member.id });
        console.log(`Użytkownik ${member.user.username} został dodany do bazy danych!`);
    } else {
        await userModel.findOneAndUpdate({userid: member.id}, {server: true})
        console.log(`Użytkownik ${member.user.username} jest już w bazie! Został zaktualizowany!`);
    }
});

client.on('guildMemberRemove', async member => {
    console.log(`Użytkownik "${member.user.username}" opuścił "${member.guild.name}".`);
    if(member.guild.id !== config.discordGuildId || member.user.bot) return;

    await userModel.findOneAndUpdate({userid: member.id}, {server: false});
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if(!oldState || !newState || oldState.member?.user.bot || newState.member?.user.bot) return;

    if(oldState.channelId === null && newState.channelId !== null) {
        // User Joins a voice channel
        console.log(`[Voice] Użytkownik '${newState.member?.user.username}' dołączył do kanału ${newState.channel?.name}.`);
        const memberId: any = newState.member?.id;
        if(newState) addExp(client, memberId, 3);
    } else if(newState.channelId === null) { 
        // User leaves a voice channel
        console.log(`[Voice] Użytkownik '${newState.member?.user.username}' wyszedł z kanału ${oldState.channel?.name}.`);
    } else if(oldState.channelId === newState.channelId) {
        return;
    } else if(oldState.channelId !== null && newState.channelId !== null) {
        // User changes a voice channel
        console.log(`[Voice] Użytkownik '${newState.member?.user.username}' zmienił kanał ${oldState.channel?.name} na ${newState.channel?.name}.`);
    }
});

client.login(config.discordBotToken);
export default client; 