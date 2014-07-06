require.config({
    baseUrl: 'js'
});

require(['src/gvtv', 'src/data-file', 'src/node-webkit'], function (gvtv, data, platform) {
    var path = require('path');
    var gui = require('nw.gui');
    console.log(gui.App.dataPath);
    var gvtvNode = require('node-gvtv');
    data.dataHost = path.join(gui.App.dataPath, 'db');
    var fs = require('fs');
    fs.exists(path.join(data.dataHost, 'config.json'), function (exists) {
        if (exists) {
            data.readConfig(function (err, config) {
                if (err) {
                    console.log('error reading config', err);
                    return;
                }
                gvtvNode.setConfig(config, function () {
                    gvtvNode.initDb(function (err) {
                        if (err) {
                            console.log('failed to init db', err);
                            return;
                        }
                        gvtvNode.startAddingGifs();
                        gvtv.init(data, platform);
                        data.checkVersion();
                    });
                });
            });
        } else {
            fs.readFile(path.resolve('config.default.json'), function (err, data) {
                if (err) {
                    console.log('error reading default config', err);
                    return;
                }
                try {
                    var config = JSON.parse(data);
                } catch (e) {
                    console.log('error parsing default config', e);
                    return;
                }
                config.dbPath = gvtvData.dataHost;
                gvtvNode.setConfig(config, function () {
                    gvtvNode.initDb(function (err) {
                        if (err) {
                            console.log('failed to init db', err);
                            return;
                        }
                        data.writeConfig(config, function (err) {
                            if (err) {
                                console.log('error writing config', err);
                                return;
                            }
                            gvtvNode.startAddingGifs();
                            gvtv.init(data, platform);
                            $('#introModal').modal({});
                        });
                    });
                });
            });
        }
    });

    $('#updateButton').click(function () {
        require('nw.gui').Shell.openExternal('http://gvtv.jetzt/');
        $('#updateModal').modal('hide');
    });
});
