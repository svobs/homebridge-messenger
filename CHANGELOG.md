# Change Log

## 1.0.4 (2024-09-24)
* Modernize project structure, rewrite in TypeScript, to prepare for verification / HomeBridge 2.0. Log messages will look slightly different but there should be no changes to functionality at all.

## 1.0.3 (2024-08-14)
* Add support for TTL field in Pushover.

## 1.0.2 (2024-03-08)
* No code changes - just an update to this changelog. Please be patient - I'm still learning the ins & outs of npm!

## 1.0.1 (2024-03-08)
* Fix broken initial release. Verified that Pushover custom sounds do indeed work correctly now.

## 1.0.0 (2024-01-22)
* Initial attempt to fork with custom Pushover sound support. 
* BAD RELEASE! Sound support was still broken due a bad publish. Do not use 1.0.0. Use 1.0.1 release instead.

# Upstream Change Log

All notable changes to this project will be documented in this file. This project uses [Semantic Versioning](https://semver.org/).

## 0.0.8 (2021-01-12)

### Bug fixes
* Fix problem when a message is send when the master switch is off ([#18](https://github.com/potrudeau/homebridge-messenger/issues/18))
* Updated some plugin dependencies 

## 0.0.7 (2021-01-04)

### Bug fixes
* Fix problem with secure emails crashing plugin. ([#15](https://github.com/potrudeau/homebridge-messenger/issues/15))

### Features

* **Email messages :** Added support for alternate email override. ([#14](https://github.com/potrudeau/homebridge-messenger/issues/14))
* **Email messages :** Added support for multiple email recipients (in alternate email). ([#13](https://github.com/potrudeau/homebridge-messenger/issues/13))

## 0.0.6 (2020-04-26)

### Bug fixes
* Bug fixe when Pushover device is not provided. ([#6](https://github.com/potrudeau/homebridge-messenger/issues/6))

## 0.0.5 (2020-04-24)

### Features

* **IFTTT messages :** Added support for [IFTTT Webhooks](https://ifttt.com/maker_webhooks). ([#1](https://github.com/potrudeau/homebridge-messenger/issues/1))
* **Pushover messages :** Added Url and Url Title properties for Pushover messages. Also, Pushover messages now supports HTML code, as permitted by the Pushover [API](https://pushover.net/api). ([#3](https://github.com/potrudeau/homebridge-messenger/issues/3))

### Bug fixes
* Remove all spaces from "device" property of Pushover messages. The spaces were not allowing message to be sent to multiple devices. ([#4](https://github.com/potrudeau/homebridge-messenger/issues/4))

## 0.0.4 (2020-04-21)

### Features

* **Pushover messages :** Added [Device](https://pushover.net/api#identifiers) property.

## 0.0.3 (2020-04-19)

### Features

* **Caching for main switch :** The main switch now keeps its status (ON/OFF) after a Homebridge restart.

## 0.0.2 (2020-04-13)

### Features

* **Support for Homebridge Config UI X :** Homebridge-messenger is now compatible with [Plugin Settings GUI](https://github.com/oznu/homebridge-config-ui-x/wiki/Developers:-Plugin-Settings-GUI).
* **Email messages :** Added default value for SMTP port (25).
* **Logging :** Added more logging when loading plugin.

## 0.0.1 (2020-04-09)

### Features

* **Initial release:** : Basic support for Pushover messages and emails!
