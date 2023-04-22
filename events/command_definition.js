import {SlashCommandBuilder} from "@discordjs/builders";

const commandDefinition = [
    new SlashCommandBuilder().setName('기록')
        .setDescription('공부 내용을 기록합니다.').toJSON(),
];

export default commandDefinition;