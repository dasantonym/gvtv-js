define(function () {
    var s = {
        currentSnippet : null,
        currentAction : null,
        toggle : function (snippet, action, callback) {
            if (s.currentSnippet == snippet && document.getElementById('gvtv-mc').innerHTML.length > 0) {
                s.hide();
                return callback(null);
            }
            var xhr = new XMLHttpRequest();
            s.currentSnippet = snippet;
            s.currentAction = action;
            xhr.onreadystatechange = function () {
                if (xhr.readyState==4 && xhr.status==200) {
                    document.getElementById('gvtv-mc').innerHTML = xhr.responseText;
                    document.getElementById('gvtv-mw').style.display = 'block';
                    callback(null);
                } else {
                    callback(new Error('failed to fetch snippet'));
                }
            };
            xhr.open('GET', 'js/snippets/' + s.currentSnippet + '.html', true);
            xhr.send();
        },
        hide : function () {
            document.getElementById('gvtv-mw').style.display = 'none';
            document.getElementById('gvtv-mc').innerHTML = '';
        },
        executeAction : function () {
            if (typeof s.currentAction === 'function') {
                s.currentAction();
            }
        },
        hasContent : function () {
            return document.getElementById('gvtv-mc').innerHTML.length > 0;
        }
    };
    return s;
});