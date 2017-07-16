/* global io */
const MainModel = require('../lib/main-model');

const attr = {
    socket: 'socket',
    update: 'update',
    unit: 'unit'
};

class User extends MainModel {
    constructor(data) {
        super(data);

        const user = this;

        user.connectToServer();
        user.set('unit', {x: 0, y: 0});
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

        socket.on('update', data => user.trigger(attr.update, data));


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
