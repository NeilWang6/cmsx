/*
 * 该文件封装了Alitalk初始化功能，组件需要用到online这个全局变量，谨防冲突。
 * @author Denis<danxia.shidx@alibaba-inc.com>
 * @link http://www.antku.com/v/alitalk.html
 * @version 3.4
 * @version 3.01 2010-03-10  修改了旺旺状态获取的路径，支持不同子公司旺旺状态获取。
 * @version 3.02 2010-06-03  增加了onClickBegin, onClickEnd2个事件接口。
 * @version 3.03 2010-06-28  提取onClickHandler，增加静态方法FD.widget.Alitalk.Talk方法。
 * @version 3.04 2011-0305   添加对firefox,chrome浏览器的监测以及旺旺弹出
 * @update Desni 2011.12.05 增加反馈信息
 * @update Denis 2012.03.12 增加分流参数
 * @update Denis 2012.06.06 优化getAlitalk方法，传递用户id给web旺旺页面
 */
;
window.online = null;
(function(w){
    /*
     * 实例化Alitalk的入口.
     * @param {HTMLElement|Array} Dom单一元素或元素组
     * @param {object} opts 配置参数
     */
    var Alitalk = function(els, opts){
        if (els && els.nodeType) 
            els = [els];
        if (els && els.length) 
            this.init(els, opts);
    }, //是否为IE浏览器
 isIE = !!(FDEV.env.ua.ie), //保存贸易通版本号，目前为5或6
 version, //转为数字
 numberify = function(s){
        var c = 0;
        return parseFloat(s.replace(/\./g, function(){
            return (c++ === 0) ? '.' : '';
        }));
    }, //是否安装贸易通或阿里旺旺
 isInstalled = (function(){
        if (isIE) {
            var vers = {
                'aliimx.wangwangx': 6,
                'Ali_Check.InfoCheck': 5
            };
            for (var p in vers) {
                try {
                    new ActiveXObject(p);
                    version = vers[p];
                    return true;
                } 
                catch (e) {
                }
            }
            version = 0;
        }
        else if (YAHOO.env.ua.gecko || YAHOO.env.ua.webkit) {
            if (navigator.mimeTypes["application/ww-plugin"]) {
                var plugin = document.createElement("embed");
                plugin.setAttribute('type', 'application/ww-plugin');
                FYD.setStyle(plugin, 'visibility', 'hidden');
                FYD.setStyle(plugin, 'width', 0);
                FYD.setStyle(plugin, 'height', 0);
                FYE.onDOMReady(function(S){
                    document.body.appendChild(plugin);
                    if ((plugin.NPWWVersion && numberify(plugin.NPWWVersion()) >= 1.003) || (plugin.isInstalled && plugin.isInstalled(1))) {
                        version = 6; //只有2011版之后才支持firefox以及chrome浏览器
                        w.Alitalk.isInstalled = isInstalled = true;
                    }
                    if (plugin.tagName.toLowerCase() == 'embed') {
                        plugin.parentNode.removeChild(plugin);
                    }
                }, this);
            }
        }
        return false;
    })(), //自动登陆
 autoLogin = function(id){
        var src;
        if (version == 5) 
            src = 'alitalk:';
        else src = 'aliim:login?uid=' + (id || '');
        invokeWW(src);
        //var iframe=document.createElement('iframe');
        //iframe.style.display='none';
        //document.body.appendChild(iframe);
        //iframe.src=src;
        //setTimeout(function() { document.body.removeChild(iframe); },1000);
    }, //默认配置
 defaults = {
        //数组对应的类型依次为自定义、按钮和图标
        cls: {
            base: 'iconAlitalk',
            on: 'icon-on',
            off: 'icon-off',
            mb: 'icon-mb'
        },
        //旺旺所在的站点，
        siteID: 'cnalichn',
        //是否请求用户在线状态
        remote: true,
        //实例化过程中是否开启自动登陆
        autoLogin: false,
        beginNum: 0,
        prop: '',
        //弹出阿里旺旺下载页
        getAlitalk: function(id){
            window.open('http://webww.1688.com/message/my_chat.htm?towimmid=' + id, '_blank');
        }
    }, //回调函数
 success = function(ali){
        for (var i = 0; i < ali.els.length; i++) {
            if (ali.els[i].opt.remote) { //对没有指定remote为false的判断在线状态并加上相应样式
                ali.els[i].opt.online = window.online[i]; //把在线状态保存到元素属性以便于后期调用
                FYD.addClass(ali.els[i], ali.els[i].opt.cls.base); //上基样式
                switch (window.online[i]) {
                    case 0:
                    case 2:
                    case 6:
                    default: //不在线
                        FYD.addClass(ali.els[i], ali.els[i].opt.cls.off);
                        break;
                    case 1: //在线
                        FYD.addClass(ali.els[i], ali.els[i].opt.cls.on);
                        break;
                    case 4:
                    case 5: //手机在线
                        FYD.addClass(ali.els[i], ali.els[i].opt.cls.mb);
                        break;
                }
                if (ali.els[i].opt.onRemote) 
                    ali.els[i].opt.onRemote.call(ali.els[i]);
            }
        }
        //重置
        window.online = null;
        if (ali.opts.onSuccess) 
            ali.opts.onSuccess.call(ali);
    },
    onClickHandler = function(e){
        if (e) 
            FYE.preventDefault(e);
        var o = this.opt;
        
        if (!isInstalled && o.webWW) {
            o.webWW.call(this);
            return;
        }
        if (o.onClickBegin) {
            var res = o.onClickBegin.call(this, e);
            if (!res) 
                return;
        }
        //静态模式下 设置默认状态为在线
        if (!o.remote) 
            o.online = 1;
        //还没有获取到状态
        if (o.online == null) 
            return;
        var prop = o.prop, feedback, info_id;
        if (typeof prop == 'function') {
            prop = prop.call(this);
            var match = prop.match(/info_id=([^#]+)/);
            if(match && match.length === 2){
                info_id = match[1];
            }
        }
            
        feedback = '&url2=http://dmtracking.1688.com/others/feedbackfromalitalk.html?online=' + o.online +
            '#info_id=' +  (o.info_id || info_id || '') +
            '#type=' +  (o.type || '') +
            '#module_ver=3#refer=' +  encodeURI(document.URL).replace(/&/g, '$');
        //解析用户id
        switch (version) {
            case 0:
            default:
                o.getAlitalk.call(this, o.id); //下载阿里旺旺
                break;
            case 5:
                invokeWW('Alitalk:Send' + (o.online == 4 ? 'Sms' : 'IM') + '?' + o.id + '&siteid=' + o.siteID + '&status=' + o.online + feedback + prop);
                break;
            case 6:
                if (o.online == 4) {
                    invokeWW('aliim:smssendmsg?touid=' + o.siteID + o.id + feedback + prop);
                }
                else {
                    invokeWW('aliim:sendmsg?touid=' + o.siteID + o.id + '&siteid=' + o.siteID + '&fenliu=1&status=' + o.online + feedback + prop);
                }
                break;
        }
        if (o.onClickEnd) 
            o.onClickEnd.call(this, e);
    },    /**
     * 调用旺旺插件
     */
    invokeWW = function(cmd){
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.src = cmd;
        setTimeout(function(){
            document.body.removeChild(iframe);
        }, 200);
    };
    Alitalk.prototype = {
        /*
         * 实例化Alitalk的入口. 这是组件实例唯一暴露在外的方法
         * @param {HTMLElement|Array} Dom单一对象或对象组
         * @param {object} opts 配置参数
         */
        init: function(els, opts){
            //防止多次调用online冲突
            if (window.online != null) {
                setTimeout(function(){
                    return new w.Alitalk(els, opts);
                }, Math.random() * 1000 + 1000);
                return;
            }
            else {
                this.opts = FD.common.applyIf(opts || {}, defaults);
                if (this.opts.remote) 
                    window.online = [];
                this.getAlitalk = this.opts.getAlitalk;
            }
            if (els.nodeType) 
                els = [els];
            if (!els.length) 
                return;
            this.els = els;
            var ids = '', that = this;
            for (var i = 0; i < els.length; i++) {
                var o = FD.common.applyIf(eval('(' + (FYD.getAttribute(els[i], 'alitalk') || '{}') + ')'), this.opts);
                if (!o.id || !FDEV.lang.trim(o.id)) {
                    els.splice(i, 1);
                    i--;
                }
                else {
                    els[i].opt = o;
                    ids += els[i].opt.siteID + o.id + ';';
                }
            }
            //给按钮注册点击事件
            FYE.addListener(els, 'click', onClickHandler);
            //从阿里软件获取在线状态
            if (this.opts.remote) 
                FDEV.util.Get.script('http://amos.im.alisoft.com/mullidstatus.aw?beginnum=' + this.opts.beginNum + '&uids=' + ids + '&t=' + new Date().valueOf(), {
                    charset: 'gb2312',
                    onSuccess: function(){
                        success(that);
                    },
                    onFailure: function(){
                        window.online = null;
                    },
                    onTimeout: function(){
                        window.online = null;
                    }
                });
            //自动登录
            if (isIE && this.opts.autoLogin) 
                autoLogin();
        }
    };
    /*
     * 静态变量及方法
     */
    w.Alitalk = Alitalk;
    /*
     * Alitalk客户端版本
     */
    w.Alitalk.version = version;
    /*
     * 客户端是否安装了Alitalk
     */
    w.Alitalk.isInstalled = isInstalled;
    /*
     * 自动启动alitalk客户端软件
     */
    w.Alitalk.autoLogin = autoLogin;
    /*
     * 旺旺聊天静态方法
     */
    w.Alitalk.talk = function(o){
        var scope = {};
        scope.opt = o || {};
        scope.opt.online = scope.opt.online || 1;
        FD.common.applyIf(scope.opt, defaults);
        onClickHandler.call(scope);
    };
})(FD.widget);
