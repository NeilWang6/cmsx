/**
 * ��Ҫҵ����
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-16
 * @modifyTime : 2013-08-03
 */

var Essential = Manifold.Essential = (function() {
    //��֤�û��Ƿ��¼
    var checkLogin = function() {
        var isLogin = (CookieProcessor.get('__cn_logon__') === 'true');
        
        return isLogin;
    },
    //��ȡresin��Ϣ��
    getResinTraceInfo = function() {
        var origin = win['dmtrack_c'];
        
        if (!origin || origin === '{-}') {
            return {};
        }
        
        origin = origin.substring(1, origin.length - 1).replace(/ali_resin_trace=/, '');
        return Tools.parseParam(origin, '|');
    },
    //��acookie������cookieͳ�ƣ����������
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
    //��������ua�ַ�����ֻ��������ϵͳ��Ϣ���������Ϣ���û��ֱ��ʺ����������
    createUaStr = function() {
        var browserObject = UA.extraBrowser
          , browser = browserObject.name + browserObject.ver.toFixed(1)
          , system = UA.system.name
          , sysStr = browser + '|' + system + '|' + UA.resolution + '|' + UA.language;
          
        return sysStr;
    },
    //�������û�ȡ��ͬ��cookieֵ
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
            
            //�������û�ȡ��ͬ��cookieֵ
            getCookies(apacheTrackJson);
            
            if (Config.isCheckLogin && !resinTraceInfo['c_signed']) {
                //�����Ƿ��ѵ�¼��Ϣ
                resinTraceInfo['c_signed'] = checkLogin() ? 1 : 0;
            }
            
            //������ת��Ϣ
            Tools.combineJson(resinTraceInfo, redirectInfo, true);
            
            //ɾ��������ת��Ϣ��cookie
            CookieProcessor.remove('aliBeacon_bcookie');
            
            //�������󣬷��͸�ʽ���ࡢ�ͼ���Ϊ�˼����ϰ汾
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