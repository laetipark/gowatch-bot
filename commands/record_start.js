import {EmbedBuilder} from "discord.js";

const embed = (name, time, content) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`${name} | \`${content}\``)
    .addFields({
        name: "📖 기록 시작 시간",
        value: time
    }).toJSON();

export default embed;