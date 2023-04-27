import recordStart from "../commands/record_start.js";
import recordEnd from "../commands/record_end.js";
import Record from "../models/record.js";
import Timeout from "../service/timeout.js";

const timeoutArray = []

const getEndTime = (start, end) => {
    const mTime = new Date(start);
    const timeDiff = end.getTime() - mTime.getTime(),
        secondMS = Math.floor(timeDiff / 1000),
        minuteMS = Math.floor(secondMS / 60),
        hourMS = Math.floor(minuteMS / 60),
        days = Math.floor(hourMS / 24),
        seconds = secondMS % 60,
        minutes = minuteMS % 60,
        hours = hourMS % 24;

    const startTime =
        `\`${mTime.getFullYear()}년 ${mTime.getMonth() + 1}월 ${mTime.getDate()}일\n${mTime.getHours()}시 ${mTime.getMinutes()}분 ${mTime.getSeconds()}초\``;

    const endTime =
        `\`${end.getFullYear()}년 ${end.getMonth() + 1}월 ${end.getDate()}일\n${end.getHours()}시 ${end.getMinutes()}분 ${end.getSeconds()}초\``;

    const recordTime = `\`${days}일 ${hours}시간 ${minutes}분 ${seconds}초\``;

    return [startTime, endTime, recordTime];
}

const commandsExecution = async (client, commandName, user, channel, options) => {

    if (commandName === '기록') {
        const content = options.getString("내용") !== null ? options.getString("내용") : " ";
        const timer = (strTimer) => {
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
        }

        const timeout = async () => {
            const member = await Record.findOne({
                where: {
                    id: user.id
                },
                raw: true,
            }).then(result => {
                return result;
            });

            if (member !== null) {
                const end = new Date(time.getTime() + timer(options.getString("타이머")));
                const [startTime, endTime, recordTime] =
                    getEndTime(time, end)

                await Record.destroy({
                    where: {
                        id: user.id
                    }
                });

                client.channels.fetch(channel.id)
                    .then(channel => {
                        channel.send({
                            content: `<@${user.id}>님의 \`${content}\` 기록이 종료되었습니다.`,
                            embeds: [recordEnd(user.tag, startTime, endTime, recordTime, content)]
                        })
                    })
            }
        };

        const UTC = new Date().getTime();
        const time = new Date(UTC);
        const recordTime =
            `\`${time.getFullYear()}년 ${time.getMonth() + 1}월 ${time.getDate()}일\n${time.getHours()}시 ${time.getMinutes()}분 ${time.getSeconds()}초\``;

        const member = await Record.findOne({
            where: {
                id: user.id
            },
            raw: true,
        }).then(result => {
            return result;
        });

        if (member === null) {
            await Record.create({
                id: user.id,
                start: time,
                content: content
            });

            timeoutArray.push(new Timeout(user.id, timeout, timer(options.getString("타이머"))));

            const recordTimer =
                options.getString("타이머") !== null ?
                    `\`${options.getString("타이머").replace(/[hH]/, "시간").replace(/[mM]/, "분").replace(/[sS]/, "초")}\`` :
                    `\`1시간\``;

            return {
                embeds: [recordStart(user.tag, recordTime, recordTimer, content)]
            };
        } else {
            const [startTime, endTime, recordTime] =
                getEndTime(member.start, time)

            await Record.destroy({
                where: {
                    id: user.id
                }
            });
            timeoutArray.find(item => item.id === user.id).stop();
            delete timeoutArray.find(item => item.id === user.id);

            return {
                embeds: [recordEnd(user.tag, startTime, endTime, recordTime, member.content)]
            };
        }
    }
};

export default commandsExecution;