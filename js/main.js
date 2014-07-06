require.config({
    baseUrl: 'js'
});

require(['src/gvtv'], function (gvtv) {
    gvtv.init();
});
