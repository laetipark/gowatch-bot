import {EmbedBuilder} from "discord.js";

const embed = (name, time) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle("공부 기록 정지")
    .addFields({
        name: name,
        value: time
    }).toJSON();

export default embed;