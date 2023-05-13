import {
    focusListEmbed,
    focusStartEmbed,
    focusPauseEmbed,
    focusResumeEmbed,
    focusStopEmbed,
    focusInfoEmbed
} from "../commands/focusCommands.js";
import {focusLeaderBoardEmbed, voiceLeaderBoardEmbed} from "../commands/leaderBoardCommand.js"
import {focusService, timeoutService, voiceService} from "../service/index.js";

const timeoutArray = []

export const getFocusTime = (beginTime, endTime) => {
    const timeDiff = endTime - beginTime,
        secondMS = Math.floor(timeDiff / 1000),
        minuteMS = Math.floor(secondMS / 60),
        hourMS = Math.floor(minuteMS / 60),
        days = Math.floor(hourMS / 24),
        seconds = secondMS % 60,
        minutes = minuteMS % 60,
        hours = hourMS % 24;

    return `> \`${days}일 ${hours}시간 ${minutes}분 ${seconds}초\``;
};

const getParamTime = (time) => {
    return `> \`${time.getFullYear()}년 ${time.getMonth() + 1}월 ${time.getDate()}일\n> ${time.getHours()}시 ${time.getMinutes()}분 ${time.getSeconds()}초\``;
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

const timeout = async (client, channel, user, startTime, stopTime, recordTime) => {
    const record = await focusService.selectFocus(user.id);

    if (record !== null) {
        await focusService.deleteFocus(user.id, recordTime);

        client.channels.fetch(channel.id).then(channel => {
            channel.send({
                content: `<@${user.id}>님의 집중이 종료되었습니다.`,
                embeds: [focusStopEmbed(user, startTime, stopTime, recordTime, record.content)]
            })
        });
    }
};

const commandsExecution = async (client, commandName, user, channel, options) => {

    if (commandName === "집중") {
        // "내용"과 "타이머" option 값을 받음
        const optionControl = options.getString("조작");
        const optionTimer = options.getString("타이머");

        // select StatusFocus
        const focus = await focusService.selectFocus(user.id);
        const currentTime = new Date();

        if (optionControl === "기록") {
            if (focus === null) {
                await focusService.insertFocus(user.id, user.tag, currentTime, getTimer(optionTimer));
                const endTime = new Date(currentTime.getTime() + getTimer(optionTimer));

                const startTime = getParamTime(new Date(currentTime));
                const stopTime = getParamTime(new Date(endTime));
                const recordTime = getFocusTime(currentTime, endTime);

                const targetTime =
                    optionTimer !== null ?
                        `\`${optionTimer.replace(/[hH]/, "시간").replace(/[mM]/, "분").replace(/[sS]/, "초")}\`` :
                        `\`1시간\``;

                timeoutArray.push(new timeoutService(user.id, () => timeout(client, channel, user, startTime, stopTime, recordTime), getTimer(optionTimer)));

                return {
                    embeds: [focusStartEmbed(user, startTime, stopTime, targetTime)]
                };
            } else {
                const timeoutItem = timeoutArray.find(item => item.id === user.id);
                const startTime = getParamTime(new Date(focus.begin_time));
                const useTime = getFocusTime(0, timeoutItem?.getUse());
                const remainTime = getFocusTime(0, timeoutItem?.getRemain());

                return {
                    content: `<@${user.id}>님의 집중 중인 정보입니다.`,
                    embeds: [focusInfoEmbed(user, startTime, useTime, remainTime, focus.pause, focus.content)]
                };
            }
        } else if (optionControl === "중지") {
            if (focus !== null) {
                const timeoutItem = timeoutArray.find(item => item.id === user.id);

                const startTime = new Date(focus.begin_time);
                const useTime = getFocusTime(0, new Date(timeoutItem?.getUse()));
                const remainTime = getFocusTime(0, new Date(timeoutItem?.getRemain()));

                if (focus.pause) {
                    return {
                        content: `<@${user.id}>님의 중지 중인 정보입니다.`,
                        embeds: [focusInfoEmbed(user, startTime, useTime, remainTime, focus.pause)]
                    };
                } else {
                    const timeoutItem = timeoutArray.find(item => item.id === user.id);

                    await focusService.updateFocusPause(user.id, true, currentTime);
                    await timeoutItem?.pause();

                    const startTime = new Date(focus.begin_time);
                    const useTime = getFocusTime(focus.begin_time, currentTime);
                    const remainTime = getFocusTime(currentTime, new Date(currentTime.getTime() + timeoutItem?.getRemain()))

                    return {
                        embeds: [focusPauseEmbed(user, startTime, useTime, remainTime)]
                    };
                }
            } else {
                return {
                    content: `<@${user.id}>님의 기록이 존재하지 않아요!\n\`/기록\`명령을 먼저 이용해주세요. `
                };
            }
        } else if (optionControl === "재개") {
            if (focus !== null) {
                const timeoutItem = timeoutArray.find(item => item.id === user.id);
                const startTime = new Date(focus.begin_time);

                const endTime = new Date(currentTime.getTime() + timeoutItem?.getRemain());
                const resumeTime = getParamTime(currentTime);
                const stopTime = getParamTime(new Date(endTime));
                const remainTime = getFocusTime(currentTime, endTime);
                const recordTime = getFocusTime(new Date(currentTime.getTime() - timeoutItem?.getUse()), endTime);

                await timeoutItem?.setCallback(() => timeout(client, channel, user, startTime, stopTime, recordTime));
                await timeoutItem?.resume();

                await focusService.updateFocusPause(user.id, false, null);
                return {
                    embeds: [focusResumeEmbed(user, resumeTime, stopTime, remainTime)]
                };
            } else {
                return {
                    content: `<@${user.id}>님의 기록이 존재하지 않아요!\n\`/기록\`명령을 먼저 이용해주세요. `
                };
            }
        } else if (optionControl === "정지") {
            if (focus !== null) {
                const timeoutItem = timeoutArray.find(item => item.id === user.id);

                const startTime = getParamTime(new Date(focus.begin_time));
                const stopTime = getParamTime(currentTime);

                await focusService.updateFocusPause(user.id, false, null);
                const recordTime = focus.pause ? getFocusTime(0, new Date(timeoutItem?.getUse())) : getFocusTime(focus.begin_time, currentTime);

                await focusService.deleteFocus(user.id, recordTime);
                await timeoutArray.find(item => item.id === user.id)?.stop();
                delete timeoutArray.find(item => item.id === user.id);

                return {
                    content: `<@${user.id}>님의 집중이 종료되었습니다.`,
                    embeds: [focusStopEmbed(user, startTime, stopTime, recordTime, focus.content)]
                };
            } else {
                return {
                    content: `<@${user.id}>님의 기록이 존재하지 않아요!\n\`/기록\`명령을 먼저 이용해주세요. `
                };
            }
        }
    } else if (commandName === "목록") {
        const focusArray =
            await focusService.selectFocusList()
                .then(result => {
                    return result.map(member => {
                        return {
                            id: member.id,
                            remain_time: `${member.pause
                                ? getFocusTime(0, member.timer - (new Date(member.pause_time).getTime() - new Date(member.begin_time).getTime()))
                                : getFocusTime((Date.now() - member.begin_time), member.timer)}`,
                            pause: member.pause
                        }
                    });
                });
        return {
            embeds: [focusListEmbed(focusArray)]
        };
    } else if (commandName === "리더보드") {
        const optionMenu = options.getString("메뉴");

        if (optionMenu === "집중") {
            const leaderBoard = await focusService.selectFocusLeaderBoard()
                .then(result => {
                    return result.map(member => {
                        return {
                            id: member.id,
                            total_time: `${getFocusTime(0, member.total_time)}`
                        }
                    });
                });
            return {
                embeds: [focusLeaderBoardEmbed(leaderBoard)]
            };
        } else if (optionMenu === "음성") {
            const leaderBoard = await voiceService.selectVoiceLeaderBoard()
                .then(result => {
                    return result.map(member => {
                        return {
                            id: member.id,
                            total_time: `${getFocusTime(0, member.total_time)}`
                        }
                    });
                });
            return {
                embeds: [voiceLeaderBoardEmbed(leaderBoard)]
            };
        }
    }
};

export const addPausedFocus = (focusList) => {
    const currentTime = Date.now();
    focusList.map(async member => {
        if (member.pause_time === null) {
            await focusService.updateFocusPause(member.id, true, currentTime);
        }
        if (currentTime - new Date(member.begin_time).getTime() < member.timer) {
            timeoutArray.push(new timeoutService(member.id, () => {
            }, member.timer - (member.pause_time - member.begin_time)));
        } else {
            await focusService.deleteFocus(member.id, 0);
        }
    });
};

export default commandsExecution;