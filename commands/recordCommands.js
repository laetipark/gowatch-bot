import {EmbedBuilder} from "discord.js";

export const recordStartEmbed = (name, startTime, stopTime, timer, content) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`${name} 기록 시작 | \`${content}\``)
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

export const recordStopEmbed = (name, startTime, stopTime, record, content) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`${name} 기록 종료 | \`${content}\``)
    .addFields({
        name: "⭐ 시작 시간",
        value: `${startTime}`
    }, {
        name: "🛑 종료 시간",
        value: `${stopTime}`
    }, {
        name: "📝 기록 시간",
        value: `${record}`
    }).toJSON();

export const recordPauseEmbed = (name, startTime, useTime, remainTime, content) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`${name} 기록 일시 정지 | \`${content}\``)
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

export const recordResumeEmbed = (name, startTime, stopTime, record, content) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`${name} 기록 재개 | \`${content}\``)
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

export const recordInfoEmbed = (name, startTime, useTime, remainTime, paused, content) => new EmbedBuilder()
    .setColor(0x2ECC70)
    .setTitle(`${name} 기록 정보 | \`${content}\``)
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
        value: `${paused ? "일시 정지" : "진행 중"}`
    }, ).toJSON();