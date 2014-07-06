require.config({
    baseUrl: 'js'
});

require(['src/gvtv', 'src/data-http', 'src/web'], function (gvtv, data, platform) {
    gvtv.init(data, platform);
});
