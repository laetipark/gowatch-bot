import {Op} from "sequelize";

import StatusVoice from "../models/status_voice.js";
import TotalVoice from "../models/total_voice.js";

export class voiceService {

    static insertVoice = async (id, channel, beginTime) => {
        await StatusVoice.findOrCreate({
            where: {
                id: id
            },
            defaults: {
                channel: channel,
                begin_time: beginTime
            }
        });
    };

    static deleteVoice = async (idArray) => {
        if (idArray !== undefined) {
            const oldMembers = await StatusVoice.findAll({
                where: {
                    id: {
                        [Op.notIn]: idArray
                    }
                }
            });

            oldMembers.map(async member => {
                const memberTime = await TotalVoice.findOne({
                    attributes: ["total_time"],
                    where: {
                        id: member.id,
                    }
                }).then(result => {
                    return result !== null ? result.total_time + (Date.now() - new Date(member.begin_time).getTime())
                        : Date.now() - new Date(member.begin_time).getTime();
                });

                await TotalVoice.upsert({
                    id: member.id,
                    total_time: memberTime
                });
            });

            await StatusVoice.destroy({
                where: {
                    id: {
                        [Op.notIn]: idArray
                    }
                }
            });
        }
    };

    static selectVoiceLeaderBoard = async () => {
        return await TotalVoice.findAll({
            order: [["total_time", "DESC"]],
            limit: 10
        });
    };
}