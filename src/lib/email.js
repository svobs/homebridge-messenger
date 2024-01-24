"use strict"

const Nodemailer = require("nodemailer")

module.exports = class EmailMessenger {
  /**
   * @param {string | undefined} emailRecipient
   * @param {string | undefined} smtpServer
   * @param {number | undefined} smtpPort
   * @param {boolean | undefined} smtpSecure
   * @param {string | undefined} smtpUsername
   * @param {string | undefined} smtpPassword
   * @param {string | undefined} messageTitle
   * @param {string | undefined} messageText
   * @param {string | undefined} messageRecipients
   */
  constructor(
    emailRecipient,
    smtpServer,
    smtpPort,
    smtpSecure,
    smtpUsername,
    smtpPassword,
    messageTitle,
    messageText,
    messageRecipients,
  ) {
    if (!messageTitle) {
      throw new Error("Message title cannot be empty")
    }

    if (!emailRecipient) {
      throw new Error(messageTitle + " : Email cannot be empty")
    }

    if (!smtpServer) {
      throw new Error(messageTitle + " : SMTP server cannot be empty")
    }

    if (smtpPort && (smtpPort < 0 || smtpPort > 65535)) {
      throw new Error(messageTitle + " : SMTP port must be between 0 and 65535")
    }

    if (!messageText) {
      throw new Error(messageTitle + " : Message text cannot be empty")
    }

    this.default_email = emailRecipient
    this.smtp_server = smtpServer
    this.smtp_port = smtpPort ?? 25
    this.smtp_secure = smtpSecure ?? false
    this.smtp_username = smtpUsername
    this.smtp_password = smtpPassword
    this.message_title = messageTitle
    this.message_text = messageText
    this.message_recipients = messageRecipients
  }

  getRecipient() {
    return this.message_recipients ?? this.default_email
  }
  
  sendMessage() {
    /** @type {import('nodemailer/lib/smtp-transport').Options} */
    const transportConfig = this.smtp_username ? {
      host: this.smtp_server,
      port: this.smtp_port,
      auth: {
        user: this.smtp_username,
        pass: this.smtp_password,
      },
      tls: {          
        requireTLS: this.smtp_secure,
      },
    } : {
      host: this.smtp_server,
      port: this.smtp_port,
    }

    const transport = Nodemailer.createTransport(transportConfig)

    transport.sendMail({      
      from: this.default_email,
      to: this.getRecipient,
      subject: this.message_title,
      text: this.message_text,
    }, (error, info) => {
      if (error) {
        throw new Error(error)
      }
    })
  }
}