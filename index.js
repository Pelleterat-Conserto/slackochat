const express = require('express');

const app = express();

const http = require('http').Server(app);

const io = require("socket.io")(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.set("port", process.env.PORT || 9000);

//Connexion port 9000

const server = http.listen(9000, () => {
    console.log("server is running on port", server.address().port);
});

io.on( 'connection', (socket) => {  
    socket.on('chat message', (msg) => {    
        io.emit('chat message', msg);  
    });
});
