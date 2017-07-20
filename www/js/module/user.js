/* global io */
const MainModel = require('../lib/main-model');

const attr = {
    socket: 'socket',
    update: 'update',
    unit: 'unit',
    dots: 'dots'
};

class User extends MainModel {
    constructor(data) {
        super(data);

        const user = this;

        user.connectToServer();
        user.set('unit', {x: 0, y: 0, size: 10});
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
        });

        socket.on('dots', userData => {
            user.set(attr.dots, userData);
            console.log('dots', userData);
            console.log(user);
        });

        socket.on('update', data => {
            data.dots = user.get(attr.dots); // eslint-disable-line no-param-reassign
            user.trigger(attr.update, data);
        });


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
