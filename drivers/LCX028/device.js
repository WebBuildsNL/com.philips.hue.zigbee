"use strict";

const Light = require("../Light.js");
require("../../lib/HueEffectsCluster");
const HueEffects = require("../../lib/HueEffects");
const GRADIENT_SCENES = require("../../lib/HueGradientScenes");

// Hue Festavia Globe outdoor string lights, every length. The driver ID matches the
// upstream JohanBendz app, so a string paired with that app keeps its driver here.

// The strings report a physical colour temperature range of 50-1000 mired (20000-1000 K).
// homey-zigbeedriver spreads light_temperature linearly over that range, which puts more
// than half of the slider below 2000 K. Use the 153-500 mired (6500-2000 K) range of the
// other Hue colour lights instead.
const COLOR_TEMP_MIN_MIREDS = 153;
const COLOR_TEMP_MAX_MIREDS = 500;

// Philips lists 0.5 W standby for every length. The driver manifest holds the 14 m figure,
// which covers LCX028 and its US twin LCX025. LCX024 (US 91 ft) has no published figure
// and falls back to that default.
const approximation = usageOn => ({ approximation: { usageOn, usageOff: 0.5 } });

// Fade used by the Hue app and by the stored gradient scenes, in deciseconds.
const DEFAULT_FADE_DS = 4;

// Disco mode sends a new gradient on every beat. The fastest beat stays well under the
// rate at which a single Hue light starts dropping commands.
const DISCO_SLOWEST_MS = 4000;
const DISCO_FASTEST_MS = 500;
const DISCO_COLORS = 5;
const DISCO_MAX_FAILURES = 3;

// "Own colours" before anything was set through a flow or the widget.
const DEFAULT_GRADIENT = { colors: ['#FF3B30', '#FFCC00', '#34C759', '#007AFF', '#AF52DE'], style: 'linear' };

// Picker entries of the festavia_mode capability, see .homeycompose/capabilities.
const MODE_NORMAL = 'normal';
const MODE_CUSTOM = 'custom';
const PICKER_EFFECTS = ['candle', 'fireplace', 'prism', 'sparkle', 'opal', 'glisten', 'underwater', 'cosmos', 'sunbeam', 'enchant'];
const PICKER_SCENES = ['silent_night', 'under_the_tree', 'festive_fun', 'golden_star', 'rosy_sparkle', 'colour_burst', 'savanna_sunset', 'tropical_twilight', 'galaxy', 'blue_lagoon'];
const DISCO_MODES = ['party', 'chase'];
const DEFAULT_SPEED_PERCENT = 50;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const toSpeed = value => (typeof value === 'number' && Number.isFinite(value) ? clamp(value, 0, 1) : 0.5);
const discoInterval = speed => Math.round(DISCO_SLOWEST_MS * (DISCO_FASTEST_MS / DISCO_SLOWEST_MS) ** toSpeed(speed));

class LCX028 extends Light {

    get energyMap() {
        return {
            LCX029: approximation(8.6), // EU 7 m, 10 bulbs
            LCX026: approximation(8.6), // US 22 ft, 8 bulbs: no published figure, EU 7 m value
            LCX027: approximation(25.6), // EU 21 m, 30 bulbs
        };
    }

    async onNodeInit(args) {
        await super.onNodeInit(args);

        // Set on every init: the base class stores the device's own range when it first
        // reads the colour cluster, and Light.js reads these values for power-on settings.
        await this.setStoreValue('colorTempMin', COLOR_TEMP_MIN_MIREDS);
        await this.setStoreValue('colorTempMax', COLOR_TEMP_MAX_MIREDS);

        // Strings paired before these capabilities existed get them added here.
        for (const [capability, initial] of [['festavia_mode', MODE_NORMAL], ['festavia_speed', DEFAULT_SPEED_PERCENT]]) {
            if (!this.hasCapability(capability)) await this.addCapability(capability);
            if (this.getCapabilityValue(capability) == null) await this.setCapabilityValue(capability, initial).catch(this.error);
        }
        this.registerCapabilityListener('festavia_mode', value => this.applyShowMode(value));
        this.registerCapabilityListener('festavia_speed', value => this.applyShowSpeed(value / 100));
    }

    onDeleted() {
        this._stopDisco();
        super.onDeleted();
    }

    async onUninit() {
        this._stopDisco();
    }

    // Plain Homey controls end disco mode and any running Hue effect, so the string does
    // what the user just asked for.

    async changeOnOff(onoff) {
        if (!onoff) {
            this._stopDisco();
            this._effect = null;
            await this._setShowMode(MODE_NORMAL);
        }
        return super.changeOnOff(onoff);
    }

    async changeColor(...args) {
        await this._stopDynamicModes();
        await this._setShowMode(MODE_NORMAL);
        return super.changeColor(...args);
    }

    async changeColorTemperature(...args) {
        await this._stopDynamicModes();
        await this._setShowMode(MODE_NORMAL);
        return super.changeColorTemperature(...args);
    }

    // Actions shared by the flow cards, the light show picker and the widget

    /**
     * Spreads up to five colours along the string.
     * @param {object} opts
     * @param {string[]} opts.colors hex colours, such as "#FF0000"
     * @param {string} opts.style linear, scattered or mirrored
     * @param {number} [opts.durationMs] fade time
     */
    async setGradient({ colors, style, durationMs }) {
        const xy = colors.map(hex => {
            const value = HueEffects.hexToXy(hex);
            if (!value) throw new Error(this.homey.__('festavia.errors.black'));
            return value;
        });
        await this._stopDynamicModes();
        await this._sendHueState({
            onOff: true,
            fadeSpeed: durationMs == null ? DEFAULT_FADE_DS : Math.round(durationMs / 100),
            gradient: { colors: xy, style },
            // A scale equal to the number of colours spreads them over the whole string.
            gradientParams: { scale: xy.length, offset: 0 },
        });
        await this.setStoreValue('customShow', { type: 'gradient', colors, style });
        await this._markOn();
        await this._setShowMode(MODE_CUSTOM);
    }

    async setGradientScene(sceneId) {
        const scene = GRADIENT_SCENES.find(item => item.id === sceneId);
        if (!scene) throw new Error(this.homey.__('festavia.errors.unknown_scene', { scene: sceneId }));
        await this._stopDynamicModes();
        await this.hueEffectsCluster.multiColor({ data: HueEffects.withOnOff(Buffer.from(scene.payload, 'hex')) });
        await this._markOn();
        if (PICKER_SCENES.includes(sceneId)) {
            await this._setShowMode(`scene_${sceneId}`);
        } else {
            // Scenes that are not in the picker become the "Own colours" entry.
            await this.setStoreValue('customShow', { type: 'scene', id: sceneId });
            await this._setShowMode(MODE_CUSTOM);
        }
    }

    /**
     * Starts one of the effects built into the light.
     * @param {string} effect key of HueEffects.EFFECTS
     * @param {number} [speed] 0 (slowest) to 1 (fastest)
     */
    async startEffect(effect, speed) {
        if (effect === 'none' || !(effect in HueEffects.EFFECTS)) {
            throw new Error(this.homey.__('festavia.errors.unknown_effect', { effect }));
        }
        this._stopDisco();
        await this._sendHueState({ onOff: true, effect, effectSpeed: toSpeed(speed) });
        this._effect = effect;
        await this._markOn();
        await this._setShowMode(PICKER_EFFECTS.includes(effect) ? `effect_${effect}` : null, toSpeed(speed));
    }

    async stopEffects() {
        this._stopDisco();
        await this._sendHueState({ effect: 'none' });
        this._effect = null;
        await this._setShowMode(MODE_NORMAL);
    }

    /**
     * Keeps sending new gradients until stopped.
     * @param {object} opts
     * @param {string} opts.mode party (random colours) or chase (a rainbow running along)
     * @param {number} [opts.speed] 0 (one beat per 4 s) to 1 (two beats per second)
     */
    async startDisco({ mode, speed }) {
        await this._stopDynamicModes();
        const run = { mode, interval: discoInterval(speed), beat: 0, failures: 0, timer: null, hue: Math.random() * 360 };
        this._disco = run;
        this.log('Disco mode started', { mode, interval: run.interval });

        // The first beat runs inside the caller, so a failure shows up in the flow or widget.
        try {
            await this._sendHueState(this._discoFrame(run));
        } catch (err) {
            this._stopDisco();
            throw err;
        }
        await this._markOn();
        await this._setShowMode(DISCO_MODES.includes(mode) ? `disco_${mode}` : null, toSpeed(speed));
        this._scheduleDiscoBeat(run);
    }

    /** Listener of the festavia_mode picker; also used by the widget. */
    async applyShowMode(mode) {
        if (mode === MODE_NORMAL) {
            await this._stopDynamicModes();
            await this._setShowMode(MODE_NORMAL);
            // Back to one colour for the whole string: the colour or temperature Homey shows.
            if (this.getCapabilityValue('light_mode') === 'temperature') {
                return super.changeColorTemperature(this.getCapabilityValue('light_temperature'));
            }
            return super.changeColor({
                hue: this.getCapabilityValue('light_hue'),
                saturation: this.getCapabilityValue('light_saturation'),
            });
        }
        if (mode === MODE_CUSTOM) {
            const saved = this.getStoreValue('customShow') || { type: 'gradient', ...DEFAULT_GRADIENT };
            if (saved.type === 'scene') return this.setGradientScene(saved.id);
            return this.setGradient({ colors: saved.colors, style: saved.style });
        }
        const [kind, ...rest] = String(mode).split('_');
        const name = rest.join('_');
        if (kind === 'scene') return this.setGradientScene(name);
        if (kind === 'effect') return this.startEffect(name, this._speed());
        if (kind === 'disco') return this.startDisco({ mode: name, speed: this._speed() });
        throw new Error(this.homey.__('festavia.errors.unknown_effect', { effect: mode }));
    }

    /** Listener of the festavia_speed slider; changes a running effect or disco on the fly. */
    async applyShowSpeed(speed) {
        const value = toSpeed(speed);
        if (this._disco) {
            this._disco.interval = discoInterval(value);
        } else if (this._effect) {
            await this._sendHueState({ onOff: true, effect: this._effect, effectSpeed: value });
        }
        // Homey stores the slider value only after this listener returns; store it now so
        // the widget gets the new speed.
        await this.setCapabilityValue('festavia_speed', Math.round(value * 100)).catch(this.error);
        this._emitShowState();
    }

    /** Snapshot for the widget. */
    getShowState() {
        const saved = this.getStoreValue('customShow');
        const gradient = saved && saved.type === 'gradient' ? saved : DEFAULT_GRADIENT;
        return {
            deviceId: typeof this.getId === 'function' ? this.getId() : null,
            name: this.getName(),
            available: this.getAvailable(),
            on: this.getCapabilityValue('onoff'),
            mode: this.getCapabilityValue('festavia_mode'),
            speed: this.getCapabilityValue('festavia_speed'),
            colors: gradient.colors,
            style: gradient.style,
        };
    }

    // Internals

    get hueEffectsCluster() {
        const cluster = this.zclNode && this.zclNode.endpoints[11] && this.zclNode.endpoints[11].clusters.hueEffects;
        if (!cluster) throw new Error(this.homey.__('festavia.errors.no_effects_cluster'));
        return cluster;
    }

    async _sendHueState(state) {
        return this.hueEffectsCluster.multiColor({ data: HueEffects.encodeState(state) });
    }

    async _markOn() {
        await this.setCapabilityValue('onoff', true).catch(this.error);
    }

    _speed() {
        const percent = this.getCapabilityValue('festavia_speed');
        return typeof percent === 'number' ? percent / 100 : DEFAULT_SPEED_PERCENT / 100;
    }

    /**
     * Mirrors the running show in the picker and the speed slider, and tells the widget.
     * @param {string|null} mode picker value, or null for a show the picker doesn't list
     * @param {number} [speed] 0-1
     */
    async _setShowMode(mode, speed) {
        if (this.hasCapability('festavia_mode')) {
            await this.setCapabilityValue('festavia_mode', mode).catch(this.error);
        }
        if (speed !== undefined && this.hasCapability('festavia_speed')) {
            await this.setCapabilityValue('festavia_speed', Math.round(speed * 100)).catch(this.error);
        }
        this._emitShowState();
    }

    _emitShowState() {
        try {
            Promise.resolve(this.homey.api.realtime('festavia_state', this.getShowState())).catch(() => {});
        } catch (err) {
            // No widget listening is fine.
        }
    }

    async _stopDynamicModes() {
        this._stopDisco();
        if (this._effect) {
            this._effect = null;
            await this._sendHueState({ effect: 'none' }).catch(err => this.error('Could not stop the Hue effect', err));
        }
    }

    _stopDisco() {
        const run = this._disco;
        if (!run) return;
        this._disco = null;
        if (run.timer) this.homey.clearTimeout(run.timer);
        this.log('Disco mode stopped');
    }

    _scheduleDiscoBeat(run) {
        if (this._disco !== run) return;
        run.timer = this.homey.setTimeout(async () => {
            if (this._disco !== run) return;
            run.beat += 1;
            try {
                await this._sendHueState(this._discoFrame(run));
                run.failures = 0;
            } catch (err) {
                run.failures += 1;
                this.error(`Disco beat failed (${run.failures}/${DISCO_MAX_FAILURES})`, err);
                if (run.failures >= DISCO_MAX_FAILURES) {
                    this._stopDisco();
                    await this._setShowMode(MODE_NORMAL);
                    return;
                }
            }
            // Scheduled after the command finished, so slow replies never pile up.
            this._scheduleDiscoBeat(run);
        }, run.interval);
    }

    _discoFrame(run) {
        const colors = [];
        if (run.mode === 'chase') {
            // Five rainbow colours, shifted half a position per beat, so they run along the string.
            run.hue = (run.hue + 360 / DISCO_COLORS / 2) % 360;
            for (let i = 0; i < DISCO_COLORS; i++) {
                colors.push(HueEffects.hsvToXy(run.hue + (i * 360) / DISCO_COLORS));
            }
            return {
                onOff: true,
                fadeSpeed: Math.round((run.interval * 0.9) / 100),
                gradient: { colors, style: 'linear' },
                gradientParams: { scale: DISCO_COLORS, offset: 0 },
            };
        }

        // Party: five fresh, well separated colours on every beat, scattered over the bulbs.
        const base = Math.random() * 360;
        for (let i = 0; i < DISCO_COLORS; i++) {
            colors.push(HueEffects.hsvToXy(base + (i * 360) / DISCO_COLORS + (Math.random() - 0.5) * 30));
        }
        return {
            onOff: true,
            fadeSpeed: clamp(Math.round((run.interval * 0.2) / 100), 1, 5),
            gradient: { colors, style: 'scattered' },
            gradientParams: { scale: DISCO_COLORS, offset: 0 },
        };
    }

}

module.exports = LCX028;
