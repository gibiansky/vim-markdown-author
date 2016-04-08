import http from 'http';
import fs from 'fs';
import Server from 'socket.io';
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';

// Connections to send markdown to
let listeners = [];

// Set up a listener for Vim to connect to
let notificationServer = http.createServer((request, response) => {
    let filename = request.headers['x-filename'];
    let content = fs.readFile(filename, 'utf8', (err, data) => {
        if(err) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(err);
        } else {
            response.writeHead(200, {"Content-Type": "text/plain"});
            for(let socket of listeners) {
                socket.emit('change', { markdown: data });
            }
        }
        response.end();
    });
});
notificationServer.listen(1337);

// Set up a Socket.io server
let io = new Server(3000);
io.on('connection', socket =>  {
    console.log("Connected a socket.");
    listeners.push(socket); 
});

let serve = serveStatic('static/', {'index': ['index.html']});
http.createServer((request, response) => {
    let done = finalhandler(request, response);
    serve(request, response, done);
}).listen(80);
