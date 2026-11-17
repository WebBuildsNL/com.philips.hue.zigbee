'use strict';

const { Cluster, ZCLDataTypes } = require('zigbee-clusters');

const SIGNIFY_MANUFACTURER_ID = 0x100B;

// Philips Hue manufacturer-specific cluster 0xFC03. Newer Hue lights take effects, effect
// speed and gradients through its single command, which carries a raw payload built by
// lib/HueEffects.js. Same cluster as zigbee2mqtt's manuSpecificPhilips2 and ZHA's
// PhilipsHueLightCluster.
class HueEffectsCluster extends Cluster {

  static get ID() {
    return 0xFC03; // 64515
  }

  static get NAME() {
    return 'hueEffects';
  }

  static get ATTRIBUTES() {
    return {
      state: { id: 0x0002, type: ZCLDataTypes.octstr, manufacturerId: SIGNIFY_MANUFACTURER_ID },
    };
  }

  static get COMMANDS() {
    return {
      multiColor: {
        id: 0x00,
        manufacturerId: SIGNIFY_MANUFACTURER_ID,
        args: {
          data: ZCLDataTypes.buffer,
        },
      },
    };
  }

}

Cluster.addCluster(HueEffectsCluster);

module.exports = HueEffectsCluster;
