/**
 * 外放接口
 * @author : yu.yuy
 * @createTime : 2011-11-30
 * @modifyTime : 2012-05-08
 */
(function($ns){
    var G = $ns.globals,
    DOC = G.doc,
    T = $ns.tools,
    C = $ns.config,
    MM = $ns.moduleManager,
    R = MM.require('recorder'),
    CP = MM.require('cookieProcessor');
    $ns.api = {
        log : function(url, params){
            try{
                var paramJson = {},
					oldParamJson = {},
					urlList = url.split('?');
				if(urlList[1] !== undefined){
					oldParamJson = T.parseParam(urlList[1],'&');
				}
                if(T.isString(params)){
                    if(params.substring(0,1) === '?'){
                        params = params.substring(1);
                    }
                    paramJson = T.parseParam(params,'&');
                }
                else if(T.is(params,Object)){
                    paramJson = params;
                }
                paramJson['st_page_id'] = G.pageId;
                R.sendEssentialInfo(urlList[0],{},T.combineJson(paramJson,oldParamJson));
            }
            catch(e){
                T.sendErrorInfo(e,'log');
            }
        },
        asysLog : function(url,refer,param){
            try{
                if(!refer || refer === '-'){
                    refer = DOC.location.href;
                }
                R.sendEssentialInfo(C.logSeverTwo,{
                    p : '{'+C.siteNo+'}',
                    u : '{'+T.trimHttpStr(url)+'}',
                    m : '{GET}',
                    s : '{200}',
                    r : '{'+refer+'}',
                    a : '{'+CP.get('ali_apache_track')+'}',
                    b : '{-}',
                    c : '{'+T.combineParam(param || {},{},'|') || '-'+'}'
                },{
                    pageid : T.randomPageId()
                });
            }
            catch(e){
                T.sendErrorInfo(e,'asysLog');
            }
        },
        //炫旺铺使用的打点接口，稍后会废弃
        flashLog : function(url,refer){
            try{
                var origin = G.win['dmtrack_c'];
                if(!origin || origin === '{-}'){
                    origin = '-';
                }
                else{
                    origin = origin.substring(1,origin.length-1).replace(/ali_resin_trace=/,'');
                }
                if(!refer || refer === '-'){
                    refer = DOC.location.href;
                }
                R.sendEssentialInfo(C.logSeverTwo,{
                    p : '{'+C.siteNo+'}',
                    u : '{'+url+'}',
                    m : '{GET}',
                    s : '{200}',
                    r : '{'+refer+'}',
                    a : '{'+CP.get('ali_apache_track')+'}',
                    b : '{-}',
                    c : '{'+origin+'}'
                },{
                    pageid : T.randomPageId(),
                    dmtrack_type:"xuanwangpu"
                });
            }
            catch(e){
                T.sendErrorInfo(e,'asysLog');
            }
        }
    }
})(MAGNETO);