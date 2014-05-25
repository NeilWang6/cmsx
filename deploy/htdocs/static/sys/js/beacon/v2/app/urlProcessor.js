/**
 * URL处理器
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-10-15
 * @modifyTime : 2013-07-03
 */

var UrlProcessor = (function(){
    /*
     * Query params
     * @desc 将“a=1&b=2&c=3”转化为{a=1,b=2,c=3}的hash对象
     * @param {Object} param
     */
    var _toQueryParams = function(param) {
        var hash = {}
          , params = param.split('&')
          , rd = /([^=]*)=(.*)/;

        for (var j = 0, len = params.length; j < len; j++) {
            var match = rd.exec(params[j]);
            
            if (!match) continue;
            
            var key = decodeURIComponent(match[1])
              , value = match[2] ? decodeURIComponent(match[2]) : undefined;
            
            if(hash[key] !== undefined) {
                if (hash[key].constructor != Array) {
                    hash[key] = [hash[key]];
                }
                if (value) { 
                    hash[key].push(value);
                }
            } else {
                hash[key] = value;
            }
        }
        return hash;
    };
    
    return {
        /*
         * Get Domain
         * @param {String} url
         */
        getDomain : function(url) {
            var _domain = loc.host;
            
            if (url) {
                _domain = url.split('://')[1].toLowerCase();
                
                if (_domain.indexof('/') > -1){
                    _domain = _domain.split('/')[0];
                }
            }
            
            return _domain;
        },
        
        /*
         * Get Params
         * @param {String} url
         */
        getParams : function(url) {
            var args = ''
              , params = url.split('?')[1];
            
            if (params) {
                args = _toQueryParams(url.split('?')[1]);
            }
            
            return args;
        },
        
        /*
         * Get Param
         * @param {String} url
         * @param {Object} param
         */
        getParam : function(url, param) {
            var params = getParams(url);
            return params[param];
        },
        
        /*
         * Set Param
         * @param {String} url
         * @param {Object} param
         * @param {Boolean} isCover
         */
        setParams : function(url, obj, isCover) {
            url = url || loc.href;

            var chips = url.split('#')
              , ret = url.split('?')[0]
              , search = Tools.combineParam(getParams(url), obj, '&', isCover)
              , hash = chips[1] || '';

            if (search) {
                ret += '?' + search;
            }
            
            if (hash) {
                ret += '?' + hash;
            }
            
            return ret;
        }
    };
}());