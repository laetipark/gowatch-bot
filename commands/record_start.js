import {EmbedBuilder} from "discord.js";

const embed = (name, time, timer, content) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`${name} | \`${content}\``)
    .addFields({
        name: "📖 시작 시간",
        value: time
    }, {
        name: "📝 설정 시간",
        value: timer
    }).toJSON();

export default embed;