import recordStart from "../commands/record_start.js";
import recordEnd from "../commands/record_end.js";
import Timeout from "../service/timeout.js";

const timeoutArray = []

const getTime = (beginTime, endTime) => {
    const mTime = new Date(beginTime);
    const timeDiff = endTime.getTime() - mTime.getTime(),
        secondMS = Math.floor(timeDiff / 1000),
        minuteMS = Math.floor(secondMS / 60),
        hourMS = Math.floor(minuteMS / 60),
        days = Math.floor(hourMS / 24),
        seconds = secondMS % 60,
        minutes = minuteMS % 60,
        hours = hourMS % 24;

    const startTime =
        `\`${mTime.getFullYear()}년 ${mTime.getMonth() + 1}월 ${mTime.getDate()}일\n${mTime.getHours()}시 ${mTime.getMinutes()}분 ${mTime.getSeconds()}초\``;
    const stopTime =
        `\`${endTime.getFullYear()}년 ${endTime.getMonth() + 1}월 ${endTime.getDate()}일\n${endTime.getHours()}시 ${endTime.getMinutes()}분 ${endTime.getSeconds()}초\``;
    const recordTime = `\`${days}일 ${hours}시간 ${minutes}분 ${seconds}초\``;

    return [startTime, stopTime, recordTime];
};

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
                embeds: [recordEnd(user.tag, startTime, stopTime, recordTime, record.content)]
            })
        });
    }
};

const commandsExecution = async (client, commandName, user, channel, options, Record) => {
    if (commandName === '기록') {
        // "내용" option 값을 받음
        const optionContent = options.getString("내용");
        const optionTimer = options.getString("타이머");

        // 현재 시간
        const currentTime = new Date();

        // select Record
        const record = await Record.selectMember(user.id);

        if (record === null) {
            await Record.insertMember(user.id, currentTime, getTimer(optionTimer), optionContent);
            const endTime = new Date(currentTime.getTime() + getTimer(optionTimer));
            const [startTime, stopTime, recordTime] =
                getTime(currentTime, endTime);
            const targetTime =
                optionTimer !== null ?
                    `\`${optionTimer.replace(/[hH]/, "시간").replace(/[mM]/, "분").replace(/[sS]/, "초")}\`` :
                    `\`1시간\``;

            timeoutArray.push(new Timeout(user, () => timeout(client, channel, Record, user, startTime, stopTime, recordTime), getTimer(optionTimer)));

            return {
                embeds: [recordStart(user.tag, startTime, stopTime, targetTime, optionContent)]
            };
        } else {
            const [startTime, stopTime, recordTime] =
                getTime(record.start, currentTime);

            await Record.deleteMember(user.id);

            await timeoutArray.find(item => item.id === user.id).stop();
            delete timeoutArray.find(item => item.id === user.id);

            return {
                embeds: [recordEnd(user.tag, startTime, stopTime, recordTime, record.content)]
            };
        }
    }
};

export default commandsExecution;