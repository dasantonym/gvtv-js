define(function () {
    var s = {
        osdConfig : {
            channelNumber : 0,
            autoVisible : false,
            autoMultiplier : 1
        },
        padLength : 1,
        osdTimeout : -1,
        showOSD : function (timeout) {
            if (typeof timeout==='undefined') timeout = 2000;
            if (s.osdTimeout>-1) {
                window.clearTimeout(s.osdTimeout);
                s.osdTimeout = -1;
            }
            s.osdTimeout = window.setTimeout(function () { s.hideOSD(); },timeout);
            document.getElementById('osd').style.display='block';
        },
        hideOSD : function () {
            if (s.osdTimeout>-1) {
                window.clearTimeout(s.osdTimeout);
                s.osdTimeout = -1;
            }
            document.getElementById('osd').style.display='none';
        },
        isOSDVisible : function () {
            return document.getElementById('osd').style.display==='block';
        },
        padChannelDisplay : function (num) {
            var numStr = num.toString();
            while (numStr.length < s.padLength) {
                numStr = '0'+numStr;
            }
            return numStr;
        },
        updateOSD : function (config) {
            s.osdConfig = config;
            if (typeof s.osdConfig.channelNumber!='undefined') document.getElementById('channelnum').innerHTML = s.padChannelDisplay(s.osdConfig.channelNumber);
            if (typeof s.osdConfig.autoMultiplier!='undefined') document.getElementById('automulti').innerHTML = s.osdConfig.autoMultiplier.toString();
            if (typeof s.osdConfig.autoVisible!='undefined') document.getElementById('auto').style.display = s.osdConfig.autoVisible ? 'block' : 'none';
        }
    };
    return s;
});
