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
        loadBgImage : function (url, callback) {
            callback(null, 'url(' + url + ')');
        }
    }
    return s;
});