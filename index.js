import {
    Client, GatewayIntentBits
} from "discord.js";
import {config} from "dotenv";
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v10";

import {
    sequelize
} from './models/index.js';

import commandDefinition from "./events/command_definition.js";
import commandExecution, {addPausedFocus} from "./events/command_execution.js";
import {voiceService, focusService} from "./service/index.js"

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ],
});

const {
    clientID,
    guildID,
    discordToken,
} = {
    clientID: process.env.CLIENT_ID,
    guildID: process.env.GUILD_ID,
    discordToken: process.env.DISCORD_TOKEN,
};

const rest = new REST({
    version: '10'
}).setToken(discordToken);

rest.put(Routes.applicationGuildCommands(clientID, guildID), {
    body: commandDefinition
}).then(() => {
    console.log('[System] Successfully registered application Commands Definition')
}).catch(err => {
    console.error(err)
});

sequelize.sync({
    force: false
}).then(() => {
    console.log("[System] Database Connected");
}).catch((err) => {
    console.error(err);
});

client.on('interactionCreate', async interaction => {
    const {options} = interaction;

    if (interaction.isChatInputCommand()) {
        interaction.reply(await commandExecution(client, interaction.commandName, interaction.user, interaction.channel, options));
    }
}).on('voiceStateUpdate', async (oldMember, newMember) => {
    const newUserChannel = newMember.channel; // 들어온 이후
    const oldUserChannel = oldMember.channel; // 나간 이후

    if (newUserChannel?.members !== undefined && oldUserChannel?.members === undefined) {
        newUserChannel?.members.map(async member => {
                await voiceService.insertVoice(
                    member.user.id,
                    newUserChannel?.name,
                    Date.now()
                )
            }
        );
    } else if (oldUserChannel?.members !== undefined) {
        await voiceService.deleteVoice(
            oldUserChannel?.members.map(member => member.user.id)
        );

    }
}).login(discordToken).then(async () => {
    const focusList = await focusService.selectFocusList();
    if (focusList !== null) {
        await addPausedFocus(focusList);
    }

    console.log('[System] es laetus :)');
}).catch(err => {
    console.log('[System] Login Failed! :(');
    console.log(err);
});