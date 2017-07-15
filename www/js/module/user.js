const MainModel = require('../lib/main-model');

class User extends MainModel {
    constructor(data) {
        super(data);

        const user = this;

        user.connectToServer();
    }

    connectToServer() {
        const user = this;
        const socket = io();

        socket.on('connect', () => {
            console.log('connect');
        });
        socket.on('create-user', userData => {
            user.set(userData);
            console.log('user data', userData);
            console.log(user);
        });

        // TODO: render here
        socket.on('update', data => {
            console.log('data', data);
        });

        // TODO: remove this
        setInterval(() => socket.emit('xy', {x: Math.random(), y: Math.random()}), 100);

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
