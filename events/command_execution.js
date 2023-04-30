import {
    recordStartEmbed,
    recordStopEmbed,
    recordPauseEmbed,
    recordResumeEmbed,
    recordInfoEmbed
} from "../commands/recordCommands.js";
import Timeout from "../service/timeout.js";

const timeoutArray = []

const getParamTime = (time) => {
    return `\`${time.getFullYear()}년 ${time.getMonth() + 1}월 ${time.getDate()}일\n${time.getHours()}시 ${time.getMinutes()}분 ${time.getSeconds()}초\``;
}

const getRecordTime = (beginTime, endTime) => {
    const timeDiff = endTime.getTime() - beginTime.getTime(),
        secondMS = Math.floor(timeDiff / 1000),
        minuteMS = Math.floor(secondMS / 60),
        hourMS = Math.floor(minuteMS / 60),
        days = Math.floor(hourMS / 24),
        seconds = secondMS % 60,
        minutes = minuteMS % 60,
        hours = hourMS % 24;

    return `\`${days}일 ${hours}시간 ${minutes}분 ${seconds}초\``;
}

const getTimer = (strTimer) => {
    if (strTimer !== null) {
        if (strTimer.match(/[hH]/) !== null) {
            return parseInt(strTimer.split(/hH/)[0]) * 3600 * 1000;
        } else if (strTimer.match(/[mM]/) !== null) {
            return parseInt(strTimer.split(/mM/)[0]) * 60 * 1000;
        } else if (strTimer.match(/[sS]/) !== null) {
            return parseInt(strTimer.split(/sS/)[0]) * 1000
        } else {
            return strTimer * 60 * 1000;
        }
    } else {
        return 3600 * 1000;
    }
};

const timeout = async (client, channel, Record, user, startTime, stopTime, recordTime) => {
    const record = await Record.selectMember(user.id);

    if (record !== null) {
        await Record.deleteMember(user.id);

        client.channels.fetch(channel.id).then(channel => {
            channel.send({
                content: `<@${user.id}>님의 \`${record.content}\` 기록이 종료되었습니다.`,
                embeds: [recordStopEmbed(user.tag, startTime, stopTime, recordTime, record.content)]
            })
        });
    }
};

const commandsExecution = async (client, commandName, user, channel, options, Record) => {

    // 현재 시간
    const currentTime = new Date();

    if (commandName === '기록') {
        // "내용" option 값을 받음
        const optionContent = options.getString("내용");
        const optionTimer = options.getString("타이머");

        // select Record
        const record = await Record.selectMember(user.id);

        if (record === null) {
            await Record.insertMember(user.id, currentTime, getTimer(optionTimer), optionContent);
            const endTime = new Date(currentTime.getTime() + getTimer(optionTimer));

            const startTime = getParamTime(currentTime);
            const stopTime = getParamTime(endTime);
            const recordTime = getRecordTime(currentTime, endTime);

            const targetTime =
                optionTimer !== null ?
                    `\`${optionTimer.replace(/[hH]/, "시간").replace(/[mM]/, "분").replace(/[sS]/, "초")}\`` :
                    `\`1시간\``;

            timeoutArray.push(new Timeout(user, () => timeout(client, channel, Record, user, startTime, stopTime, recordTime), getTimer(optionTimer)));

            return {
                content: `<@${user.id}>님의 \`${optionContent}\` 기록을 시작합니다.`,
                embeds: [recordStartEmbed(user.tag, startTime, stopTime, targetTime, optionContent)]
            };
        } else {
            const timeoutItem = timeoutArray.find(item => item.id === user.id);
            const startTime = getParamTime(new Date(record.start));
            const useTime = getRecordTime(0, timeoutItem?.getUse());
            const remainTime = getRecordTime(0, timeoutItem?.getRemain());

            return {
                content: `현재 <@${user.id}>님의 \`${record.content}\` 기록이 진행 중입니다.`,
                embeds: [recordInfoEmbed(user.tag, startTime, useTime, remainTime, record.pause, record.content)]
            };
        }
    } else if (commandName === '중지') {
        const record = await Record.selectMember(user.id);

        if (record !== null) {
            const timeoutItem = timeoutArray.find(item => item.id === user.id);

            const startTime = getParamTime(new Date(record.start));
            const useTime = getRecordTime(new Date(0), new Date(timeoutItem?.getUse()));
            const remainTime = getRecordTime(new Date(0), new Date(timeoutItem?.getRemain()));

            if (record.pause) {
                return {
                    content: `현재 <@${user.id}>님의 \`${record.content}\` 기록이 중지 상태입니다.`,
                    embeds: [recordInfoEmbed(user.tag, startTime, useTime, remainTime, record.pause, record.content)]
                };
            } else {
                const timeoutItem = timeoutArray.find(item => item.id === user.id);

                await Record.updateMemberPause(user.id, true);
                await timeoutItem?.pause();

                const startTime = getParamTime(new Date(record.start));
                const useTime = getRecordTime(record.start, currentTime);
                const remainTime = getRecordTime(currentTime, new Date(currentTime.getTime() + timeoutItem?.getRemain()))

                return {
                    content: `<@${user.id}>님의 \`${record.content}\` 기록이 중지되었습니다.`,
                    embeds: [recordPauseEmbed(user.tag, startTime, useTime, remainTime, record.content)]
                };
            }
        } else {
            return {
                content: `<@${user.id}>님의 기록이 존재하지 않아요!\n\`/기록\`명령을 먼저 이용해주세요. `
            };
        }
    } else if (commandName === "재개") {
        const record = await Record.selectMember(user.id);
        if (record !== null) {
            const timeoutItem = timeoutArray.find(item => item.id === user.id);
            const startTime = getParamTime(new Date(record.start));

            const endTime = new Date(currentTime.getTime() + timeoutItem?.getRemain());
            const resumeTime = getParamTime(currentTime);
            const stopTime = getParamTime(endTime);
            const remainTime = getRecordTime(currentTime, endTime);
            const recordTime = getRecordTime(new Date(currentTime.getTime() - timeoutItem?.getUse()), endTime);

            await timeoutItem?.setCallback(() => timeout(client, channel, Record, user, startTime, stopTime, recordTime));
            await timeoutItem?.resume();

            await Record.updateMemberPause(user.id, false);
            return {
                content: `<@${user.id}>님의 \`${record.content}\` 기록을 재개합니다.`,
                embeds: [recordResumeEmbed(user.tag, resumeTime, stopTime, remainTime, record.content)]
            };
        } else {
            return {
                content: `<@${user.id}>님의 기록이 존재하지 않아요!\n\`/기록\`명령을 먼저 이용해주세요. `
            };
        }
    } else if (commandName === '정지') {
        const record = await Record.selectMember(user.id);
        if (record !== null) {
            const timeoutItem = timeoutArray.find(item => item.id === user.id);

            const startTime = getParamTime(new Date(record.start));
            const stopTime = getParamTime(currentTime);

            const recordTime = record.pause ? getRecordTime(new Date(0), new Date(timeoutItem?.getUse())) : getRecordTime(record.start, currentTime);

            await Record.deleteMember(user.id);
            await timeoutArray.find(item => item.id === user.id)?.stop();
            delete timeoutArray.find(item => item.id === user.id);

            return {
                content: `<@${user.id}>님의 \`${record.content}\` 기록이 정지되었습니다.`,
                embeds: [recordStopEmbed(user.tag, startTime, stopTime, recordTime, record.content)]
            };
        } else {
            return {
                content: `<@${user.id}>님의 기록이 존재하지 않아요!\n\`/기록\`명령을 먼저 이용해주세요. `
            };
        }
    }
};

export default commandsExecution;