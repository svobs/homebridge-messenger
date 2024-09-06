'use strict';

import IFTTT from 'ifttt-webhooks-channel';

export class IftttMessenger {

  constructor(
    private readonly iftttKey: string,
    private readonly iftttEvent: string,
    private readonly value_1: string,
    private readonly value_2: string,
    private readonly value_3: string,
  ) {}


  getRecipient() {
    return this.iftttKey + ' (event : ' + this.iftttEvent + ')';
  }

    
  sendMessage() {      
    const ifttt = new IFTTT(this.iftttKey);
    ifttt.post(this.iftttEvent, [this.value_1, this.value_2, this.value_3])
      .catch(error => new Error(error));
  }
};