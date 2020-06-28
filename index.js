const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
const moniker = require('moniker');
//TODO: is their a better way, like a way where i can use the whole js file with require
const {
    randomColorFromString,
    remove_from,
    escapeHtml,
    getTimeStamp
} = require('./helper');

var users = [];
var randomName = moniker.generator([moniker.adjective, moniker.noun]);

app.use(express.static('public'));

http.listen(port, function() {
    console.log(`webserver listening on *:${port}`);
});

io.on('connection', function(socket) {
    console.log('a user connected');
    var user = {
        role: "user",
        socketID: socket.id,
        name: randomName.choose(),
        message: null,
        color: "crimson",
        time: null
    };
    user.color = randomColorFromString(user.name);
    users.push(user);

    var bot = {
        role: "bot",
        message: `${users.length} chappas connected`
    }
    io.emit('chat message', bot);

    socket.on('chat message', function(msg) {
        if (msg.slice(0, 5) == "/name" && msg.slice(6)) {
            console.log(`user ${user.name} changed his name to ${msg.slice(6)}`);
            user.name = msg.slice(6);
        } else {
            console.log(`got message '${msg}', broadcasting to all`);
            user.message = escapeHtml(msg);
            user.time = getTimeStamp();
            io.emit('chat message', user);
        }
    });

    socket.on('reaction', function(msg) {
        console.log(`got reaction, broadcasting to all`);
        user.message = msg;
        user.time = getTimeStamp();
        io.emit('reaction', user);
    });

    socket.on('disconnect', function() {
        remove_from(users, socket);
        io.emit('chat message', bot);
        console.log('user disconnected');
    });
});