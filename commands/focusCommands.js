import {EmbedBuilder} from "discord.js";

export const focusStartEmbed = (user, startTime, stopTime, timer) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`⏺️ \`${user.tag}\` 집중 시작`)
    .addFields({
        name: "⭐ 시작 시간",
        value: `${startTime}`
    }, {
        name: "🎯 목표 시간",
        value: `${stopTime}`
    }, {
        name: "⏰ 설정 시간",
        value: `${timer}`
    }).toJSON();

export const focusStopEmbed = (user, startTime, stopTime, record) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`⏹️ \`${user.tag}\` 집중 종료`)
    .addFields({
        name: "⭐ 시작 시간",
        value: `${startTime}`
    }, {
        name: "🛑 종료 시간",
        value: `${stopTime}`
    }, {
        name: "📝 집중 시간",
        value: `${record}`
    }).toJSON();

export const focusPauseEmbed = (user, startTime, useTime, remainTime) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`⏸️ \`${user.tag}\` 집중 일시 정지`)
    .addFields({
        name: "⭐ 시작 시간",
        value: `${startTime}`
    }, {
        name: "⏳ 사용 시간",
        value: `${useTime}`
    }, {
        name: "⌛ 남은 시간",
        value: `${remainTime}`
    }).toJSON();

export const focusResumeEmbed = (user, startTime, stopTime, record) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`⏯️ \`${user.tag}\` 집중 재개`)
    .addFields({
        name: "⭐ 재개 시간",
        value: `${startTime}`
    }, {
        name: "🎯 목표 시간",
        value: `${stopTime}`
    }, {
        name: "⌛ 남은 시간",
        value: `${record}`
    }).toJSON();

export const focusInfoEmbed = (user, startTime, useTime, remainTime, paused) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`ℹ️ \`${user.tag}\` 집중 정보`)
    .setDescription(`<@${user.id}>님의 집중 중인 정보입니다.`)
    .addFields({
        name: "⭐ 시작 시간",
        value: `${startTime}`
    }, {
        name: "⏳ 사용 시간",
        value: `${useTime}`
    }, {
        name: "⌛ 남은 시간",
        value: `${remainTime}`
    }, {
        name: "🚩 현재 상태",
        value: `${paused ? "> \`일시 정지\`" : "> \`진행 중\`"}`
    }).toJSON();

export const focusListEmbed = (focusArray) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`📁 집중 목록`)
    .addFields(focusArray.length !== 0 ? focusArray.map((focus, index) => {
        return {
            name: ` `,
            value: `**${index+1}. <@${focus.id}>님의 남은 시간**\n${focus.remain_time}\n> \`(${focus.pause ? "일시 정지" : "진행 중"})\``
        }
    }) : {
        name: `집중 목록이 없습니다!`,
        value: `\`/집중\` 명령어로 추가할 수 있습니다.`
    }).toJSON();