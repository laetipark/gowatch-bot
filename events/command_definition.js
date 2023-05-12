import {SlashCommandBuilder} from "@discordjs/builders";

const commandDefinition = [
    new SlashCommandBuilder().setName('집중')
        .setDescription('집중 모드를 시작합니다.')
        .addStringOption((option) =>
            option.setName('조작')
                .setDescription('집중 모드 조작을 설정합니다.')
                .addChoices(
                    {name: "기록", value: "기록"},
                    {name: "재개", value: "재개"},
                    {name: "중지", value: "중지"},
                    {name: "정지", value: "정지"})
                .setRequired(true))
        .addStringOption(option =>
            option.setName('타이머')
                .setDescription('집중할 시간을 입력합니다. (기본 1시간)')
                .setRequired(false))
        .toJSON(),
    new SlashCommandBuilder().setName('목록')
        .setDescription('기록 목록을 확인합니다.')
        .toJSON(),
    new SlashCommandBuilder().setName('리더보드')
        .setDescription('음성채팅 또는 집중모드를 오래 사용한 상위 10명의 유저를 보여줍니다.')
        .addStringOption((option) =>
            option.setName('메뉴')
                .setDescription('확인할 리더보드를 설정합니다.')
                .addChoices(
                    {name: "음성", value: "음성"},
                    {name: "집중", value: "집중"})
                .setRequired(true))
        .toJSON(),
];

export default commandDefinition;