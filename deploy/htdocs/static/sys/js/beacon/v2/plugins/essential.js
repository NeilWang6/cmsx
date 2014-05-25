/**
 * 必要业务监控
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-16
 * @modifyTime : 2013-08-03
 */

var Essential = Manifold.Essential = (function() {
    //验证用户是否登录
    var checkLogin = function() {
        var isLogin = (CookieProcessor.get('__cn_logon__') === 'true');
        
        return isLogin;
    },
    //获取resin信息串
    getResinTraceInfo = function() {
        var origin = win['dmtrack_c'];
        
        if (!origin || origin === '{-}') {
            return {};
        }
        
        origin = origin.substring(1, origin.length - 1).replace(/ali_resin_trace=/, '');
        return Tools.parseParam(origin, '|');
    },
    //给acookie（集团cookie统计）服务器打点
    sendToAcookie = function(){
        try{
            var refer = Tools.getReferrer()
              , random = Tools.random()
              , acookieAdditional = Globals.customize['acookieAdditional'] || {}
              , acookieJson = {
                  cache : random,
                  pre : refer
                };
                
            Recorder.sendStat(Config.acookieSever, {}, Tools.combineJson(acookieJson,acookieAdditional));
        } catch(e) {
            Recorder.sendError(e, 'acookie');
        }
    },
    //创建简易ua字符串，只包含操作系统信息、浏览器信息、用户分辨率和浏览器语言
    createUaStr = function() {
        var browserObject = UA.extraBrowser
          , browser = browserObject.name + browserObject.ver.toFixed(1)
          , system = UA.system.name
          , sysStr = browser + '|' + system + '|' + UA.resolution + '|' + UA.language;
          
        return sysStr;
    },
    //根据配置获取不同的cookie值
    getCookies = function(obj) {
        var needCustomCookies = Globals.customize.needCookies
          , needCookies = Config.needDefaultCookies;

        if (needCustomCookies && Tools.isArray(needCookies)){
            needCookies = needCookies.concat(needCustomCookies);
        }
        
        var len = needCookies.length, key, value;
        
        while (len--) {
            key = needCookies[len];
            value = CookieProcessor.get(key) || '-';
            obj[key] = value;
        }
    };
    return {
        send : function() {
            var refer = encodeURI(Tools.getReferrer())
              , apacheTrackJson = CookieProcessor.getSubCookies('ali_apache_track') || {}
              , resinTraceInfo = getResinTraceInfo()
              , redirectInfo = CookieProcessor.getSubCookies('aliBeacon_bcookie') || {}
              , currentHref = encodeURI(loc.href);

            if (Config.isSetCookieToAcookie) {
                sendToAcookie();
            }
            
            //根据配置获取不同的cookie值
            getCookies(apacheTrackJson);
            
            if (Config.isCheckLogin && !resinTraceInfo['c_signed']) {
                //集成是否已登录信息
                resinTraceInfo['c_signed'] = checkLogin() ? 1 : 0;
            }
            
            //集成跳转信息
            Tools.combineJson(resinTraceInfo, redirectInfo, true);
            
            //删除挂载跳转信息的cookie
            CookieProcessor.remove('aliBeacon_bcookie');
            
            //发送请求，发送格式冗余、低级是为了兼容老版本
            Recorder.sendStat(Config.logSeverOne, {
                p : '{'+ Config.siteNo +'}',
                u : '{'+ Tools.trimHttpStr(currentHref) +'}',
                m : '{GET}',
                s : '{200}',
                r : '{'+ refer+'}',
                a : '{'+ Tools.combineParam(apacheTrackJson, {}, '|') +'}',
                b : '{-}',
                c : '{'+ Tools.combineParam(resinTraceInfo, redirectInfo, '|', true) +'}'
            },{
                spm_cnt : SPM.cnt,
                pageid : Tools.randomPageId(),
                sys : createUaStr()
            });
        }
    }
}());