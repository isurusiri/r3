import openSocket from 'socket.io-client';
import { Observable } from 'rxjs';
//import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/Rx';

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

export {
    createDrawing,
    subscribeToDrawings,
    publishLine,
    subscribeToDrawingLines,
};
