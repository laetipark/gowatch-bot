import {EmbedBuilder} from "discord.js";

const embed = (name, startTime, stopTime, timer, content) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`${name} 기록 시작 | \`${content}\``)
    .addFields({
        name: "📖 시작 시간",
        value: `${startTime}`
    }, {
        name: "📕 목표 시간",
        value: `${stopTime}`
    }, {
        name: "📝 설정 시간",
        value: `${timer}`
    }).toJSON();

export default embed;