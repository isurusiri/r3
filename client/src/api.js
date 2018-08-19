import openSocket from 'socket.io-client';
import { Observable } from 'rxjs';
//import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/Rx';
import createSync from 'rxsync';

const port = parseInt(window.location.search.replace('?', ''), 10) || 8000;
const socket = openSocket(`http://localhost:${port}`);

function subscribeToDrawings(callback) {
    socket.on('drawing', callback);
    socket.emit('subscribeToDrawings');
}

function createDrawing(name) {
    socket.emit('createDrawing', {name});
}

const sync = createSync({
    maxRetries: 10,
    delayBetweenRetries: 1000,
    syncAction: line => new Promise((resolve, reject) => {
        let sent = false;

        socket.emit('publishLine', line, () => {
            sent => true;
            resolve();
        });

        setTimeout(() => {
            if (!sent) {
                reject();
            }
        }, 2000);
    }),
});

sync.failedItems.subscribe(items => console.log('failed to sync ', items));
sync.syncedItems.subscribe(line => console.log('line synced', line));

function publishLine({drawingId, line}) {
    sync.queue({drawingId, ...line});
}

function subscribeToDrawingLines(drawingId, callback) {
    const lineStream = Observable.fromEventPattern(
        handler => socket.on(`drawingLine:${drawingId}`, handler),
        handler => socket.off(`drawingLine:${drawingId}`, handler)
    );

    const bufferedTimeStream = lineStream
    .bufferTime(100)
    .map(lines => ({ lines }));

    const reconnectStream = Observable.fromEventPattern(
        handler => socket.on('connect', handler),
        handler => socket.off('connect', handler),
    );

    const maxStream = lineStream
    .map(line => new Date(line.timestamp).getTime())
    .scan((a,b) => Math.max(a, b), 0);

    reconnectStream
    .withLatestFrom(maxStream)
    .subscribe((joined) => {
        const lastReceivedTimestamp = joined[1];
        socket.emit('subscribeToDrawingLines', {
            drawingId,
            from: lastReceivedTimestamp
        });
    });

    bufferedTimeStream.subscribe(linesEvent => callback(linesEvent));
    socket.emit('subscribeToDrawingLines', {drawingId});
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
