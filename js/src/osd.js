define(function () {
    var s = {
        config : {
            channelNumber : 0,
            autoVisible : false,
            autoMultiplier : 1
        },
        padLength : 1,
        timeout : -1,
        show : function (timeout) {
            if (typeof timeout==='undefined') timeout = 2000;
            if (s.timeout > -1) {
                window.clearTimeout(s.timeout);
                s.timeout = -1;
            }
            s.timeout = window.setTimeout(function () {
                s.hide();
            }, timeout);
            document.getElementById('osd').style.display='block';
        },
        hide : function () {
            if (s.timeout > -1) {
                window.clearTimeout(s.timeout);
                s.timeout = -1;
            }
            document.getElementById('osd').style.display='none';
        },
        isVisible : function () {
            return document.getElementById('osd').style.display==='block';
        },
        padChannelDisplay : function (num) {
            var numStr = num.toString();
            while (numStr.length < s.padLength) {
                numStr = '0' + numStr;
            }
            return numStr;
        },
        update : function (osdConfig) {
            s.config = osdConfig;
            if (typeof s.config.channelNumber != 'undefined') {
                document.getElementById('channelnum').innerHTML = s.padChannelDisplay(s.config.channelNumber);
            }
            if (typeof s.config.autoMultiplier != 'undefined') {
                document.getElementById('automulti').innerHTML = s.config.autoMultiplier.toString();
            }
            if (typeof s.config.autoVisible != 'undefined') {
                document.getElementById('auto').style.display = s.config.autoVisible ? 'block' : 'none';
            }
        }
    };
    return s;
});
