import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToTimer(callback) {
    socket.on('timer', timestamp => callback(timestamp));
    socket.emit('subscribeToTimer', 1000);
}

export {
    subscribeToTimer
};
