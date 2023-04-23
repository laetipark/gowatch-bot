import recordStart from "../commands/record_start.js";
import recordEnd from "../commands/record_end.js";
import Record from "../models/record.js";

const commandsExecution = async (commandName, userID, userName) => {

    if (commandName === '기록') {
        const UTC = new Date().getTime();
        const time = new Date(UTC);
        const startTime =
            `${time.getFullYear()}년 ${time.getMonth() + 1}월 ${time.getDate()}일
                ${time.getHours()}시 ${time.getMinutes()}분 ${time.getSeconds()}초`

        const member = await Record.findOne({
            where: {
                id: userID
            },
            raw: true,
        }).then(result => {
            return result;
        });

        if (member === null) {
            await Record.create({
                id: userID,
                start: time
            });

            return {
                embeds: [recordStart(userName, startTime)]
            }
        } else {
            const mTime = new Date(member.start);
            const timeDiff = time.getTime() - mTime.getTime(),
                secondMS = Math.floor(timeDiff / 1000),
                minuteMS = Math.floor(secondMS / 60),
                hourMS = Math.floor(minuteMS / 60),
                days = Math.floor(hourMS / 24),
                seconds = secondMS % 60,
                minutes = minuteMS % 60,
                hours = hourMS % 24;

            const startTime =
                `${mTime.getFullYear()}년 ${mTime.getMonth() + 1}월 ${mTime.getDate()}일
                ${mTime.getHours()}시 ${mTime.getMinutes()}분 ${mTime.getSeconds()}초`

            const endTime =
                `${time.getFullYear()}년 ${time.getMonth() + 1}월 ${time.getDate()}일
                ${time.getHours()}시 ${time.getMinutes()}분 ${time.getSeconds()}초`

            const recordTime = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`
            const embeds = await recordEnd(userName, startTime, endTime, recordTime)

            await Record.destroy({
                where: {
                    id: userID
                }
            });

            return {
                embeds: [embeds]
            };
        }
    }
};

export default commandsExecution;