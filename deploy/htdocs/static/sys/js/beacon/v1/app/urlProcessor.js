/**
 * URL处理器
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-10-15
 * @modifyTime : 2012-07-04
 */

(function($ns){
    $ns.moduleManager.register('urlProcessor', function(){
        var that = this,
        T = that.tools,
        LOCATION = window.location,
        // 将“a=1&b=2&c=3”转化为{a=1,b=2,c=3}的hash对象
        _toQueryParams = function(s){
            var hash = {},
            params = s.split('&'),
            rd = /([^=]*)=(.*)/;
            for(var j=0;j<params.length;j++) {
                var match=rd.exec(params[j]);
                if(!match) continue;
                var key=decodeURIComponent(match[1]);
                var value=match[2]?decodeURIComponent(match[2]):undefined;
                if(hash[key]!==undefined) {
                    if(hash[key].constructor!=Array)
                        hash[key]=[hash[key]];
                    if(value)
                        hash[key].push(value);
                } else {
                    hash[key]=value;
                }
            }
            return hash;
        };
        return {
            getDomain : function(url){
                var _domain = "";
                if(url){
                    _domain = url.split("://")[1].toLowerCase();
                    if(_domain.indexof("/") > -1){
                        _domain = _domain.split("/")[0];
                    }
                }
                else{
                    _domain = LOCATION.host;
                }
                return _domain;
            },
            getParams : function(url){
                var args = '', params = url.split('?')[1];
                if (params) {
                    args = _toQueryParams(url.split('?')[1]);
                }
                return args;
            },
            getParam : function(url,param){
                var params = this.getParams(url);
                return params[param];
            },
            setParams : function(url, o, isCover){
                url = url || LOCATION.href;
                var chips = url.split('#'),
                ret = url.split('?')[0],
                search = T.combineParam(this.getParams(url), o, '&', isCover),
                hash = chips[1] || '';
                if(search){
                    ret += '?'+search;
                }
                if(hash){
                    ret += '?'+hash;
                }
                return ret;
            }
        }
    },true);
}(MAGNETO));