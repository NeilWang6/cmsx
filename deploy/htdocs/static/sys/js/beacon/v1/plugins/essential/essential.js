/**
 * 必要业务监控
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-16
 * @modifyTime : 2012-01-22
 */
(function($ns){
    $ns.moduleManager.register('essential',function(){
        var that = this,
        G = $ns.globals,
        MM = that.moduleManager,
        //TM = that.taskManager,
        T = that.tools,
        C = that.config,
        CP = MM.require('cookieProcessor'),
        SPM = MM.require('spm'),
        R = MM.require('recorder'),
        UA = MM.require('ua'),
        customize = G.customize,
        //验证用户是否登录
        checkLogin = function(){
            var lastLoginId,
            isLogin = CP.get('__cn_logon__')==='true';
            return isLogin;
        },
        //获取resin信息串
        getResinTraceInfo = function(){
            var origin = G.win['dmtrack_c'];
            if(!origin || origin === '{-}'){
                return {};
            }
            origin = origin.substring(1,origin.length-1).replace(/ali_resin_trace=/,'');
            return T.parseParam(origin,'|');
        },
        //给acookie（集团cookie统计）服务器打点
        sendToAcookie = function(){
            try{
                var refer = T.getReferrer(),
                random = T.random(),
                acookieAdditional = customize['acookieAdditional'] || {},
                acookieJson = {
                    cache : random,
                    pre : refer
                };
                R.sendEssentialInfo(C.acookieSever,{},T.combineJson(acookieJson,acookieAdditional));
            }
            catch(e){
                T.sendErrorInfo(e,'acookie');
            }
        },
        //创建简易ua字符串，只包含操作系统信息、浏览器信息、用户分辨率和浏览器语言
        createUaStr = function(){
            var browserObject = UA.extraBrowser,
            browser = browserObject.name+browserObject.ver.toFixed(1),
            system = UA.system.name,
            sysStr = browser+'|'+system+'|'+UA.resolution+'|'+UA.language;
            return sysStr;
        },
        //根据配置获取不同的cookie值
        getCookies = function(o){
            var needCustomCookies = customize.needCookies,
            needCookies = C.needDefaultCookies,
            l,
            key,
            value = '-';
            if(T.isArray(needCookies) && needCustomCookies != undefined){
                needCookies = needCookies.concat(needCustomCookies);
            }
            l = needCookies.length;
            while(l--){
                key = needCookies[l];
                value = CP.get(key) || '-';
                o[key] = value;
            }
        },
        beaconSend = function() {
            var refer = encodeURI(T.getReferrer()),
            apacheTrackJson = CP.getSubCookies('ali_apache_track') || {},
            url = C.logSeverOne,
            resinTraceInfo = getResinTraceInfo(),
            redirectInfo = CP.getSubCookies('aliBeacon_bcookie') || {},
            //当前页面的URL
            currentHref = encodeURI(G.doc.location.href);
            if(C.isSetCookieToAcookie){
                sendToAcookie();
            }
            //根据配置获取不同的cookie值
            getCookies(apacheTrackJson);
            
            if(C.isCheckLogin && resinTraceInfo['c_signed'] == undefined){
                //集成是否已登录信息
                resinTraceInfo['c_signed'] = checkLogin() ? 1 : 0;
            }
            //集成跳转信息
            T.combineJson(resinTraceInfo,redirectInfo,true);
            //删除挂载跳转信息的cookie
            CP.remove('aliBeacon_bcookie');
            //发送请求，发送格式冗余、低级是为了兼容老版本
            R.sendEssentialInfo(url,{
                p : '{'+C.siteNo+'}',
                u : '{'+T.trimHttpStr(currentHref)+'}',
                m : '{GET}',
                s : '{200}',
                r : '{'+refer+'}',
                a : '{'+T.combineParam(apacheTrackJson,{},'|')+'}',
                b : '{-}',
                c : '{'+T.combineParam(resinTraceInfo,redirectInfo,'|',true)+'}'
            },{
                pageid : T.randomPageId(),
                sys : createUaStr()
            });
        },
        init = function(){
            //抽样
            if(!T.sampling()){
                return;
            }
            try{
                var hasMoved = CP.get('sync_cookie');

                if (!hasMoved || hasMoved !== 'yes') {
                    R.send(C.changeServer, '');
                }
                
                beaconSend();
                SPM.init();
            }
            catch(e){
                T.sendErrorInfo(e,'essential');
            }
        };
        return {
            init : init
        }
    },true);
})(MAGNETO);