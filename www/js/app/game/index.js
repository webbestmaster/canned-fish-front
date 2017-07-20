/* global FPSMeter */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import user from './../../module/user';
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
                dots: [],
                timestamp: 0
            },
            data: {
                units: [],
                dots: [],
                timestamp: 0
            },
            fpsMeter: new FPSMeter()
        };
    }

    initialize() {
        const view = this;
        const {wrapper} = view.refs;
        const app = new PIXI.Application(800, 600);

        function appOnResize() {
            const docElem = document.documentElement;

            app.renderer.resize(docElem.clientWidth, docElem.clientHeight);
        }

        appOnResize();
        window.addEventListener('resize', appOnResize, false);

        wrapper.appendChild(app.view);

        PIXI.loader
            .add('./assets/fish.json')
            .load(() => {
                // app.ticker.speed = ;
                // let odd = 0;
                app.ticker.add(delta => {
                    // odd = (odd + 1) % 2;
                    // if (odd) {
                    //     return;
                    // }
                    view.draw();
                    view.updateUnitXY(delta);
                });
            });
        view.state.app = app;
    }

    updateUnitXY(delta) {
        const userUnit = user.get('unit');
        const vector = joystick.get('vector');

        userUnit.x -= delta * vector.x;
        userUnit.y -= delta * vector.y;

        // I can forget pass all parameters
        user.get('socket').emit('xy', Object.assign({}, userUnit, {
            x: parseInt(userUnit.x, 10),
            y: parseInt(userUnit.y, 10)
        }));
    }

    draw() {
        const view = this;
        const {state} = view;

        state.fpsMeter.tick();
        view.updateUnits();
        view.updateDots();

        state.oldData = state.data;
    }

    updateUnits() {
        const view = this;
        const {state} = view;
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
            let unitSprite = null;

            if (oldUnit) {
                unitSprite = oldUnit.sprite;
            } else {
                unitSprite = PIXI.Sprite.fromFrame('fish-' + parseInt(unit.id.substr(-3), 10) % 5 + '.png');
                stage.addChild(unitSprite);
            }

            Object.assign(unit, {sprite: unitSprite});

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

