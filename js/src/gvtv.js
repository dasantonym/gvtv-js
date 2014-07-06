define(['src/keyboard','src/osd', 'src/data'], function (keyboard, osd, dataSource) {
    var s = {
        currentChannel: 1,
        currentInput : '',
        keyTimeout : -1,
        autoTimer : -1,
        autoBaseDelay : 1000,
        autoDelayMultiply: 3,
        randomChannels : [],
        init : function () {
            s.updateChannels(function (err) {
                if (err) return;
                s.currentChannel = Math.round(Math.random() * (dataSource.available - 1)) + 1;
                s.setChannel();
                s.autoChannel(1, false);
                keyboard.registerKeys(s.channelCommand);
            });
        },
        channelNumberInput: function (input) {
            var displayLength = dataSource.available.toString().length;

            s.stopAutoTimer();

            if (!osd.isVisible()) {
                osd.show();
                s.currentInput = '00000000';
            }

            if (s.keyTimeout>-1) {
                window.clearTimeout(s.keyTimeout);
                s.keyTimeout = -1;
            }
            s.keyTimeout = window.setTimeout(function () {
                s.setChannel();
            },2000);
            s.currentInput += input;
            if (s.currentInput.length > displayLength) {
                s.currentInput = s.currentInput.substr(s.currentInput.length - displayLength, displayLength);
            }

            osd.update({
                channelNumber : parseInt(s.currentInput)
            });

        },
        channelCommand : function (input) {
            if (input==='up') {
                s.stopAutoTimer();
                s.channelMove(1);
            } else if (input==='down') {
                s.stopAutoTimer();
                s.channelMove(-1);
            } else if (input==='+') {
                s.autoChannel(1, true);
            } else if (input==='-') {
                s.autoChannel(-1, true);
            } else {
                s.stopAutoTimer();
                s.channelNumberInput(input);
            }
        },
        channelMove : function (delta) {
            s.currentChannel += delta;
            if (s.currentChannel < 1) {
                s.currentChannel = dataSource.available;
            } else if (s.currentChannel > dataSource.available) {
                s.currentChannel = 1;
            }
            s.setChannel();
        },
        autoChannel : function (delta, autoVisible) {
            if (s.autoTimer > 0) s.stopAutoTimer();

            s.autoDelayMultiply += delta;

            if (s.autoDelayMultiply > 0) {
                s.autoTimer = window.setInterval(
                    s.randomChannel,
                    s.autoBaseDelay * s.autoDelayMultiply
                );
            } else {
                s.autoDelayMultiply = 0;
            }

            osd.update({
                autoVisible : autoVisible,
                autoMultiplier : s.autoDelayMultiply
            });
            osd.show(4000);
        },
        stopAutoTimer : function () {
            if (s.autoTimer>0) {
                osd.update({
                    autoVisible : false
                });
                window.clearInterval(s.autoTimer);
                s.autoTimer = -1;
            }
        },
        randomChannel : function () {
            var channel;
            if (s.randomChannels.length==0) {
                var i, n, length, shuffle;
                for (i = 0; i < dataSource.available; i++) {
                    s.randomChannels[i] = i + 1;
                }
                for (length = s.randomChannels.length; length;) {
                    n = Math.random() * length-- | 0;
                    shuffle = s.randomChannels[n];
                    s.randomChannels[n] = s.randomChannels[length];
                    s.randomChannels[length] = shuffle;
                }
            }
            channel = s.randomChannels.pop();
            s.currentChannel = channel;
            s.setChannel();
        },
        setChannel : function () {

            document.getElementById('content').style.display = 'none';

            if (s.currentInput.length > 0) {
                s.currentChannel = parseInt(s.currentInput);
                s.currentInput = '';
            }

            if (s.currentChannel > dataSource.available) {
                s.currentChannel = dataSource.available;
            }

            dataSource.getChannel(s.currentChannel, function (err, data) {
                if (err || !data || !data['url']) return;
                var ext = data['url'].split('.').pop().toLowerCase();
                if (ext==='gif') {
                    document.getElementById('content').style.backgroundImage = 'url(/db/gif/'+s.currentChannel+'.gif)';
                    document.getElementById('content').style.display = 'block';
                }
                osd.update({
                    channelNumber : s.currentChannel,
                    autoVisible : false
                });
                osd.show(4000);
            });
        },
        updateChannels : function (callback) {
            dataSource.getAvailable(function (err, status, data) {
                if (err || status===false) {
                    document.getElementById('blackout').style.display = 'block';
                    return callback(err, null);
                } else {
                    document.getElementById('blackout').style.display = 'none';
                }
                if (data) osd.padLength = dataSource.available.toString().length;
                if (typeof callback === 'function') callback(err, status);
            });
            window.setTimeout(s.updateChannels,10000);
        }
    };
    return s;
});
