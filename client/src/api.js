import openSocket from 'socket.io-client';
import { Observable } from 'rxjs';
//import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/Rx';

const port = parseInt(window.location.search.replace('?', ''), 10) || 8000;
const socket = openSocket(`http://localhost:${port}`);

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

function subscribeToDrawingLines(drawingId, callback) {
    const liveStream = Observable.fromEventPattern(
        handler => socket.on(`drawingLine:${drawingId}`, handler),
        handler => socket.off(`drawingLine:${drawingId}`, handler)
    );

    const bufferedTimeStream = liveStream
    .bufferTime(100)
    .map(lines => ({ lines }));

    bufferedTimeStream.subscribe(linesEvent => callback(linesEvent));
    socket.emit('subscribeToDrawingLines', drawingId);
}

function subscribeToConnectionEvent(callback) {
    socket.on('connect', () => callback({
        state: 'connected',
        port,
    }));
    socket.on('disconnect', () => callback({
        state: 'disconnected',
        port,
    }));
    socket.on('connect_error', () => callback({
        state: 'disconnected',
        port
    }));
}

export {
    createDrawing,
    subscribeToDrawings,
    publishLine,
    subscribeToDrawingLines,
    subscribeToConnectionEvent,
};
