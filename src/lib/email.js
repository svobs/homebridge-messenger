"use strict"

const Nodemailer = require("nodemailer")
const HomebridgeMessengerError = require("../errors/HomebridgeMessengerError")

const MESSENGER_NAME = "EmailMessenger"

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
        if (!smtpServer) {
            throw new HomebridgeMessengerError("SMTP server cannot be empty", MESSENGER_NAME)
        }

        if (smtpPort && (smtpPort < 0 || smtpPort > 65535)) {
            throw new HomebridgeMessengerError("SMTP port must be between 0 and 65535", MESSENGER_NAME)
        }

        if (!messageTitle) {
            throw new HomebridgeMessengerError("Message title cannot be empty", MESSENGER_NAME)
        }

        if (!messageText) {
            throw new HomebridgeMessengerError("Message text cannot be empty", MESSENGER_NAME, messageTitle)
        }

        if (!emailRecipient) {
            throw new HomebridgeMessengerError("Email cannot be empty", MESSENGER_NAME, messageTitle)
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
