# r3
Real-time ReactJS with RethinkDB

This is a project that I started to explore RethinkDB's real-time functionalities with Socket.io. The initial idea was to create a real-time collaborative drawing board.  

<p align="center">
  <img src="https://github.com/isurusiri/r3/blob/master/resources/screenrecording.gif">
</p>

##### Prerequisites  

[RethinkDB](https://rethinkdb.com/)
[Node.js](https://nodejs.org/en/)

##### Installation  

Clone the project to your local machine by executing below command in terminal,  

`> git clone https://github.com/isurusiri/r3.git`  

`> cd r3`  

_Node: before moving forward, make sure that RethinkDB is running and it is listening over port 28015 in localhost._  

Start server in your local machine by executing below command in terminal,  

`> cd server || node index.js`  

Start client in your local machine by executing below command in terminal,  

`> cd client || npm start`  

Once above commands are done, the app will be available in _localhost 3000_.  

Also we could open server via different ports otherthan it's default port _(8000)_. To Start it in a different port, use the below command,

`> node index.js 8001`  

##### ToDo  

- [ ]User account support  
- [ ]Multi color and color picker  
- [ ]Export as an image  
- [ ]and a lot more  

##### Libraries I used

[Socket.io](https://socket.io/)  
[RxJS](https://www.npmjs.com/package/rxjs)  
[RxSync](https://www.npmjs.com/package/rxsync)  
[ReactJS](https://reactjs.org/)  
[Simple-react-canvas](https://www.npmjs.com/package/simple-react-canvas)  
[Node.js](https://nodejs.org/en/)  


