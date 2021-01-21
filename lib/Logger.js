module.exports = class Logger {
    static DEBUG = process.env.DEBUG;

    static log(str) {
        console.log(str);
    }

    static error(err) {
        console.error(err);
    }

    static debug(str) {
        if (this.DEBUG) {
            console.log(str);
        }
    }
}