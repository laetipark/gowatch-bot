import {SlashCommandBuilder} from "@discordjs/builders";

const commandDefinition = [
    new SlashCommandBuilder().setName('기록')
        .setDescription('공부 내용을 기록합니다.')
        .addStringOption(option =>
            option.setName('내용')
                .setDescription('내용을 입력합니다.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('타이머')
                .setDescription('타이머 시간을 입력합니다.')
                .setRequired(false))
        .toJSON(),
];

export default commandDefinition;