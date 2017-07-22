import MainModel from './../lib/main-model';

const attr = {
    vector: 'vector'
};

class Joystick extends MainModel {
    constructor() {
        super();

        const joystick = this;

        joystick.set(attr.vector, {x: 0, y: 0});

        joystick.initialize();
    }

    // TODO: add case for other device
    initialize() {
        const joystick = this;

        joystick.initializePC();
    }

    initializePC() {
        const joystick = this;

        document.body.addEventListener('click', data => { // mousemove
            const maxDelta = 100;
            const docElem = document.documentElement;
            const centerX = docElem.clientWidth / 2;
            const centerY = docElem.clientHeight / 2;
            const x = data.clientX - centerX;
            const y = data.clientY - centerY;

            joystick.set(attr.vector, {
                x: Math.min(Math.max(-maxDelta, x), maxDelta) / maxDelta,
                y: Math.min(Math.max(-maxDelta, y), maxDelta) / maxDelta
            });
        }, false);
    }
}

export default new Joystick();
export {Joystick};
