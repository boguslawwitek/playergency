import userModel from './models/user';
const cooldownDb: any = [];

export function getLevelColor(level: number) {
    if(level < 6) return '#9b9b9b';
    else if(level < 10) return '#997c52';
    else if(level < 14) return '#d95b43';
    else if(level < 18) return '#fecc23';
    else if(level < 22) return '#467a3c';
    else if(level < 26) return '#4e8ddb';
    else if(level < 30) return '#7652c9';
    else if(level < 34) return '#c252c9';
    else if(level < 38) return '#542437';
    else return '#c02942';
}

export function truncateString(str: string, n: number){
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
};

export async function addExp(client: any, memberId: string, numberExpToAdd: number, memberUsername?: string, channelId?: string) {
    let timeInSec = 120;

    //COOLDOWN
    const cooldownUser = cooldownDb.find((user: any) => user.userid == memberId);
    if(cooldownUser) {
        const date = Math.floor(new Date().getTime() / 1000);
        const cooldownDate = Math.floor(cooldownUser.date.getTime() / 1000);
        if(date - cooldownDate > timeInSec) {
            const index = cooldownDb.findIndex((user: any) => user.userid == memberId);
            cooldownDb.splice(index, 1);
            //add next cooldown
            cooldownDb.push({userid: memberId, date: new Date()});
        } else {
            return;
        }
    } else {
        cooldownDb.push({userid: memberId, date: new Date()});
    }
    //COOLDOWN END

    const userDb = await userModel.find({userid: memberId}).lean();
    if(!userDb) return;

    userDb[0].exp += numberExpToAdd;
    let update;
    if(userDb[0].exp >= userDb[0].goal) {
        userDb[0].level++;
        userDb[0].goal = userDb[0].goal + userDb[0].goal * 0.5;
        userDb[0].goal = Math.floor(userDb[0].goal);
        update = { goal: userDb[0].goal, level: userDb[0].level, exp: userDb[0].exp };

        const level = userDb[0].level;
        if(channelId) {
            client.channels.cache.get(channelId).send(`Gratulacje, użytkownik ${memberUsername} osiągnął poziom ${level}!`);
        }
    } else {
        update = { exp: userDb[0].exp };
    };

    await userModel.findOneAndUpdate({ userid: memberId }, update);

    console.log(`Dodaje ${numberExpToAdd} expa, użytkownikowi: ${memberId}!`);
};