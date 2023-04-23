import {EmbedBuilder} from "discord.js";

const embed = (name, time) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(name)
    .addFields({
        name: "📖 공부 시작 시간",
        value: time
    }).toJSON();

export default embed;