define(function () {
    var s = {
        registerKeys : function () {
            document.onkeydown = function (e) {
                var reg = /^\d+$/;
                var input = s.getChar(e.keyCode || e.charCode);
                if (reg.test(input)) {
                    GVTV.channelNumberInput(input);
                } else if (input.toLowerCase()==='q') {
                    GVTV.channelCommand('+');
                } else if (input.toLowerCase()==='a') {
                    GVTV.channelCommand('-');
                } else if (input.toLowerCase()==='w') {
                    GVTV.channelCommand('up');
                } else if (input.toLowerCase()==='s') {
                    GVTV.channelCommand('down');
                }
            }
        },
        getChar : function (keycode) {
            return String.fromCharCode(keycode);
        }
    };
    return s;
});
