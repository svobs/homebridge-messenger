const {taggedMessage} = require("../utilities/logs")

module.exports = class HomebridgeMessengerError extends Error {
    /**
     * @param {string} message
     * @param {string} messengerName
     * @param {string | undefined} messageTitle
     */
    constructor (message, messengerName, messageTitle = undefined) {
        const errorMessage = taggedMessage(`${messengerName} - ${message}`)
        super(messageTitle
            ? errorMessage + `\nMessage Title: ${messageTitle}`
            : errorMessage ,   
        )
    }
}
