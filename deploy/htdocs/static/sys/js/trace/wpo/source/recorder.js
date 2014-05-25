var recorder = function(testId, testOne, testTwo, testThree, testFour){
    var url = 'http://abtest.china.alibaba.com/analysis.html',
    getCookie = function( name ){
        var value = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
        return value ? unescape(value[1]) : '';
    },
    buildUrlParams = function(o){
        var ret = [];
        for(var item in o){
            ret.push(item+'='+o[item])
        }
        return ret.join('&');
    },
    doRecorder = function(url){
        var img = new Image();
        img.src = url;
    },
    init = function(){
        var ua = uaMonitor(),
        os = ua.system.name,
        browser = ua.extraBrowser,
        browserType = browser.name+browser.ver.toFixed(1),
        uid = getCookie('ali_beacon_id'),
        params = {
            test_id : testId,
            uid : uid,
            browser_type : browserType,
            os_type : os,
            test_one : testOne || 0,
            test_two : testTwo || 0,
            test_three : testThree || 0,
            test_four : testFour || 0
        },
        requestUrl = url + '?' + buildUrlParams(params);
        doRecorder(requestUrl);
    }();
};