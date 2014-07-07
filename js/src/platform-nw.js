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
        },
        loadSnippet : function (snippet, callback) {
            var path = require('path'),
                fs = require('fs');
            fs.readFile(path.join(require('dirname').dirname, '..', 'approot', 'js', 'snippets', snippet + '.html'), function (err, data) {
                if (err) {
                    console.log('error loading snippet', err);
                    return callback(err, null);
                }
                callback(null, data);
            });
        },
        checkVersion : function (msgRef) {
            var http = require('http'),
                options = {
                    host: 'gvtv.jetzt',
                    port: 80,
                    path: '/api/v1/desktopVersion.json'
                };

            http.get(options, function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    try {
                        var obj = JSON.parse(data);
                    } catch (e) {
                        console.log('unable to check version', e);
                        return;
                    }
                    var gui = require('nw.gui');
                    var componentsRemote = obj.version_string.split('.');
                    var componentsLocal = gui.App.manifest.version.split('.');
                    var hasUpdate = false;
                    for (var i in componentsRemote) {
                        if (parseInt(componentsRemote[i]) > parseInt(componentsLocal[i])) hasUpdate = true;
                    }
                    if (hasUpdate) {
                        msgRef.toggle('update',
                            function () {
                                s.gotoDownloadSite();
                            },
                            function () {

                            }
                        );
                    }
                });
            }).on('error', function (err) {
                console.log('unable to check version', err);
            });
        },
        gotoDownloadSite : function () {
            var gui = require('nw.gui');
            gui.Shell.openExternal('http://gvtv.jetzt/');
        }
    }
    return s;
});