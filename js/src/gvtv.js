define(['src/keyboard','src/osd', 'src/util', 'src/msg'], function (keyboard, osd, util, msg) {
    var s = {
        dataSource: null,
        platform: null,
        msg: msg,
        targetDivId: 'gvtv',
        gridSize: {
            x: 1,
            y: 1
        },
        currentChannel: 1,
        currentInput : '',
        keyTimeout: -1,
        autoTimer: -1,
        autoBaseDelay: 500,
        autoDelayMultiply: 5,
        displays: 0,
        displayIndex: 0,
        randomContentTargets: [],
        randomChannels: [],
        init : function (dataSource, platform) {
            s.dataSource = dataSource;
            s.platform = platform;
            document.getElementById(s.targetDivId).innerHTML = '<div id="content-wrapper"></div><div id="menu-wrapper"><div id="menu-content"></div></div>';
            s.updateChannels(function (err) {
                if (err) return;
                s.currentChannel = Math.round(Math.random() * (s.dataSource.available - 1)) + 1;
                s.buildDisplays(function () {
                    s.autoChannel(1, false);
                    keyboard.registerKeys(s.channelCommand);
                    msg.toggle('intro', null, function () {
                        osd.setDisabled(msg.hasContent());
                    });
                });
            });
        },
        buildDisplays : function (callback) {
            s.displays = s.gridSize.x * s.gridSize.y;
            var cellSizeX = (100.0/ s.gridSize.x).toFixed(2),
                cellSizeY = (100.0/ s.gridSize.y).toFixed(2),
                css = 'width:' + cellSizeX + '%;height:' + cellSizeY + '%;',
                fontSizeCss = 'font-size:' + (3.5 / (s.gridSize.x > s.gridSize.y ? s.gridSize.x : s.gridSize.y)).toFixed(2) + 'em;';
                displayCode = '',
                i = 0;
            for (var y = 0; y < s.gridSize.y; y += 1) {
                for (var x = 0; x < s.gridSize.x; x += 1) {
                    var positionCss = 'left:' + cellSizeX*x + '%;' + 'top:' + cellSizeY*y + '%;'
                    displayCode += '<div id="display_' + i + '" style="' + css + fontSizeCss + positionCss + '" class="display"><div class="content"></div><div class="osd"></div></div>';
                    i += 1;
                }
            }
            document.getElementById('content-wrapper').innerHTML = displayCode;
            s.randomContentTargets = util.randomIntegerArray(s.displays, 0);
            s.setChannel();
            if (callback) callback();
        },
        channelNumberInput: function (input) {
            var displayLength = s.dataSource.available.toString().length;

            s.stopAutoTimer();

            osd.show();
            s.currentInput = '';

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
                targetIndex: s.displayIndex,
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
            } else if (input==='x') {
                s.gridSize.x += 1;
                if (s.gridSize.x > 8) s.gridSize.x = 1;
                s.buildDisplays();
            } else if (input==='y') {
                s.gridSize.y += 1;
                if (s.gridSize.y > 8) s.gridSize.y = 1;
                s.buildDisplays();
            } else if (input==='fullscreen') {
                s.platform.toggleFullscreen(s.targetDivId);
            } else if (input==='help') {
                msg.toggle('help', null, function () {
                    osd.setDisabled(msg.hasContent());
                });
            } else if (input==='osd') {
                if (msg.hasContent()) return;
                osd.setDisabled(osd.disabled ? false : true);
            } else if (input==='action') {
                if (msg.hasContent()) msg.executeAction();
            } else {
                s.stopAutoTimer();
                s.channelNumberInput(input);
            }
        },
        channelMove : function (delta) {
            s.currentChannel += delta;
            if (s.currentChannel < 1) {
                s.currentChannel = s.dataSource.available;
            } else if (s.currentChannel > s.dataSource.available) {
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
                targetIndex: s.displayIndex,
                channelNumber : s.currentChannel,
                autoVisible : autoVisible,
                autoMultiplier : s.autoDelayMultiply
            });
        },
        stopAutoTimer : function () {
            if (s.autoTimer>0) {
                osd.update({
                    targetIndex: s.displayIndex,
                    channelNumber : s.currentChannel,
                    autoVisible : false
                });
                window.clearInterval(s.autoTimer);
                s.autoTimer = -1;
            }
        },
        randomChannel : function () {
            var channel;
            if (s.randomChannels.length==0) {
                s.randomChannels = util.randomIntegerArray(s.dataSource.available, 1);
            }
            channel = s.randomChannels.pop();
            s.currentChannel = channel;
            s.setChannel();
        },
        setChannel : function () {

            if (s.autoTimer > 0) {
                if (s.randomContentTargets.length == 0) {
                    s.randomContentTargets = util.randomIntegerArray(s.displays, 0);
                }
                s.displayIndex = s.randomContentTargets.pop();
            } else {
                s.displayIndex += 1;
                if (s.displayIndex >= s.displays) {
                    s.displayIndex = 0;
                }
            }
            var target = 'display_' + s.displayIndex;

            document.getElementById(target).getElementsByClassName('content')[0].style.display = 'none';

            if (s.currentInput.length > 0) {
                s.currentChannel = parseInt(s.currentInput);
                s.currentInput = '';
            }

            if (s.currentChannel > s.dataSource.available) {
                s.currentChannel = s.dataSource.available;
            }

            s.dataSource.getChannel(s.currentChannel, function (err, data) {
                if (err || !data) return;
                s.platform.loadBgImage('/gif/' + s.currentChannel + '.gif', s.dataSource.dataHost, function (err, bgData) {
                    document.getElementById(target).getElementsByClassName('content')[0].style.backgroundImage = bgData;
                    document.getElementById(target).getElementsByClassName('content')[0].style.display = 'block';
                    osd.update({
                        targetIndex: s.displayIndex,
                        channelNumber : s.currentChannel,
                        autoVisible : false
                    });
                });
            });
        },
        updateChannels : function (callback) {
            s.dataSource.getAvailable(function (err, status, data) {
                if (err || status===false) {
                    if (typeof callback === 'function') return callback(err, null);
                }
                if (data) {
                    osd.padLength = s.dataSource.available.toString().length;
                }
                if (typeof callback === 'function') callback(err, status);
            });
            window.setTimeout(s.updateChannels, 10000);
        }
    };
    return s;
});
