function computeHash(str) {
    let hash = 0;

    if (!str)
        return hash;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }

    return hash;
}

function randomColorFromString(str) {
    var hue = computeHash(str) % 360;
    return `hsl(${hue}, 100%, 30%)`
}

function remove_from(users, socket) {
    let idx = users.findIndex(user => user.id === socket.id);
    users.splice(idx, 1);
}

const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
};

const reUnescapedHtml = /[&<>"'`]/g;

function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
}

function escapeHtml(string) {
    return string.replace(reUnescapedHtml, escapeHtmlChar);
}

function IntTwoChars(num) {
    return (`0${num}`).slice(-2);
}

function getTimeStamp() {
    let time = new Date();
    let hours = IntTwoChars(time.getHours());
    let minutes = IntTwoChars(time.getMinutes());
    return `${hours}:${minutes}`;
}

module.exports = {
    randomColorFromString,
    remove_from,
    escapeHtml,
    getTimeStamp
};