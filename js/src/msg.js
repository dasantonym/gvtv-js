define(['jquery'], function ($) {
    var s = {
        currentSnippet : null,
        currentAction : null,
        toggle : function (snippet, action, callback) {
            if (s.currentSnippet == snippet && document.getElementById('menu-content').innerHTML.length > 0) {
                s.hide();
                return callback(null);
            }
            s.currentSnippet = snippet;
            s.currentAction = snippet;
            $.ajax({
                url: 'js/snippets/' + s.currentSnippet + '.html',
                type: 'get',
                success: function(data){
                    document.getElementById('menu-content').innerHTML = data;
                    document.getElementById('menu-wrapper').style.display = 'block';
                    callback(null);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    console.log('error getting snippet', errorThrown);
                    callback(errorThrown);
                }
            });
        },
        hide : function () {
            document.getElementById('menu-wrapper').style.display = 'none';
            document.getElementById('menu-content').innerHTML = '';
        },
        executeAction : function () {
            if (typeof s.currentAction === 'function') {
                s.currentAction();
            }
        },
        hasContent : function () {
            return document.getElementById('menu-content').innerHTML.length > 0;
        }
    };
    return s;
});