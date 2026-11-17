'use strict';

const { ZigBeeDriver } = require('homey-zigbeedriver');
const GRADIENT_SCENES = require('../../lib/HueGradientScenes');

class FestaviaGlobeDriver extends ZigBeeDriver {

    async onInit() {
        const flow = this.homey.flow;

        flow.getActionCard('LCX028_set_colors').registerRunListener(args => {
            const colors = [args.color1, args.color2, args.color3, args.color4, args.color5]
                .filter(color => typeof color === 'string' && color !== '');
            return args.device.setGradient({ colors, style: args.style, durationMs: args.duration });
        });

        flow.getActionCard('LCX028_gradient_scene')
            .registerRunListener(args => args.device.setGradientScene(args.scene.id))
            .registerArgumentAutocompleteListener('scene', async query => {
                const search = (query || '').trim().toLowerCase();
                return GRADIENT_SCENES
                    .filter(scene => scene.name.toLowerCase().includes(search))
                    .map(scene => ({ name: scene.name, id: scene.id }));
            });

        flow.getActionCard('LCX028_start_effect')
            .registerRunListener(args => args.device.startEffect(args.effect, args.speed));

        flow.getActionCard('LCX028_start_disco')
            .registerRunListener(args => args.device.startDisco({ mode: args.mode, speed: args.speed }));

        flow.getActionCard('LCX028_stop_effects')
            .registerRunListener(args => args.device.stopEffects());
    }

}

module.exports = FestaviaGlobeDriver;
