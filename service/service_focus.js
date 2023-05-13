import StatusFocus from "../models/status_focus.js";
import TotalFocus from "../models/total_focus.js";

export class focusService {

    static insertFocus = async (id, name, currentTime, timer) => {
        await StatusFocus.create({
            id: id,
            name: name,
            begin_time: currentTime,
            timer: timer,
            pause: false,
            pause_time: null
        });
    };

    static selectFocus = async (id) => {
        return await StatusFocus.findOne({
            where: {
                id: id
            }
        });
    };

    static selectFocusList = async () => {
        return await StatusFocus.findAll();
    };

    static updateFocusPause = async (id, pause, time) => {
        await StatusFocus.update({
            pause: pause,
            pause_time: time
        }, {
            where: {
                id: id
            }
        });
    };

    static deleteFocus = async (id, timer) => {
        const memberTime = await TotalFocus.findOne({
            attributes: ["total_time"],
            where: {
                id: id
            }
        }).then(result => {
            return result !== null ? result.total_time + timer : timer;
        });

        await TotalFocus.upsert({
            id: id,
            total_time: memberTime
        });

        await StatusFocus.destroy({
            where: {
                id: id
            }
        });
    };

    static selectFocusLeaderBoard = async () => {
        return await TotalFocus.findAll({
            order: [["total_time", "DESC"]],
            limit: 10
        });
    };
}

export class timeoutService {
    constructor(id, callback, delay) {
        this.use = 0;
        this.remain = delay;
        this.callback = callback;
        this.start = Date.now();
        this.timeout = setTimeout(callback, delay);
        this.id = id;
    };

    // 일시정지
    pause = () => {
        clearTimeout(this.timeout);
        this.use = Date.now() - this.start;
        this.remain -= (Date.now() - this.start);
        console.log(this.timeout);
    };

    // 재개
    resume = () => {
        clearTimeout(this.timeout);
        this.start = Date.now();
        this.timeout = setTimeout(this.callback, this.remain);
    };

    // 정지
    stop = () => {
        clearTimeout(this.timeout);
    };

    getUse = () => {
        return this.use;
    };

    getRemain = () => {
        return this.remain;
    };

    setCallback = (callback) => {
        this.callback = callback;
    };
}