(function() {

/**
 * 公共变量管理
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-9-24
 * @modifyTime : 2013-04-08
 */

var isConflicted = true
  , win = window
  , doc = win.document
  , loc = doc.location
  , pro = loc.protocol;

if (win['Manifold'] === undefined){
    Manifold = {};
    isConflicted = false;
}

var M_globals = Manifold.globals = {
    opener : opener,
    pageId : null,
    //js文件根目录
    jsUrlRoot : 'http://style.c.aliimg.com/sys/js/beacon/v2/',
    //各js文件相对路径配置
    /* jsUrlHash : {
        flash : 'plugins/client/flash.js',
        html5 : 'plugins/client/html5.js'
    }, */
    customize : window['WolfSmoke'] || {},
    isConflicted : isConflicted,
    version : '2.0'
};

/**
 * 配置区
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-14
 * @modifyTime : 2013-04-08
 */

var TEMP_PASS = 'pass';
var M_config = Manifold.config = {
    //默认抽样率
    samplerate : M_globals.customize.samplerate || 1,
    //站点编号：
    //1：国际站
    //2：中文站
    //4：阿里学院
    //5：Aliexpress
    //6：阿里金融
    //7：ITBU
    //20：内网
    siteNo : M_globals.customize.siteNo || 2,
    //日志记录服务器一
    logSeverOne : pro + '//dmtracking.1688.com/b.jpg',
    //日志记录服务器二
    logSeverTwo : pro + '//dmtracking.1688.com/c.jpg',
    //tracelog服务器
    tracelogSever : pro + '//stat.1688.com/tracelog/click.html',
    //错误记录服务器
    errorSever : pro + '//stat.1688.com/dw/error.html',
    //SPM服务器
    spmServer : pro + '//stat.1688.com/spm.html',
    //acookie接收服务器
    acookieSever : pro + '//acookie.1688.com/1.gif',
    // 域名切换服务器
    changeServer: pro + '//'+ TEMP_PASS +'.alibaba.com/read_cookie.htm',
    // 第一次切换cookie服务器
    firstUserServer: pro + '//check.china.alibaba.com/cta/cucrpc/getCookieId.jsonp',
    //是否种入acookie（集团cookie）
    isSetCookieToAcookie : M_globals.customize.isSetCookieToAcookie || true,
    needDefaultCookies : ['cna','ali_apache_id'],
    isCheckLogin : true
};

/**
 * 数据采集器内核
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-09-13
 * @modifyTime : 2012-07-09
 */

var atta = !!doc.attachEvent,
attachEvent = "attachEvent",
addEventListener = "addEventListener",
detachEvent = "detachEvent",
removeEventListener = "removeEventListener",
onevent = atta ? attachEvent : addEventListener,
offevent = atta ? detachEvent : removeEventListener;

var M_tools = Manifold.tools = {
    is : function(who, what){
        return who != null && Object(who) instanceof what;
    },
    isFunction : function (fn) {
        return (typeof fn==="function")||Object.prototype.toString.apply(fn)==='[object Function]';
    },
    isNumber : function(n){
        return typeof n==="number"&&isFinite(n);
    },
    isString : function(s){
        return typeof s==='string';
    },
    isArray : Array.isArray || function(a){
        return Object.prototype.toString.apply(a) === '[object Array]';
    },
    //检测是否为空对象
    isEmptyObject : function(o){
        for (var name in o) {
            return false;
        }
        return true;
    },
    // 读取spm meta信息
    spmMeta: function() {
        var meta = document.getElementsByTagName('meta'), A = 0,
        i, len = meta.length, W;
            
        for (i = 0; i < len; i++) {
            W = meta[i];
            
            if (this.tryToGetAttribute(W, 'name') === 'data-spm') {
                A = this.tryToGetAttribute(W, 'content');
                break;
            }
        }
        return A;
    },
    //去掉字符串 s 前后的空格
    trim : function(s) {
        return this.isString(s) ? s.replace(/^\s+|\s+$/g, "") : "";
    },
    //生成随机数
    random : function(){
        //取0到2147483647之间的自然数，32位系统最大整型
        return Math.round(Math.random() * 2147483647);
    },
    //抽样
    sampling : function(){
        return (Math.random() - M_config.samplerate) <= 0;
    },
    //去除URL中的'http:/'字样，为兼容后端服务程序
    trimHttpStr : function(url){
        //return encodeURIComponent(url.substr(url.indexOf("://") + 2));
        return url.substr(url.indexOf("://") + 2);
    },
    //随机化pageId
    randomPageId : function(){
        var pageId = win['dmtrack_pageid'] || '',
        now = +new Date(),
        ret = '';
        pageId += now;
        //截取前20位，单页面可能会随机化好几次，保持每次变化都不同
        pageId = pageId.substr(0,20);
        //字符串不足42位则补随机数
        while(pageId.length < 42){
            pageId += this.random();
        }
        //pageId只能是42位的字符串
        ret = pageId.substr(0,42);
        M_globals.pageId = ret;
        win['dmtrack_pageid'] = ret;
        return ret;
    },
    //发送错误日志
    sendErrorInfo : function(e,type){
        var url = M_config.errorSever,
        //导入发送器模块
        params = {
            type : type,
            exception : e.message
        };
        MM_recorder.send(url,params);
    },
    //木桩（空函数）
    emptyFunction : function(){}
};
/**
 * 简易模块管理器
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-9-24
 * @modifyTime : 2013-04-08
 */

var M_moduleManager = Manifold.moduleManager = function(){
    //模块存储池
    var _modules = {},
    //获取JS的完整路径
    _getJsUrl = function(id){
        var relativePath = M_globals.jsUrlHash[id];
        return relativePath ? M_globals.jsUrlRoot+relativePath : null;
    },
    //JS加载器
    _jsLoader = function(){
        var loadScriptDomElement = function(url,onload){
            var existingScript,
            domScript = doc.createElement('script');
            domScript.src = url;
            if(onload){
                domScript.onload = domScript.onreadystatechange = function(){
                    if(!this.readyState || 'loaded' === domScript.readyState || 'complete'===domScript.readyState){
                        //IE9、opera同时支持onload和onreadystatechange事件
                        domScript.onload = domScript.onreadystatechange = null;
                        onload();
                    }
                }
            }
            //获取页面中的第一个script标签元素
            existingScript = doc.getElementsByTagName('script')[0];
            existingScript.parentNode.insertBefore(domScript, existingScript);
        };
        return {
            load : loadScriptDomElement
        }
    }();
    return {
        //模块注册
        register : function(id,module,isImmediate){
            var that = this;
            //保证只注册一次
            if(that.hasRegistered(id)){
                return;
            }
            //是否立即执行，如果立即执行则保存模块代码执行后的结果对象，反之则只保存模块代码到需要的时候再执行，该标识针对内部模块使用
            _modules[id] = isImmediate?module.call(Manifold):module;
        },
        //获取模块
        require : function(id,fn){
            var module = _modules[id],
            jsUrl;
            //如果模块池中存储的只是模块代码，则执行该代码，且将执行完的结果替换掉原来模块池中对应的值，然后返回。
            if(M_tools.isFunction(module)){
                return _modules[id] = module.call(Manifold);
            }
            //如果模块池中存储的是模块代码执行结果对象，则直接返回该结果对象
            else if(module){
                return module;
            }
            jsUrl = _getJsUrl(id);

            /*
             * BUGFIX: 单页面load多次时，会加载多次相同的js文件
             * edited by arcthur.cheny
             */
            var hasRepeat = false
              , head = document.head || document.getElementsByTagName('head')[0]
              , allUrl = head.getElementsByTagName('script');

            for (var i = 0, l = allUrl.length; i < l; i++) {
                if (allUrl[i].src === jsUrl) {
                    hasRepeat = true;
                }
            }

            if(!hasRepeat && jsUrl !== null){
                //异步载入模块对应的JS文件
                _jsLoader.load(jsUrl,function(){
                    //将模块代码执行结果对象存入模块池中
                    _modules[id] = _modules[id].call($ns);
                    //执行回调函数
                    !fn || fn.call(null,_modules[id]);
                });
            }
            return null;
        },
        //检测指定模块是否已被注册
        hasRegistered : function(id){
            return !!_modules[id];
        },
        //检测模块池中存储的指定模块是否为执行后的结果对象
        hadUsed : function(id){
            var module = _modules[id];
            return module && !M_tools.isFunction(module);
        }
    }
}();

/**
 * 请求发送器
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-10-15
 * @modifyTime : 2013-04-08
 */

Manifold.moduleManager.register('recorder', function(){
    var that = this,
    //以创建图片的形式发送请求
    sendByImage = function(url, params,callback){
        params = params ? ('?' + params) : '';

        var img = new Image(1,1);
        img.src = url + params;
        img.onload = function(){
            this.onload = null;
            !callback || callback();
        }
    };
    return {
        //普通信息发送接口
        send : function(url, params, callback){
            var l = params.length;
            //图片方式请求长度极限测试结果：1、FF8（8203），2、IE6/IE7（2083），3、chrome16（8201），3、IE8（8206），4、IE9（8205）
            //所以2K以内为安全长度
            if(l <= 2036){
                sendByImage(url,params,callback);
            }
            //8K以内除IE6/7外，其他主流浏览器都安全，而IE6/7会忽略超出2K的所有字段，这个无法避免，这里在参数的最前面加上长度标注，以便分析排除
            else if(l <= 8192){
                sendByImage(url,'len='+l+'&'+params,callback);
            }
            else{
                sendByImage(url,'err=len&len='+l+'&'+params,callback);
            }
        }
    }
},true);

var MM_recorder = M_moduleManager.require('recorder');
/**
 * cookie处理器
 * @author : yu.yuy
 * @createTime : 2011-9-24
 * @modifyTime : 2012-05-08
 */

Manifold.moduleManager.register('cookieProcessor', function(){
    var that = this,
    //将cookie字符串转化成JSON对象
    _parseCookieString = function(s){
        var parts=s.split(/;\s/g),
        name=null,
        value=null,
        a=null,
        hash = {};
        if(M_tools.isString(s) && s.length) {
            for(var i = 0, len = parts.length; i < len; i++) {
                a = parts[i].match(/([^=]+)=/i);
                if(a instanceof Array) {
                    name = unescape(a[1]);
                    value = unescape(parts[i].substring(a[1].length+1));
                } else {
                    name = unescape(parts[i]);
                    value = '';
                }
                hash[name] = value;
            }
        }
        return hash;
    },
    _getCookieExpires = function(timeout){
        timeout = new Date((new Date()).getTime() + timeout);
        return ";expires=" + timeout.toGMTString();
    },
    //创建完整的cookie串
    _createCookieString = function(name,value,expires,path,domain,secure){
        var text = escape(name) + "=" + escape(value);
        //expires Date 设置具体日期
        if(expires instanceof Date) {
            text += "; expires=" + expires.toUTCString();
        }
        //expires Number型，单位是日，据现在后**日
        if(M_tools.isNumber(expires) && expires !== 0) {
            text += _getCookieExpires(expires*24*60*60*1000);
        }
        //path
        if(M_tools.isString(path) && path !== '') {
            text += "; path=" + path;
        }
        //domain
        if(M_tools.isString(domain) && domain !== '') {
            text += "; domain="+domain;
        }
        //secure
        if(secure) {
            text += "; secure";
        }
        return text;
    };
    return {
        //获取主cookie
        get : function(name){
            if(!M_tools.isString(name)||name===''){
                return null;
            }
            var cookies = _parseCookieString(doc.cookie);
            return name in cookies ? cookies[name] : null;
        },
        //获取指定主cookie中的子cookie
        getSub : function(name, subName){
            var hash = this.getSubCookies(name);
            if(hash) {
                if(!M_tools.isString(subName) || subName===''){
                    return null;
                }
                return subName in hash ? hash[subName]:null;
            }
            else{
                return null;
            }
        },
        //获取主cookie，并将其转化成JSON对象
        getSubCookies : function(name){
            var s = this.get(name),
            subCookieHash;
            if(s){
                subCookieHash = M_tools.parseParam(s,'|');
                return subCookieHash;
            }
            else{
                return null;
            }
        },
        //编辑主cookie
        set : function(name,value,options){
            options=options||{};
            if(M_tools.isString(name) && value!==undefined) {
                var text=_createCookieString(name,value,options.expires,options.path,options.domain,options.secure);
                doc.cookie=text;
            }
        },
        //编辑子cookie
        setSub : function(name,subName,value,options){
            if(!M_tools.isString(name)||name==='') return;
            if(!M_tools.isString(subName)||subName==='') return;
            if(!value) return;

            var hash=this.getSubCookies(name),
            o = {};
            if(hash === null) hash={};
            o[subName]=value;
            this.set(name,M_tools.combineParam(hash,o,'|',true),options);
        },
        //编辑多个子cookie
        setSubs : function(name,o,options){
            if(!M_tools.isString(name)||name==='') return;
            var hash=this.getSubCookies(name) || {};
            this.set(name,M_tools.combineParam(hash,o,'|',true),options);
        },
        //删除主cookie
        remove : function(name,options){
            options=options||{};
            var text=_createCookieString(name,'',new Date(0),options.path,options.domain,options.secure);
            doc.cookie=text;
        },
        //删除子cookie
        removeSub : function(name,subName){
            if(!M_tools.isString(name)||name==='') return;
            if(!M_tools.isString(subName)||subName==='') return;
            var hash=this.getSubCookies(name);
            if(hash && hash.hasOwnProperty(subName)) {
                delete hash[subName];
                this.set(name,M_tools.combineParam(hash,{},'|'));
            }
        }
    }
},true);

var MM_cookieProcessor = M_moduleManager.require('cookieProcessor');

/**
 * 必要业务监控
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-16
 * @modifyTime : 2013-04-09
 */

Manifold.moduleManager.register('essential', function(){
    var init = function(){
        //抽样
        if(!M_tools.sampling()){
            return;
        }
        try {
            var hasMoved = MM_cookieProcessor.get('sync_cookie');

            if (!hasMoved || hasMoved !== 'true') {
                MM_recorder.send(M_config.changeServer, '');
            }
        } catch(e){
            M_tools.sendErrorInfo(e, 'essential');
        }
    };
    return {
        init : init
    }
},true);

var MM_essential = M_moduleManager.require('essential');

/**
 * 兼容老版本补丁
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-30
 * @modifyTime : 2013-04-09
 */

win.ex_dmtracking = function(){
    if (M_globals.isConflicted === true) {
        return;
    }
    MM_essential.init();
};

ex_dmtracking();
}());
