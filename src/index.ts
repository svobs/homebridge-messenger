import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  CharacteristicEventTypes,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAP,
  Logging,
  Service,
} from 'homebridge';

import { PushOverMessenger } from './lib/pushover.js';
import { EmailMessenger } from './lib/email.js';
import { IftttMessenger } from './lib/ifttt.js';
import { PushcutMessenger } from './lib/pushcut.js';

import nodePersist from 'node-persist';

let hap: HAP;

export default (api: API) => {
  hap = api.hap;
  api.registerAccessory('HomebridgeMessenger', HomebridgeMessenger);
};


export class HomebridgeMessenger implements AccessoryPlugin {
  private readonly log: Logging;
  private readonly config: AccessoryConfig;
  private readonly serviceMainSwitch: Service;
  private readonly cacheDirectory: string;
  private readonly storage = nodePersist;

  private isOn: CharacteristicValue = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private messages: any[] = [];
  private serviceMessagesSwitches: Service[] = [];
  
  constructor(log: Logging, config: AccessoryConfig, api: API) {
    this.log = log;
    this.config = config;

    // Add main switch to Homebridge
    this.serviceMainSwitch = new hap.Service.Switch(this.config.name, '0');
    this.log(`Added Main Switch: ${this.config.name}`);

    // Initialize cache
    this.cacheDirectory = api.user.persistPath();
    this.storage.initSync({ dir:this.cacheDirectory, forgiveParseErrors: true });

    // Get cache and validate if main switch is in cache
    const cachedState = this.storage.getItemSync(this.config.name);
    if((cachedState === undefined) || (cachedState === false)) { // If not in cache
      this.isOn = false;
    } else { // If in cache
      this.isOn = true;
    }
    this.serviceMainSwitch.setCharacteristic(hap.Characteristic.On, this.isOn);
    this.log('Main Switch status' + ': ' + (this.isOn ? 'ON' : 'OFF'));

    // Load configured messages
    this.loadMessages();
  }

  loadMessages() {
    this.messages = this.config.messages || [];
    this.serviceMessagesSwitches = [];

    // Iterate through configured messages
    for (let x = 0; x < this.messages.length; x++) {

      // Add switch for each message
      const msgSwitch = this.messages[x];
      const subtype: string = String(x + 100);
      const serviceMessageSwitch = new hap.Service.Switch(msgSwitch.name, subtype);
      this.log(`Added switch #${x}: name=[${msgSwitch.name}], type=${msgSwitch.type.toLowerCase()}, uid=${subtype}`);

      // Add event handler for each message
      const listener = (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        //this.log(`[${msgSwitch.name}] Entered listenerFunc (value: ${value}, masterIsOn: ${this.isOn})`);
        if (value===true) { // If message switch status is On
          if (this.isOn) { // If main switch status if On

            let message;
            switch(msgSwitch.type.toLowerCase()) {

            // Message type is email
            case 'email': 
              message = new EmailMessenger(this.config.services.email.recipient, 
                this.config.services.email.smtpServer, 
                this.config.services.email.smtpPort, 
                this.config.services.email.smtpSecure, 
                this.config.services.email.smtpUsername, 
                this.config.services.email.smtpPassword, 
                msgSwitch.name,
                msgSwitch.text, 
                msgSwitch.recipients);
              break;

              // Message type is pushover
            case 'pushover':
              message = new PushOverMessenger(this.config.services.pushover.user, 
                this.config.services.pushover.token,
                msgSwitch.name,
                msgSwitch.text,
                msgSwitch.priority,
                msgSwitch.device,
                msgSwitch.ttl,
                msgSwitch.sound,
                msgSwitch.url,
                msgSwitch.urltitle);
              break;

              // Message type is ifttt
            case 'ifttt':
              message = new IftttMessenger(this.config.services.ifttt.key,
                msgSwitch.event,
                msgSwitch.value1,
                msgSwitch.value2,
                msgSwitch.value3);
              break;  

              // Message type is pushcut
            case 'pushcut':
              message = new PushcutMessenger(this.config.services.pushcut.apikey,
                msgSwitch.notification,
                msgSwitch.title,
                msgSwitch.text,
                msgSwitch.input,
                msgSwitch.actions);
              break;       
                          
              // Invalid message type
            default:
              throw new Error(`[${msgSwitch.name}] Invalid type value.`);
            }
            
            message.sendMessage();
            this.log(`[${msgSwitch.name}] Message sent to ${message.getRecipient()}`);
          } else { // If main switch status if Off
            this.log(`[${msgSwitch.name}] Message not sent. Master switch is off.`);
          }

          // Configure message switch to be stateless : will be turned off after 100 ms.
          setTimeout(() => {
            serviceMessageSwitch.setCharacteristic(hap.Characteristic.On, false);
          }, 100);
        }

        callback(null);
      };

      serviceMessageSwitch.getCharacteristic(hap.Characteristic.On).on(CharacteristicEventTypes.SET, listener);

      // Add message switch to array. Array will be loaded in getServices()
      this.serviceMessagesSwitches.push(serviceMessageSwitch);
    }

    this.log(`Finished adding ${this.serviceMessagesSwitches.length} switches`);
  }


  setOnCharacteristicHandler(value: CharacteristicValue, callback: CharacteristicSetCallback) {
    this.isOn = value;
    this.storage.setItemSync(this.config.name, value);
    this.log(`Main Switch status: ${value}`);
    callback(null);
  }


  getServices () {
    // Load configuration information for devices
    const informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, 'HomeBridge Plugin')
      .setCharacteristic(hap.Characteristic.SerialNumber, 'N/A')
      .setCharacteristic(hap.Characteristic.Model, 'N/A')
      .setCharacteristic(hap.Characteristic.FirmwareRevision, '1.0.4');  // should match version in package.json

    // Event handler for main switch
    this.serviceMainSwitch.getCharacteristic(hap.Characteristic.On).on(CharacteristicEventTypes.SET, this.setOnCharacteristicHandler.bind(this)); 
   
    // Send all switches to Homebridge to be added
    return [informationService, this.serviceMainSwitch, ...this.serviceMessagesSwitches];
  }
}
