import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToDrawings(callback) {
    socket.on('drawing', callback);
    socket.emit('subscribeToDrawings');
}

function createDrawing(name) {
    socket.emit('createDrawing', {name});
}

function publishLine({drawingId, line}) {
    socket.emit('publishLine', {drawingId, ...line});
}

export {
    createDrawing,
    subscribeToDrawings,
    publishLine,
};
