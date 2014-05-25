/**
 * Recorder
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-10-15
 * @modifyTime : 2013-07-03
 */

var Recorder = (function(){
    /*
     * Send by image
     * @param {String} url
     * @param {String} param of url
     * @api public
     */
    var sendByImage = function(url, params, callback) {
        var img = new Image()
          , rnd_id = '_img_' + Tools.random()
          , link_char = url.indexOf('?') == -1 ? '?' : '&'
          , src
          , param_data = params ? (Tools.isString(params) ? params : '') : '';

        // 在全局变量中引用 img，防止 img 被垃圾回收机制过早回收造成请求发送失败
        // 参考：http://hi.baidu.com/meizz/blog/item/a0f4fc0ae9d8be1694ca6b05.html
        win[rnd_id] = img;

        img.onload = img.onerror = function () {
            win[rnd_id] = null;
            !callback || callback();
        };

        img.src = src = param_data ? (url + link_char + param_data) : url;
        img = null;

        return src;
    },

    /*
     * Load script
     * @param {String} url
     * @api public
     */
    loadScript = function (url, pfnError) {
        var head = doc.getElementsByTagName('head')[0]
          , script = doc.createElement('script')
          , done = false;

        script.src = url;
        script.async = true;

        var errorHandler = pfnError;
        if ( Tools.isFunction(errorHandler) ) {
            script.onerror = function(ex){
                errorHandler({url: url, event: ex});
            };
        }

        script.onload = script.onreadystatechange = function() {
            if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
                done = true;
                script.onload = script.onreadystatechange = null;
                if ( script && script.parentNode ) {
                    script.parentNode.removeChild( script );
                }
            }
        };

        head.appendChild( script );
    },
    
    /*
     * Compile Params
     * @param {Object} business param
     * @param {Object} other param
     */
    compileParams = function(business, other) {
        var businessStr = ''
          , otherStr = ''
          , ret = [];

        if (business && !Tools.isEmptyObject(business)){
            businessStr = Tools.btoa(Tools.combineParam(business, {}, '&'));
        }

        other['ver'] = Globals.version;
        other['t'] = NOW;
        otherStr = Tools.combineParam(other, {}, '&');

        if (businessStr) {
            ret.push(businessStr);
        }
        if (otherStr) {
            ret.push(otherStr);
        }

        return ret.join('&');
    };

    return {
        /*
         * loadScript
         */
        loadScript: loadScript,
        /*
         * JSONP
         * @param {String} url
         * @param {Object} param
         * @api public
         * @param {String} api name
         */
        jsonp : function (url, params, callback, callbackName) {
            callbackName = (callbackName||'callback');
            params = params || {};
            
            var query = (url || '').indexOf('?') === -1 ? '?' : '&'
              , uniqueName = callbackName + "_json" + NOW;

            for ( var key in params ) {
                if ( params.hasOwnProperty(key) ) {
                    query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
                }
            }

            win[ uniqueName ] = function(data) {
                callback(data);
                try {
                    delete win[ uniqueName ];
                } catch (e) {}
                win[ uniqueName ] = null;
            };

            loadScript(url + query + callbackName + '=' + uniqueName);
            
            return uniqueName;
        },
        
        /*
         * send image request
         * @param {String} url
         * @param {Object} param
         * @api public
         */
        send : function(url, params, callback) {
            var l = params.length;
            //图片方式请求长度极限测试结果：1、FF8（8203），2、IE6/IE7（2083），3、chrome16（8201），3、IE8（8206），4、IE9（8205）
            //2K以内为安全长度，8K以内除IE6/7外，其他主流浏览器都安全，而IE6/7会忽略超出2K的所有字段，在参数的最前面加上长度标注
            if (l <= 2 * 1024) {
                sendByImage(url, params, callback);
            } else if (l <= 8 * 1024) {
                sendByImage(url, 'len=' + l + '&' + params, callback);
            } else {
                sendByImage(url, 'err=len&len=' + l + '&' + params, callback);
            }
        },
        
        /*
         * send stat
         * @param {String} url
         * @param {Object} business param
         * @param {Object} other param
         * @api public
         */
        sendStat : function(url, business, other, callback) {
            var params = compileParams(business, other);
            this.send(url, params, callback);
        },
        
        /*
         * send error
         * @param {Object} error
         * @param {String} type
         * @api public
         */
        sendError : function(e, type, callback) {
            var params = 'type=' + type + '&exception=' + e.message;
            this.send(Config.errorSever, params, callback);
        }
    };
}());