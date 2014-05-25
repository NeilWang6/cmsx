jQuery.namespace('FE.dcms');
(function( $, D, window, undefined ){

var WID_PREFIX = 'xui-wid-',
	EXT_PREFIX = 'xui-ext-',
	EXPR_ID = /(\s+id\s*=\s*"\s*)([a-zA-Z0-9-_]+)(\s*")/g;

/**
 * 产生一个uuid
 * 
 * @function $UUID 
 * @param {String} prefix 前缀字符串
 * @return {String} 返回UUID
 */
var $UUID = function(prefix){
	var t = new Date().getTime();
	return (!prefix?'':prefix)+t+''+Math.floor(Math.random()*t);
};

/**
 * 检测传入参数的类型
 * @function $type 
 * @param  目标检测对象
 * @return  如下
 * 'element' - (string) DOM元素节点
 * 'textnode' - (string) DOM文本节点
 * 'whitespace' - (string) DOM空白节点
 * 'arguments' - (string) arguments
 * 'array' - (string) 数组
 * 'object' - (string) Object对象
 * 'string' - (string) 字符串
 * 'number' - (string) 数字
 * 'infinity' - (string) 无穷大
 * '-infinity' - (string) 无穷小
 * 'date' - (string) 日期对象
 * 'boolean' - (string) 布尔值
 * 'function' - (string) 函数对象
 * 'regexp' - (string) 正则表达式对象
 * 'class' - (string) Class (由new Class创建, 或由其他Class对象扩展而来).
 * 'collection' - (string) 原生htmlelements集合, 如由方法childNodes, getElementsByTagName等获取到的结果
 * 'window' - (string) window
 * 'document' - (string) document
 * false - (boolean) undefined, null, NaN 或以上列出的类型都不是
*/

function $type(o){
	if(o === null||o===undefined)return false;
	switch(Object.prototype.toString.apply(o)){
		case '[object Boolean]': return 'boolean';
		case '[object Array]':return 'array';
		case '[object Function]':return 'function'; 
		case '[object Date]':return 'date';
		case '[object RegExp]':return 'regexp';
		case '[object String]':return 'string';
		case '[object Number]':
			if(isFinite(o)){
				return 'number'
			}else{
				if(o===Infinity)return 'infinity';
				if(o===-Infinity)return '-infinity'; 
				return false
			}
		
	}
	if(o === window)return 'window';
	if(o === document)return 'document';
	if (o.nodeName) {
		switch (o.nodeType) {
			case 1: return 'element';
			case 3: return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
		}
	} else if (typeof o.length === 'number') {
		if (o.callee) return 'arguments';
		else if (o.item) return 'collection';
	}
	if(typeof o === 'object')return 'object';
	return false;
}

var isString = function(o){
	Object.prototype.toString.apply(o) === '[object String]';
};
var isFunction = function(o){
	return  $.isFunction(o);	
};
var isObject = function(o){
	return 	$type(o) === 'object'
};
var isArray = function(o){
	return $.isArray(o);
};

/**
 * 克隆对象或数组，返回的对象或数组会解除原数组中的引用
 * @function $unlink 
 * @param  需要解除引用的对象或数组
 * @return 解除引用的新的对象或数组
 */
function $unlink(object) {
    var unlinked;
    switch ($type(object)) {
        case 'object':
            unlinked = {};
            for (var p in object) unlinked[p] = $unlink(object[p]);
            break;
        case 'array':
            unlinked = [];
            for (var i = 0, l = object.length; i < l; i++) unlinked[i] = $unlink(object[i]);
            break;
        default: return object;
    }
    return unlinked;
}
/**
 * 合并一组对象生成新对象
 * @function $merge 
 * @param  任意数量的对象
 * @return 合并生成的新对象
 */
function $merge() {
    var mix = {};
    for (var i = 0, l = arguments.length; i < l; i++) {
        var object = arguments[i];
        if ($type(object) != 'object') continue;
        for (var key in object) {
            var op = object[key], mp = mix[key];
            mix[key] = (mp && $type(op) == 'object' && $type(mp) == 'object') ? $merge(mp, op) : $unlink(op);
        }
    }
    return mix;
}

/**
 * 迭代数组(包括非常规数组,如由内建的getElementsByTagName方法返回的集合对象, arguments对象, 或Ojbect对象)
 * iterable - (object or array) 被迭代的对象
 * fn - (function) 迭代执行的函数. 当前迭代项的值和键将传入该函数
 * 如果iterable为对象则fn(value, key, hash)
 *	 -value - (mixed) 当前迭代值
 *   -key - (string) 当前迭代键
 *   -hash - (hash) 主调hash
 * bind - (object, 可选) 函数中'this'引用的对象. 详情参考[Function:bind][]
 */
function $each(iterable,fn, bind){
	var type = $type(iterable);
	if(type == 'arguments' || type == 'collection' || type == 'array'){
		for (var i = 0, l = iterable.length; i < l; i++) fn.call(bind, iterable[i], i, iterable);
	}else{
		for (var key in iterable){
			if (iterable.hasOwnProperty(key)) fn.call(bind, iterable[key], key, iterable);
		}
	}	 
}

function $mix(/*r,s1,s2...*/) {
	var r = arguments[0],
		i = 1,
		l = arguments.length;
    for (; i < l; i++) {
        var object = arguments[i];
        if ($type(object) != 'object') continue;
        for (var key in object) {
            var op = object[key], mp = r[key];
            r[key] = (mp && $type(op) == 'object' && $type(mp) == 'object') ? $mix(mp, op) : $unlink(op);
        }
    }
    return r;
}
var	$augment = function(/*r, s1, s2, ...*/) {
	var args = arguments, len = args.length,
		r = args[0],
		i = 1;
	for (; i < len; i++) {
		$mix(r.prototype, args[i].prototype || args[i]);
	}
	return r;
}
/*
* 提供一个javascript模板工具，可应用javascript作为模板的语法，用{% %}分隔语法，{%= %}分隔数据
* example:
*	xui.util.template.string(
*	'<ul>',
*	  '{% for ( var i = 0; i < users.length; i++ ) { %}',
*		'<li>{%= users[i] %}</li>',
*	  '{% } %}',
*	'</ul>',
*	dataObject,
*	't1'
*	);
*/
var template =  {
	cache : {},	
	_tmpl : function(str){
		var fn = new Function("obj",
				"var p=[];with(obj){p.push('" +
				 str.replace(/[\r\t\n]/g, " ")
					.split("{%").join("\t")
					.replace(/((^|%})[^\t]*)'/g, "$1\r")
					.replace(/\t=(.*?)%}/g, "',$1,'")
					.split("\t").join("');")
					.split("%}").join("p.push('")
					.split("\r").join("\\'")
			  + "');}return p.join('');");
		return fn;
	},
	
	htmlFn : function(id){
		return fn  = this.cache[id] = this.cache[id] || this._tmpl(document.getElementById(id).innerHTML);
	},
	/*
	* 支持以<script type="text/xui-templete" id="user_tmpl"></script>的内容作为模板嵌入到页面中
	* @param {String} id script标签的id
	* @param {Object} 需要导入模板的数据
	*/
	html : function(id,data){
		return data ? this.htmlFn( id )( data ) : this.htmlFn( id )({});
	},

	stringFn : function(/*str1, str2,str3....,id*/){
		var fn, 
			str = '',
			len = arguments.length,
			lastArg = arguments[len-1],
			args = Array.prototype.slice.call(arguments);
		if( !/^[a-z0-9-_]+$/.test(lastArg) ){
			fn = this._tmpl(args.join(''));
		}else {
			args.pop();
			fn  = this.cache[lastArg] = this.cache[lastArg] || this._tmpl(args.join(''));	
		}
		return fn;
	},

	/*
	* 支持解析字符串模板
	* @param {String} 拼接模板的字符串
	* @param {Object} 倒数第二个参数为需要传输的数据
	* @param {String} 可选参数，最后一个参数为id，用于获取缓存到cache里的模板可提高性能
	*/
	string : function(/*str1, str2,str3....,id,data*/){	
		var fn, 
			data = {},
			str = '',
			len = arguments.length,
			lastArg = arguments[len-1],
			args = Array.prototype.slice.call(arguments);
		if($type(lastArg)==='object'){
			data = args.pop();
			fn = this.stringFn.apply( this, args );
			
		}else{
			fn = this.stringFn.apply( this, arguments );	
		}
		return fn( data );
	}	
};
/**
 * MAttribute 提供Attribute 的 mixin类
 * MEvents可以通过$augment方法混入到需要自定义事件的类中提供相应的功能,不能单独调用，和实例化
 */	
var MAttribute = function(){};
MAttribute.prototype = {
	initializeAttribute:function(){
		this.__attrs  = {};
		this.__attrVals ={};
	},
	addAttr:function(name,value){
		this.__attrs[name] = $unlink(value);
		return this;
	},
	addAttrs : function(context, attrs) {
        if (attrs) {
            for (var attr in attrs) {
                if (attrs.hasOwnProperty(attr) && !context.hasAttr(attr)) {
                    context.addAttr(attr, attrs[attr]);
					
                }
            }
        }
		
    },
 	initAttrs : function(context, config) {
        if (config) {
            for (var attr in config) {
                if (config.hasOwnProperty(attr))
                    context._set(attr, config[attr]);
            }
        }
    },
	hasAttr:function(name){
		return this.__attrs.hasOwnProperty(name);
	},
	removeAttr:function(name){
		if(this.hasAttr(name)){
			delete this.__attrs[name];
			delete this.__attrVals[name];
		}
		return this;
	},
	__getDefAttrVal: function(name) {
		var attr = this.__attrs[name],
			value = attr.value,
			valFn, val;
		
		if (!attr) return;
		if ((valFn = attr.valueFn)) {
			val = valFn.call(this);
			if (val !== undefined) {
				attr.value = val;
			}
			delete attr.valueFn;
		}	
		return attr.value;
	},
	get:function(name){
		var attr = this.__attrs[name], 
			getter = attr&&attr['getter'];
		var	ret = name in this.__attrVals ?
				this.__attrVals[name] :
				this.__getDefAttrVal(name);
		
		if (getter) ret = getter.call(this, ret);
		return ret;
	},
	set:function(name,value){
		var preValue = this.get(name);
		if ( false === this.fireEvent('before'+this.__capitalFirst(name)+'Change',
			{
				name: name,
				preValue : preValue, 
				newValue : value
			})
		) return false;
		this._set(name,value);
		this.fireEvent('after'+this.__capitalFirst(name)+'Change',{
			name: name,
			preValue : preValue, 
			newValue : this.__attrVals[name]
		});	

		return this;
	},
	_set:function(name,value){
		var attr = this.__attrs[name],
			setter = attr.setter,
			setValue;
		if (setter) setValue = setter.call(this, value);
		if (setValue !== undefined) value = setValue;
		this.__attrVals[name] = value;
	},
	__capitalFirst : function(s) {
        s = s + '';
        return s.charAt(0).toUpperCase() + s.substring(1);
    }
};

/**
 * MEvents 提供自定义事件的mixin类
 * MEvents可以通过$augment方法混入到需要自定义事件的类中提供相应的功能,不能单独调用，和实例化
 */	
var MEvents = function(){};
MEvents.prototype = {
	initializeEvents:function(){
		this.__evnetsList = {};
	},
	/**
	 * 添加一个自定义事件
	 * @param {String} type 自定义事件的类型
	 * @param {Function} fn 事件触发后调用的函数
	 * @param {Boolean,可选} internal 设置为true时, 可防止该事件被清除
	 * @return {Object} 返回该实例对象 
	 */
	addEvent : function(type, fn, internal){
		var self = this;
		var addItem = function (ar,item){
			var i = 0,l = ar.length,t = true;
			for(;i<ar.length;i++){
				if(ar[i]===item){
				    t = false;
	                break;
				}else{
                     t = true;
               	}
			}	
            if(t)ar.push(item);
		}
		type = this.__removeOn(type);
		if (fn != function(){}){
			this.__evnetsList[type] = this.__evnetsList[type] || [];
			addItem(this.__evnetsList[type],fn);
			if (internal) fn.internal = true;
		}

		return this;	
	},
	/**
	 * 添加一个自定义事件（addEvent的别名）
	 * @param {String} type 自定义事件的类型
	 * @param {Function} fn 事件触发后调用的函数
	 * @param {Boolean,可选} internal 设置为true时, 可防止该事件被清除
	 * @return {Object} 返回该实例对象 
	 */
	on: function(type, fn, internal){
		this.addEvent(type, fn, internal);
		return this;	
	},
	/**
	 * 添加一组自定义事件
	 * @param {Object} 一个键值对对象: 键代表事件名(如: {'start': function(){},'end': function(){}}), 值代表事件触发时执行的函数
	 * @return {Object} 返回该实例对象
	 */
	addEvents :function(events){
		for (var type in events) {
			this.addEvent(type, events[type]);
		}
		return this;
	},
	/**
	 * 删除一个自定义事件
	 * @param {String} type 自定义事件的类型
	 * @param {Function,可选} fn 事件触发后调用的函数，如不传则删除该事件类型下所有的函数
	 * @return {Object} 返回该实例对象
	 */
	removeEvent:function(type, fn){
		var deleteItem = function(ar,item){
			for (var i = ar.length; i--; i){
				if (ar[i] === item) ar.splice(i, 1);
			}
		};
		type = this.__removeOn(type);
		if (!this.__evnetsList[type]) return this;
		if(!fn){
			this.__evnetsList[type] = [];
		}else{
			if (!fn.internal) deleteItem(this.__evnetsList[type],fn);	
		}
		return this;
	},
	/**
	 * 删除一组事件
	 * @param {Object} 一个键值对对象: 键代表事件名(如: {'start': function(){},'end': function(){}}), 值代表事件触发时执行的函数
	 * @return {Object} 返回该实例对象
	 */
	removeEvents:function(events){
		var type;
		if ($type(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		if (events) events = this.__removeOn(events);
		for (type in this.__evnetsList){
			if (events && events != type) continue;
			var fns = this.__evnetsList[type];
			for (var i = fns.length; i--; i) this.removeEvent(type, fns[i]);
		}
		return this;
	},
	/**
	 * 触发指定事件类型的下所有监听函数
	 * @param {String} type 自定义事件的类型
	 * @param {Mixed, 可选} args 传递给监听函数的参数. 如果参数大于一个,请使用数组
	 * @param {Boolean,可选} internal 设置为true时, 可防止该事件被清除
	 * @return {Boolean} 返回监听函数的返回值
	 */
	fireEvent:function(type, args){
		type = this.__removeOn(type);
		var ret;
		if ( !this.__evnetsList || !this.__evnetsList[type] ) return this;
		$each(this.__evnetsList[type],function(fn){
			if( args!==undefined ){
				ret = ($type(args)==='array'
					? fn.apply(this,args)
					: fn.call(this,args))	
			}else{
				ret = fn.apply(this);
			}
		},this);
		return ret;
		
	},
	/**
	 * 删除一组事件函数
	 * @return {Object} 返回该实例对象
	 */
	cleanEvents:function(){
		this.__evnetsList = [];
		return this;
	},
	__removeOn:function(string){
		return string.replace(/^on([A-Z])/, function(full, first){
			return first.toLowerCase();
		});
	}
};

var newClass = function(parent,obj){
	if(obj=== undefined){
		obj = parent;
		parent = null;
	}
	// 创建一个父类的构造函数
	var create = function(parent){
		var F = function () {},
			proto = $unlink(parent.prototype),
			o = new F();
			
		delete proto.initialize;
		delete proto.__initObj;
		
		F.prototype = proto;
		o.constructor = parent;
			
		return F;
	};

	// 用于混入mixin类的所有方法
	var getMixinProto = function(fn){
		var mixProto={};
		mixProto = $unlink(fn.prototype);
		if(mixProto.initialize)delete mixProto.initialize;
		
	
		delete mixProto.superClass;
		delete mixProto.__initObj;
		
		if(mixProto.constructor)delete mixProto.constructor;
		if(mixProto.mixin) delete mixProto.mixin;
		
		return mixProto;
	};
	// 创建类的构造函数
	var F = function(config) {
		
		
		if(this.events||this.attrs){
			this.initializeEvents();
			this.addEvents(this.events);	
		}
		
		if(this.attrs){
			this.initializeAttribute();
			this.addAttrs( this,this.attrs );
			this.initAttrs( this, config );
		}
		
		if(obj.initialize){
			$each( this.__collectMethod(this,'initialize') ,function( item ){
				item.call( this );				  
			},this);
		}		
	};
	// __initObj存储默认类配置
	F.prototype.__initObj = $unlink(obj);
	
	if(parent)$augment(F,create(parent));
	
	// 无父类superClass为null，不追溯到Object
	$augment(F,{superClass: parent || null},obj);
	
	if(F.prototype.attrs)$augment(F,MAttribute);
	if(F.prototype.attrs||F.prototype.events)$augment(F,MEvents);
	
	var mixin = F.prototype.mixin,
		tpProto = {};
	if(mixin){
		$each(mixin,function(item){
			$mix(tpProto,getMixinProto(item));
		});
		F.prototype = $mix(tpProto , F.prototype);
	}
	
	// 方便获取superClass而添加一个静态属性
	F.superClass = F.prototype.superClass;
	
	//收集继承连上的方法
	F.prototype.__collectMethod = function(host,method){
		var c = host,
			m = [],
			t = [],
		 	collectMixinMethod = function(mixin,ar){
				$each(mixin,function(item){
					if(item.prototype.__initObj[method])ar.push(item.prototype.__initObj[method]);
					if(item.prototype.mixin)collectMixinMethod( item.prototype.mixin , ar );
				});	
			};

		while (c) {
			// m 收集继承链上的所有mixin类中的所需方法
			collectMixinMethod(c.__initObj.mixin,m);
			
			if( c.__initObj[method] ){
				//collectMixinMethod(c.mixin,m);
				
				// t 收集继承链上的所有主类的所需方法
				t.push(c.__initObj[method]);
				
			}
            c = c.superClass && c.superClass.prototype;
        }
		// mixin类在前，后面依次是从子类到祖先类，initialize,render时顺序如此，destroy时则相反
		m = m.concat(t.reverse());
		return m;
	};
	return F;
};


var WidgetBase = newClass({
	attrs:{
		autoRender : {
			value : false	
		},
		rendered : { 
			value : false
		},
		render : {
			valueFn : function(){
				return $(document.body);
			}
		},
		prefix : {
			value :	WID_PREFIX
		},
		uuid : {
			valueFn :function(){
				return $UUID();
			}
		}	
	},
	initialize : function(){
		if(this.get('autoRender'))this.render();
	},
	templateParse :function( item ){

		if(this.attrs.template && this.get('template')){
			
			var tpl = this.get('template'),
				obj = {};
			if( item ){
				obj[item] = this.htmlParse( tpl[item] );
				this.set( 'template', $merge( tpl , obj) );
				return
			}
			
			// 可以为字符串或对象，数组或产生字串的function
			if( isFunction( tpl ) ) return;
			if( isString( tpl ) ){
				this.set( 'template', this.htmlParse( tpl ) );
			}else{
				if( isArray( tpl ) ) obj = [];
				$each( tpl, function( v, k ){
					if(v) obj[k] = isFunction( v )? v : this.htmlParse( v );					
				},this);
				this.set( 'template', obj );	
			}
		}
	},
	htmlParse : function( tpl ){
		var	self = this,
			uuid = self.get('uuid');

		return tpl.replace(EXPR_ID,function($0,$1,$2,$3) {
			if(!$2)return $1+$2+$3;
			var id = self.get('prefix') + $2 + '-' + uuid,
				obj = {
					getter :function(){
						return $(id);	
					}
				};
			self.attrs[$2] = obj;
			self.addAttr($2,obj);
			
			return $1+id+$3;
		});
	},
	__renderUI :function(){

	},
	__bindUI :function(){
		var self = this;
		$each(this.attrs,function(v,k){
			m = '_uiSet' + self.__capitalFirst(k);
			if (self[m]) {
				(function(k, m) {
					self.on('after' + self.__capitalFirst(k) + 'Change', function(e) {
						self[m](e.newValue);
					});
				})(k, m);
			}
		});
		
	},
	__syncUI :function(){
		$each(this.attrs,function(v,k){
			 var m = '_uiSet'+this.__capitalFirst(k);
			 if(this[m]&&this.get(k)!==undefined) this[m](this.get(k)); 
		},this);
		
	},
	render : function(){
		if(!this.get('rendered')){
			this.templateParse();
			
			// 1. 渲染
			this.__renderUI();	
			$each(this.__collectMethod(this,'renderUI'),function(item){
				item.call(this);
			},this);
			this.fireEvent('afterRenderUI');
	
			// 2. 绑定事件
			this.__bindUI();
			$each(this.__collectMethod(this,'bindUI'),function(item){
				item.call(this);
			},this);
			this.fireEvent('afterBindUI');
			
			// 3. 最后将属性变化同步到UI
			this.__syncUI();
			$each(this.__collectMethod(this,'syncUI'),function(item){
				item.call(this);
			},this);
			this.fireEvent('afterSyncUI');
			this.set('rendered',true);
		}
	},
	destroy : function(){
		$each(this.__collectMethod(this,'destructor').reverse(),function(item){
			item.call(this);
		});
		this.fireEvent('destroy');
		this.cleanEvents();
	}	
});


D.newClass = newClass;
D.template = template;
D.WidgetBase = WidgetBase;
D.merge = $merge;
})( jQuery, FE.dcms, window );