'use strict';

import Pushover from 'pushover-notifications';

const MESSAGE_RETRY = 60;
const MESSAGE_EXPIRE = 3600;
const HTML = 1;

export class PushOverMessenger {

  constructor(
    private readonly pushover_user: string,
    private readonly pushover_token: string,
    private readonly message_title: string,
    private readonly message_text: string,
    private readonly message_priority: number,
    private readonly message_ttl: number,
    private readonly message_device: string,
    private readonly message_sound: string,
    private readonly message_url: string,
    private readonly message_urltitle: string,
  ) {

    if (!this.pushover_user) {
      throw new Error(this.message_title + ' : User cannot be empty');
    }

    if (!this.pushover_token) {
      throw new Error(this.message_title + ' : Token cannot be empty');
    }

    if (!this.message_title) {
      throw new Error(this.message_title + ' : Message title cannot be empty');
    }

    if (!this.message_text) {
      throw new Error(this.message_title + ' : Message text cannot be empty');
    }

    if (![-2, -1, 0 , 1, 2].includes(this.message_priority)) {
      throw new Error(this.message_title + ' : Invalid priority value ' + this.message_priority);
    }

    if (this.message_ttl && this.message_ttl < 1) {
      throw new Error(this.message_title + ' : TTL must not be less than 0 (sec). Leave it empty for unlimited TTL');
    }

    if (this.message_device) {
      this.message_device = this.message_device.replace(/\s/g,'');
    }

    if (!this.message_sound) {
      this.message_sound = 'pushover';
    }
  }


  getRecipient() {
    return this.pushover_token;
  }


  sendMessage() {
    const p = new Pushover( {
      user: this.pushover_user,
      token: this.pushover_token,
    });
        
    const msg = {
      message: this.message_text,
      title: this.message_title,
      device : this.message_device,
      priority: this.message_priority,
      ttl: this.message_ttl,
      sound : this.message_sound,
      url : this.message_url,
      url_title : this.message_urltitle,
      html: HTML,
      retry : MESSAGE_RETRY,
      expire: MESSAGE_EXPIRE,
    };

    p.send(msg, (error) => {
      if (error) {
        throw new Error(error);
      }
    });   
  }     
    
};
