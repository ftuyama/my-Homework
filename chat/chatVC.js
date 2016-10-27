$(document).ready(function() {

    /*
        ===========================================================================
                               Communication with Server
        ===========================================================================
    */
    var username;
    var socket = io.connect('/', {
        path: '/chat-socket'
    });

    $('form').submit(function() {});

    $('#send').click(function() {
        socket.emit('chat message', $('#text').val());
        $('#text').val('');
        return false;
    });

    $('#melar').click(function() {
        socket.emit('spam', "melar");
    });

    /*
        ===========================================================================
                                Receive Server Messages
        ===========================================================================
    */
    socket.on('connected', function(msg) {
        /* Register self */
        if (username == undefined)
            register_self(msg);
        else printMsg(msg, 'connected');
    });
    socket.on('chat', function(msg) {
        printMsg(msg, 'chat');
    });
    socket.on('disconnected', function(msg) {
        printMsg(msg, 'disconnected');
    });
    socket.on('spam', function(msg) {
        printMsg(msg, 'spam');
    });
    socket.on('history', function(history) {
        [dest, msg] = [history.dest, history.msg];
        if (dest != username) return;
        var kind = msg.key.split(':').slice(1, 2)[0];
        msg.value = JSON.parse(msg.value);
        printMsg(msg, kind);
    });

    /*
        ===========================================================================
                                Proccess Received Messages
        ===========================================================================
    */



    function printMsg(msg, kind) {
        new EmbedJS({
            googleAuthKey: 'AIzaSyCqFouT8h5DKAbxlrTZmjXEmNBjC69f0ts',
            input: msg.value.message
        }).text(function(compiled) {
            var time = msg.key.split(':').slice(5, 8).join(':');
            $('#messages').append(
                $('<p>').html(time + "  " + user_credential(msg.value.user) +
                    '<span style="color:#6c6"> ' + kind + '</span> ' +
                    compiled
                )
            );
            processUsers(msg, kind);
            scrollBotton();
        })
    }

    function processUsers(msg, kind) {
        if (kind == "connected" && msg.value.user != username &&
            $("[id='" + msg.value.user + "']").length == 0)
            $('#users').append(
                $('<p id="' + msg.value.user + '">').html(user_great_credential(msg.value))
            );
        else if (kind == "disconnected")
            $("[id='" + msg.value.user + "']").remove();
    }

    function register_self(msg) {
        username = msg.value.user;
        $('#users').append($('<p>').html(user_great_credential(msg.value)));
    }

    /*
        ===========================================================================
                                Helpers to Manage View
        ===========================================================================
    */

    function user_great_credential(value) {
        return '<img class="userIcon" src="' + value.img + '"/>' + user_credential(value.user);
    }

    function user_credential(user) {
        return '<b style="color:' + stringToColour(user) + '">@' + user + '</b>';
    }

    function scrollBotton() {
        var scroll = document.getElementById('messages');
        scroll.scrollTop = scroll.scrollHeight
    }

});

/*
 * Google Analytics
 */
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '/js/analytics.js', 'ga');

ga('create', 'UA-60506552-2', 'auto');
ga('send', 'pageview');