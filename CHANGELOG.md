# Changelog

All notable changes to this app are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project
follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Two things worth knowing before you edit this file:

- Entries up to and including 2.1.1 were migrated from the release notes that used to live in
  `README.md`. Their wording is preserved; only the structure changed.
- Homey shows a separate, one-line-per-release changelog in the app store, kept in
  `.homeychangelog.json`. Add an entry there too when you cut a release.

## [Unreleased]

`app.json` is already at `3.0.0`, but `package.json` still reports `2.1.1` and
`.homeychangelog.json` has no `3.0.0` entry yet. Line those three up before publishing.

### Added

- Lightguide range: Ellipse, Globe Small G30, Globe Large G40, Triangle, Edison ST23, Edison ST72
- Hue Dymera
- Hue Wall Switch Module – Wired (ROM002)
- Filament Bulb Candle E14 White Ambiance (LTE005)
- GU10 White Ambiance BT (LTG005)
- `Start dimming` and `Stop dimming` flow actions for lights, with a configurable rate

### Changed

- Updated `homey-zigbeedriver` 2.1.4 → 2.2.17 and `zigbee-clusters` 2.4.1 → 3.6.0
- App now validates against Homey's `verified` level
- Requires Node 18 or newer
- `npm run` now calls `homey app run` instead of the retired `athom project --run`
- Driver artwork: PNGs quantised to 256 colours and SVGs run through svgo, shrinking the bundle
- Merged all pull requests that were still open on the upstream JohanBendz repository

### Removed

- Eight unused runtime dependencies: `color-space`, `cookie`, `homey-log`, `hsluv`,
  `json-stringify-safe`, `lsmod`, `stack-trace` and `uuid`
- Routine per-event logging across the sensor, switch and contact drivers. The `zigbee-clusters`
  frame debug is off by default now; see [Troubleshooting](README.md#troubleshooting) for how to
  turn it back on

### Fixed

- Contact Sensor (SOC001): secure on/off reporting
- Dimmer Switch Gen 3 (RWL022): battery level is now reported

## [2.1.1]

### Added

- Filament Bulb ST64 White Edison (LWV005)
- Filament Bulb ST64 White Ambiance Edison (LTV001)

## [2.1.0] - 2024-09-22

### Added

- Contact Sensor

### Changed

- Updated the `homey-zigbeedriver` and `zigbee-clusters` npm modules

## [2.0.54] - 2024-09-22

### Added

- Akari Downlight

## [2.0.53] - 2024-04-01

### Added

- Fugato 4-Spotlight

## [2.0.52] - 2024-04-01

### Added

- Tuar Outdoor Wall Light
- Econic Outdoor Pedestal Light
- Adore Bathroom mirror
- Wellner
- Enrave
- Wellness
- Go portable table lamp
- Filament Bulb ST64 White Ambiance
- New version of Bulb E27 White and Color Ambiance BT
- New version of Filament Bulb Candle E14
- Suppression functionality for Occupancy Sensors
- Condition flow card: luminance is above / below
- Condition flow card: temperature is above / below

## [2.0.51] - 2024-03-05

### Fixed

- Adds the `measure_battery` capability if missing, on RDM001 and RDM002

## [2.0.50] - 2024-03-05

### Added

- New version of the Wall Switch Module (RDM004)
- New version of the Smart Button (RDM003)
- New version of the Lightstrip (LCL006)
- New version of the Outdoor Occupancy Sensor (SML004)

### Changed

- The Wall Switch Module (RDM001 and RDM004) driver is back to two tiles, one per input/button.
  For now this is the only way to stop a single button change firing both triggers.

### Fixed

- Wall Switch Module now works
- Motion sensors now have keep-alive code, hopefully resolving units dropping or going quiet after
  a while
- Some devices that did not report battery now do

## [2.0.49] - 2024-02-25

### Added

- Devere Medium Ceiling Light
- Surimu Rectangle Ceiling Panel
- New version of Bulb E14 P45 White
- New version of Argenta 3-light Spotlight
- New versions of Bulb 1100 Lumen White
- New versions of Ensis Pendant
- New version of the Smart Plug
- New version of Infuse Medium Ceiling Light
- New version of Being Ceiling Lamp

## [2.0.48] - 2023-12-03

### Changed

- The Wall Switch Module (RDM001) driver now has both buttons in the same device

## [2.0.47] - 2023-12-03

### Added

- New version of Lily Outdoor Spot
- New version of Filament Bulb A60
- Wall Switch Module

## [2.0.46] - 2023-07-10

### Fixed

- Potential memory leak: run listeners were started multiple times

## [2.0.45] - 2023-07-10

### Added

- Tap Dial Switch

## [2.0.44] - 2023-07-04

### Added

- Sumiri Panel
- Infuse Medium Ceiling Light
- LED indicator and sensitivity settings for Occupancy Sensors

## [2.0.43] - 2023-04-11

### Added

- New model of Being Ceiling

## [2.0.42] - 2022-11-27

### Changed

- Updated the `homey-zigbeedriver` and `zigbee-clusters` npm modules

## [2.0.41] - 2022-11-27

### Added

- New version of Buckram Spotlights
- Mickey Mouse Bloom/Aura Living Colors
- New version of Smart Plug
- Filament Bulb White Ambient A60 E27
- Bulb White Ambient E27
- Filament Bulb White Ambient G23 E27
- Filament Bulb White Ambient G125 E27
- Bulb White 1100 Lumen
- Filament Bulb Candle E14
- New version of Indoor Occupancy Sensor

### Changed

- Updated a number of icons

## [2.0.40]

### Added

- New version of Calla Outdoor Short Path Light
- New version of Bulb White Ambiance A19 E27
- New version of Ensis pendant
- New version of Go

## [2.0.39] - 2022-02-06

### Added

- Argenta 3-light Spotlight
- Amarant Linear Outdoor Light
- Fuzo Outdoor Pedestal Light
- New version of Beyond Ceiling Light
- New versions of White and Color Ambiance Bulbs
- New version of Calla Outdoor Short Path Light
- New version of Appear Outdoor Wall Light
- New version of Centris Panel Light
- New version of Play Lightbar
- New version of Centris Spotlight
- New versions of Iris Living Colors Light
- New versions of the Smart Plug
- New versions of Cher Ceiling Light
- New version of Adore Bathroom Ceiling White Ambience Light
- New version of the Outdoor Motion/Occupancy Sensor
- New version of the Indoor Motion/Occupancy Sensor

## [2.0.38]

### Fixed

- Power On Control for the Plug

## [2.0.37]

### Added

- Power On Behaviour for the Plug

## [2.0.36] - 2021-05-07

### Added

- Turaco Outdoor Wall Light
- Argenta Spotlights

## [2.0.35] - 2021-03-24

### Fixed

- Power On Control behaviour for lights now works. Some devices need a firmware update to support
  this feature.

## [2.0.32] - 2021-03-16

### Added

- Some additional device IDs

### Changed

- Minor improvements

## [2.0.31] - 2021-03-05

### Added

- Dimmer Switch (Gen 3)
- Adore Bathroom Recessed Downlights
- Flow card for alerts (lights)

## [2.0.30] - 2021-03-01

### Added

- A secondary version of the Outdoor Sensor — Outdoor Occupancy Sensor, for test and evaluation

## [2.0.29] - 2021-03-01

### Added

- Aurelle Panel Round
- Centris Panel
- Centris Spot
- A secondary version of the Motion Sensor — Occupancy Sensor, for test and evaluation
- Some device IDs for already supported devices

### Changed

- Optimized images to shrink the size of the app

## [2.0.27]

### Fixed

- Smart Button: replaced faulty flow cards with correct, and more, cards

## [2.0.26] - 2021-01-24

### Added

- Milliskin GU10 Recessed Spotlight White Ambiance
- Filament ST72 E27
- Some device IDs for already supported devices

## [2.0.24] - 2021-01-14

### Added

- Flow card for Blink (lights)

## [2.0.23] - 2021-01-07

### Added

- Buckram Spotlights
- Some device IDs for already supported devices

## [2.0.22] - 2021-01-02

### Added

- Bulb E14 Candle White and Color BT
- Bulb E14 P45 White
- Phoenix Downlight
- Motion Sensor now has a setting for the time between triggered and reset alarm

## [2.0.21] - 2020-12-27

Test version on GitHub only.

### Changed

- Hue Motion Sensors with up-to-date firmware are added as an Occupancy Sensor instead of a Motion
  Sensor

## [2.0.20] - 2020-12-19

### Changed

- Reverted the previous update; issues with some bulbs need to be fixed first

## [2.0.19] - 2020-12-18

### Added

- Power On/Off/Recover behaviour after power loss, for lights

## [2.0.14] - 2020-12-06

### Added

- A few product IDs for already supported devices
- `manufacturerName` "Signify Netherlands B.V." to all drivers

## [2.0.13] - 2020-12-05

### Added

- Calla Outdoor Tall Path Light
- Appear Outdoor Wall Light (upper and lower)

## [2.0.12] - 2020-10-30

### Added

- E14 Candle White Ambience (BT)
- Filament G125
- Additional product IDs for Lucca Pedestal and Lucca Post

## [2.0.11] - 2020-10-13

### Added

- Smart Button

## [2.0.10] - 2020-10-05

### Added

- Additional product ID for the Play Lightbar

## [2.0.9] - 2020-10-05

### Added

- Product IDs for already added devices in different colors

## [2.0.8]

### Fixed

- Forced a Zigbee driver and cluster update

## [2.0.7]

### Added

- Lily Outdoor XL Spotlight
- Additional product IDs for Ensis Pendant (upper and lower light)
- Runner Single Spotlight
- Additional product ID for Adore Bathroom Mirror

## [2.0.6]

### Added

- Econic Hanging Wall light (thanks Caseda)

## [2.0.5]

### Added

- Fugato Triple Spotlight (thanks Caseda)

### Fixed

- Removed jpg, replaced with png

## [2.0.4]

### Added

- New version of Being Ceiling Lamp
- Resonate Outdoor Wall Light

### Fixed

- On/Off was not correctly set when dimming to or from 0

## [2.0.3]

### Added

- Hue Garnea Downlight
- Bulb 1600 Lumen White

### Changed

- Verbose Zigbee logging enabled, for better troubleshooting of crash logs

## [2.0.2]

### Fixed

- Luminance for Motion and Outdoor Sensors was not calculated correctly

## [2.0.1]

The SDK3 rewrite.

### Added

- Hue Lightstrip Plus V4 (thanks zepign)
- Hue Lightstrip Outdoor 2 meter
- Hue Lightstrip Outdoor 5 meter
- Hue Being Pendant
- Nyro Outdoor Pedestal
- Nyro Outdoor Wall Light
- Hue Econic Wall Light
- Hue Aurelle Rectangular

### Changed

- SDK3 rewrite
- Implemented the new Homey Zigbee Driver
- Implemented the use of Compose
- Hue Switch Button now shows battery information
- Some changes in settings for Motion Sensors

## [1.6.3] - 2020-12-12

### Added

- Econic Wall light
- Nyro Outdoor Pedestal
- Nyro Outdoor Wall Light
- Lily Outdoor XL Spotlight
- Resonate Outdoor Wall Light
- Aurelle Panel Rectangular
- Fugato Triple Spotlight
- Lightstrip Plus V4
- Lightstrip Outdoor 2 meter
- Lightstrip Outdoor 5 meter
- Garnea Downlight
- Being Pendant
- Bulb 1600 Lumen White
- Filament G125 E27

### Changed

- Implemented Composer

## [1.6.2]

### Added

- New product IDs for a number of devices already supported by the app
- New `manufacturerName`, Signify Netherlands B.V.

## [1.6.1]

Prepping for SDK3. Upgrading the Test version to Stable.

### Fixed

- LCT000 issue
- SML001 and SML002 typo in settings update

## [1.5.10]

### Added

- Silver frame version of Daylo Outdoor Wall Light

## [1.5.9]

### Fixed

- Killed some bugs

## [1.5.8]

### Fixed

- There appear to be multiple versions of the Fuzo Wall Light; added an additional device ID and
  profile ID

## [1.5.7]

### Added

- Australian version of the Hue Smart Plug (LOM005)

### Fixed

- Fuzo lights were set as Color by mistake, now White

## [1.5.6]

### Fixed

- Ensis upper and lower were switched

## [1.5.5]

### Fixed

- Corrected the device driver info for Hue Econic

## [1.5.4]

### Added

- Hue Ensis Pendant, upper and lower light version

## [1.5.3]

### Added

- Hue Fuzo Outdoor Wall Light (open front version)

## [1.5.2]

### Added

- Hue Daylo Outdoor Wall Light
- Hue Flourish Ceiling Light
- Hue Centura GU10 Recessed Spotlight
- Hue Impress Path Light
- Hue Fugato Double Spotlight
- Hue Calla Outdoor Path Light
- Hue Fuzo Outdoor Wall Light (split front version)
- Hue Impress Outdoor Wall Light

### Fixed

- Added error handling where code was missing it, to comply with the updated Homey SDK

## [1.5.1]

### Added

- Hue Signe Floor Light
- Duration functionality for units that support hue, saturation and temperature

### Changed

- Hue Motion Sensor: fine-tuned reporting, which will hopefully make the device work better
- Hue Outdoor Sensor: fine-tuned reporting, which will hopefully make the device work better

## [1.5.0]

The app and project were transferred from Sebastian Johansson to Johan Bendz.

### Added

- Hue Outdoor Discover Floodlight
- Hue Flourish Pendant
- Dim duration functionality for units with the Dim capability

### Changed

- Added product ID LOM001 to Hue Smart Plug

## [1.4.9]

### Added

- Hue Bulb 9W A60 E27 EUR White (thanks Gemini123)
- Hue White Ambiance GU10 BT (thanks Schnaaf)
- Hue smart plug (thanks KrakenTyio)
- Hue Filament ST64 (thanks bramoosterhuis)
- Hue Go BT (thanks Schnaaf)
- Hue Bulb E27 W&C Ambiance BT (thanks Schnaaf)
- Hue Bulb E27 White Ambiance BT (thanks Schnaaf)
- Hue Bulb E14 White Candle BT
- Hue Outdoor Fuzo Wall Lantern
- Hue Fluorish Ceiling Light
- Battery types for Energy (thanks JohanBendz)
- Energy consumption for the devices that had data defined on meethue.com

### Changed

- Based on findings by mapulu, motion detection on SML001 now runs with minimum 5 second reports,
  to see if that mitigates motion sensors that stop reporting data

## [1.4.6]

### Added

- Hue White GU10 PF
- Hue Fair Pendant
- Hue White (LWF002)
- Hue Color Spot GU10
- Hue Filament G93 (thanks Gemeni123)
- Hue Filament A60 (thanks Gemeni123)
- Hue Living Colors Aura
- Hue Lucca Outdoor Post
- Hue Lucca Outdoor Pedestal
- Hue White Ambience Adore Bathroom Ceiling (thanks Gemeni123)
- Hue Spot GU10 with Bluetooth
- Hue Impress Outdoor Pedestal Light
- Hue Impress Outdoor Wall Light
- Hue Adore Bathroom mirror light
- Hue Aurelle Square (thanks Gemeni123)
- Hue Ensis Pendant (thanks Gemeni123)

## [1.4.5]

### Added

- Hue Outdoor Sensor
- Hue Outdoor Welcome Floodlight
- Hue Cher Ceiling
- Hue Still Ceiling
- Temperature offset for Motion Sensor and Outdoor Sensor

### Fixed

- Images of LTC001 and LTC002 had been switched
- Icons for HML004 and LTC012

## [1.4.4]

### Added

- Hue Phoenix Wall
- Hue Amaze Pendant
- Hue play bar (thanks Simon Skog)
- Hue Struana Ceiling
- Hue Lily Outdoor Spot
- Hue Outdoor Lightstrip

### Fixed

- Changed all RGB bulbs back to `ZigbeeLightDevice`, since a lot of RGB bulbs got a slightly
  greenish color when selecting the warmest ambiance

## [1.4.3]

### Changed

- Added references to installed packages
- Force-added dependencies to the repository

### Fixed

- Bug regarding LST001 (thanks Andreas Pardeike)

## [1.4.0]

### Added

- Hue Beyond Table
- Hue Beyond Pendant
- Hue Beyond Ceiling
- Hue Fair Ceiling Lamp
- Hue Being Ceiling Lamp
- Hue Sana Wall Light
- Hue Dimmer Switch (RWL020 US version)
- Hue Aurelle Rectangle Panel Light

### Changed

- Color lights now use the XY ZigBee light device

## [1.3.0]

The first release with release notes.

### Added

- Hue Dimmer Switch
- Hue Motion Sensor
- Hue Phoenix Pendant
- Hue Phoenix Table
- Hue Go
