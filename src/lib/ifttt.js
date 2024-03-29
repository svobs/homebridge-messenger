"use strict"

const Ifttt = require("ifttt-webhooks-channel")
const HomebridgeMessengerError = require("../errors/HomebridgeMessengerError")

const MESSENGER_NAME = "IftttMessenger"

module.exports = class IftttMessenger {
    /**
     * @param {string | undefined} key
     * @param {string | undefined} event
     * @param {string | undefined} value1
     * @param {string | undefined} value2
     * @param {string | undefined} value3
    */
    constructor(key, event, value1, value2, value3) { 
        if (!key) {
            throw new HomebridgeMessengerError("IFTTT key cannot be empty", MESSENGER_NAME)
        }

        if (!event) {
            throw new HomebridgeMessengerError("IFTTT event cannot be empty", MESSENGER_NAME)
        }

        this.iftttKey = key
        this.iftttEvent = event
        this.value_1 = value1
        this.value_2 = value2
        this.value_3 = value3
    }

    getRecipient() {
        return `${this.iftttKey} (event : ${this.iftttEvent})`
    }

    sendMessage() {
        const ifttt = new Ifttt(this.iftttKey)
        ifttt.post(this.iftttEvent, [this.value_1, this.value_2, this.value_3])
            .catch(error => new Error(error))
    }
}
