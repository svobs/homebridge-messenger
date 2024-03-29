"use strict"

const axios = require("axios").default
const HomebridgeMessengerError = require("../errors/HomebridgeMessengerError")

const MESSENGER_NAME = "PushcutMessenger"

module.exports = class PushcutMessenger {
    /**
     * @param {string | undefined} apiKey
     * @param {string | undefined} notificationName
     * @param {string | undefined} messageTitle
     * @param {string | undefined} messageText
     * @param {string | undefined} messageInput
     * @param {string | undefined} messageActions
    */
    constructor(apiKey, notificationName, messageTitle, messageText, messageInput, messageActions) { 
        if (!apiKey) {
            throw new HomebridgeMessengerError("Pushcut API key cannot be empty", MESSENGER_NAME)
        }

        this.pushcut_apikey = apiKey
        this.message_notification = notificationName
        this.message_title = messageTitle
        this.message_text = messageText
        this.message_input = messageInput
        this.message_actions = messageActions
    }

    getRecipient() {
        return `${this.pushcut_apikey} (notification : ${this.message_notification})`
    }
  
    sendMessage() {
        const url = "https://api.pushcut.io/v1/notifications/" + this.message_notification
        const data = {
            actions: this.message_actions,
            input: this.message_input,
            text: this.message_text,
            title: this.message_title,
        }

        /** @type {import("axios").AxiosRequestConfig} */
        const config = {
            headers: {
                "Accept": "*/*",
                "API-Key": this.pushcut_apikey,
                "Content-Type": "application/json",
            },
        }

        axios.post(url, data, config)
            .catch(error => {
                console.error(error)
            })
    }
}
