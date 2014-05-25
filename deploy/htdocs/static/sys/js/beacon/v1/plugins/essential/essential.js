/**
 * ��Ҫҵ����
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
        //��֤�û��Ƿ��¼
        checkLogin = function(){
            var lastLoginId,
            isLogin = CP.get('__cn_logon__')==='true';
            return isLogin;
        },
        //��ȡresin��Ϣ��
        getResinTraceInfo = function(){
            var origin = G.win['dmtrack_c'];
            if(!origin || origin === '{-}'){
                return {};
            }
            origin = origin.substring(1,origin.length-1).replace(/ali_resin_trace=/,'');
            return T.parseParam(origin,'|');
        },
        //��acookie������cookieͳ�ƣ����������
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
        //��������ua�ַ�����ֻ��������ϵͳ��Ϣ���������Ϣ���û��ֱ��ʺ����������
        createUaStr = function(){
            var browserObject = UA.extraBrowser,
            browser = browserObject.name+browserObject.ver.toFixed(1),
            system = UA.system.name,
            sysStr = browser+'|'+system+'|'+UA.resolution+'|'+UA.language;
            return sysStr;
        },
        //�������û�ȡ��ͬ��cookieֵ
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
            //��ǰҳ���URL
            currentHref = encodeURI(G.doc.location.href);
            if(C.isSetCookieToAcookie){
                sendToAcookie();
            }
            //�������û�ȡ��ͬ��cookieֵ
            getCookies(apacheTrackJson);
            
            if(C.isCheckLogin && resinTraceInfo['c_signed'] == undefined){
                //�����Ƿ��ѵ�¼��Ϣ
                resinTraceInfo['c_signed'] = checkLogin() ? 1 : 0;
            }
            //������ת��Ϣ
            T.combineJson(resinTraceInfo,redirectInfo,true);
            //ɾ��������ת��Ϣ��cookie
            CP.remove('aliBeacon_bcookie');
            //�������󣬷��͸�ʽ���ࡢ�ͼ���Ϊ�˼����ϰ汾
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
            //����
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