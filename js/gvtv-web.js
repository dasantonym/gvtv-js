require.config({
    baseUrl: 'js'
});

require(['src/gvtv', 'src/data-http', 'src/platform-web'], function (gvtv, data, platform) {
    gvtv.init(data, platform);
});
