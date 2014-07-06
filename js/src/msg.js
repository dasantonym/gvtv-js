define(['jquery'], function ($) {
    var s = {
        currentSnippet : null,
        currentAction : null,
        toggle : function (snippet, action, callback) {
            if (s.currentSnippet == snippet && document.getElementById('gvtv-mc').innerHTML.length > 0) {
                s.hide();
                return callback(null);
            }
            s.currentSnippet = snippet;
            s.currentAction = action;
            $.ajax({
                url: 'js/snippets/' + s.currentSnippet + '.html',
                type: 'get',
                success: function(data){
                    document.getElementById('gvtv-mc').innerHTML = data;
                    document.getElementById('gvtv-mw').style.display = 'block';
                    callback(null);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    console.log('error getting snippet', errorThrown);
                    callback(errorThrown);
                }
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
            return document.getElementById('gvtv-mc').innerHTML.length > 0;
        }
    };
    return s;
});