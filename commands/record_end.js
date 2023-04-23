import {EmbedBuilder} from "discord.js";

const embed = (name, startTime, endTime, record) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(name)
    .addFields({
        name: "📖 공부 시작 시간",
        value: `${startTime}`
    }, {
        name: "📕 공부 종료 시간",
        value: `${endTime}`
    }, {
        name: "📝 기록",
        value: `${record}`
    }).toJSON();

export default embed;