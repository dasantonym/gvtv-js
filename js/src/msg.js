define(function () {
    var s = {
        currentSnippet : null,
        currentAction : null,
        platform : null,
        toggle : function (snippet, action, callback) {
            if (s.currentSnippet == snippet && document.getElementById('gvtv-mc').innerHTML.length > 0) {
                s.hide();
                return callback(null);
            }
            s.currentSnippet = snippet;
            s.currentAction = action;
            s.platform.loadSnippet(s.currentSnippet, function (err, data) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                document.getElementById('gvtv-mc').innerHTML = data;
                document.getElementById('gvtv-mw').style.display = 'block';
                callback(null);
            });
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
            return document.getElementById('gvtv-mc').innerHTML.length > 0 || document.getElementById('gvtv-mw').style.display == 'block';
        }
    };
    return s;
});