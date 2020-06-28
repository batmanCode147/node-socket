const socket = io();

let form = document.getElementById('chat-form');
let input = document.getElementById('m');
let list = document.getElementById('messages');
let infoBtn = document.getElementById('info-button');
let buttons = document.querySelectorAll('.reaction-btn');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (input.value) {
        socket.emit('chat message', input.value);
    }
    input.value = "";

    return false;
});

infoBtn.addEventListener('click', () => {
    let li = document.createElement('li');

    li.className = 'chappa-bot';
    li.innerHTML = `<p>type /name *new name* to change your name!</p>`;
    list.appendChild(li);
    list.scrollTop = list.scrollHeight;
});

let btnHandler = (e) => {
    e.preventDefault();
    socket.emit('reaction', e.target.value.repeat(3));
};

let displayMsg = (data) => {
    let li = document.createElement('li');

    if (data.role == "bot") {
        let userCount = document.getElementById('current-users');
        userCount.innerHTML = `<p>${data.message}</p>`;
    } else {
        if (data.socketID == socket.id) {
            li.className = "client-msg test";
        }

        li.innerHTML = `<p class="msg-meta" style="background-color:${data.color};">${data.name}:</p>\n
        <br>\n
        <div class="msg-container">
        <p class="msg">${data.message}</p>\n
        <p class="msg-time">${data.time} Uhr</p>\n
        </div>`;
    }

    list.appendChild(li);
    list.scrollTop = list.scrollHeight;
};

buttons.forEach(btn => {
    btn.addEventListener('click', btnHandler);
});

socket.on('reaction', displayMsg);
socket.on('chat message', displayMsg);