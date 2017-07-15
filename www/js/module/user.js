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

/*
        socket.on('chat message', function(data){
            console.log('chat message', data);
        });
        socket.on('disconnect', function(){
            console.log('disconnect');
        });
        setTimeout(() => socket.emit('message from front', 'math +++++', 'dsds'), 1000);
*/
    }
}

export {User};
export default new User();
