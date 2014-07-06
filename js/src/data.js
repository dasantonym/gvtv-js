define(['jquery'], function ($) {
    var s = {
        request : null,
        available : 0,
        dataHost: 'db',
        getChannel : function (channel, callback) {
            if (s.request) {
                s.request.abort();
            }
            s.request = $.ajax({
                url: s.dataHost + "/channels/" + channel.toString() + ".json",
                data: null,
                type: 'get',
                success: function(data){
                    if (data) {
                        if (typeof callback==='function') callback(null, data);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    console.log('error loading channel content', errorThrown);
                    if (typeof callback==='function') callback(new Error('error loading channel content'), null);
                }
            });
        },
        getAvailable : function (callback) {
            $.ajax({
                url: s.dataHost+"/available.json",
                type: 'get',
                success: function(data){
                    var status = false;
                    if (data) {
                        if (data>0) {
                            status = true;
                            s.available = data;
                        }
                    }
                    if (typeof callback==='function') callback(null, status, data);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    console.log('error getting available channels', errorThrown);
                    if (typeof callback==='function') callback(new Error('error loading channel content'), false, null);
                }
            });
        }
    };
    return s;
});
