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
        },
        loadSnippet : function (snippet, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status==200) {
                    callback(null, xhr.responseText);
                } else if (xhr.readyState == 4) {
                    callback(new Error('failed to fetch snippet status: ' + xhr.status), null);
                }
            };
            xhr.open('GET', 'js/snippets/' + snippet + '.html', true);
            xhr.send();
        }
    }
    return s;
});