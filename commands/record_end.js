import {EmbedBuilder} from "discord.js";

const embed = (name, startTime, stopTime, record, content) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`${name} 기록 종료 | \`${content}\``)
    .addFields({
        name: "📖 시작 시간",
        value: `${startTime}`
    }, {
        name: "📕 종료 시간",
        value: `${stopTime}`
    }, {
        name: "📝 기록 시간",
        value: `${record}`
    }).toJSON();

export default embed;