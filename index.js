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
import commandExecution from "./events/command_execution.js";

config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
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

}).login(discordToken).then(() => {
    console.log('[System] es laetus :)');
}).catch(err => {
    console.log('[System] Login Failed! :(');
    console.log(err);
});