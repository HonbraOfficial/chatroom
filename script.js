firebase.initializeApp({
    apiKey: "AIzaSyBCocS2eta8LyANZuni_AcwyoCiZW_SIDs",
    authDomain: "honbrachatroom.firebaseapp.com",
    databaseURL: "https://honbrachatroom.firebaseio.com",
    projectId: "honbrachatroom",
    storageBucket: "honbrachatroom.appspot.com",
    messagingSenderId: "888468409183",
    appId: "1:888468409183:web:5064af8accdf7ff77b84ea"
});

let database = firebase.database(),
    dbref = database.ref("messages"),
    textField = new mdc.textField.MDCTextField(document.getElementById("textfield")),
    latest = [],
    loggedin = false,
    username = "";

if (getParam("username")) {
    loggedin = true;
    username = getParam("username");
}

dbref.limitToLast(10).on('value', function(snapshot) {
    if (loggedin) {
        latest = snapshot.val();
        display(latest);
    } else {
        login();
    }
});

function display(json) {
    var html = "";
    for (var elem in json) {
        html += generateHTML(json[elem]);
    }
    document.getElementById("messages").innerHTML = html;
    window.scrollTo(0, document.body.scrollHeight);
}

function generateHTML(elem) {
    return `<div class="mdc-card message-cont">
        <div class="message">${elem.message}</div>
        <div class="user">${elem.user}</div>
    </div>`;
}

function getLastId(json) {
    var array = [];
    for (var elem in json) {
        array.push(elem);
    }
    return array[array.length - 1];
}

function sendMessage(message, user) {
    database.ref("messages/" + (parseInt(getLastId(latest), 10) + 1)).set({ message, user });
}

function sendFormMessage() {
    if (loggedin) {
        if (textField.value == "newAdventure") {
            clear();
        } else {
            sendMessage(textField.value, username);
        }
        textField.value = "";
    } else {
        location.href = "?username=" + textField.value;
    }
    return false;
}

function clear() {
    dbref.set({ "0": { user: "", message: "A new adventure begins here." } });
}

function getParam(param) {
    return new URL(window.location.href).searchParams.get(param);
}

function login() {
    display({ "0": { user: "", message: "Please type your username below." } })
    document.getElementById("textfield").querySelector("input").placeholder = "Username";
}