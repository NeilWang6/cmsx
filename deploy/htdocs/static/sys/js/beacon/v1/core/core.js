/**
 * 数据采集器内核
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-09-13
 * @modifyTime : 2012-07-09
 */
(function($ns){
    var G = $ns.globals,
    C = $ns.config,
    doc = G.doc,
    atta = !!doc.attachEvent,
    attachEvent = "attachEvent",
    addEventListener = "addEventListener",
    detachEvent = "detachEvent",
    removeEventListener = "removeEventListener",
    onevent = atta ? attachEvent : addEventListener,
    offevent = atta ? detachEvent : removeEventListener;
	
    $ns.tools = {
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
        //读取href
        tryToGetHref: function(anchor) {
            var that = this;
            /**
             * 如果 href 格式有误时，在 IE8/9 下 href 将无效，
             * 读取 anchor.href 时会直接出错。
             */
            
            var href;
            try {
                href = this.trim(anchor.getAttribute("href", 2));
            } catch (e) {}
            
            return href || "";
        },
        // 读取属性
        tryToGetAttribute: function (element, attr_name) {
            return element && element.getAttribute ? (element.getAttribute(attr_name) || "") : "";
        },
        // 写入属性
        tryToSetAttribute: function (element, attr_name, attr_value) {
            if (element && element.setAttribute) {
                try {
                    element.setAttribute(attr_name, attr_value);
                } catch (e) {}
            }
        },
        // 移除属性
        tryToRemoveAttribute: function (element, attr_name) {
            if (element && element.removeAttribute) {
                try {
                    element.removeAttribute(attr_name);
                } catch (e) {
                    tryToSetAttribute(element, attr_name, "");
                }
            }
        },
        //将一个 node list 转为数组
        nodeListToArray: function (nodes) {
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
        //将两个JSON对象合并成一个
        combineJson : function(src,des,isCover){
            var ret = {};
            for(var i in des){
                if(isCover || !src.hasOwnProperty(i)){
                    ret[i] = des[i];
                    delete src[i];
                }
            }
            for(var j in src){
                ret[j] = src[j];
            }
            return ret;
        },
        //将两个JSON对象合并成一个由自定义间隔符间隔的字符串
        combineParam : function(src,des,separator,isCover){
            var ret = [];
            for(var param in des){
                //是否覆盖原有属性
                if(isCover || !src.hasOwnProperty(param)){
                    ret.push(param+'='+des[param]);
                    delete src[param];
                }
            }
            for(var p in src){
                ret.push(p+'='+src[p]);
            }
            return ret.join(separator);
        },
        //拆解字符串（cookie/url参数等）成json对象
        parseParam : function(s,separator){
            var parts,
            keyValueArray=null,
            hash={};
            if(this.isString(s) && s.length>0) {
                parts=s.split(separator);
                for(var i=0,len=parts.length;i<len;++i) {
                    keyValueArray=parts[i].split('=');
                    //hash[unescape(keyValueArray[0])]=unescape(keyValueArray[1]);
                    hash[keyValueArray[0]]=keyValueArray[1];
                }
            }
            return hash;
        },
        //绑定事件
        on : function(obj, eventType, f) {
			obj[onevent](
				(atta ? "on" : "") + eventType,
				function (e) {
					e = e || win.event;
					var el = e.target || e.srcElement;

					f(e, el);
				},
				false
			);
		},
        //移除事件
        off : function(obj, eventType, f){
            obj[offevent](
				(atta ? "on" : "") + eventType,
				function (e) {
					e = e || win.event;
					var el = e.target || e.srcElement;

					f(e, el);
				},
				false
			);
        },
        //生成随机数
        random : function(){
            //取0到2147483647之间的自然数，32位系统最大整型
            return Math.round(Math.random() * 2147483647);
        },
        //获取refer
        getReferrer : function(){
            var ret,
            refer = G.doc.referrer;
            try{
                //IE下如果跨域取opener.location.href会出异常
                ret = refer || G.opener.location.href || '-';
            }
            catch(e){
                ret = '-';
            }
            //return encodeURIComponent(ret);
            return ret;
        },
        //抽样
        sampling : function(){
            return (Math.random() - C.samplerate) <= 0;
        },
        //去除URL中的'http:/'字样，为兼容后端服务程序
        trimHttpStr : function(url){
            //return encodeURIComponent(url.substr(url.indexOf("://") + 2));
            return url.substr(url.indexOf("://") + 2);
        },
        //随机化pageId
        randomPageId : function(){
            var pageId = G.win['dmtrack_pageid'] || '',
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
            G.pageId = ret;
            G.win['dmtrack_pageid'] = ret;
            return ret;
        },
        //发送错误日志
        sendErrorInfo : function(e,type){
            var url = C.errorSever,
            //导入发送器模块
            R = $ns.moduleManager.require('recorder'),
            params = {
                type : type,
                exception : e.message
            };
            R.send(url,params);
        },
        //木桩（空函数）
        emptyFunction : function(){}
    };
})(MAGNETO);
