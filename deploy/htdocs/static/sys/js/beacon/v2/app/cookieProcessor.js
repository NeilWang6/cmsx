/**
 * cookie´¦ÀíÆ÷
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-9-24
 * @modifyTime : 2013-07-03
 */

var CookieProcessor = (function(){
    /*
     * Parse Cookie String
     * @param {Object} param
     */
    var _parseCookieString = function(param) {
        var hash = {};

        if (param && Tools.isString(param)) {
            var parts = param.split(/;\s/g)
              , name = ''
              , value = ''
              , seqPart = '';

            for (var i = 0, len = parts.length; i < len; i++) {
                seqPart = parts[i].match(/([^=]+)=/i);

                if (Tools.isArray(seqPart)) {
                    name = unescape(seqPart[1]);
                    value = unescape(parts[i].substring(seqPart[1].length + 1));
                } else {
                    name = unescape(parts[i]);
                    value = '';
                }

                hash[name] = value;
            }
        }

        return hash;
    },

    /*
     * Get Cookie Expires
     * @param {String} time
     */
    _getCookieExpires = function(timeout) {
        timeout = new Date(NOW + timeout);
        return ';expires=' + timeout.toGMTString();
    },

    /*
     * Create Cookie String
     * @param {String} name
     * @param {String} value
     * @param {Object} options
     */
    _createCookieString = function(name, value, options) {
        var expires = options.expires || 1
          , path = options.path || ''
          , domain = options.domain || ''
          , secure = options.secure || false
          , text = escape(name) + '=' + escape(value);

        //expires Date
        if (expires instanceof Date) {
            text += '; expires=' + expires.toUTCString();
        }
        //expires Number
        if (expires && Tools.isNumber(expires)) {
            text += _getCookieExpires(expires * 24 * 60 * 60 * 1000);
        }
        //path
        if (path && Tools.isString(path)) {
            text += '; path=' + path;
        }
        //domain
        if (domain && Tools.isString(domain)) {
            text += '; domain=' + domain;
        }
        //secure
        if (secure) {
            text += '; secure';
        }

        return text;
    };

    return {
        /*
         * Get main cookie
         * @param {String} name
         */
        get : function (name) {
            if (!name || !Tools.isString(name)) {
                return null;
            }
            var cookies = _parseCookieString(doc.cookie);

            return (name in cookies ? cookies[name] : null);
        },
        
        /*
         * Get subcookie of main cookie
         * @param {String} name
         * @param {String} sub name
         */
        getSub : function(name, subName) {
            var hash = this.getSubCookies(name);

            if (hash) {
                if (!subName || !Tools.isString(subName)){
                    return null;
                }
                return subName in hash ? hash[subName] : null;
            } else {
                return null;
            }
        },
        
        /*
         * Get subcookie of main cookie, and hase to json
         * @param {String} name
         */
        getSubCookies : function(name) {
            var param = this.get(name)
              , subCookieHash = Tools.parseParam(param, '|');

            return subCookieHash;
        },
        
        /*
         * Set cookie
         * @param {String} name
         * @param {String} value
         * @param {Object} options
         */
        set : function(name, value, options) {
            options = options || {};

            if (value && Tools.isString(name)) {
                var text = _createCookieString(name, value, options);
                doc.cookie = text;
            }
        },
        
        /*
         * Set sub cookie
         * @param {String} name
         * @param {String} sub name
         * @param {String} value
         * @param {Object} options
         */
        setSub : function(name, subName, value, options) {
            if ( !name || !Tools.isString(name)
              || !subName || !Tools.isString(subName)
              || !value ) return;

            var hash = this.getSubCookies(name) || {}
              , obj = {};

            obj[subName] = value;

            this.set(name, Tools.combineParam(hash, obj, '|', true), options);
        },
        
        /*
         * Set many sub cookie
         * @param {String} name
         * @param {Object} obj
         * @param {Object} options
         */
        setSubs : function(name, obj, options) {
            if (!name || !Tools.isString(name)) return;

            var hash = this.getSubCookies(name) || {};

            this.set(name, Tools.combineParam(hash, obj, '|', true), options);
        },
        
        /*
         * Remove Cookie
         * @param {String} name
         * @param {Object} options
         */
        remove : function(name) {
            doc.cookie = _createCookieString(name, '', { expires: new Date(0) });
        },
        
        /*
         * Remove Sub Cookie
         * @param {String} name
         * @param {String} sub name
         */
        removeSub : function(name, subName) {
            if ( !name || !Tools.isString(name)
              || !subName || !Tools.isString(subName)) return;

            var hash = this.getSubCookies(name);

            if (hash && hash.hasOwnProperty(subName)) {
                delete hash[subName];
                this.set(name, Tools.combineParam(hash, {}, '|'));
            }
        }
    };
}());