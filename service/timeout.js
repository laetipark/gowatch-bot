export default class Timeout {
    constructor(user, callback, delay) {
        this.use = 0;
        this.remain = delay;
        this.callback = callback;
        this.start = Date.now();
        this.timeout = setTimeout(callback, delay);
        this.id = user.id;
    };

    // 일시정지
    pause = () => {
        clearTimeout(this.timeout);
        this.use = Date.now() - this.start;
        this.remain -= (Date.now() - this.start);
    };

    // 재개
    resume = () => {
        clearTimeout(this.timeout);
        this.start = Date.now();
        this.timeout = setTimeout(this.callback, this.remain);
    };

    // 재개
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