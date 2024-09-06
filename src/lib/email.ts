'use strict';

import Nodemailer from 'nodemailer';

export class EmailMessenger {

  constructor(
    private readonly default_email: string,
    private readonly smtp_server: string,
    private readonly smtp_port: number,
    private readonly smtp_secure: boolean,
    private readonly smtp_username: string,
    private readonly smtp_password: string,
    private readonly message_title: string,
    private readonly message_text: string,
    private readonly message_recipients: [],
  ) {

    if (!this.default_email) {
      throw new Error(this.message_title + ' : Email cannot be empty');
    }

    if (!this.smtp_server) {
      throw new Error(this.message_title + ' : SMTP server cannot be empty');
    }

    if (!this.smtp_port) {
      this.smtp_port = 25;
    }

    if (this.smtp_port < 0 || this.smtp_port > 65535) {
      throw new Error(this.message_title + ' : SMTP port must be between 0 and 65535');
    }

    if (!this.smtp_secure) {
      this.smtp_secure = false;
    }

    if (!this.message_title) {
      throw new Error(this.message_title + ' : Message title cannot be empty');
    }

    if (!this.message_text) {
      throw new Error(this.message_title + ' : Message text cannot be empty');
    }
  }


  getRecipient() {
    if (this.message_recipients) {
      return this.message_recipients;
    } else {
      return this.default_email;
    }
  }

    
  sendMessage() {
    let transport;

    if (this.smtp_username) {
      transport = Nodemailer.createTransport({
        host: this.smtp_server, port: this.smtp_port,
        auth: {
          user: this.smtp_username, pass: this.smtp_password,
        },
        tls: {          
          requireTLS: this.smtp_secure,
        },          
      });
    } else {
      transport = Nodemailer.createTransport({
        host: this.smtp_server, port: this.smtp_port,
      });
    }
        
    const mailOptions = {      
      from: this.default_email, to: this.getRecipient(), subject: this.message_title, text: this.message_text,
    };
  
    transport.sendMail(mailOptions, (error) => {
      if (error) {
        throw new Error(error);
      }
    });  
  }
};