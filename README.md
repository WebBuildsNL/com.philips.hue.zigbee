# Philips Hue Zigbee for Homey

Connect Philips Hue lights, sensors and switches straight to Homey — no Hue Bridge required.

Homey speaks Zigbee natively, so it can talk to Hue hardware directly. This app gives it the
drivers to do that: **152 drivers** covering lights, motion and contact sensors, dimmer switches,
wall modules and the smart plug.

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Adding a device](#adding-a-device)
- [What the app can do](#what-the-app-can-do)
- [Supported devices](#supported-devices)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Adding support for a new device](#adding-support-for-a-new-device)
- [Project history](#project-history)
- [Credits](#credits)
- [License](#license)

## Requirements

| | |
| --- | --- |
| Homey | firmware 5.0.0 or newer, on a model with a Zigbee radio |
| Hue Bridge | not needed — and a light can only be paired to one Zigbee network at a time |
| Node (development only) | 18 or newer |

## Installation

Install *Philips Hue, without the bridge* from the Homey App Store, or run it from source — see
[Development](#development).

## Adding a device

A Hue device can only belong to one Zigbee network at a time. If the device is currently paired to
a Hue Bridge, remove it there first, or factory reset it.

1. In Homey, go to **Devices → Add device** and pick this app.
2. Choose the driver matching your device, and follow the pairing instructions it shows.
3. Put the device in pairing mode. What that takes depends on the device:
   - **Lights** — power the light on. If pairing does not start by itself, switch it off and on six
     times, or reset it with a Hue Dimmer Switch held close to the light.
   - **Sensors and switches** — hold the reset pin or setup button until the LED confirms.

Pair the device close to Homey. You can move it to its final spot afterwards; mains-powered Hue
lights act as Zigbee routers and extend the mesh.

## What the app can do

### Capabilities

On/off, dim, color hue, color saturation, color temperature and color mode for lights; motion,
contact, luminance and temperature for sensors; battery level and battery alarm for
battery-powered devices.

### Flow cards

The action and condition cards are offered for every device; the ones that need a specific
capability report "device does not support this" when picked for the wrong device. Triggers are
scoped to their driver.

| Type | Card | Works on |
| --- | --- | --- |
| Action | Blink | Lights |
| Action | Alert — blink, breathe, okay, channel change, finish or stop effect | Lights |
| Action | Start dimming, with direction and rate | Lights |
| Action | Stop dimming | Lights |
| Action | Suppress sensor for a duration | Occupancy sensors |
| Condition | Luminance is above / below | Sensors reporting luminance |
| Condition | Temperature is above / below | Sensors reporting temperature |
| Trigger | Button pressed, held and released | RWL000, RWL022, RDM001, RDM002, ROM001, ROM002 |

### Device settings

- **Power on behaviour** for lights — off, on with a configured brightness and color, or recover
  the last state after a power cut. Some lights need a firmware update from the Hue app before
  this works.
- **Temperature offset** and **decimals** for sensors that measure temperature.
- **Reporting intervals** for temperature and luminance.
- **Motion sensitivity** and **LED indicator** on the occupancy sensors.
- **Alarm reset time** on the motion sensor, between triggering and clearing the alarm.
- **Battery threshold** driving the battery alarm.

## Supported devices

Generated from the drivers in this repository. The Zigbee model ID is what the device reports as
its `modelId`; you can look yours up in Homey's developer tools under **Zigbee**.

<details>
<summary><strong>All 152 supported devices</strong></summary>

#### Lights (140)

| Device | Zigbee model ID |
| --- | --- |
| Adore Bathroom Ceiling White Ambience | `LTC021`, `3418411P6` |
| Adore Bathroom mirror | `3418631P6` |
| Adore Bathroom mirror light | `LTW017`, `3417711P6` |
| Adore Bathroom Recessed Downlight | `3417611P6` |
| Akari Downlight | `LCD003` |
| Amarant Linear Outdoor Light | `1746630P7` |
| Amaze Pendant | `LTP002`, `4023330P6`, `4023331P6`, `4023330P7`, `4023331P7` |
| Appear Outdoor Wall | `1746330P7`, `1746347P7` |
| Appear Outdoor Wall - Lower Light | `1746330P7_02` |
| Appear Outdoor Wall - Upper Light | `1746330P7_01` |
| Argenta 2-light Spotlight | `5062248P7`, `5062231P7` |
| Argenta 3-light Spotlight | `5062348P7`, `5062331P7` |
| Argenta 4-light Spotlight | `5062448P7` |
| Argenta Spotlight | `5062148P7`, `5062131P7` |
| Aurelle Panel Light | `LTC012`, `LTC015`, `LTC013`, `LTC016` |
| Aurelle Panel Rectangular | `3216331P6` |
| Aurelle Panel Round | `3216431P6` |
| Aurelle Panel Square | `LTC014`, `3216231P6`, `3216131P6` |
| Being Ceiling Lamp | `LTC001`, `3261030P6`, `3261031P6`, `3261048P6`, `929003055001`, `929003055101`, `929003055201` |
| Being Pendant | `LTP008` |
| Beyond Ceiling | `HBL003`, `LLM001` |
| Beyond Pendant | `HBL002` |
| Beyond Table | `HBL001` |
| Bloom/Aura Living Colors | `LLC011`, `LLC012`, `LLC014`, `929002375901`, `929002376001` |
| Buckram Spotlights | `5047131P6`, `5047231P6`, `5047331P6`, `5047431P6`, `929003048301_01`, `929003048301_02`, `929003048301_03`, `929003048301_04` |
| Bulb 1100 Lumen White | `LWA011`, `LWA017`, `LWA019`, `LWA029` |
| Bulb 1600 Lumen White | `LWA009` |
| Bulb 9W A60 E27 EUR White | `LWA001`, `LWA011` |
| Bulb A19 | `LCT001`, `LCT007`, `LCT010`, `LCT014`, `LCT015`, `LCT016` |
| Bulb A60 E27 White | `LWB010`, `LWB014`, `LWB004`, `LWB006`, `LWB007`, `LWF002` |
| Bulb E14 Candle White (BT) | `LWE002` |
| Bulb E14 Candle White Ambiance | `LTW012` |
| Bulb E14 Candle White Ambiance (BT) | `LTE002` |
| Bulb E14 Candle White and Color Ambiance (BT) | `LCE002` |
| Bulb E14 Hue White | `LWE007` |
| Bulb E14 P45 White | `LWU001`, `LWU002` |
| Bulb E27 White Ambiance BT | `LTA001`, `LTA004` |
| Bulb E27 White and Color Ambiance BT | `LCA001`, `LCA004`, `LCA005`, `LCA006`, `LCA008` |
| Bulb White Ambient A19 | `LTW001`, `LTW004`, `LTW010`, `LTW015`, `LTA009` |
| Bulb White Ambient E27 | `LTA011` |
| Calla Outdoor Short Path Light | `LCF002`, `1742030P7`, `1742330P7` |
| Calla Outdoor Tall Path Light | `LCF005` |
| Candle Color | `LCT012` |
| Centris Panel | `5060730P7_01`, `5060731P7_01`, `5061031P7_01`, `5060930P7_01` |
| Centris Spot | `5060730P7_02`, `5060731P7_02`, `5061031P7_02`, `5060930P7_02`, `5060931P7_02`, `5060730P7_03`, `5060731P7_03`, `5061031P7_03`, `5060930P7_03`, `5060931P7_03`, `5060730P7_04`, `5060731P7_04`, `5060930P7_04`, `5060931P7_04`, `5060730P7_05`, `5060731P7_05`, `5060930P7_05`, `5060931P7_05` |
| Centura GU10 Recessed Spotlight White and Color Ambiance | `5045131P7`, `5045148P7` |
| Cher Ceiling | `LTC011`, `4096730P6` |
| Cher Pendant | `LTP001`, `4076130P6` |
| Connected Lamp GU10 | `LCT003` |
| Daylo Outdoor Wall Light | `1746530P7`, `1746547P7` |
| Devere Medium Ceiling Light | `915005997601` |
| Discover Outdoor Floodlight | `1743530P7` |
| Econic Hanging Wall light | `1744030P7` |
| Econic light | `1743830P7` |
| Econic Outdoor Pedestal Light | `1744130P7` |
| Econic Wall light | `1743930P7` |
| Enrave | `915005996401` |
| Ensis Pendant | `4090331P9` |
| Ensis Pendant - Lower light | `4090330P9_02`, `4090331P9_02`, `LCP002`, `929003053301_02`, `929003052501_02` |
| Ensis Pendant - Upper light | `4090330P9_01`, `4090331P9_01`, `LCP001`, `929003053301_01`, `929003052501_01` |
| Fair Ceiling Lamp | `LTC002`, `4100148U7`, `929003054601` |
| Fair Pendant | `LTP003`, `4033930P6`, `4033930P7`, `4033931P6`, `4033931P7` |
| Filament Bulb A60 | `LWA004`, `LWA021` |
| Filament Bulb Candle E14 | `LWE004` |
| Filament Bulb Candle E14 White Ambiance | `LTE005` |
| Filament Bulb G93 | `LWO001` |
| Filament Bulb ST64 | `LWV001` |
| Filament Bulb ST64 White | `LWV005` |
| Filament Bulb ST64 White Ambiance | `LTV001` |
| Filament Bulb ST64 White Ambiance | `LTV002` |
| Filament Bulb ST72 E27 | `LWV003` |
| Filament Bulb White Ambient A60 E27 | `LTA005` |
| Filament Bulb White Ambient G125 E27 | `LTO002` |
| Filament Bulb White Ambient G23 E27 | `LTO001` |
| Filament Bulb White G125 E27 | `LWO003` |
| Flourish Ceiling Light White and Color | `4090431P9` |
| Flourish Pendant Light | `4090631P9` |
| Fluorish Ceiling Light | `4090531P9` |
| Fugato 4-Spotlight | `5063430P7` |
| Fugato Double Spotlight | `5063230P7` |
| Fugato Triple Spotlight | `5063330P7`, `5063331P7` |
| Fuzo Outdoor Pedestal Light | `1744830P7` |
| Fuzo Outdoor Wall Light - Closed front | `1744430P7` |
| Fuzo Outdoor Wall Light - Open front | `1744530P7` |
| Fuzo Outdoor Wall Light - Tall open front | `1744630P7` |
| Garnea Downlight | `LTD011` |
| Go | `LLC020` |
| Go BT | `LCT026`, `7602031P7` |
| Go portable table lamp | `929003128501` |
| GU10 Spot Color | `LCG002`, `5055131P7`, `5055148P7` |
| GU10 White Ambiance BT | `LTG002` |
| GU10 White Ambiance BT | `LTG005` |
| GU10 White BT | `LWG004` |
| GU10 White PF | `LWG001` |
| Hue Dymera | `929003665001` |
| Impress Outdoor Pedestal Light | `1743130P7`, `1745430P7`, `1743430P7` |
| Impress Outdoor Wall Light | `1742930P7` |
| Impress Outdoor Wall Light | `1743030P7`, `1742930P7` |
| Impress Path Light | `1743230P7` |
| Infuse Medium Ceiling Light | `915005997201`, `915005997301` |
| Iris Living Colors | `LLC010`, `929002376101`, `929002376201`, `929002376301`, `929002376401` |
| Lightguide Edison ST23 | `046677577520`, `LCV002` |
| Lightguide Edison ST72 | `929003151501`, `LCV001` |
| Lightguide Ellipse | `929003058801`, `LCZ001` |
| Lightguide Globe Large G40 | `929003059001`, `LCO006` |
| Lightguide Globe Small G30 | `929003058901`, `LCO003` |
| Lightguide Triangle | `929003059101`, `LCY001` |
| Lightstrip Outdoor | `LST003`, `LST004` |
| Lightstrip Outdoor 2 meter | `LCL002` |
| Lightstrip Outdoor 5 meter | `LCL003` |
| Lightstrip Plus V4 | `LCL001`, `LCL006` |
| LightStrips | `LST001` |
| LightStrips Plus | `LST002` |
| Lily Outdoor Spot | `LCS001`, `1741430P7`, `1741530P7`, `1742830P7` |
| Lily Outdoor XL Spotlight | `1746230P7` |
| Lucca Outdoor Pedestal | `LWW001`, `1740293P0`, `LWF001` |
| Lucca Outdoor Post | `LWW002`, `1740393P0`, `LWF002` |
| Mickey Mouse Bloom/Aura Living Colors | `LLC013` |
| Milliskin GU10 Recessed Spotlight White Ambiance | `5041131P7`, `5041148P7`, `5042131P7`, `5041131P9`, `5041148P9`, `5042148P9` |
| Nyro Outdoor Pedestal | `1745530P7` |
| Nyro Outdoor Wall Light | `1745630P7` |
| Phoenix Downlight | `HML006` |
| Phoenix Pendant | `LLM010`, `LLM011`, `LLM012` |
| Phoenix Table | `LLM010`, `LLM011`, `LLM012` |
| Phoenix Wall Light | `HML004` |
| Play Lightbar | `LCT024`, `440400982841`, `440400982842` |
| Resonate Outdoor Wall Light | `1746447P7`, `1746430P7` |
| Runner Spotlights | `5309030P9`, `5309031P9`, `5309030P6`, `5309031P6`, `5309230P6`, `5309231P6`, `5309330P6`, `5309331P6` |
| Sana Wall Light | `LCW001`, `4090130P9`, `4090131P9` |
| Signe Floor Light | `LCF003`, `4080248P9` |
| Spot Ambiance | `LTW013`, `LTW014` |
| Still Ceiling | `LTC003`, `3261330P6`, `3261331P6` |
| Struana Ceiling | `LTC012`, `3418931P6` |
| Surimu Rectangle Panel | `929002966501` |
| Surimu Square Panel | `929002966401` |
| Tuar Outdoor Wall Light | `1740447P0` |
| Turaco Outdoor Wall light | `LWW003`, `1647293P0` |
| Welcome Outdoor Floodlight | `1743630P7` |
| Wellner | `4440156P6` |
| Wellness | `929003054001` |

#### Sensors (5)

| Device | Zigbee model ID |
| --- | --- |
| Contact sensor | `SOC001` |
| Motion Sensor | `SML001` |
| Occupancy Sensor | `SML001`, `SML003`, `9290030657` |
| Outdoor Occupancy Sensor | `SML002`, `9290019758`, `SML004` |
| Outdoor Sensor | `SML002`, `9290019758` |

#### Switches and remotes (6)

| Device | Zigbee model ID |
| --- | --- |
| Dimmer Switch (Gen 1 & 2) | `RWL020`, `RWL021` |
| Dimmer Switch (Gen 3) | `RWL022` |
| Hue Wall Switch Module | `RDM001`, `RDM004` |
| Hue Wall Switch Module - Wired | `ROM002` |
| Smart Button | `ROM001`, `RDM003` |
| Tap Dial Switch | `RDM002` |

#### Plugs (1)

| Device | Zigbee model ID |
| --- | --- |
| Smart Plug | `LOM001`, `LOM002`, `LOM005`, `LOM006`, `LOM007`, `LOM008` |
</details>

Does your device report a model ID that is not listed? It is often the same hardware in a new
package, and adding the ID to an existing driver is enough — see
[Adding support for a new device](#adding-support-for-a-new-device).

## Troubleshooting

### A light will not pair

It is almost always still joined to another Zigbee network. Remove it from the Hue Bridge or Hue
Bluetooth app first, or factory reset the light: switch it off and on six times, or hold a Hue
Dimmer Switch's on and off buttons together within a few centimetres of the light.

### A device pairs but shows the wrong capabilities

Homey picked a driver whose model ID matches, but the device is a different variant. Remove it,
then add it again with the driver that names your exact product. If no driver fits, open an issue
with the model ID.

### A sensor stops reporting after a while

Check the battery and the mesh. Battery devices do not route, so they need a mains-powered Zigbee
device — a Hue light, for example — within range to hop through.

### Battery level stays empty on a portable light

The Hue Go and Go portable table lamp do not report their battery over Zigbee at all. Their
`powerConfiguration` cluster implements no attributes, so there is nothing to read; the Hue app
does not show it either. This is a hardware limitation, not a missing driver feature.

### Turning on verbose Zigbee logging

Every ZCL frame can be logged, which is what you want when diagnosing a device that misbehaves.
It is off by default because it is extremely noisy.

In `app.js`, uncomment:

```js
debug(true);
```

Then run the app from source (`homey app run`) and reproduce the problem. Turn it back off before
committing — note that `debug()` is a global switch, so enabling it anywhere enables it everywhere.

## Development

```bash
git clone https://github.com/WebBuildsNL/com.philips.hue.zigbee.git
cd com.philips.hue.zigbee
npm install

homey app run        # run against your Homey, logs stream to your terminal
homey app validate --level publish
homey app install    # install the local build onto your Homey
```

`homey app run` temporarily replaces the installed app, and restores it when you stop it. Devices
re-initialise both times.

### Layout

| Path | What lives there |
| --- | --- |
| `app.js` | App entry point, registers the flow card run listeners |
| `drivers/Light.js` | Base class for every light driver |
| `drivers/Plug.js` | Base class for the smart plug |
| `drivers/<model>/` | One folder per driver: `driver.compose.json`, `device.js`, assets |
| `lib/` | Hue manufacturer-specific Zigbee cluster definitions |
| `.homeycompose/` | Shared app manifest, driver templates and flow cards |
| `app.json` | Generated by Homey Compose — do not edit by hand |

Anything shared between drivers belongs in `.homeycompose/`; `app.json` is assembled from it at
build time and your edits there will be overwritten.

## Adding support for a new device

Most "new" Hue products are existing hardware with a fresh model ID.

1. Pair the device and find its `modelId` in Homey's developer tools, under **Zigbee**.
2. Look for a driver for the same kind of light or sensor. If you find one, add your model ID to
   the `zigbee.productId` array in its `driver.compose.json` and you are done.
3. If nothing fits, copy the closest driver folder, rename it to the model ID, and adjust
   `driver.compose.json`: the name, the `$extends` template, the endpoints and clusters, and the
   energy figures.
4. Run `homey app validate --level publish`, test against the real device, and open a pull request.

The driver templates in `.homeycompose/drivers/templates/` cover the usual light types:
`light_color_ambiance`, `light_color`, `light_white_ambiance`, `light_white_temperature` and
`light_white`.

## Project history

This app has been passed along a few times, and this repository is the current fork:

| | |
| --- | --- |
| Original author | Sebastian Johansson |
| Transferred April 2020 | [Johan Bendz](https://github.com/JohanBendz/com.philips.hue.zigbee) |
| Continued 2026 | [Robert Raaijmakers](https://github.com/robertraaijmakers/com.philips.hue.zigbee) |
| This fork | [WebBuildsNL](https://github.com/WebBuildsNL/com.philips.hue.zigbee) |

The fork exists because the original repository is no longer maintained. Pull requests that were
left open upstream have been merged here.

See [CHANGELOG.md](CHANGELOG.md) for the full release history.

## Credits

Sebastian Johansson wrote the original app, and Johan Bendz maintained it for years — the bulk of
the 152 drivers here is their work, plus that of everyone who contributed a device over the years.

Icons by [Richard Slater](https://thenounproject.com/richard.slater).

## License

[MIT](LICENSE)
