define(function () {
    var s = {
        registerKeys : function (callback) {
            document.onkeydown = function (e) {
                var reg = /^\d+$/;
                var input = e.keyCode || e.charCode;
                if (reg.test(s.getChar(input))) {
                    callback(s.getChar(input));
                } else if (input === 39) {
                    callback('+');
                } else if (input === 37) {
                    callback('-');
                } else if (input === 38) {
                    callback('up');
                } else if (input === 40) {
                    callback('down');
                } else if (s.getChar(input).toLowerCase() === 'x') {
                    callback('x');
                } else if (s.getChar(input).toLowerCase() === 'y') {
                   callback('y');
               }
            }
        },
        getChar : function (keycode) {
            return String.fromCharCode(keycode);
        }
    };
    return s;
});
