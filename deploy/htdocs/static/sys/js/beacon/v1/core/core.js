/**
 * ���ݲɼ����ں�
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
        //��ȡhref
        tryToGetHref: function(anchor) {
            var that = this;
            /**
             * ��� href ��ʽ����ʱ���� IE8/9 �� href ����Ч��
             * ��ȡ anchor.href ʱ��ֱ�ӳ���
             */
            
            var href;
            try {
                href = this.trim(anchor.getAttribute("href", 2));
            } catch (e) {}
            
            return href || "";
        },
        // ��ȡ����
        tryToGetAttribute: function (element, attr_name) {
            return element && element.getAttribute ? (element.getAttribute(attr_name) || "") : "";
        },
        // д������
        tryToSetAttribute: function (element, attr_name, attr_value) {
            if (element && element.setAttribute) {
                try {
                    element.setAttribute(attr_name, attr_value);
                } catch (e) {}
            }
        },
        // �Ƴ�����
        tryToRemoveAttribute: function (element, attr_name) {
            if (element && element.removeAttribute) {
                try {
                    element.removeAttribute(attr_name);
                } catch (e) {
                    tryToSetAttribute(element, attr_name, "");
                }
            }
        },
        //��һ�� node list תΪ����
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
        //������JSON����ϲ���һ��
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
        //������JSON����ϲ���һ�����Զ�������������ַ���
        combineParam : function(src,des,separator,isCover){
            var ret = [];
            for(var param in des){
                //�Ƿ񸲸�ԭ������
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
        //����ַ�����cookie/url�����ȣ���json����
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
        //���¼�
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
        //�Ƴ��¼�
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
        //���������
        random : function(){
            //ȡ0��2147483647֮�����Ȼ����32λϵͳ�������
            return Math.round(Math.random() * 2147483647);
        },
        //��ȡrefer
        getReferrer : function(){
            var ret,
            refer = G.doc.referrer;
            try{
                //IE���������ȡopener.location.href����쳣
                ret = refer || G.opener.location.href || '-';
            }
            catch(e){
                ret = '-';
            }
            //return encodeURIComponent(ret);
            return ret;
        },
        //����
        sampling : function(){
            return (Math.random() - C.samplerate) <= 0;
        },
        //ȥ��URL�е�'http:/'������Ϊ���ݺ�˷������
        trimHttpStr : function(url){
            //return encodeURIComponent(url.substr(url.indexOf("://") + 2));
            return url.substr(url.indexOf("://") + 2);
        },
        //�����pageId
        randomPageId : function(){
            var pageId = G.win['dmtrack_pageid'] || '',
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
            G.pageId = ret;
            G.win['dmtrack_pageid'] = ret;
            return ret;
        },
        //���ʹ�����־
        sendErrorInfo : function(e,type){
            var url = C.errorSever,
            //���뷢����ģ��
            R = $ns.moduleManager.require('recorder'),
            params = {
                type : type,
                exception : e.message
            };
            R.send(url,params);
        },
        //ľ׮���պ�����
        emptyFunction : function(){}
    };
})(MAGNETO);
