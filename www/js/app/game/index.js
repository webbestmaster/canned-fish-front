import React, {Component} from 'react';
import {connect} from 'react-redux';
import user from './../../module/user';
import {find} from 'lodash';
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

        wrapper.appendChild(app.view);

        PIXI.loader.add('./assets/fish.json').load(() => {
            app.ticker.add(() => view.draw());
        });
        view.state.app = app;
    }

    draw() {
        const view = this;
        const {data, oldData} = view.state;
        const {units} = data;
        let oldUnits = oldData.units;
        const {stage} = view.state.app;

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
                unitSprite = PIXI.Sprite.fromFrame('fish-1.png');
                stage.addChild(unitSprite);
            }

            Object.assign(unit, {sprite: unitSprite});

            unitSprite.x = unit.x;
            unitSprite.y = unit.y;
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

