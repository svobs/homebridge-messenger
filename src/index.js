"use strict"

const packageJson = require("../package.json")
const PushoverMessenger = require("./lib/pushover")
const EmailMessenger = require("./lib/email")
const IftttMessenger = require("./lib/ifttt")
const PushcutMessenger = require("./lib/pushcut")

/** @type {import("homebridge").API['hap']['Service']} */
var Service
/** @type {import("homebridge").API['hap']['Characteristic']} */
var Characteristic
/** @type {import("homebridge").API} */
var HomebridgeAPI

/**
 * @typedef {{ 
 *  type: 'email';
 *  name: string;
 *  text: string;
 *  recipients: string;
 * }} EmailMessage
 */

/**
 * @typedef {{ 
*  type: 'ifttt';
*  event: string;
*  value1: string;
*  value2: string;
*  value3: string;
* }} IftttMessage
*/

/**
* @typedef {{ 
*  type: 'pushcut';
*  notification: string;
*  title: string;
*  text: string;
*  input: string;
*  actions: string;
* }} PushcutMessage
*/

/**
 * @typedef {{ 
 *  type: 'pushover';
 *  name: string;
 *  priority: number;
 *  device: string;
 *  sound: string;
 *  url: string;
 *  urltitle: string;
 * }} PushoverMessage
*/

/**
 * @typedef {EmailMessage | IftttMessage | PushcutMessage | PushoverMessage} HomebridgeMessage
 */

class HomebridgeMessenger {
    /**
     * @param {import("homebridge").Logger} log
     * @param {import("homebridge").AccessoryConfig} config
    */
    constructor (log, config) {
        this.log = log
        this.config = config
        /** @type {HomebridgeMessage[]} */
        this.messages = this.config.messages ?? []
        /** @type {import("homebridge").API['hap']['Service']['Switch'][]} */
        this.serviceMessagesSwitches = []

        // Add main switch to Homebridge
        this.serviceMainSwitch = new Service.Switch(this.config.name, 0)
        this.log("Added Main Switch: " + this.config.name)

        // Initialize cache
        this.cacheDirectory = HomebridgeAPI.user.persistPath()
        this.storage = require("node-persist")
    
        /** @type {Parameters<import("node-persist").LocalStorage['init']>[0]} */
        const storagePersistOptions = {
            dir: this.cacheDirectory,
            forgiveParseErrors: true,
        }

        this.storage.initSync(storagePersistOptions)

        // Get cache and validate if main switch is in cache
        const itemInCache = this.storage.getItemSync(this.config.name)
        this.on = !!itemInCache

        if (!itemInCache) {
            this.serviceMainSwitch.setCharacteristic(Characteristic.On, false)
            this.log("Main Switch: OFF")
        } else {
            this.serviceMainSwitch.setCharacteristic(Characteristic.On, true)
            this.log("Main Switch: ON")
        }

        this.loadConfiguredMessages()
    }

    loadConfiguredMessages() {
        for (const [index, message] of this.messages.entries()) {
            const {name: messageName, type: _messageType} = message

            /** @type {HomebridgeMessage['type']} */
            const messageType = _messageType.toLowerCase()

            const serviceMessageSwitch = new Service.Switch(messageName , index + 100)
            this.log(`Added ${messageType}: ${messageName}`)

            serviceMessageSwitch.getCharacteristic(Characteristic.On)
                .on("set", function (value, callback) {
                    if (!!value) {
                        if (!this.isOn) {
                            this.log(`${messageName}: Message not sent. Master switch is off.`)
                        } else {
                            /** @type {EmailMessenger | IftttMessenger | PushcutMessenger | PushoverMessenger} */
                            let messenger

                            switch (messageType) {
                                case "email": 
                                    messenger = new EmailMessenger(
                                        this.config.services.email.recipient, 
                                        this.config.services.email.smtpServer, 
                                        this.config.services.email.smtpPort, 
                                        this.config.services.email.smtpSecure, 
                                        this.config.services.email.smtpUsername, 
                                        this.config.services.email.smtpPassword, 
                                        this.messages[x].name,
                                        this.messages[x].text, 
                                        this.messages[x].recipients,
                                    )
                                    break

                                case "pushover":
                                    messenger = new PushoverMessenger(
                                        this.config.services.pushover.user, 
                                        this.config.services.pushover.token,
                                        this.messages[x].name,
                                        this.messages[x].text,
                                        this.messages[x].priority,
                                        this.messages[x].device,
                                        this.messages[x].sound,
                                        this.messages[x].url,
                                        this.messages[x].urltitle,
                                    )
                                    break

                                case "ifttt":
                                    messenger = new IftttMessenger(
                                        this.config.services.ifttt.key,
                                        this.messages[x].event,
                                        this.messages[x].value1,
                                        this.messages[x].value2,
                                        this.messages[x].value3,
                                    )
                                    break

                                case "pushcut":
                                    messenger = new PushcutMessenger(
                                        this.config.services.pushcut.apikey,
                                        this.messages[x].notification,
                                        this.messages[x].title,
                                        this.messages[x].text,
                                        this.messages[x].input,
                                        this.messages[x].actions,
                                    )
                                    break

                                default:
                                    throw new Error(`${messageName}: Invalid message type value.`)
                            }
              
                            this.log(`${messageName}: Message sent to ${messenger.getRecipient()}`)
                            messenger.sendMessage()
                        }

                        // Configure message switch to be stateless: will be turned off after 100ms.
                        setTimeout(
                            function () {
                                serviceMessageSwitch.setCharacteristic(Characteristic.On, false)
                            }.bind(this),
                            100,
                            this.time,
                        )
                    }

                    callback(null)
                }.bind(this))

            this.serviceMessagesSwitches.push(serviceMessageSwitch)
        }  
    }

    /**
     * @param {boolean} value
     * @param {import("homebridge").CharacteristicSetCallback} callback
    */
    setOnCharacteristicHandler(value, callback) {
        this.isOn = value
        this.storage.setItemSync(this.config.name, value)
        this.log("Main Switch status"+ " : " + value)
        callback(null)
    }

    /**
     * **REQUIRED** function by Homebridge to add accessory plugins
     * @see {@link https://developers.homebridge.io/#/api/accessory-plugins}
    */
    getServices() {
        // Load configuration information for devices
        const informationService = new Service.AccessoryInformation()
            .setCharacteristic(Characteristic.Manufacturer, packageJson.name)
            .setCharacteristic(Characteristic.SerialNumber, packageJson.name)
            .setCharacteristic(Characteristic.Model, packageJson.name)
            .setCharacteristic(Characteristic.FirmwareRevision, packageJson.version)

        // Event handler for main switch
        this.serviceMainSwitch.getCharacteristic(Characteristic.On)
            .on("set", this.setOnCharacteristicHandler.bind(this)) 
   
        // Send all switches to Homebridge to be added
        return [
            informationService,
            this.serviceMainSwitch,
            ...this.serviceMessagesSwitches,
        ]
    }
}

/** @param {import("homebridge").API} homebridge */
module.exports = (homebridge) => {
    Service = homebridge.hap.Service
    Characteristic = homebridge.hap.Characteristic
    HomebridgeAPI = homebridge
    homebridge.registerAccessory("homebridge-messenger", "HomebridgeMessenger", HomebridgeMessenger)
}
