export default class Stopwatch {
    readonly start = Date.now();
    public get elaraMessage() {
        const time = Date.now() - this.start;
        const text = time < 1000 ? time + 'ms' : (time / 1000) + ' second' + (time === 1000 ? '' : 's');
        return `Elara found this for you in ${text}! 😇`
    }
}