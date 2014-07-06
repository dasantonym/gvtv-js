define(function () {
    var s = {
        available : 0,
        dataHost: 'db',
        getChannel : function (num,callback) {
            var fs = require('fs'),
              path = require('path');
            fs.readFile(path.join(s.dataHost, 'channels', num.toString() + '.json'), function (err, data) {
                if (err) {
                    console.log('error loading channel file', err);
                    return callback(err, null);
                }
                try {
                    var obj = JSON.parse(data);
                } catch (e) {
                    return callback(e, null);
                }
                callback(null, obj);
            });
        },
        getAvailable : function (callback) {
            var fs = require('fs'),
                path = require('path');
            fs.readFile(path.join(s.dataHost, 'available.json'), function (err, data) {
                if (err) {
                    console.log('error loading available file', err);
                    return callback(err, null);
                }
                try {
                    var obj = JSON.parse(data);
                    var status = false;
                    if (obj) {
                        if (obj>0) {
                            status = true;
                            s.available = data;
                        }
                    }
                    if (typeof callback==='function') callback(null, status, data);
                } catch (e) {
                    return callback(e, null);
                }
                callback(null, obj);
            });
        },
        writeConfig : function (config, callback) {
        var fs = require('fs'),
            path = require('path');
        fs.writeFile(path.join(s.dataHost, 'config.json'), JSON.stringify(config), function (err) {
            if (err) {
                callback(err, null);
                return;
            }
            callback();
        });
        },
        readConfig : function (callback) {
            var fs = require('fs'),
                path = require('path');
            fs.readFile(path.join(s.dataHost, 'config.json'), function (err, data) {
                if (err) {
                    callback(err, null);
                    return;
                }
                try {
                    var obj = JSON.parse(data);
                } catch (e) {
                    callback(e, null);
                }
                callback(null, obj);
            });
        }
    };
    return s;
});