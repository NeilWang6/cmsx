/**
 * @author chuangui.xiecg
 * @version 0.0.3
 * @date 2009-2-12
 */

/*����һ��ȫ��������ҳ���Ƿ񷢲�ͨ������������*/
if(typeof isCoaseCompleted =='undefined'){
	isCoaseCompleted = false;
}

if (typeof COASE == "undefined" || !COASE) {
	/**
	 * ��˹�����
	 * The COASE global namespace object.  If COASE is already defined, the
	 * existing COASE object will not be overwritten so that defined
	 * namespaces are preserved.
	 * @class COASE
	 * @static
	 */
	var COASE = {};
}

/**
 * �����˹�������Ӧ��url,����Ǹ���ȫ���ģ������ȫ���������
 */
COASE.coaseUrl = {
	'specificSpider':'http://style.c.aliimg.com/js/coase/specificSpider.js',
	'spider':'http://style.c.aliimg.com/js/coase/spider.js'
};
/**
 * �����˹ͨ�����ò���,����һЩ����ͨ�õĲ�����������Ӧ�ļ���js��������
 */
COASE.coaseConfig={
	'api':'http://ctr.1688.com/ctr.html?ctr_type={ctr_type}&page_area={page_area}&page_id={page_id}&category_id={category_id}&object_type={object_type}&object_ids={object_ids}&keyword={keyword}&page_size={page_size}&page_no={page_no}&refer={refer}'
};
/**
 * �����˹���ĳ�ʼ������
 * @param {Object} o һ��Json����,��Ϊ��
 * @return {Object}
 * @dynamic
 */
COASE.urlParams={
	'ctr_type': '1',
	'page_id': '',
	'page_area': '4',
	'category_id': '',
	'object_type': 'offer',
	'object_ids':'',
	'keyword':'',
	'page_size': '',
	'page_no':'',
	'refer':''
}
COASE.getUrlParams=function(o){
	o = o||{};
	var p = {};
	for(var i in COASE.urlParams){
		p[i] = o[i]||COASE.urlParams[i];
	}
	return p;
}
/**
 * �����˹��㺯��
 * @param {String} s ��˹��㺯��
 * @static
 */
COASE.coaseClick=function(s){
	var d = new Date().getTime();
	if(document.images){
		setTimeout(function(){
			(new Image()).src = s+"&time="+d;
		},10);
	}
}
/**
 * ���ٴ�㺯��,��ֹ��Ϊ����,Ŀǰ��δ��ȡ��ط���,Ԥ��һ���ӿ�,��Ϊ�Ժ�һ����չ
 * @method scout
 * @param  {String*} arguments 1-n namespaces to create 
 * @return {Boolean} ͨ������ֵ���жϵ�ǰ�Ƿ�Ҫ���д��
 */
COASE.scout=function(arr){
	if(arr.length<2||isCoaseCompleted){
		return false;
	}
	isCoaseCompleted = true;
	return true;
}
/**
	 * �����˹�����༯�ϣ�������ص�����ڶ�Ӧ��js�ļ�������չ,ĿǰΪ��
 */
COASE.modules={};
/**
 * coase URI·��
 * URI�������ź���Ψһ��Ӧ�Ŀ�����(controller)��/����/������
 * @param {String} ����������
 * @param {String} ������,��Ӧ����Ӧ����,��������Ϊһ�������ж�,��������غ���
 * @param {Object||String} ����,��һ��Json������߾�ֱ��һ���ַ���,Ĭ��ֵΪ�ն���{}
 * @static
 */
COASE.coaseURI=function(){
	var a = arguments||[];
	var C = COASE;
	var loader = COASE.util.loader;
	if(C.scout(a)){
		var url = C.coaseUrl[a[0]];
		var callback = function(){
			var fn = a[1];
			var p = a[2];
			C.modules[a[0]](fn,p);
		}
		loader.script(url,callback,window);
	}else{
		//throw new Error('Error:the params should be at least two!');
	}
};
COASE.util={
	/**
	 * �����滻 (��ϸ�뿴yui�ṩYAHOO.Lang.substitute)
	 * @param {String} s Դ�ַ���
	 * @param {Object} o Json����
	 * @return {String} �滻����ַ���
	 * @static
	 */
	substitute:function(s,o){
		if(typeof o !=='object')return s;
		for(var i in o){
			var temp = "{"+i+"}";
			var key = new RegExp(temp,"g");
			s=s.replace(key,o[i]);
		}
		return s;
	},
	/**
	 * �ж�key�Ƿ��ڵ�ǰ����(��������������)����
	 * @param {String} key
	 * @param {Array} arr 
	 * @return {Boolean}
	 * @static
	 */
	isInArray:function(key,arr){
		for(var i=0,l=arr.length;i<l;i++){
			if(key===arr[i]){
				return true;
			}
		}
		return false;
	},
	/**
	 * ����ID��ȡDom����
	 * @param {String} id
	 * @return {HTMLElement}
	 * @static
	 */
	get:function(id){
		if(id=='document')return document;
		return document.getElementById(id);
	},
	/**
	 * ͳһȥ��ȡҳ���page_id,����page_id�����޸ĵĻ�������ͳһ�޸�
	 * @static
	 */
	getPageId:function(){
		return window.dmtrack_pageid || '';
	},
	/**
	 * ����������ĳ��Ԫ���Ƿ���������
	 * @method _arrayLastIndexOf
	 * @param {Array} arr
	 * @param {mixed} element
	 * @param {int} index
	 * @static
	 */
	_arrayLastIndexOf:function(arr,element,index){
		if(arr.lastIndexOf) return arr.lastIndexOf(element,index);
		var length = arr.length;
		if(index < 0) index+=length+1;
		else if(index === undefined || index > length) index = length;
		else ++index;
		while(index--){
			if(element === arr[index]) return index;
		}
		return -1;
	},
	/**
	 * ����Ψһ��
	 * @method arrayUnique
	 * @param arr
	 * @dynamic
	 */
	arrayUnique:function(arr){
		var length = arr.length;
		while(--length){//arr[0] is not removed
			if(COASE.util._arrayLastIndexOf(arr,arr[length],length-1) > -1) arr.splice(length,1);
		}
		return arr;
	}
};
/**
 * �첽����������ķ�װʵ��
 */
COASE.util.loader = function(){
	var nidx = 0;//script���������ID
	
	/**
	 * ���ݽӵ����ͺͽڵ�ӵ�е����Լ�������������һ���ڵ�
	 * @param {String} nodeType �ӵ�����
	 * @param {Object} attributes �ڵ�ӵ�е�����
	 * @param {Object} win ������
	 * @return ����һ��DOM�ڵ�
	 */
	var _node = function(nodeType,attributes,win){
		var w = win || window, d=w.document, n=d.createElement(nodeType);
		for (var i in attributes) {
            if (attributes[i]) {
                n.setAttribute(i, attributes[i]);
            }
        }
		return n;
	};
	
	/**
	 * ����URL��������ͱ���������һ��javascript�ڵ�
	 * @param {String} url URL
	 * @param {Object} win ������
	 * @param {String} charset ����
	 * @return ����һ��javascript�ڵ�
	 */
	var _scriptNode = function(url,win,charset){
		var c = charset || "gbk";
		return _node("script",{
			"id":"coase-"+(nidx++),
			"type":"text/javascript",
			"charset": c,
			"src":url
		},win);
	};
	
	return {
		/**
		 * �����첽��������ķ���
		 * @param {Object} url �첽�������������
		 * @param {Object} fn ����ɹ��󴥷��ķ���
		 * @param {Object} scope ������
		 */
		script:function(url,fn,scope){
			var w=scope||window, d=w.document, h=d.getElementsByTagName("head")[0], n;
			n = _scriptNode(url,w,"gbk");
			h.appendChild(n);
			if(document.all&&!document.opera){
				n.onreadystatechange = function(){
					var rs = this.readyState;
				 	if("loaded" === rs || "complete" === rs){
						fn();
					}
				}
			}else{
				n.onload = function(){
					fn();
				}
			}
		}
	}
}();
/**
 * ���÷���
 */
COASE.lang = {
	/**
	 * �ж��Ƿ��Ƿ���
	 * @param {Object} o
	 */
	isFunction: function(o) {
        return typeof o === 'function';
    },
	/**
	 * ������IE��֧��ʲô�ģ����������
	 * @param {Object} r
	 * @param {Object} s
	 */
	_IEEnumFix: function(r, s) {
        if (document.all&&!document.opera) {
            var add=["toString", "valueOf"], i;
            for (i=0;i<add.length;i=i+1) {
                var fname=add[i],f=s[fname];
                if (COASE.lang.isFunction(f) && f!=Object.prototype[fname]) {
                    r[fname]=f;
                }
            }
        }
    },
	/**
	 * �ϲ�����ķ������������ռ���һ����������
	 * @param {Object} r �ϲ���Ķ���
	 * @param {Object} s ��Ҫ�ϲ���R�еĶ���
	 */
	augmentObject: function(r, s) {
        if (!s||!r) {
            throw new Error("Absorb failed, verify dependencies.");
        }
        var a=arguments, i, p, override=a[2];
        if (override && override!==true) { // only absorb the specified properties
            for (i=2; i<a.length; i=i+1) {
                r[a[i]] = s[a[i]];
            }
        } else { // take everything, overwriting only if the third parameter is true
            for (p in s) { 
                if (override || !r[p]) {
                    r[p] = s[p];
                }
            }
            COASE.lang._IEEnumFix(r, s);
        }
    },
	/**
	 * �ϲ�����
	 */
	merge: function() {
        var o={}, a=arguments;
        for (var i=0, l=a.length; i<l; i=i+1) {
            COASE.lang.augmentObject(o, a[i], true);
        }
        return o;
    }
}

if (typeof coaseParam == 'undefined') {
	coaseParam = {
		'coaseType': 'spider',
		'fnType': 'common'
	};
}
/*Ĭ�ϴ��ε�ֵ*/
coaseParam.coaseType = coaseParam.coaseType||'spider';
coaseParam.fnType = coaseParam.fnType||'common';
coaseParam.filterTag = coaseParam.filterTag||'isCoaseFilter';
/**
 * ֩����ȡҳ���offerIDs�Լ���˾��memberIds
 */

COASE.coaseURI(coaseParam.coaseType,coaseParam.fnType,coaseParam);
