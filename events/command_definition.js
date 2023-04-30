import {SlashCommandBuilder} from "@discordjs/builders";

const commandDefinition = [
    new SlashCommandBuilder().setName('기록')
        .setDescription('기록을 시작합니다.')
        .addStringOption(option =>
            option.setName('내용')
                .setDescription('기록할 내용을 입력합니다.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('타이머')
                .setDescription('타이머 시간을 입력합니다.')
                .setRequired(false))
        .toJSON(),
    new SlashCommandBuilder().setName('중지')
        .setDescription('기록을 중지합니다.')
        .toJSON(),
    new SlashCommandBuilder().setName('정지')
        .setDescription('기록을 정지합니다.')
        .toJSON(),
];

export default commandDefinition;