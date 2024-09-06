'use strict';

import axios from 'axios';

export class PushcutMessenger {

  constructor(
    private readonly pushcut_apikey: string,
    private readonly message_notification: string,
    private readonly message_title: string,
    private readonly message_text: string,
    private readonly message_input: string,
    private readonly message_actions: [],
  ) {}
  

  getRecipient() {
    return this.pushcut_apikey + ' (notification : ' + this.message_notification + ')';
  }

    
  sendMessage() {
    const url = 'https://api.pushcut.io/v1/notifications/' + this.message_notification;
    const data = { text: this.message_text, title: this.message_title, input : this.message_input, actions: this.message_actions };
    const config = { headers: { 'accept': '*/*', 'API-Key': this.pushcut_apikey, 'Content-Type': 'application/json' } };

    axios.post(url, data, config)
      .catch(error => {
        console.error(error);
      });

  }
};