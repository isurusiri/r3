const io = require('socket.io')();
const r = require('rethinkdb');

r.connect({
    host: 'localhost',
    port: 28015,
    db: 'awesome_whiteboard',
}).then((connection) => {
    io.on('connection', (client) => {
        client.on('subscribeToTimer', (interval) => {
            console.log('client is subscribing to timer with interval ', interval);
            r.table('timers')
            .changes()
            .run(connection)
            .then((corsur) => {
                corsur.each((err, timerRow) => {
                    client.emit('timer', timerRow.new_val.timestamp);
                })
            });
        });
    });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);