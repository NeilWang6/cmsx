(function() {

/**
 * ������������
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
    //js�ļ���Ŀ¼
    jsUrlRoot : 'http://style.c.aliimg.com/sys/js/beacon/v2/',
    //��js�ļ����·������
    /* jsUrlHash : {
        flash : 'plugins/client/flash.js',
        html5 : 'plugins/client/html5.js'
    }, */
    customize : window['WolfSmoke'] || {},
    isConflicted : isConflicted,
    version : '2.0'
};

/**
 * ������
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-14
 * @modifyTime : 2013-04-08
 */

var TEMP_PASS = 'pass';
var M_config = Manifold.config = {
    //Ĭ�ϳ�����
    samplerate : M_globals.customize.samplerate || 1,
    //վ���ţ�
    //1������վ
    //2������վ
    //4������ѧԺ
    //5��Aliexpress
    //6���������
    //7��ITBU
    //20������
    siteNo : M_globals.customize.siteNo || 2,
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
    changeServer: pro + '//'+ TEMP_PASS +'.alibaba.com/read_cookie.htm',
    // ��һ���л�cookie������
    firstUserServer: pro + '//check.china.alibaba.com/cta/cucrpc/getCookieId.jsonp',
    //�Ƿ�����acookie������cookie��
    isSetCookieToAcookie : M_globals.customize.isSetCookieToAcookie || true,
    needDefaultCookies : ['cna','ali_apache_id'],
    isCheckLogin : true
};

/**
 * ���ݲɼ����ں�
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
    //����Ƿ�Ϊ�ն���
    isEmptyObject : function(o){
        for (var name in o) {
            return false;
        }
        return true;
    },
    // ��ȡspm meta��Ϣ
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
    //ȥ���ַ��� s ǰ��Ŀո�
    trim : function(s) {
        return this.isString(s) ? s.replace(/^\s+|\s+$/g, "") : "";
    },
    //���������
    random : function(){
        //ȡ0��2147483647֮�����Ȼ����32λϵͳ�������
        return Math.round(Math.random() * 2147483647);
    },
    //����
    sampling : function(){
        return (Math.random() - M_config.samplerate) <= 0;
    },
    //ȥ��URL�е�'http:/'������Ϊ���ݺ�˷������
    trimHttpStr : function(url){
        //return encodeURIComponent(url.substr(url.indexOf("://") + 2));
        return url.substr(url.indexOf("://") + 2);
    },
    //�����pageId
    randomPageId : function(){
        var pageId = win['dmtrack_pageid'] || '',
        now = +new Date(),
        ret = '';
        pageId += now;
        //��ȡǰ20λ����ҳ����ܻ�������ü��Σ�����ÿ�α仯����ͬ
        pageId = pageId.substr(0,20);
        //�ַ�������42λ�������
        while(pageId.length < 42){
            pageId += this.random();
        }
        //pageIdֻ����42λ���ַ���
        ret = pageId.substr(0,42);
        M_globals.pageId = ret;
        win['dmtrack_pageid'] = ret;
        return ret;
    },
    //���ʹ�����־
    sendErrorInfo : function(e,type){
        var url = M_config.errorSever,
        //���뷢����ģ��
        params = {
            type : type,
            exception : e.message
        };
        MM_recorder.send(url,params);
    },
    //ľ׮���պ�����
    emptyFunction : function(){}
};
/**
 * ����ģ�������
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-9-24
 * @modifyTime : 2013-04-08
 */

var M_moduleManager = Manifold.moduleManager = function(){
    //ģ��洢��
    var _modules = {},
    //��ȡJS������·��
    _getJsUrl = function(id){
        var relativePath = M_globals.jsUrlHash[id];
        return relativePath ? M_globals.jsUrlRoot+relativePath : null;
    },
    //JS������
    _jsLoader = function(){
        var loadScriptDomElement = function(url,onload){
            var existingScript,
            domScript = doc.createElement('script');
            domScript.src = url;
            if(onload){
                domScript.onload = domScript.onreadystatechange = function(){
                    if(!this.readyState || 'loaded' === domScript.readyState || 'complete'===domScript.readyState){
                        //IE9��operaͬʱ֧��onload��onreadystatechange�¼�
                        domScript.onload = domScript.onreadystatechange = null;
                        onload();
                    }
                }
            }
            //��ȡҳ���еĵ�һ��script��ǩԪ��
            existingScript = doc.getElementsByTagName('script')[0];
            existingScript.parentNode.insertBefore(domScript, existingScript);
        };
        return {
            load : loadScriptDomElement
        }
    }();
    return {
        //ģ��ע��
        register : function(id,module,isImmediate){
            var that = this;
            //��ֻ֤ע��һ��
            if(that.hasRegistered(id)){
                return;
            }
            //�Ƿ�����ִ�У��������ִ���򱣴�ģ�����ִ�к�Ľ�����󣬷�֮��ֻ����ģ����뵽��Ҫ��ʱ����ִ�У��ñ�ʶ����ڲ�ģ��ʹ��
            _modules[id] = isImmediate?module.call(Manifold):module;
        },
        //��ȡģ��
        require : function(id,fn){
            var module = _modules[id],
            jsUrl;
            //���ģ����д洢��ֻ��ģ����룬��ִ�иô��룬�ҽ�ִ����Ľ���滻��ԭ��ģ����ж�Ӧ��ֵ��Ȼ�󷵻ء�
            if(M_tools.isFunction(module)){
                return _modules[id] = module.call(Manifold);
            }
            //���ģ����д洢����ģ�����ִ�н��������ֱ�ӷ��ظý������
            else if(module){
                return module;
            }
            jsUrl = _getJsUrl(id);

            /*
             * BUGFIX: ��ҳ��load���ʱ������ض����ͬ��js�ļ�
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
                //�첽����ģ���Ӧ��JS�ļ�
                _jsLoader.load(jsUrl,function(){
                    //��ģ�����ִ�н���������ģ�����
                    _modules[id] = _modules[id].call($ns);
                    //ִ�лص�����
                    !fn || fn.call(null,_modules[id]);
                });
            }
            return null;
        },
        //���ָ��ģ���Ƿ��ѱ�ע��
        hasRegistered : function(id){
            return !!_modules[id];
        },
        //���ģ����д洢��ָ��ģ���Ƿ�Ϊִ�к�Ľ������
        hadUsed : function(id){
            var module = _modules[id];
            return module && !M_tools.isFunction(module);
        }
    }
}();

/**
 * ��������
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-10-15
 * @modifyTime : 2013-04-08
 */

Manifold.moduleManager.register('recorder', function(){
    var that = this,
    //�Դ���ͼƬ����ʽ��������
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
        //��ͨ��Ϣ���ͽӿ�
        send : function(url, params, callback){
            var l = params.length;
            //ͼƬ��ʽ���󳤶ȼ��޲��Խ����1��FF8��8203����2��IE6/IE7��2083����3��chrome16��8201����3��IE8��8206����4��IE9��8205��
            //����2K����Ϊ��ȫ����
            if(l <= 2036){
                sendByImage(url,params,callback);
            }
            //8K���ڳ�IE6/7�⣬�����������������ȫ����IE6/7����Գ���2K�������ֶΣ�����޷����⣬�����ڲ�������ǰ����ϳ��ȱ�ע���Ա�����ų�
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
 * cookie������
 * @author : yu.yuy
 * @createTime : 2011-9-24
 * @modifyTime : 2012-05-08
 */

Manifold.moduleManager.register('cookieProcessor', function(){
    var that = this,
    //��cookie�ַ���ת����JSON����
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
    //����������cookie��
    _createCookieString = function(name,value,expires,path,domain,secure){
        var text = escape(name) + "=" + escape(value);
        //expires Date ���þ�������
        if(expires instanceof Date) {
            text += "; expires=" + expires.toUTCString();
        }
        //expires Number�ͣ���λ���գ������ں�**��
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
        //��ȡ��cookie
        get : function(name){
            if(!M_tools.isString(name)||name===''){
                return null;
            }
            var cookies = _parseCookieString(doc.cookie);
            return name in cookies ? cookies[name] : null;
        },
        //��ȡָ����cookie�е���cookie
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
        //��ȡ��cookie��������ת����JSON����
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
        //�༭��cookie
        set : function(name,value,options){
            options=options||{};
            if(M_tools.isString(name) && value!==undefined) {
                var text=_createCookieString(name,value,options.expires,options.path,options.domain,options.secure);
                doc.cookie=text;
            }
        },
        //�༭��cookie
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
        //�༭�����cookie
        setSubs : function(name,o,options){
            if(!M_tools.isString(name)||name==='') return;
            var hash=this.getSubCookies(name) || {};
            this.set(name,M_tools.combineParam(hash,o,'|',true),options);
        },
        //ɾ����cookie
        remove : function(name,options){
            options=options||{};
            var text=_createCookieString(name,'',new Date(0),options.path,options.domain,options.secure);
            doc.cookie=text;
        },
        //ɾ����cookie
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
 * ��Ҫҵ����
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-11-16
 * @modifyTime : 2013-04-09
 */

Manifold.moduleManager.register('essential', function(){
    var init = function(){
        //����
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
 * �����ϰ汾����
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
