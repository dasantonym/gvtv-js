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
                    return callback(null, err);
                }
                try {
                    var obj = JSON.parse(data);
                } catch (e) {
                    return callback(null, e);
                }
                callback(obj);
            });
        },
        getAvailable : function (callback) {
            var fs = require('fs'),
                path = require('path');
            fs.readFile(path.join(s.dataHost, 'available.json'), function (err, data) {
                if (err) {
                    console.log('error loading available file', err);
                    return callback(null, err);
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
                    return callback(null, e);
                }
                callback(obj);
            });
      },
      writeConfig : function (config, callback) {
        var s = gvtvData;
        var fs = require('fs');
        var path = require('path');
          fs.writeFile(path.join(s.dataHost, 'config.json'), JSON.stringify(config), function (err) {
              if (err) {
                  callback(err, null);
                  return;
              }
              callback();
          });
      },
      readConfig : function (callback) {
          var s = gvtvData;
          var fs = require('fs');
          var path = require('path');
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
      },
      checkVersion : function () {
          var http = require('http');
            var options = {
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
                        $('#updateModal').modal({});
                    }
                });
            }).on('error', function (err) {
                console.log('unable to check version', err);
            });
      }
    };
    return s;
});