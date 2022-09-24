// Allows for sending errors with ss

class HttpError extends Error {
    constructor(message, errorCode) {
        super(message)
        this.code = errorCode
    }
}

module.exports = HttpError