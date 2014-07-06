define(function () {
    var s = {
        config : {
            targetIndex : 0,
            channelNumber : 0,
            autoVisible : false,
            autoMultiplier : 1,
            displayTime : 4000
        },
        padLength : 1,
        timeout : -1,
        show : function () {
            var target = s.getTarget();
            if (s.timeout > -1) {
                window.clearTimeout(s.timeout);
                s.timeout = -1;
            }
            s.timeout = window.setTimeout(function () {
                s.hide(target);
            }, s.config.displayTime ? s.config.displayTime : 2000);
        },
        hide : function (target) {
            if (s.timeout > -1) {
                window.clearTimeout(s.timeout);
                s.timeout = -1;
            }
            target.innerHTML = '';
        },
        padChannelDisplay : function (num) {
            var numStr = num.toString();
            while (numStr.length < s.padLength) {
                numStr = '0' + numStr;
            }
            return numStr;
        },
        update : function (osdConfig) {
            s.getTarget().innerHTML = '';
            s.config = osdConfig;
            var osdCode = '<div class="channelnum">' + ( s.config.channelNumber ? s.config.channelNumber : '' ) + '</div>';
            console.log(s.config);
            if (s.config.autoVisible==true) {
                osdCode += '<div class="auto">Random ' + ( s.config.autoMultiplier && s.config.autoMultiplier > 0 ? (s.config.autoMultiplier/2).toFixed(1) + 's' : 'off' ) + '</div>';
            }
            s.getTarget().innerHTML = osdCode;
            s.show();
        },
        getTarget : function (target) {
            if (!target) {
                target = s.config.targetIndex;
            }
            return document.getElementById('display_' + target).getElementsByClassName('osd')[0];
        }
    };
    return s;
});
