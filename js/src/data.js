define(['jquery'], function ($) {
    var s = {
        currentRequest : null,
        availableChannels : 0,
        dataHost: 'db',
        requestChannelContent : function (num,callback) {
            if (s.currentRequest) {
                s.currentRequest.abort();
            }
            s.currentRequest = $.ajax({
                url: s.dataHost+"/channels/"+num.toString()+".json",
                data: null,
                type: 'get',
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    console.log('error loading channel content', errorThrown);
                    if (typeof callback==='function') callback(null, 'error loading channel content');
                },
                success: function(data){
                    if (data) {
                        if (typeof callback==='function') callback(data);
                    }
                }
            });
        },
        getAvailableChannels : function (callback) {
            $.ajax({
                url: s.dataHost+"/available.json",
                type: 'get',
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    console.log('error getting available channels', errorThrown);
                    if (typeof callback==='function') callback(null, 'error getting available channels');
                },
                success: function(data){
                    if (typeof callback==='function') callback(JSON.parse(data), null);
                }
            });
        },
        getChannels : function (callback) {
            s.getAvailableChannels(function (data, error) {
                var status = false;
                if (data) {
                    if (data>0) {
                        status = true;
                        s.availableChannels = data;
                    }
                }
                if (status===true) {
                    document.getElementById('blackout').style.display = 'none';
                } else {
                    document.getElementById('blackout').style.display = 'block';
                }
                if (typeof callback==='function') callback(error, data);
            });
        }
    };
    return s;
});
