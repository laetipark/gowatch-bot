export default class Timeout {
    constructor(id, callback, delay) {
        this.remain = delay;
        this.callback = callback;
        this.start = Date.now();
        this.timeout = setTimeout(callback, delay);
        this.id = id
    }

    // 일시정지
    pause = () => {
        clearTimeout(this.timeout);
        this.remain -= (Date.now() - start);
    }

    // 재개
    resume = () => {
        clearTimeout(this.timeout);
        this.start = Date.now();
        this.timeout = setTimeout(callback, remain);
    }

    // 재개
    stop = () => {
        clearTimeout(this.timeout);
    }
}