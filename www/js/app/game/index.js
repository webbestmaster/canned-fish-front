/* global FPSMeter */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import user, {adjustUnitData} from './../../module/user';
import {find, filter, each} from 'lodash';
import joystick from './../../module/joystick';

const PIXI = require('pixi.js');

class Game extends Component {
    constructor() {
        super();

        const view = this;

        view.state = {
            app: null,
            oldData: {
                units: [],
                ts: 0
            },
            data: {
                units: [],
                ts: 0
            },
            fpsMeter: new FPSMeter()
        };
    }

    initialize() {
        const view = this;
        const {wrapper} = view.refs;
        const app = new PIXI.Application(800, 600);

        // resize screen
        function appOnResize() {
            const docElem = document.documentElement;

            app.renderer.resize(docElem.clientWidth, docElem.clientHeight);
        }

        appOnResize();
        window.addEventListener('resize', appOnResize, false);

        // joystick listen
        joystick.onChange('vector', vector => {
            user.get('socket').emit('xy', {
                vx: vector.x,
                vy: vector.y
            });
        });

        wrapper.appendChild(app.view);

        PIXI.loader
            .add('./assets/fish.json')
            .load(() => {
                let isNeeded = 0;

                app.ticker.add(delta => {
                    isNeeded += 1;
                    if (isNeeded % 3) {
                        return;
                    }
                    isNeeded = 0;
                    view.draw();
                });
            });
        view.state.app = app;
    }

    draw() {
        const view = this;
        const {state} = view;

        state.fpsMeter.tick();
        view.updateUnits();
        user.get('socket').emit('get-data');
        // view.updateDots();

        state.oldData = state.data;
    }

    updateUnits() {
        const view = this;
        const {state} = view;

        state.data = user.get('data');
        const {data, oldData} = state;
        const {units} = data;
        let oldUnits = oldData.units;
        const {stage, renderer} = state.app;
        const userId = user.get('id');

        oldUnits = filter(oldUnits, oldUnit => {
            if (find(units, {id: oldUnit.id})) {
                return true;
            }
            stage.removeChild(oldUnit.sprite);
            return false;
        });

        each(units, unit => {
            const oldUnit = find(oldUnits, {id: unit.id});
            const deltaT = data.ts - unit.ts;
            let unitSprite = null;

            if (oldUnit) {
                unitSprite = oldUnit.sprite;
            } else {
                unitSprite = PIXI.Sprite.fromFrame('fish-' + parseInt(unit.id.substr(-3), 10) % 5 + '.png');
                stage.addChild(unitSprite);
            }

            Object.assign(unit, {sprite: unitSprite});

            // 16! see back end way for count
            unit.x += unit.vx * deltaT / 16; // eslint-disable-line no-param-reassign
            unit.y += unit.vy * deltaT / 16; // eslint-disable-line no-param-reassign

            Object.assign(unit, adjustUnitData(unit));

            unitSprite.x = unit.x;
            unitSprite.y = unit.y;
            unitSprite.anchor.x = 0.5;
            unitSprite.anchor.y = 0.5;

            if (unit.id === userId) {
                stage.pivot.x = unit.x;
                stage.pivot.y = unit.y;
                stage.position.x = renderer.width / 2;
                stage.position.y = renderer.height / 2;
            }
        });
    }

    /*
        updateDots() {
            const view = this;
            const {state} = view;
            const {data, oldData} = state;
            const {dots} = data;
            const {stage} = state.app;
            let oldDots = oldData.dots;

            oldDots = filter(oldDots, oldDot => {
                if (find(dots, [oldDot[0], oldDot[1]])) {
                    return true;
                }
                stage.removeChild(oldDot[2]);
                return false;
            });

            each(dots, dot => {
                const oldDot = find(oldDots, [dot[0], dot[1]]);
                let dotSprite = null;

                if (oldDot) {
                    dotSprite = oldDot[2];
                } else {
                    dotSprite = PIXI.Sprite.fromFrame('fish-0.png');
                    dotSprite.scale.x = 0.1;
                    dotSprite.scale.y = 0.1;
                    dotSprite.anchor.x = 0.5;
                    dotSprite.anchor.y = 0.5;
                    stage.addChild(dotSprite);
                }

                dot[2] = dotSprite; // eslint-disable-line no-param-reassign

                dotSprite.x = dot[0];
                dotSprite.y = dot[1];
            });
        }
    */

    componentDidMount() {
        const view = this;

        view.initialize();

        user.onChange('update', data => {
            view.state.data = data;
        });
    }

    render() {
        return <div ref="wrapper"/>;
    }
}

export default connect(
    state => ({}),
    {}
)(Game);

