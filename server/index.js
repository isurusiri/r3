const io = require('socket.io')();
const r = require('rethinkdb');

function createDrawing({connection, name}) {
    r.table('drawings')
     .insert({
         name,
         timestamp: new Date(),
     })
     .run(connection)
     .then(() => console.log('created a drawing with name: ', name));
}

function subscribeToDrawings({client, connection}) {
    r.table('drawings')
     .changes({include_initial: true})
     .run(connection)
     .then((cursor) => {
         cursor.each((err, drawingRow) => client.emit('drawing',
            drawingRow.new_val
        ))
     });
}

function handleLinePublish({connection, line}) {
  console.log('saving line to the db');
  r.table('lines')
  .insert(Object.assign(line, { timestamp: new Date() }))
  .run(connection)
}

r.connect({
    host: 'localhost',
    port: 28015,
    db: 'awesome_whiteboard'
  }).then((connection) => {
    io.on('connection', (client) => {
      client.on('createDrawing', ({ name }) => {
        createDrawing({ connection, name });
      });
  
      client.on('subscribeToDrawings', () => subscribeToDrawings({
        client,
        connection,
      }));

      client.on('publishLine', (line) => handleLinePublish({
        connection,
        line,
      }))
    });
  });

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
