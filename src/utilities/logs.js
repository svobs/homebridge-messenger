/**
 * @param {string} message
 */
function taggedMessage(message) {
    return `[homebridge-messenger]: ${message}`
}

module.exports = {
    taggedLog: taggedMessage,
}
