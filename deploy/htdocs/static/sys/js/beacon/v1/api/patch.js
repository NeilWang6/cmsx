/**
 * �����ϰ汾����
 * @author : yu.yuy
 * @createTime : 2011-11-30
 * @modifyTime : 2012-05-09
 */
(function($ns){
    var G = $ns.globals,
    WIN = G.win,
    C = $ns.config,
    API = $ns.api;
    WIN.sk_dmtracking = function(){
        if(G.isConflicted === true){
            return;
        }
        $ns.moduleManager.require('essential').init();
    };
    WIN.dmtrack = {
        clickstat : function(url,param){
            API.log(url,param);
        },
        tracelog : function(param){
            API.log(C.tracelogSever,{
                tracelog : param
            });
        },
        beacon_click : function(url,refer,param){
            API.asysLog(url,refer,param);
        },
        //������ʹ�õĴ��ӿڣ��Ժ�����
        flash_dmtracking : function(url,refer){
            API.flashLog(url,refer);
        }
    };
})(MAGNETO);
