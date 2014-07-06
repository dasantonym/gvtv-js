define(['src/keyboard','src/osd', 'src/data'], function (keyboard, osd, data) {
    var s = {
        currentChannel: 1,
        currentInput : '',
        keyTimeout : -1,
        autoTimer : -1,
        autoBaseDelay : 1000,
        autoDelayMultiply: 5,
        osd : null,
        keyboard : null,
        data : null,
        randomChannels : [],
        init : function () {
            s.osd = osd;
            s.keyboard = keyboard;
            s.keyboard.registerKeys(s);

            s.data = data;
            s.data.getChannels(function (err) {
              if (err) {
                  return;
              }
              s.currentChannel = Math.round(Math.random()*(s.data.availableChannels-1))+1;
              s.setChannel();
              s.autoChannel(true,false);
            });

        },
        channelNumberInput: function (input) {
            s.killAutoTimer();

            if (!s.osd.isOSDVisible()) {
                s.osd.showOSD();
                s.currentInput = '00000000';
            }

            if (s.keyTimeout>-1) {
                window.clearTimeout(s.keyTimeout);
                s.keyTimeout = -1;
            }
            s.keyTimeout = window.setTimeout(function () { s.setChannel(); },2000);
            s.currentInput += input;
            s.currentInput = s.currentInput.substr(s.currentInput.length-8);

            s.osd.updateOSD({
                channelNumber : parseInt(s.currentInput),
                padLength : s.data.availableChannels.toString().length,
                channelInfo : ''
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
                s.currentChannel = s.data.availableChannels;
            } else if (s.currentChannel>s.data.availableChannels) {
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
            s.osd.updateOSD({
                autoVisible : autoVisible,
                autoMultiplier : s.autoDelayMultiply
            });
            s.osd.showOSD(4000);
        },
        killAutoTimer : function () {
            if (s.autoTimer>0) {
                s.osd.updateOSD({
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
                for (i = 0; i < s.data.availableChannels; i++) {
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
            if (s.currentChannel > s.data.availableChannels) {
                s.currentChannel = s.data.availableChannels;
            }

            document.getElementById('content').style.display = 'none';

            if (s.currentInput.length > 0) {
                s.currentChannel = parseInt(GVTV.currentInput);
                s.currentInput = '';
            }

            s.data.requestChannelContent(s.currentChannel, function (data) {
                if (data===null || typeof data['url']==='undefined') return;
                var ext = data['url'].split('.').pop().toLowerCase();
                if (ext==='gif') {
                    document.getElementById('content').style.backgroundImage = 'url(/db/gif/'+s.currentChannel+'.gif)';
                    document.getElementById('content').style.display = 'block';
                }
                s.osd.updateOSD({
                    channelNumber : s.currentChannel,
                    padLength : s.data.availableChannels.toString().length,
                    autoVisible : false
                });
                s.osd.showOSD(4000);
            });
        }
    };
    return s;
});
