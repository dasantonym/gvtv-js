define(function () {
    var s = {
        config : {
            channelNumber : 0,
            autoVisible : true,
            autoMultiplier : 5,
            displayTime : 4000
        },
        padLength : 1,
        channelTimeout : -1,
        autoTimeout : -1,
        disabled : false,
        show : function () {
            if (s.channelTimeout > -1) {
                window.clearTimeout(s.channelTimeout);
                s.channelTimeout = -1;
            }
            s.channelTimeout = window.setTimeout(function () {
                s.hide();
            }, s.config.displayTime);
        },
        hide : function () {
            if (s.channelTimeout > -1) {
                window.clearTimeout(s.channelTimeout);
                s.channelTimeout = -1;
            }
            s.getTarget().innerHTML = '';
        },
        setDisabled : function (disabled) {
            console.log(disabled);
            s.disabled = disabled;
            if (s.disabled) {
                s.hide();
            } else {
                s.update({});
            }
        },
        padChannelDisplay : function (num) {
            var numStr = num.toString();
            while (numStr.length < s.padLength) {
                numStr = '0' + numStr;
            }
            return numStr;
        },
        update : function (osdConfig) {
            for (var key in osdConfig) {
                s.config[key] = osdConfig[key];
            }
            if (s.disabled) return;
            if (osdConfig.autoVisible === true) {
                if (s.autoTimeout > -1) {
                    window.clearTimeout(s.autoTimeout);
                    s.autoTimeout = -1;
                }
                s.autoTimeout = window.setTimeout(function () {
                    s.config.autoVisible = false;
                }, s.config.displayTime);
            }
            var osdCode = '<div class="gvtv-osd-cn">' + ( s.config.channelNumber ? s.config.channelNumber : '' ) + '</div>';
            if (s.config.autoVisible==true) {
                osdCode += '<div class="gvtv-osd-rnd">Random ' + ( s.config.autoMultiplier && s.config.autoMultiplier > 0 ? (s.config.autoMultiplier/2).toFixed(1) + 's' : 'off' ) + '</div>';
            }
            s.getTarget().innerHTML = osdCode;
            s.show();
        },
        getTarget : function () {
            return document.getElementById('gvtv-osd');
        }
    };
    return s;
});
