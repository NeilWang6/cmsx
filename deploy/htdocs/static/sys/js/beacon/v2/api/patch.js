/**
 * ºÊ»›¿œ∞Ê±æ≤π∂°
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-30
 * @modifyTime : 2013-07-03
 */

win.dmtrack = {
    clickstat : function(url, param){
        Api.log(url, param);
    },
    clickunite : function(param) {
        Api.log(Config.tracelogSever, param);
    },
    tracelog : function(param){
        Api.log(Config.tracelogSever, {
            tracelog : param
        });
    },
    beacon_click : function(url, refer, param){
        Api.asysLog(url, refer, param);
    },
    flash_dmtracking : function(url, refer){
        Api.flashLog(url, refer);
    }
};