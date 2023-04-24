import {SlashCommandBuilder} from "@discordjs/builders";

const commandDefinition = [
    new SlashCommandBuilder().setName('기록')
        .setDescription('공부 내용을 기록합니다.')
        .addStringOption(option =>
            option.setName('내용')
                .setDescription('내용을 입력합니다.')
                .setRequired(false))
        .toJSON(),
];

export default commandDefinition;