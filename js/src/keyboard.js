define(function () {
    var s = {
        registerKeys : function (callback) {
            document.onkeydown = function (e) {
                var reg = /^\d+$/;
                var input = s.getChar(e.keyCode || e.charCode);
                if (reg.test(input)) {
                    callback(input);
                } else if (input.toLowerCase() === 'q') {
                    callback('+');
                } else if (input.toLowerCase() === 'a') {
                    callback('-');
                } else if (input.toLowerCase() === 'w') {
                    callback('up');
                } else if (input.toLowerCase() === 's') {
                    callback('down');
                }
            }
        },
        getChar : function (keycode) {
            return String.fromCharCode(keycode);
        }
    };
    return s;
});
