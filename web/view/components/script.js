$(document).ready(function() {
    $('#navbar').load('/components/navbar.html');
})

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return LightenDarkenColor(color, 40);
}


function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;
    r = colorInRange(r);

    var b = ((num >> 8) & 0x00FF) + amt;
    b = colorInRange(b);

    var g = (num & 0x0000FF) + amt;
    g = colorInRange(g);

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

function colorInRange(col) {
    if (col > 255) return 255;
    else if (col < 0) return 0;
    return col;
}

Date.prototype.sameDay = function(d) {
    return this.getFullYear() === d.getFullYear() &&
        this.getDate() === d.getDate() &&
        this.getMonth() === d.getMonth();
}

function showSnackBar(message) {
    var x = document.getElementById("snackbar");
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
}