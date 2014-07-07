define(function () {
    var s = {
        request : null,
        available : 0,
        dataHost: 'db',
        getChannel : function (channel, callback) {
            if (s.request) {
                s.request.abort();
            }
            s.request = new XMLHttpRequest();
            s.request.onreadystatechange = function () {
                if (s.request.readyState==4 && s.request.status==200) {
                    if (s.request.responseText) {
                        try {
                            var result = JSON.parse(s.request.responseText);
                        } catch (e) {
                            return callback(e, null);
                        }
                        callback(null, result);
                    } else {
                        callback(new Error('error loading channel content'));
                    }
                } else {
                    callback(new Error('error loading channel content'));
                }
            };
            s.request.open('GET', s.dataHost + '/channels/' + channel.toString() + '.json', true);
            s.request.send();
        },
        getAvailable : function (callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState==4 && xhr.status==200) {
                    if (xhr.response) {
                        try {
                            var result = JSON.parse(xhr.response);
                        } catch (e) {
                            return callback(e, false, null);
                        }
                        var status = false;
                        if (result>0) {
                            status = true;
                            s.available = result;
                        }
                        if (typeof callback==='function') callback(null, status, result);
                    } else {
                        callback(new Error('error loading available channels'), false, null);
                    }
                } else {
                    callback(new Error('error loading channel content'), false, null);
                }
            };
            xhr.open('GET', s.dataHost + '/available.json', true);
            xhr.send();
        }
    };
    return s;
});
