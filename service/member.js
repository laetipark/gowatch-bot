import Record from "../models/record.js";

export default class Member {

    insertMember = async (id, currentTime, timer, content) => {
        return await Record.create({
            id: id,
            start: currentTime,
            timer: timer,
            content: content,
            pause: false
        });
    };

    selectMember = async (id) => {
        return await Record.findOne({
            where: {
                id: id
            },
            raw: true,
        }).then(result => {
            return result;
        });
    };

    selectMembers = async () => {
        return await Record.findOne({
            raw: true,
        }).then(result => {
            return result;
        });
    };

    updateMemberPause = async (id, pause) => {
        return await Record.update({
            pause: pause
        }, {
            where: {
                id: id
            }
        });
    };

    deleteMember = async (id) => {
        await Record.destroy({
            where: {
                id: id
            }
        });
    };
}