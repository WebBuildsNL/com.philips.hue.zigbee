'use strict';

const GRADIENT_SCENES = require('../../lib/HueGradientScenes');

const STYLES = ['linear', 'mirrored', 'scattered'];

// The widget passes the Homey device ID it was configured with. Without a match, a Homey
// with a single Festavia Globe still works.
function findDevice(homey, deviceId) {
  const devices = homey.drivers.getDriver('LCX028').getDevices();
  const match = devices.find(device => typeof device.getId === 'function' && device.getId() === deviceId);
  if (match) return match;
  if (devices.length === 1) return devices[0];
  throw new Error(homey.__('festavia.errors.widget_no_device'));
}

module.exports = {
  async getState({ homey, query }) {
    return findDevice(homey, query.deviceId).getShowState();
  },

  async getScenes() {
    return GRADIENT_SCENES.map(({ id, name }) => ({ id, name }));
  },

  async setColors({ homey, query, body }) {
    const colors = Array.isArray(body.colors) ? body.colors.filter(color => typeof color === 'string') : [];
    if (colors.length < 2 || colors.length > 5) throw new Error('Pick two to five colours');
    const style = STYLES.includes(body.style) ? body.style : 'linear';
    const device = findDevice(homey, query.deviceId);
    await device.setGradient({ colors, style });
    return device.getShowState();
  },

  async setScene({ homey, query, body }) {
    const device = findDevice(homey, query.deviceId);
    await device.setGradientScene(String(body.id));
    return device.getShowState();
  },

  async setMode({ homey, query, body }) {
    const device = findDevice(homey, query.deviceId);
    await device.triggerCapabilityListener('festavia_mode', String(body.mode));
    return device.getShowState();
  },

  async setSpeed({ homey, query, body }) {
    const device = findDevice(homey, query.deviceId);
    const speed = Math.min(Math.max(Math.round(Number(body.speed) / 5) * 5, 0), 100);
    await device.triggerCapabilityListener('festavia_speed', speed);
    return device.getShowState();
  },
};
