(function(win, undefined) {

/**
 * ������������
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-9-24
 * @modifyTime : 2013-07-03
 */

var isConflicted = true
  , doc = win.document
  , loc = doc.location
  , pro = loc.protocol;

var NOW = (new Date()).getTime();

if (win['Manifold'] === undefined) {
    Manifold = {};
    isConflicted = false;
} else {
    return;
}

var Globals = {
    opener : opener,
    pageId : null,
    customize : win['WolfSmoke'] || {},
    version : '2.1'
};

/**
 * ������
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-14
 * @modifyTime : 2013-04-08
 */

var Config = {
    //Ĭ�ϳ�����
    samplerate : Globals.customize.samplerate || 1,
    //վ���ţ�
    //1������վ
    //2������վ
    //4������ѧԺ
    //5��Aliexpress
    //6���������
    //7��ITBU
    //20������
    siteNo : Globals.customize.siteNo || 2,
    //��־��¼������һ
    logSeverOne : pro + '//dmtracking.1688.com/b.jpg',
    //��־��¼��������
    logSeverTwo : pro + '//dmtracking.1688.com/c.jpg',
    //tracelog������
    tracelogSever : pro + '//stat.1688.com/tracelog/click.html',
    //�����¼������
    errorSever : pro + '//stat.1688.com/dw/error.html',
    //SPM������
    spmServer : pro + '//stat.1688.com/spm.html',
    //acookie���շ�����
    acookieSever : pro + '//acookie.1688.com/1.gif',
    // �����л�������
    changeServer: pro + '//pass.alibaba.com/read_cookie.htm',
    // ��һ���л�cookie������
    firstUserServer: pro + '//check.china.alibaba.com/cta/cucrpc/getCookieId.jsonp',
    needDefaultCookies : ['cna','ali_apache_id'],
    isCheckLogin : true,
    isSetCookieToAcookie: true,
    is1688: /\b1688\.com$/.test(loc.hostname)
};

/**
 * ���ݲɼ����ں�
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-09-13
 * @modifyTime : 2012-07-09
 */

var Tools = {
    isObject : function(value) {
        return value === Object(value);
    },
    isFunction : function (value) {
        return typeof value === 'function';
    },
    isNumber : function(value) {
        return typeof value === 'number' && Object.prototype.toString.call(value) == '[object Number]';
    },
    isString : function(value) {
        return typeof value === 'string' || Object.prototype.toString.call(value) == '[object String]';
    },
    isArray : Array.isArray || function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    },
    //����Ƿ�Ϊ�ն���
    isEmptyObject : function(o) {
        for (var name in o) {
            return false;
        }
        return true;
    },
    //ȥ���ַ��� ǰ��Ŀո�
    trim : function(value) {
        if (!this.isString(value)) { return ''; }
        
        if (String.prototype.trim) {
            return value.trim();
        } else {
            return value.replace(/^\s+|\s+$/g, '');
        }
    },
    btoa : function(str) {
      if (win.btoa) {
        return win.btoa(str);
      } else {
        var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        c1, c2, c3,
        len = str.length,
        i = 0,
        out = '';
        while(i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if(i === len){
                out += b64chars.charAt(c1 >> 2);
                out += b64chars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if(i === len){
                out += b64chars.charAt(c1 >> 2);
                out += b64chars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += b64chars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += b64chars.charAt(c1 >> 2);
            out += b64chars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += b64chars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
            out += b64chars.charAt(c3 & 0x3F);
        }
        return out;
      }
    },
    //������JSON����ϲ���һ��
    combineJson : function(src, des, isCover) {
        var ret = {};
        for (var i in des) {
            if (isCover || !src.hasOwnProperty(i)) {
                ret[i] = des[i];
                delete src[i];
            }
        }
        for (var j in src) {
            ret[j] = src[j];
        }
        return ret;
    },
    //������JSON����ϲ���һ�����Զ�������������ַ���
    combineParam : function(src, des, separator, isCover) {
        var ret = [];
        for (var param in des) {
            //�Ƿ񸲸�ԭ������
            if (isCover || !src.hasOwnProperty(param)) {
                ret.push(param + '=' + des[param]);
                delete src[param];
            }
        }
        for (var p in src) {
            ret.push(p + '=' + src[p]);
        }
        return ret.join(separator);
    },
    //����ַ�����cookie/url�����ȣ���json����
    parseParam : function(s, separator) {
        var parts
          , keyValueArray = null
          , hash = {};
          
        if (this.isString(s) && s.length) {
            parts = s.split(separator);
            for (var i = 0, len = parts.length; i < len; i++) {
                keyValueArray = parts[i].split('=');
                hash[keyValueArray[0]] = keyValueArray[1];
            }
        }
        
        return hash;
    },
    //���������
    random : function() {
        //ȡ0��2147483647֮�����Ȼ����32λϵͳ�������
        return Math.round(Math.random() * 2147483647);
    },
    
    //��ȡrefer
    getReferrer : function() {
        var ret = '-';

        try {
            //IE���������ȡopener.location.href����쳣
            ret = doc.referrer || Globals.opener.location.href || '-';
        } catch(e) {
            ret = '-';
        }
        
        return ret;
    },
    //�����pageId
    randomPageId : function() {
        var pageId = (win['dmtrack_pageid'] || '') + NOW;
        
        //��ȡǰ20λ����ҳ����ܻ�������ü��Σ�����ÿ�α仯����ͬ
        pageId = pageId.substr(0,20);
        //�ַ�������42λ�������
        while (pageId.length < 42) {
            pageId += Tools.random();
        }
        //pageIdֻ����42λ���ַ���
        pageId = pageId.substr(0,42);
        
        Globals.pageId = win['dmtrack_pageid'] = win['unique_pageid'] = pageId;
        
        return pageId;
    },
    //����
    sampling : function() {
        return (Math.random() - Config.samplerate) <= 0;
    },
    //ȥ��URL�е�'http:/'������Ϊ���ݺ�˷������
    trimHttpStr : function(url){
        //return encodeURIComponent(url.substr(url.indexOf("://") + 2));
        return url.substr(url.indexOf("://") + 2);
    }
};
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

        // ��ȫ�ֱ��������� img����ֹ img ���������ջ��ƹ���������������ʧ��
        // �ο���http://hi.baidu.com/meizz/blog/item/a0f4fc0ae9d8be1694ca6b05.html
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
            //ͼƬ��ʽ���󳤶ȼ��޲��Խ����1��FF8��8203����2��IE6/IE7��2083����3��chrome16��8201����3��IE8��8206����4��IE9��8205��
            //2K����Ϊ��ȫ���ȣ�8K���ڳ�IE6/7�⣬�����������������ȫ����IE6/7����Գ���2K�������ֶΣ��ڲ�������ǰ����ϳ��ȱ�ע
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
/**
 * cookie������
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
/**
 * ץȡ�û��ͻ�����Ϣ
 * @author : yu.yuy
 * @createTime : 2011-11-14
 * @modifyTime : 2012-05-08
 */

var UA = Manifold.UA = (function(){
    var engine = {
        trident : 0,
        webkit : 0,
        gecko : 0,
        presto : 0,
        khtml : 0,

        name : 'other',
        ver : null
    },
    browser = {
        ie : 0,
        firefox : 0,
        chrome : 0,
        safari : 0,
        opera : 0,
        konq : 0,

        name : 'other',
        ver : null
    },
    extraBrowser = {
        name : '',
        ver : null
    },
    system = {
        win : false,
        mac : false,
        x11 : false,

        name : 'other'
    },
    mobile = 'other',
    navigator = win.navigator,
    ua = navigator.userAgent,
    platform = navigator.platform,
    match,
    external,
    numberify = function(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function() {
            return (c++ === 0) ? '.' : '';
        }));
    };

    if (win.opera){
        engine.ver = browser.ver = numberify(win.opera.version());
        engine.presto = browser.opera = parseFloat(engine.ver);
        engine.name = 'presto';
        browser.name = 'opera';
    } else if (/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver = numberify(RegExp["$1"]);
        engine.webkit = engine.ver;
        engine.name = 'webkit';

        //figure out if it's Chrome or Safari
        if (/Chrome\/(\S+)/.test(ua)){
            browser.ver = numberify(RegExp["$1"]);
            browser.chrome = browser.ver;
            browser.name = 'chrome';
        } else if (/Version\/(\S+)/.test(ua)){
            browser.ver = numberify(RegExp["$1"]);
            browser.safari = browser.ver;
            browser.name = 'safari';
        } else {
            //approximate version
            var safariVersion = 1;
            if (engine.webkit < 100){
                safariVersion = 1;
            } else if (engine.webkit < 312){
                safariVersion = 1.2;
            } else if (engine.webkit < 412){
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }

            browser.safari = browser.ver = safariVersion;
            browser.name = 'safari';
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
        engine.ver = browser.ver = numberify(RegExp["$1"]);
        engine.khtml = browser.konq = engine.ver;
        engine.name = 'khtml';
        browser.name = 'konq';
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
        engine.ver = numberify(RegExp["$1"]);
        engine.gecko = engine.ver;
        engine.name = 'gecko';

        //determine if it's Firefox
        if (/Firefox\/(\S+)/.test(ua)){
            browser.ver = numberify(RegExp["$1"]);
            browser.firefox = browser.ver;
            browser.name = 'firefox';
        }
    } else if (/IE ([^;]+)/.test(ua)){
        engine.ver = browser.ver = numberify(RegExp["$1"]);
        engine.trident = browser.ie = engine.ver;
        engine.name = 'trident';
        browser.name = 'ie';
    }

    extraBrowser.name = browser.name;
    extraBrowser.ver = browser.ver;

    // 360Browser
    if (match = ua.match(/360SE/)) {
        extraBrowser.name = 'se360';
        extraBrowser.ver = 3; // issue: 360Browser 2.x cannot be recognised, so if recognised default set verstion number to 3
    }
    // Maxthon
    else if ((match = ua.match(/Maxthon/)) && (external = WIN.external)) {
        // issue: Maxthon 3.x in IE-Core cannot be recognised and it doesn't have exact version number
        // but other maxthon versions all have exact version number
        extraBrowser.name = 'maxthon';
        try {
            extraBrowser.ver = numberify(external['max_version']);
        } catch(ex) {
            extraBrowser.ver = 0.1;
        }
    }
    // TT
    else if (match = ua.match(/TencentTraveler\s([\d.]*)/)) {
        extraBrowser.name = 'tt';
        extraBrowser.ver = numberify(match[1]) || 0.1;
    }
    // TheWorld
    else if (match = ua.match(/TheWorld/)) {
        extraBrowser.name = 'theworld';
        extraBrowser.ver = 3;
    }
    // Sougou
    else if (match = ua.match(/SE\s([\d.]*)/)) {
        extraBrowser.name = 'sougou';
        extraBrowser.ver = numberify(match[1]) || 0.1;
    }

    system.win = platform.indexOf("Win") == 0;
    system.mac = platform.indexOf("Mac") == 0;
    system.x11 = (platform == "X11") || (platform.indexOf("Linux") == 0);

    if (system.win){
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
            if (RegExp["$1"] == "NT"){
                switch(RegExp["$2"]){
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    case "6.3":
                        system.win = "8";
                        break;
                    default:
                        system.win = "NT";
                        break;
                }
            } else if (RegExp["$1"] == "9x"){
                system.win = "ME";
            } else {
                system.win = RegExp["$1"];
            }
        }
        system.name = 'windows' + system.win;
    }
    if (system.mac) {
        system.name = 'mac';
    }
    if (system.x11) {
        system.name = 'x11';
    }

    if (system.win == "CE") {
        mobile = 'windows mobile';
    }
    // Apple Mobile
    else if (/ Mobile\//.test(ua)) {
        mobile = 'apple'; // iPad, iPhone or iPod Touch
    }
    // Other WebKit Mobile Browsers
    else if ((match = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))) {
        mobile = match[0].toLowerCase(); // Nokia N-series, Android, webOS, ex: NokiaN95
    }

    return {
        //�������������
        engine : engine,
        //���������
        browser : browser,
        //���������
        extraBrowser : extraBrowser,
        //����ϵͳ��Ϣ
        system : system,
        //�ƶ��豸����
        mobile : mobile,
        //�ֱ���
        resolution : win.screen.width+'*' + win.screen.height,
        //���������
        language : navigator.language || navigator.browserLanguage
    }
}());

/**
 * SPMģ��
 * @author : arcthur.cheny
 * @createTime : 2012-07-18
 * @lastModifiy : 2013-07-03
 */
var SPM = Manifold.SPM = (function(){
    var S_TRUE = true,
    S_FALSE = false,

    IS_USE_DEFAULT_AB    = false,
    S_SPM_ATTR_NAME      = 'data-spm',
    S_DATA_SPM_ANCHOR_ID = 'data-spm-anchor-id',
    S_SPM_DATA_PROTOCOL  = 'data-spm-protocol',

    wh_in_page = S_FALSE,   // ҳ�����Ƿ����޺����
    wh_spm_data = {},       // �޺� SPM ���ݣ�key Ϊ xpath
    wh_spm_initialized = S_FALSE,

    spm_meta = '',
    spm_protocol = '',
    spm_stat_url = Config.spmServer,

    atta = !!doc.attachEvent,
    attachEvent = "attachEvent",
    addEventListener = "addEventListener",
    onevent = atta ? attachEvent : addEventListener,

    is_dom_ready = S_FALSE,
    isContain = function(s1, s2) {
        return s1.indexOf(s2) > -1;
    },

    tryToGetHref = function(anchor) {
        /**
         * ��� href ��ʽ����ʱ���� IE8/9 �� href ����Ч��
         * ��ȡ anchor.href ʱ��ֱ�ӳ���
         */

        var href;
        try {
            href = Tools.trim(anchor.getAttribute("href", 2));
        } catch (e) {}

        return href || "";
    },

    tryToGetAttribute = function(element, attr_name) {
        return element && element.getAttribute ? (element.getAttribute(attr_name) || "") : "";
    },

    tryToSetAttribute = function(element, attr_name, attr_value) {
        if (element && element.setAttribute) {
            try {
                element.setAttribute(attr_name, attr_value);
            } catch (e) {}
        }
    },

    nodeListToArray = function(nodes) {
        var arr, length;

        try {
            // works in every browser except IE
            arr = [].slice.call(nodes);
            return arr;
        } catch(err) {
            // slower, but works in IE
            arr = [];
            length = nodes.length;

            for (var i = 0; i < length; i++) {
                arr.push(nodes[i]);
            }

            return arr;
        }
    },

    on = function(obj, eventType, f) {
        obj[onevent](
            (atta ? "on" : "") + eventType,
            function (e) {
                e = e || win.event;
                var el = e.target || e.srcElement;

                f(e, el);
            },
            S_FALSE
        );
    },

    getMetaTags = function() {
        return doc.getElementsByTagName('meta');
    },

    getSPMFromMeta = function() {
        var metas = getMetaTags(),
            i, l,
            meta,
            meta_name;

        for (i = 0, l = metas.length; i < l; i++) {
            meta = metas[i];
            meta_name = tryToGetAttribute(meta, "name");
            if (meta_name === S_SPM_ATTR_NAME) {
                spm_protocol = tryToGetAttribute(meta, S_SPM_DATA_PROTOCOL);
                spm_meta = tryToGetAttribute(meta, 'content');
            }
        }
    },

    spm_global = (function() {
        var spm_a = '', spm_b = '', spm_ab;

        getSPMFromMeta();

        if (win._SPM_a && win._SPM_b) {
            // ���ҳ���ϴ��� _SPM_a��_SPM_b����ʾҳ�������޺����
            spm_a = win._SPM_a.replace(/^{(\w+)}$/g, "$1");
            spm_b = win._SPM_b.replace(/^{(\w+)}$/g, "$1");

            if (spm_a !== '{}' && spm_a !== '{-}' && spm_b !== '{}' && spm_b !== '{-}') {
                wh_in_page = 'true';
            }
        }

        if (!spm_a || !spm_b ||
             spm_a === '{}' || spm_b === '{}' ||
             spm_a === '{-}' || spm_b === '{-}') {
            spm_a = spm_meta;
            spm_b = tryToGetAttribute(doc.body, 'data-spm') || 0;
        }

        spm_ab = spm_a + "." + spm_b;

        if (!spm_a || !spm_b || !/^[\w\-\*]+\.[\w\-\*]+$/.test(spm_ab)) {
            IS_USE_DEFAULT_AB = true;
            spm_ab = 0;
        }

        return spm_ab;
    }()),

    getSpmModuleProtocol = function(el) {
        var tmp;
        while ((el = el.parentNode) && el.tagName != 'BODY') {
            tmp = tryToGetAttribute(el, S_SPM_DATA_PROTOCOL);
            if (tmp) return tmp;
        }
        return '';
    },

    onDOMReady = function(f) {
        if (win.jQuery) {
            // ���ҳ���ϴ��� jQuery��ʹ�� jQuery �ķ���
            jQuery(doc).ready(f);

        } else {

            // �ж�ҳ���Ƿ��Ѿ��������
            if (doc.readyState === "complete") {
                // ���ҳ���Ѿ�������ɣ�ֱ��ִ�к��� f
                f();

            } else {
                // ʹ�� window �� onload �¼�
                on(win, "load", f);
            }
        }
    },

    getElementByXPath = function(xpath, context) {
      if (!context) context = doc;
      if (doc.evaluate) {
        return context.evaluate(xpath, doc, null, 9, null).singleNodeValue;
      }

      // �Զ��巽��
      var arr_paths = xpath.split("/");
      var x1;

      while (!x1 && arr_paths.length > 0) {
        x1 = arr_paths.shift();
      }
      // ȡ��һ����ǩ x1
      var re_1 = /^.+?\[@id="(.+?)"]$/i;
      var re_3 = /^(.+?)\[(\d+)]$/i;
      var match;

      if (match = x1.match(re_1)) {
        // tag[@id="xxx"]
        context = context.getElementById(match[1]);

      } else if (match = x1.match(re_3)) {
        // tag[1]
        context = context.getElementsByTagName(match[1])[parseInt(match[2])];
      }

      if (!context) return null;
      if (arr_paths.length == 0) return context;

      return getElementByXPath(arr_paths.join("/"), context);
    },

    wh_updateXPathElements = function() {
      var xpath;
      var founds = {};
      var el;
      var spm_data;
      for (xpath in wh_spm_data) {
        if (wh_spm_data.hasOwnProperty(xpath)) {
          el = getElementByXPath(xpath);
          if (el) {
            founds[xpath] = 1;
            spm_data = wh_spm_data[xpath];
            tryToSetAttribute(el, S_SPM_ATTR_NAME, (
              el.tagName == "A" ? spm_data["spmd"] : spm_data["spmc"]
            ) || "");
          }
        }
      }

      for (xpath in founds) {
        if (founds.hasOwnProperty(xpath)) {
          delete wh_spm_data[xpath];
        }
      }
    };

    wh_init = function() {
        if (wh_spm_initialized) return;

        if (!win["spmData"]) {
            if (!is_dom_ready) {
                setTimeout(arguments.callee, 100);
            }
            return;
        }
        wh_spm_initialized = S_TRUE;

        /** spmData ���ݸ�ʽ���磺
         *
         * {'data': [
         *         {
         *             "spmc": "1000891",
         *             "spmd": "",
         *             "xpath": "/html[1]/body[1]/table[2]/tbody[1]/tr[1]/td[2]/div[1]/div[3]"
         *         }
         * ]};
         */

        var data = win["spmData"]["data"],
            i, l,
            idata,
            xpath;

        if (!data || !Tools.isArray(data)) return;

        for (i = 0, l = data.length; i < l; i++) {
            idata = data[i];
            xpath = idata.xpath;
            xpath = xpath.replace(/^id\("(.+?)"\)(.*)/g, "//*[@id=\"$1\"]$2");
            wh_spm_data[xpath] = {
                spmc: idata.spmc,
                spmd: idata.spmd
            };
        }

        wh_updateXPathElements();
    },

    isAlipayUrl = function(url) {
        return url ?
            (!!url.match(/^[^\?]*\balipay\.(?:com|net)\b/i))
            : false;
    },
    // a ����ָ���� SPM ����λ������ֵ����Щ������ָ����ֵ
    getAnchor4thId = function(el) {
      var spm_d;

      if (IS_USE_DEFAULT_AB) {
        spm_d = '0';
      } else {
        spm_d = tryToGetAttribute(el, S_SPM_ATTR_NAME);
        if (!spm_d || !spm_d.match(/^d\w+$/)) {
          spm_d = "";
        }
      }

      return spm_d;
    },
    removeAnchorSPM = function(href) {
        // ȥ�����е� href �е� spm ����
        if (href && /&?\bspm=[^&#]*/.test(href)) {
            href = href.replace(/&?\bspm=[^&#]*/g, '')
                .replace(/&{2,}/g, '&')
                .replace(/\?&/, '?')
                .replace(/\?$/, '');
        }

        return href;
    },
    // ������ href �м���� spm ���������ԭ�� href ������ spm���������
    updateHrefWithSPMId = function(href, dataSpm) {

        href = removeAnchorSPM(href);

        if (!dataSpm) return href;

        // �� href �в����µ� spm ����
        var search, hash, a,
            and_char = "&",
            query_split,
            query_count,
            filename,
            file_ext;

        if (href.indexOf("#") != -1) {
            a = href.split("#");
            href = a.shift();
            hash = a.join("#"); // ȡ��һ�� # ��Ĳ���
        }
        query_split = href.split("?");
        query_count = query_split.length - 1;

        // ���洦�����硰http://www.taobao.com��������ĩβ������/��������
        // �������Ӷ�Ӧ��filenameΪ��
        a = query_split[0].split("//");
        a = a[a.length - 1].split("/");
        filename = a.length > 1 ? a.pop() : "";

        if (query_count > 0) {
            /**
             * ���ڴ������� http://ju.atpanel.com/?scm=1005.10.1.703&url=http://www.tmall.com/go/act/tmall/mymx-ym.php?spm=1.1000386.222017.20&ad_id=&am_id=&cm_id=&pm_id=150100827263368085f8
             * ���������ӣ�ע��������������?����
             * ����һ����ת���ӣ����� spm ������Ҫ���ں���һ�� ? ֮��
             * ��������������2012-03-30��������ͳһ�� spm �����ӵ� href �����һ�� ? ֮��
             */
            search = query_split.pop(); // ȡ���һ�� ? ��Ĳ���
            href = query_split.join("?"); // ���һ�� ? ֮ǰ�Ĳ���
        }

        if (search &&
            query_count > 1 && // # ֻ�����������ϵġ�?���� url ִ�������ļ��
            search.indexOf("&") == -1 &&
            search.indexOf("%") != -1) {
            /**
             * ��һЩҳ�棬�� http://login.taobao.com/member/logout.jhtml?f=top&redirectURL=http://login.tmall.com/?spm=1007.100361.0.180%26redirect_url=http%253A%252F%252Ftemai.tmall.com%252F%253Fspm%253D3.1000473.197562.2%2526prt%253D1336367425196%2526prc%253D4
             * spm �������ڵڶ��� ? ֮�󣬵��ǵڶ��� ? ֮��� & ���Ѿ����˹淶��ת�룬��������ӵ� spm ����� & ҲҪ����ת��
             */
            and_char = "%26";
        }

        href = href + "?spm=" + dataSpm
            + (search ? (and_char + search) : "")
            + (hash ? ("#" + hash) : "")
        ;

        /**
         * ����ļ����������
         * ������IE�£��������spm�������ܻ������ļ���׺�����޸ģ�
         *
         * ���磺
         * ԭʼ�������ӣ�
         * http://download.alipay.com/sec/edit/aliedit.exe
         *
         * ����spm����֮��
         * http://download.alipay.com/sec/edit/aliedit.exe?spm=a2107.1.1000341.10�������⣬IE�º�׺�����޸�Ϊ��.10����
         *
         * ����file����֮��
         * http://download.alipay.com/sec/edit/aliedit.exe?spm=a2107.1.1000341.10&file=aliedit.exe��û�����⣩
         *
         * ��ˣ������������ļ����ص��������һ���������
         */
        file_ext = isContain(filename, ".") ? filename.split(".").pop().toLowerCase() : "";
        if (file_ext) {
            if (({
                "png": 1,
                "jpg": 1,
                "jpeg": 1,
                "gif": 1,
                "bmp": 1,
                "swf": 1
            }).hasOwnProperty(file_ext)) {
                // ��ͼƬ��׺����β�����Ӳ��� spm ����
                return 0;
            }

            if (!search && query_count <= 1) {
                if (!hash && !({
                    "htm": 1,
                    "html": 1,
                    "php": 1
                }).hasOwnProperty(file_ext)) {
                    // ��Ϊ��ǰ�ļ���һ�������ļ�����Ӷ������
                    href += "&file=" + filename;
                }
            }
        }

        return href;
    },
    // ���� spmid �Ĳ���
    anchorAddSpmParam = function(el, dataSpm) {
        var currentNode = el,
        href = tryToGetHref(currentNode),

        is_i_protocol = (
        tryToGetAttribute(currentNode, S_SPM_DATA_PROTOCOL)
            || getSpmModuleProtocol(currentNode)
            || spm_protocol
        ) == 'i',

        i_protocol_beacon_url = spm_stat_url + '?spm=';

        if (!href || !dataSpm) return;
        if (href.indexOf('#') === 0
            || href.toLowerCase().indexOf('javascript:') === 0
            || isAlipayUrl(href)) return;

        if (is_i_protocol) {
            href = removeAnchorSPM(href);

            i_protocol_beacon_url += dataSpm
                                  + '&st_page_id=' + Globals.pageId
                                  + '&url=' + encodeURIComponent(href)
                                  + '&cache=' + Tools.random();

            Recorder.send(i_protocol_beacon_url, '');
        } else {
            (href = updateHrefWithSPMId(href, dataSpm)) && spmWriteHref(currentNode, href);
        }
    },
    // д���� currentNode �� href ��ֵ
    spmWriteHref = function(el, href) {
        /**
         * ˵����
         * �� href ǰ���һ���ո�ķ�ʽ������̫�࣬
         * �������ʹ�ü�һ���� <b></b> �ڵ�Ȼ����ɾ���ķ�����
         * ����http://oldj.net/article/ie-bug-at-href-innerHTML/
         *
         * �ο���https://github.com/kissyteam/kissy/blob/master/src/dom/src/attr.js#L215
         */
        var currentNode = el, b,
            inner_html = currentNode.innerHTML;

        if (inner_html && inner_html.indexOf('<') == -1) {
            b = doc.createElement('b');
            b.style.display = 'none';
            currentNode.appendChild(b);
        }
        currentNode.href = href;

        if (b) {
            currentNode.removeChild(b);
        }
    },
    // ���������Ľڵ�
    dealNoneSPMLink = function(el) {
        var currentNode = el,
            strSpm = [spm_global, 0, 0].join('.');

        anchorAddSpmParam(currentNode, strSpm);
    },

    // ȡ������ spm id (c����)���ڵ�
    getParentSPMId = function(el) {
        var dataSpm,
            tagName = el.tagName.toLowerCase(),
            spmAreaInfo = {};

        while (el &&
            tagName !== 'html' &&
            tagName !== 'body') {

            if (wh_in_page) {
              wh_updateXPathElements();
            }

            dataSpm = tryToGetAttribute(el, S_SPM_ATTR_NAME);

            if (dataSpm) {
                spmAreaInfo = {
                    spmEl: el,
                    spmId: dataSpm
                };
                break;
            }

            if (!(el = el.parentNode)) break;
            tagName = el.tagName.toLowerCase();
        }

        return spmAreaInfo;
    },

    // ����spm ������Ϣ d�������ҷ���spm
    // d �ɼ��㵱ǰģ������������, �����id��¼��ģ���� data-spm-max-idx
    // ��һ�ε����spm������¼�������� data-spm-anchor-id
    initSPMModule = function(el, spmAreaData) {
        var currentNode = el,
            areaTarget = spmAreaData.spmEl,
            areaSpm = spmAreaData.spmId,
            strSpm = [spm_global, areaSpm].join(".");

        // �ж�a.b.c��ϵ� spm �Ƿ�Ϸ�
        if (!strSpm.match || !strSpm.match(/^[\w\-\*]+\.[\w\-\*]+\.[\w\-\*]+$/)) return;

        var el_a = nodeListToArray(areaTarget.getElementsByTagName("a")),
            el_area = nodeListToArray(areaTarget.getElementsByTagName("area")),
            anchors = el_a.concat(el_area),
            anchor, href, anchorId, anchorIdx = 0;

        for (var i = 0, anchorsLen = anchors.length; i < anchorsLen; i++) {
            anchor = anchors[i];
            href = tryToGetHref(anchor);
            if (!href) continue;

            anchorIdx++;
            if (anchor === currentNode) {
                anchorId = strSpm + '.' + (getAnchor4thId(anchor) || anchorIdx);
                tryToSetAttribute(anchor, S_DATA_SPM_ANCHOR_ID, anchorId);
                break;
            }
        }
    },
    // �ϲ�spm����
    setSpmParm = function(el) {
        var currentNode = el,
            spmAnchorId = tryToGetAttribute(currentNode, S_DATA_SPM_ANCHOR_ID),
            spmAreaData;

        if (!spmAnchorId) {
            spmAreaData = getParentSPMId(currentNode.parentNode);

            if (!spmAreaData.spmId) {
                // �����spmģ�������
                dealNoneSPMLink(currentNode);

                return;
            }

            // spm ģ���ʼ��
            initSPMModule(currentNode, spmAreaData);

            // ��ʼ������Ԫ�ؾ߱� data-spm-anchor-id ����
            spmAnchorId = tryToGetAttribute(currentNode, S_DATA_SPM_ANCHOR_ID);
        }

        anchorAddSpmParam(currentNode, spmAnchorId);
    },
    doTrace = function(e, el) {
      var tn;

      while (el && (tn = el.tagName.toLowerCase())) {

        if (tn === "a" || tn === "area") {
          // �㵽��������
          setSpmParm(el);
          break;
        } else if (tn === "body" || tn === "html") {
          break;
        }

        el = el.parentNode;
      }
    },
    init = function() {
      onDOMReady(function () {
        is_dom_ready = S_TRUE;

        if (!spm_global) return;

        wh_init();

        on(doc.body, 'mousedown', doTrace);
        on(doc.body, 'keydown', doTrace);
      });
    };
    return {
        cnt: spm_global,
        init: init
    };
}());

/**
 * ��Ҫҵ����
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-16
 * @modifyTime : 2013-08-03
 */

var Essential = Manifold.Essential = (function() {
    //��֤�û��Ƿ��¼
    var checkLogin = function() {
        var isLogin = (CookieProcessor.get('__cn_logon__') === 'true');
        
        return isLogin;
    },
    //��ȡresin��Ϣ��
    getResinTraceInfo = function() {
        var origin = win['dmtrack_c'];
        
        if (!origin || origin === '{-}') {
            return {};
        }
        
        origin = origin.substring(1, origin.length - 1).replace(/ali_resin_trace=/, '');
        return Tools.parseParam(origin, '|');
    },
    //��acookie������cookieͳ�ƣ����������
    sendToAcookie = function(){
        try{
            var refer = Tools.getReferrer()
              , random = Tools.random()
              , acookieAdditional = Globals.customize['acookieAdditional'] || {}
              , acookieJson = {
                  cache : random,
                  pre : refer
                };
                
            Recorder.sendStat(Config.acookieSever, {}, Tools.combineJson(acookieJson,acookieAdditional));
        } catch(e) {
            Recorder.sendError(e, 'acookie');
        }
    },
    //��������ua�ַ�����ֻ��������ϵͳ��Ϣ���������Ϣ���û��ֱ��ʺ����������
    createUaStr = function() {
        var browserObject = UA.extraBrowser
          , browser = browserObject.name + browserObject.ver.toFixed(1)
          , system = UA.system.name
          , sysStr = browser + '|' + system + '|' + UA.resolution + '|' + UA.language;
          
        return sysStr;
    },
    //�������û�ȡ��ͬ��cookieֵ
    getCookies = function(obj) {
        var needCustomCookies = Globals.customize.needCookies
          , needCookies = Config.needDefaultCookies;

        if (needCustomCookies && Tools.isArray(needCookies)){
            needCookies = needCookies.concat(needCustomCookies);
        }
        
        var len = needCookies.length, key, value;
        
        while (len--) {
            key = needCookies[len];
            value = CookieProcessor.get(key) || '-';
            obj[key] = value;
        }
    };
    return {
        send : function() {
            var refer = encodeURI(Tools.getReferrer())
              , apacheTrackJson = CookieProcessor.getSubCookies('ali_apache_track') || {}
              , resinTraceInfo = getResinTraceInfo()
              , redirectInfo = CookieProcessor.getSubCookies('aliBeacon_bcookie') || {}
              , currentHref = encodeURI(loc.href);

            if (Config.isSetCookieToAcookie) {
                sendToAcookie();
            }
            
            //�������û�ȡ��ͬ��cookieֵ
            getCookies(apacheTrackJson);
            
            if (Config.isCheckLogin && !resinTraceInfo['c_signed']) {
                //�����Ƿ��ѵ�¼��Ϣ
                resinTraceInfo['c_signed'] = checkLogin() ? 1 : 0;
            }
            
            //������ת��Ϣ
            Tools.combineJson(resinTraceInfo, redirectInfo, true);
            
            //ɾ��������ת��Ϣ��cookie
            CookieProcessor.remove('aliBeacon_bcookie');
            
            //�������󣬷��͸�ʽ���ࡢ�ͼ���Ϊ�˼����ϰ汾
            Recorder.sendStat(Config.logSeverOne, {
                p : '{'+ Config.siteNo +'}',
                u : '{'+ Tools.trimHttpStr(currentHref) +'}',
                m : '{GET}',
                s : '{200}',
                r : '{'+ refer+'}',
                a : '{'+ Tools.combineParam(apacheTrackJson, {}, '|') +'}',
                b : '{-}',
                c : '{'+ Tools.combineParam(resinTraceInfo, redirectInfo, '|', true) +'}'
            },{
                spm_cnt : SPM.cnt,
                pageid : Tools.randomPageId(),
                sys : createUaStr()
            });
        }
    }
}());
/**
 * ��Žӿ�
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
/**
 * �����ϰ汾����
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
/**
 * ����
 * @author : arcthur.cheny
 * @createTime : 2013-08-05
 * @modifyTime : 2013-08-05
 */

if (!Tools.sampling()) {
    return;
}

try {
    var hasMoved = CookieProcessor.get('sync_cookie');
    
    if (Config.is1688) {
        if (!hasMoved || hasMoved !== 'true') {
            Recorder.jsonp(Config.firstUserServer, {}, function(data) {
                if (data && data.content && data.content.ali_beacon_id) {
                    for (var i in data.content) {
                        CookieProcessor.set(i, data.content[i]);
                    }
                }
                
                Recorder.send(Config.changeServer, '');
                Essential.send();
            });
        } else {
            Essential.send();
        }
    } else {
        if (!hasMoved || hasMoved !== 'true') {
            Recorder.send(Config.changeServer, '');
        }
        
        Essential.send();
    }
    
    Recorder.loadScript('http://a.tbcdn.cn/s/aplus_b2b.js?t=20130911');
    SPM.init();
    
} catch(e) {
    Recorder.sendError(e, 'essential');
}
}(window));

