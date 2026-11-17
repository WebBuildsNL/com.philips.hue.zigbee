'use strict';

// Payload encoder for the Hue cluster 0xFC03 (see lib/HueEffectsCluster.js).
//
// Wire format, from https://github.com/chrivers/bifrost/blob/master/doc/hue-zigbee-format.md:
// a little-endian u16 with flags, then only the fields whose flag is set, always in this
// order: on/off, brightness, mired, xy, fade speed, effect type, gradient colours, effect
// speed, gradient parameters. The order is not the order of the flag bits.

const FLAGS = {
  onOff: 0x0001,
  brightness: 0x0002,
  mired: 0x0004,
  xy: 0x0008,
  fadeSpeed: 0x0010,
  effect: 0x0020,
  gradientParams: 0x0040,
  effectSpeed: 0x0080,
  gradient: 0x0100,
};

const EFFECTS = {
  none: 0x00,
  candle: 0x01,
  fireplace: 0x02,
  prism: 0x03,
  sunrise: 0x09,
  sparkle: 0x0a,
  opal: 0x0b,
  glisten: 0x0c,
  sunset: 0x0d,
  underwater: 0x0e,
  cosmos: 0x0f,
  sunbeam: 0x10,
  enchant: 0x11,
};

const GRADIENT_STYLES = {
  linear: 0x00,
  scattered: 0x02,
  mirrored: 0x04,
};

// The device rejects the whole message when a gradient has more than 9 colours.
const MAX_GRADIENT_COLORS = 9;

// Gradient colours use 12 bits per axis, scaled to these maxima instead of 0-1.
const GRADIENT_MAX_X = 0.7347;
const GRADIENT_MAX_Y = 0.8264;

const WHITE_POINT = { x: 0.3127, y: 0.3290 };

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function u16(value) {
  const buf = Buffer.alloc(2);
  buf.writeUInt16LE(clamp(Math.round(value), 0, 0xFFFF));
  return buf;
}

function encodeGradientColors(colors, style) {
  if (!Array.isArray(colors) || colors.length < 1 || colors.length > MAX_GRADIENT_COLORS) {
    throw new RangeError(`A gradient needs 1 to ${MAX_GRADIENT_COLORS} colours, got ${colors && colors.length}`);
  }
  const styleByte = GRADIENT_STYLES[style];
  if (styleByte === undefined) throw new RangeError(`Unknown gradient style: ${style}`);

  const buf = Buffer.alloc(5 + colors.length * 3);
  buf[0] = 4 + colors.length * 3; // size of everything after this byte
  buf[1] = colors.length << 4;
  buf[2] = styleByte;
  // buf[3] and buf[4] are reserved and stay 0
  colors.forEach(({ x, y }, i) => {
    const x12 = Math.round(clamp(x / GRADIENT_MAX_X, 0, 1) * 0xFFF);
    const y12 = Math.round(clamp(y / GRADIENT_MAX_Y, 0, 1) * 0xFFF);
    const p = 5 + i * 3;
    buf[p] = x12 & 0xFF;
    buf[p + 1] = ((y12 & 0x0F) << 4) | ((x12 >> 8) & 0x0F);
    buf[p + 2] = (y12 >> 4) & 0xFF;
  });
  return buf;
}

/**
 * Builds a 0xFC03 payload. Every property is optional; leave one out to keep the light's
 * current value for it.
 * @param {object} state
 * @param {boolean} [state.onOff]
 * @param {number} [state.brightness] 1-254
 * @param {number} [state.mired]
 * @param {{x: number, y: number}} [state.xy] CIE 1931 coordinates, 0-1
 * @param {number} [state.fadeSpeed] transition in deciseconds
 * @param {string} [state.effect] key of EFFECTS
 * @param {{colors: {x: number, y: number}[], style: string}} [state.gradient]
 * @param {number} [state.effectSpeed] 0 (slowest) to 1 (fastest)
 * @param {{scale: number, offset: number}} [state.gradientParams] in lights, steps of 1/8
 * @returns {Buffer}
 */
function encodeState(state) {
  let flags = 0;
  const parts = [];

  if (state.onOff !== undefined) {
    flags |= FLAGS.onOff;
    parts.push(Buffer.from([state.onOff ? 1 : 0]));
  }
  if (state.brightness !== undefined) {
    flags |= FLAGS.brightness;
    parts.push(Buffer.from([clamp(Math.round(state.brightness), 1, 254)]));
  }
  if (state.mired !== undefined) {
    flags |= FLAGS.mired;
    parts.push(u16(state.mired));
  }
  if (state.xy !== undefined) {
    flags |= FLAGS.xy;
    parts.push(u16(clamp(state.xy.x, 0, 1) * 0xFFFF), u16(clamp(state.xy.y, 0, 1) * 0xFFFF));
  }
  if (state.fadeSpeed !== undefined) {
    flags |= FLAGS.fadeSpeed;
    parts.push(u16(state.fadeSpeed));
  }
  if (state.effect !== undefined) {
    const effect = EFFECTS[state.effect];
    if (effect === undefined) throw new RangeError(`Unknown effect: ${state.effect}`);
    flags |= FLAGS.effect;
    parts.push(Buffer.from([effect]));
  }
  if (state.gradient !== undefined) {
    flags |= FLAGS.gradient;
    parts.push(encodeGradientColors(state.gradient.colors, state.gradient.style));
  }
  if (state.effectSpeed !== undefined) {
    flags |= FLAGS.effectSpeed;
    parts.push(Buffer.from([Math.round(clamp(state.effectSpeed, 0, 1) * 255)]));
  }
  if (state.gradientParams !== undefined) {
    flags |= FLAGS.gradientParams;
    const { scale, offset } = state.gradientParams;
    parts.push(Buffer.from([clamp(Math.round(scale * 8), 0, 255), clamp(Math.round(offset * 8), 0, 255)]));
  }

  return Buffer.concat([u16(flags), ...parts]);
}

/**
 * Adds "turn on" to a stored payload, such as a gradient scene. On/off is the first field
 * on the wire, so its byte goes straight after the flags.
 * @param {Buffer} payload
 * @returns {Buffer}
 */
function withOnOff(payload) {
  const flags = payload.readUInt16LE(0);
  if (flags & FLAGS.onOff) return payload;
  return Buffer.concat([u16(flags | FLAGS.onOff), Buffer.from([1]), payload.subarray(2)]);
}

function parseHexColor(hex) {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!match) throw new TypeError(`Not a hex colour: ${hex}`);
  const n = parseInt(match[1], 16);
  return { r: (n >> 16) & 0xFF, g: (n >> 8) & 0xFF, b: n & 0xFF };
}

/**
 * sRGB to CIE xy with the gamma correction and Wide RGB D65 matrix from Philips' Hue
 * developer documentation. Returns null for black, which has no chromaticity.
 */
function rgbToXy({ r, g, b }) {
  const linear = c => {
    const v = c / 255;
    return v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92;
  };
  const [lr, lg, lb] = [linear(r), linear(g), linear(b)];
  const X = lr * 0.664511 + lg * 0.154324 + lb * 0.162028;
  const Y = lr * 0.283881 + lg * 0.668433 + lb * 0.047685;
  const Z = lr * 0.000088 + lg * 0.072310 + lb * 0.986039;
  const sum = X + Y + Z;
  if (sum === 0) return null;
  return { x: X / sum, y: Y / sum };
}

function hexToXy(hex) {
  return rgbToXy(parseHexColor(hex));
}

/** Hue 0-360, saturation and value 0-1, to CIE xy. */
function hsvToXy(hue, saturation = 1, value = 1) {
  const c = value * saturation;
  const h = ((hue % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const [r1, g1, b1] = h < 1 ? [c, x, 0] : h < 2 ? [x, c, 0] : h < 3 ? [0, c, x]
    : h < 4 ? [0, x, c] : h < 5 ? [x, 0, c] : [c, 0, x];
  const m = value - c;
  return rgbToXy({ r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 }) || WHITE_POINT;
}

module.exports = {
  EFFECTS,
  GRADIENT_STYLES,
  MAX_GRADIENT_COLORS,
  encodeState,
  withOnOff,
  hexToXy,
  hsvToXy,
};
