////
//
// web specific features

define(function () {
    var s = {
        toggleFullscreen : function (target) {
            var elem = document.getElementById(target);
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
              elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
              elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen();
            }
        },
        loadBgImage : function (url, dataHost, callback) {
            callback(null, 'url(' + dataHost + url + ')');
        }
    }
    return s;
});