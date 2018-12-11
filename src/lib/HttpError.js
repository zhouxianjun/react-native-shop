export default class HttpError extends Error {
    res;

    constructor (msg, res, data) {
        super(msg);
        this.res = res;
        this.data = data;
    }
}
