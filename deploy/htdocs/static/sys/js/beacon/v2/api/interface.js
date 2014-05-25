/**
 * 外放接口
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-30
 * @modifyTime : 2013-07-03
 */

var Api = Manifold.api = {
    log : function(url, params) {
        try {
            var paramJson = {}
              , oldParamJson = {}
              , urlList = url.split('?');
                
            if (urlList[1]) {
                oldParamJson = Tools.parseParam(urlList[1], '&');
            }
            if (Tools.isString(params)) {
                if (params.substring(0, 1) === '?'){
                    params = params.substring(1);
                }
                paramJson = Tools.parseParam(params, '&');
            } else if (Tools.isObject(params)) {
                paramJson = params;
            }
            paramJson['st_page_id'] = Globals.pageId;
            Recorder.sendStat(urlList[0], {}, Tools.combineJson(paramJson,oldParamJson));
        } catch(e) {
            Recorder.sendError(e, 'log');
        }
    },
    asysLog : function(url, refer, param) {
        try {
            if (!refer || refer === '-') {
                refer = loc.href;
            }
            Recorder.sendStat(Config.logSeverTwo, {
                p : '{'+ Config.siteNo +'}',
                u : '{'+ Tools.trimHttpStr(url) +'}',
                m : '{GET}',
                s : '{200}',
                r : '{'+ refer +'}',
                a : '{'+ CookieProcessor.get('ali_apache_track') +'}',
                b : '{-}',
                c : '{'+ Tools.combineParam(param || {},{},'|') || '-' + '}'
            },{
                pageid : Tools.randomPageId()
            });
        } catch(e) {
            Recorder.sendError(e, 'asysLog');
        }
    },
    flashLog : function(url, refer) {
        try {
            var origin = win['dmtrack_c'];
            if (!origin || origin === '{-}'){
                origin = '-';
            } else {
                origin = origin.substring(1, origin.length - 1).replace(/ali_resin_trace=/,'');
            }
            if (!refer || refer === '-'){
                refer = loc.href;
            }
            Recorder.sendStat(Config.logSeverTwo, {
                p : '{'+ Config.siteNo +'}',
                u : '{'+ url +'}',
                m : '{GET}',
                s : '{200}',
                r : '{'+ refer +'}',
                a : '{'+ CookieProcessor.get('ali_apache_track') +'}',
                b : '{-}',
                c : '{'+ origin +'}'
            },{
                pageid : Tools.randomPageId(),
                dmtrack_type : 'xuanwangpu'
            });
        } catch(e) {
            Recorder.sendError(e, 'flashLog');
        }
    }
}