import {EmbedBuilder} from "discord.js";

export const focusLeaderBoardEmbed = (leaderBoard) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`🥇 집중모드 리더보드`)
    .addFields(leaderBoard.length !== 0 ? leaderBoard.map((focus, index) => {
        return {
            name: ` `,
            value: `**${index + 1}. <@${focus.id}>님**\n${focus.total_time}`
        }
    }) : {
        name: ` `,
        value: `현재 순위에 들어간 사람이 없습니다!`
    }).toJSON();

export const voiceLeaderBoardEmbed = (leaderBoard) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`🥇 음성채팅 리더보드`)
    .addFields(leaderBoard.length !== 0 ? leaderBoard.map((voice, index) => {
        return {
            name: ` `,
            value: `**${index + 1}. <@${voice.id}>님**\n${voice.total_time}`
        }
    }) : {
        name: ` `,
        value: `현재 순위에 들어간 사람이 없습니다!`
    }).toJSON();