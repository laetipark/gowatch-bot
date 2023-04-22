import {EmbedBuilder} from "discord.js";

const embed = (name, time) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle("공부 기록 시작")
    .addFields({
        name: name,
        value: time
    }).toJSON();

export default embed;