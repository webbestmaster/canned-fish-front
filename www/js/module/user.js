/* global io */
const MainModel = require('../lib/main-model');
const gameData = require('./../app/game/data.json');

const attr = {
    socket: 'socket',
    update: 'update',
    unit: 'unit',
    data: 'data'
    // oldData: 'oldData'
};

class User extends MainModel {
    constructor(data) {
        super(data);

        const user = this;

        user.connectToServer();
        user.set(attr.unit, {x: 0, y: 0});
        user.set(attr.data, {units: [], ts: 0});
    }

    connectToServer() {
        const user = this;
        const socket = io();

        user.set(attr.socket, socket);

        socket.on('connect', () => {
            console.log('connect');
        });

        socket.on('create-user', userData => {
            user.set(userData);
            console.log('user data', userData);
            console.log(user);
            socket.emit('xy', Object.assign(
                {
                    vx: 0,
                    vy: 0,
                    // id: user.get('id'),
                    ...user.get(attr.unit)
                }
            ));
        });

        socket.on('data', data => {
            // user.set(attr.oldData, user.get(attr.data));
            user.set(attr.data, data);
            // console.log('data --->', data);
        });


        // socket.on('dots', userData => {
        //     user.set(attr.dots, userData);
        //     console.log('dots', userData);
        //     console.log(user);
        // });

        // socket.on('update', data => {
        //     data.dots = user.get(attr.dots); // eslint-disable-line no-param-reassign
        //     user.trigger(attr.update, data);
        // });

        /*
         socket.on('chat message', function(data){
         console.log('chat message', data);
         });
         socket.on('disconnect', function(){
         console.log('disconnect');
         });
         */
    }
}

export {User};
export default new User();

// helper
export function adjustUnitData(unitData) {
    const maxX = gameData.sea.width;
    const maxY = gameData.sea.height;
    const minX = 0;
    const minY = 0;
    const {x, y} = unitData;

    return {
        x: Math.max(Math.min(x, maxX), minX),
        y: Math.max(Math.min(y, maxY), minY)
    };
}
