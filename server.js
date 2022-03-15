var app = require('express')();

var cors = require('cors')

app.use(cors({origin: "*"}))

var http = require('http').createServer(app);
const PORT = 8080;

const io = require("socket.io")(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

var STATIC_CHANNELS = [{
    name: 'General',
    participants: 0,
    id: 1,
    sockets: []
}, {
    name: 'H.S.',
    participants: 0,
    id: 2,
    sockets: []
}];

/**
 * @description This methos retirves the static channels
 */
 app.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
});

io.on('connection', (socket) => {
    console.log('new client connected');
    socket.emit('connection', null);
    socket.on('channel-join', id => {
        console.log('channel join', id);
        STATIC_CHANNELS.forEach(c => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == (-1)) {
                    c.sockets.push(socket.id);
                    c.participants++;
                    io.emit('channel', c);
                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                if (index != (-1)) {
                    c.sockets.splice(index, 1);
                    c.participants--;
                    io.emit('channel', c);
                }
            }
        });

        return id;
    });
    socket.on('send-message', message => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        STATIC_CHANNELS.forEach(c => {
            let index = c.sockets.indexOf(socket.id);
            if (index != (-1)) {
                c.sockets.splice(index, 1);
                c.participants--;
                io.emit('channel', c);
            }
        });
    });

});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
