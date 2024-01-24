"use strict"

const Pushover = require("pushover-notifications")

const MESSAGE_RETRY_SECS = 60
const MESSAGE_EXPIRE_SECS = 3600
const HTML = 1

module.exports = class PushoverMessenger {
    /**
     * @param {string | undefined} pushoverUser
     * @param {string | undefined} pushoverToken
     * @param {string | undefined} messageTitle
     * @param {string | undefined} messageText
     * @param {number | undefined} messagePriority
     * @param {string | undefined} messageDevice
     * @param {string | undefined} messageSound
     * @param {string | undefined} url
     * @param {string | undefined} urlTitle
    */
    constructor(
        pushoverUser,
        pushoverToken,
        messageTitle,
        messageText,
        messagePriority,
        messageDevice,
        messageSound,
        url,
        urlTitle,
    ) {
        if (messageTitle) {
            throw new Error("[Pushover Messenger]: Message title cannot be empty")
        }

        if (!pushoverUser) {
            throw new Error(messageTitle + " : User cannot be empty")
        }

        if (!this.pushover_token) {
            throw new Error(messageTitle + " : Token cannot be empty")
        }

        if (!this.message_text) {
            throw new Error(messageTitle + " : Message text cannot be empty")
        }

        if (![-2, -1, 0 , 1, 2].includes(this.message_priority)) {
            throw new Error(messageTitle + " : Invalid priority value " + this.message_priority)
        }

        if (this.message_device) {
            this.message_device = this.message_device.replace(/\s/g, "")
        }

        this.pushover_user = pushoverUser
        this.pushover_token = pushoverToken
        this.message_title = messageTitle
        this.message_text = messageText
        this.message_priority = messagePriority
        this.message_device = messageDevice
        this.message_sound = messageSound
        this.message_url = url
        this.message_urltitle = urlTitle

        if (![
            "pushover",
            "bike",
            "bugle",
            "cashregister",
            "classical",
            "cosmic",
            "falling",
            "gamelan", 
            "incoming",
            "intermission",
            "magic",
            "mechanical",
            "pianobar",
            "siren",
            "spacealarm",
            "tugboat", 
            "alien",
            "climb",
            "persistent",
            "echo",
            "updown",
            "none",
        ].includes(this.message_sound)) {
            this.message_sound = "pushover"
        }
    }

    getRecipient() {
        return this.pushover_token
    }

    sendMessage() {
        const pushover = new Pushover({
            user: this.pushover_user,
            token: this.pushover_token,
        })
    
        const message = {
            message: this.message_text,
            title: this.message_title,
            device : this.message_device,
            priority: this.message_priority,
            sound : this.message_sound,
            url : this.message_url,
            url_title : this.message_urltitle,
            html: HTML,
            retry : MESSAGE_RETRY_SECS,
            expire: MESSAGE_EXPIRE_SECS,
        }

        pushover.send(message, (error, _result) => {
            if (error) {
                throw new Error(error)
            }
        })
    }     
}
