////
//
// node-webkit specific features

define(function () {
    var s = {
        toggleFullscreen : function () {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            win.toggleFullscreen();
            win.focus();
        },
        loadBgImage : function (url, dataHost, callback) {
            var path = require('path'),
                fs = require('fs'),
                gifpath = path.join(dataHost, url);
            fs.readFile(gifpath, function (err, data) {
                if (err) {
                    console.log('error loading gif', err);
                    return callback(err, null);
                }
                var base64Image = new Buffer(data, 'binary').toString('base64');
                callback(null, 'url(data:image/gif;base64,'+base64Image+')');
            });
        }
    }
    return s;
});