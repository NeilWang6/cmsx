/**
 * Æô¶¯
 * @author : arcthur.cheny
 * @createTime : 2013-08-05
 * @modifyTime : 2013-08-05
 */

if (!Tools.sampling()) {
    return;
}

try {
    var hasMoved = CookieProcessor.get('sync_cookie');
    
    if (Config.is1688) {
        if (!hasMoved || hasMoved !== 'true') {
            Recorder.jsonp(Config.firstUserServer, {}, function(data) {
                if (data && data.content && data.content.ali_beacon_id) {
                    for (var i in data.content) {
                        CookieProcessor.set(i, data.content[i]);
                    }
                }
                
                Recorder.send(Config.changeServer, '');
                Essential.send();
            });
        } else {
            Essential.send();
        }
    } else {
        if (!hasMoved || hasMoved !== 'true') {
            Recorder.send(Config.changeServer, '');
        }
        
        Essential.send();
    }
    
    Recorder.loadScript('http://a.tbcdn.cn/s/aplus_b2b.js?t=20130911');
    SPM.init();
    
} catch(e) {
    Recorder.sendError(e, 'essential');
}