/**
 * @author chuangui.xiecg
 * @version 0.0.3
 * @date 2009-2-12
 */

/*定义一个全局来控制页面是否发布通用搜索的请求*/
if(typeof isCoaseCompleted =='undefined'){
	isCoaseCompleted = false;
}

if (typeof COASE == "undefined" || !COASE) {
	/**
	 * 科斯框架类
	 * The COASE global namespace object.  If COASE is already defined, the
	 * existing COASE object will not be overwritten so that defined
	 * namespaces are preserved.
	 * @class COASE
	 * @static
	 */
	var COASE = {};
}

/**
 * 定义科斯打点类别对应的url,这个是覆盖全网的，如果不全，将会出错
 */
COASE.coaseUrl = {
	'specificSpider':'http://style.c.aliimg.com/js/coase/specificSpider.js',
	'spider':'http://style.c.aliimg.com/js/coase/spider.js'
};
/**
 * 定义科斯通用配置参数,其他一些不是通用的参数将会在相应文件的js进行配置
 */
COASE.coaseConfig={
	'api':'http://ctr.1688.com/ctr.html?ctr_type={ctr_type}&page_area={page_area}&page_id={page_id}&category_id={category_id}&object_type={object_type}&object_ids={object_ids}&keyword={keyword}&page_size={page_size}&page_no={page_no}&refer={refer}'
};
/**
 * 定义科斯打点的初始化参数
 * @param {Object} o 一个Json对象,可为空
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
 * 定义科斯打点函数
 * @param {String} s 科斯打点函数
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
 * 跟踪打点函数,防止人为干扰,目前还未采取相关方法,预留一个接口,作为以后一个扩展
 * @method scout
 * @param  {String*} arguments 1-n namespaces to create 
 * @return {Boolean} 通过返回值来判断当前是否要进行打点
 */
COASE.scout=function(arr){
	if(arr.length<2||isCoaseCompleted){
		return false;
	}
	isCoaseCompleted = true;
	return true;
}
/**
	 * 定义科斯打点的类集合，具体相关的类会在对应的js文件进行扩展,目前为空
 */
COASE.modules={};
/**
 * coase URI路由
 * URI参数有着和它唯一对应的控制器(controller)类/方法/参数。
 * @param {String} 控制器的类
 * @param {String} 方法名,对应到相应的类,将会是作为一个类型判断,来调用相关函数
 * @param {Object||String} 参数,是一个Json对象或者就直接一个字符串,默认值为空对象{}
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
	 * 参数替换 (详细请看yui提供YAHOO.Lang.substitute)
	 * @param {String} s 源字符串
	 * @param {Object} o Json对象
	 * @return {String} 替换后的字符串
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
	 * 判断key是否在当前数组(不包含关联数组)当中
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
	 * 根据ID获取Dom对象
	 * @param {String} id
	 * @return {HTMLElement}
	 * @static
	 */
	get:function(id){
		if(id=='document')return document;
		return document.getElementById(id);
	},
	/**
	 * 统一去获取页面的page_id,假如page_id命名修改的话，可以统一修改
	 * @static
	 */
	getPageId:function(){
		return window.dmtrack_pageid || '';
	},
	/**
	 * 查找数组中某个元素是否在数组中
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
	 * 数组唯一化
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
 * 异步跨域请求类的封装实现
 */
COASE.util.loader = function(){
	var nidx = 0;//script对象的序列ID
	
	/**
	 * 根据接点类型和节点拥有的属性及作用域来创建一个节点
	 * @param {String} nodeType 接点类型
	 * @param {Object} attributes 节点拥有的属性
	 * @param {Object} win 作用域
	 * @return 返回一个DOM节点
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
	 * 根据URL，作用域和编码来创建一个javascript节点
	 * @param {String} url URL
	 * @param {Object} win 作用域
	 * @param {String} charset 编码
	 * @return 返回一个javascript节点
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
		 * 发起异步跨域请求的方法
		 * @param {Object} url 异步跨域请求的链接
		 * @param {Object} fn 请求成功后触发的方法
		 * @param {Object} scope 作用域
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
 * 常用方法
 */
COASE.lang = {
	/**
	 * 判断是否是方法
	 * @param {Object} o
	 */
	isFunction: function(o) {
        return typeof o === 'function';
    },
	/**
	 * 好像是IE不支持什么的，用来解决的
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
	 * 合并对象的方法，把属性收集到一个对象里面
	 * @param {Object} r 合并后的对象
	 * @param {Object} s 需要合并到R中的对象
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
	 * 合并对象
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
/*默认传参的值*/
coaseParam.coaseType = coaseParam.coaseType||'spider';
coaseParam.fnType = coaseParam.fnType||'common';
coaseParam.filterTag = coaseParam.filterTag||'isCoaseFilter';
/**
 * 蜘蛛爬取页面的offerIDs以及公司的memberIds
 */

COASE.coaseURI(coaseParam.coaseType,coaseParam.fnType,coaseParam);
