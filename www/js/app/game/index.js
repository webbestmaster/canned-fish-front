import React, {Component} from 'react';
import {connect} from 'react-redux';
import user from './../../module/user';
import {find} from 'lodash';
import joystick from './../../module/joystick';
const PIXI = require('pixi.js');

class Game extends Component {
    constructor() {
        super();

        const view = this;

        view.state = {
            app: null,
            oldData: {
                units: []
            },
            data: {
                units: []
            }
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
                app.ticker.add(delta => view.draw(delta));
            });
        view.state.app = app;
    }

    draw(delta) {
        const view = this;
        const {data, oldData} = view.state;
        const {units} = data;
        let oldUnits = oldData.units;
        const {stage, renderer} = view.state.app;
        const userUnit = user.get('unit');
        const vector = joystick.get('vector');

        userUnit.x -= delta * vector.x;
        userUnit.y -= delta * vector.y;

        user.get('socket').emit('xy', userUnit);

        oldUnits = oldUnits.filter(oldUnit => {
            if (find(units, {id: oldUnit.id})) {
                return true;
            }
            stage.removeChild(oldUnit.sprite);
            return false;
        });

        units.forEach(unit => {
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
            unitSprite.anchor.set(0.5, 0.5);

            if (unit.id === user.get('id')) {
                stage.pivot.x = unit.x;
                stage.pivot.y = unit.y;
                stage.position.x = renderer.width / 2;
                stage.position.y = renderer.height / 2;
            }
        });

        view.state.oldData = data;
    }

    componentDidMount() {
        const view = this;

        view.initialize();

        user.onChange('update', data => {
            view.state.data = data;
        });
    }

    render() {
        return <div ref="wrapper">

        </div>;
    }
}

export default connect(
    state => ({}),
    {}
)(Game);

