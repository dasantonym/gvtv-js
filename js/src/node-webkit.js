define(function () {
    var s = {
        toggleFullscreen : function () {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            win.toggleFullscreen();
            win.focus();
        }
    }
    return s;
});