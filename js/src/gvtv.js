define(['src/keyboard','src/osd', 'src/data'], function (keyboard, osd, dataSource) {
    var s = {
        currentChannel: 1,
        currentInput : '',
        keyTimeout : -1,
        autoTimer : -1,
        autoBaseDelay : 1000,
        autoDelayMultiply: 5,
        randomChannels : [],
        init : function () {
            s.updateChannels(function (err) {
                if (err) {
                    console.log('failed to update channels', err);
                    return;
                }
                s.currentChannel = Math.round(Math.random()*(dataSource.availableChannels-1))+1;
                s.setChannel();
                s.autoChannel(true,false);
                keyboard.registerKeys(s);
            });
        },
        channelNumberInput: function (input) {
            s.killAutoTimer();

            if (!osd.isOSDVisible()) {
                osd.showOSD();
                s.currentInput = '00000000';
            }

            if (s.keyTimeout>-1) {
                window.clearTimeout(s.keyTimeout);
                s.keyTimeout = -1;
            }
            s.keyTimeout = window.setTimeout(function () { s.setChannel(); },2000);
            s.currentInput += input;
            s.currentInput = s.currentInput.substr(s.currentInput.length-8);

            osd.updateOSD({
                channelNumber : parseInt(s.currentInput)
            });

        },
        channelCommand : function (input) {
            if (input==='up') {
                s.killAutoTimer();
                s.channelMove(1);
            } else if (input==='down') {
                s.killAutoTimer();
                s.channelMove(-1);
            } else if (input==='+') {
                s.autoChannel(true,true);
            } else if (input==='-') {
                s.autoChannel(false,true);
            } else {
                s.killAutoTimer();
                s.channelNumberInput(input);
            }
        },
        channelMove : function (delta) {
            s.currentChannel += delta;
            if (s.currentChannel < 1) {
                s.currentChannel = dataSource.availableChannels;
            } else if (s.currentChannel>dataSource.availableChannels) {
                s.currentChannel = 1;
            }
            s.setChannel();
        },
        autoChannel : function (increase,autoVisible) {
            if (increase) {
                if (s.autoDelayMultiply < 100) s.autoDelayMultiply += 1;
            } else {
                if (s.autoDelayMultiply > 0) s.autoDelayMultiply -= 1;
            }
            if (s.autoTimer > 0) s.killAutoTimer();
            if (s.autoDelayMultiply > 0) s.autoTimer = window.setInterval(s.randomChannel,s.autoBaseDelay*s.autoDelayMultiply);
            osd.updateOSD({
                autoVisible : autoVisible,
                autoMultiplier : s.autoDelayMultiply
            });
            osd.showOSD(4000);
        },
        killAutoTimer : function () {
            if (s.autoTimer>0) {
                osd.updateOSD({
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
                for (i = 0; i < dataSource.availableChannels; i++) {
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
            if (s.currentChannel > dataSource.availableChannels) {
                s.currentChannel = dataSource.availableChannels;
            }

            document.getElementById('content').style.display = 'none';

            if (s.currentInput.length > 0) {
                s.currentChannel = parseInt(s.currentInput);
                s.currentInput = '';
            }

            dataSource.requestChannelContent(s.currentChannel, function (data) {
                if (data===null || typeof data['url']==='undefined') return;
                var ext = data['url'].split('.').pop().toLowerCase();
                if (ext==='gif') {
                    document.getElementById('content').style.backgroundImage = 'url(/db/gif/'+s.currentChannel+'.gif)';
                    document.getElementById('content').style.display = 'block';
                }
                osd.updateOSD({
                    channelNumber : s.currentChannel,
                    autoVisible : false
                });
                osd.showOSD(4000);
            });
        },
        updateChannels : function (callback) {
            dataSource.getChannels(function (err) {
                if (err) {
                    return callback(err, null);
                }
                osd.padLength = dataSource.availableChannels.toString().length;
                if (typeof callback === 'function') callback();
            });
            window.setTimeout(s.updateChannels,10000);
        }
    };
    return s;
});
