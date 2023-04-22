import recordStart from "../commands/record_start.js";
import recordEnd from "../commands/record_end.js";
import Record from "../models/record.js";

const commandsExecution = async (commandName, userID, userName) => {

    if (commandName === '기록') {
        const KST = 9 * 60 * 60 * 1000;
        const UTC = new Date().getTime();
        const time = new Date(UTC + KST);

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
                embeds: [recordStart(userName, time.toString())]
            }
        } else {
            const timeDiff = time.getTime() - new Date(member.start).getTime(),
                secondMS = Math.floor(timeDiff / 1000),
                minuteMS = Math.floor(secondMS / 60),
                hourMS = Math.floor(minuteMS / 60),
                days = Math.floor(hourMS / 24),
                seconds = secondMS % 60,
                minutes = minuteMS % 60,
                hours = hourMS % 24;
            
            const endTime = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`
            const embeds = await recordEnd(userName, endTime.toString())

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