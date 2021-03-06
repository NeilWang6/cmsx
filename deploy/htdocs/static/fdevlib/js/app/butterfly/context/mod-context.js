/**
 * 提供一种页面组件化的方式
 * @author qijun.weiqj
 */
define('butterfly/context/ModContext', 

['jquery', 'lofty/lang/class', 'lofty/lang/log', 'butterfly/lang/Event', 'butterfly/context/Context'], 
function($, Class, Log, Event, Context) {

'use strict'

var log = new Log('butterfly/context/ModContext');


var guid = $.now(),
	proxy = function() {};


/**
 * @param id
 * @param config
 *	- loader
 *	- async
 *
 *	- queryMods
 *	- selector
 *	- container
 */
var ModContext = function(id, config) {
	var event = config.event || new Event(),
		context = new Context(id, new Attach(config));

	event.mixto(context);

	context.callModMethod = function(mod, method, args) {
		var o = $(mod).data('modContext');
		if (o) {
			log.info('call mod method: ' + o.name + '.' + method);
			return o.context[method].apply(o.context, args || []);
		}
	};

	return context;
};
//~


var Attach = new Class({

	init: function(config) {
		this.config = config;

		this.loader = config.loader;
		this.moduleFilter = config.moduleFilter;

		// 用于更快速地根据模块查询节点
		this._cache = {};
	},


	before: function(context) {
		this.context = context;

		var config = this.config,
			event = context;

		var queryMods = config.queryMods || function() {
			return $(config.selector || '[data-mod-id]', config.container || 'body');
		};

		event.on('mod-ready', function(node, params) {
			context.attach(node, params);
		});

		queryMods().each(function() {
			context.attach($(this));
		});

		event.trigger('mod-all-ready');

		// break context routine
		return false;
	},


	/**
	 * context.start之后注册的模块会走query对节点进行初始化
	 */
	query: function(name) {
		var ids = this._cache[name];
		if (!ids) {
			return null;
		}

		delete this._cache[name];
		
		var nodes = [];
		$.each(ids, function(index, id) {
			var node = $('#' + id);
			node.length && nodes.push(node[0]);
		});

		return nodes.length ? $(nodes) : null;
	},


	resolve: function(node) {
		var config = this.config,
			id = config.resolve ? config.resolve(node) : node.data('modId');

		if (!this.context.get(id)) {
			var list = this._cache[id];
			if (!list) {
				list = this._cache[id] = [];
			}
			list.push(this._nodeId(node));

			config.async && this._proxy();
		}

		return id;
	},


	bind: function(node, item, params) {
		var self = this;
		if (node.length === 1) {
			this._bind(node, item, params);
		} else {
			node.each(function() {
				self._bind($(this), item, params);	
			});
		}
	},


	_bind: function(node, item, params) {
		var config = this.config,
			event = this.context,
			module = item.module;

		var fn = function() {
			var context = null,
				entry = null;
			
			if (typeof module === 'function') {
				proxy.prototype = module.prototype;
				context = new proxy();
				entry = module;
			} else {
				context = module;
				entry = module.init;
			}

			var o = {
				node: node,

				name: item.name,
				item: item,

				context: context,
				params: params,
				config: node.data('modConfig')
			};

			node.data('modContext', o);
			if (event.trigger('mod-before-init', o) !== false) {
				if(module._initialized) return;
				module._initialized = true;
				o.result = entry.apply(context, [o.node, o.config, o.params]);
				
				event.trigger('mod-inited', o);
			}
		};

		config.executor ? config.executor.execute(item.name, fn) : fn();
	},


	_nodeId: function(node) {
		var id = node.attr('id');
		if (!id) {
			id = 'mod-' + guid++;
			node.attr('id', id);
		}
		return id;
	},


	/**
	 * 生成一个代理模块来处理异步加载模块
	 */
	_proxy: function(id) {
		var self = this,
			loader = this.loader;	
		if (!loader) {
			log.warn('loader not specified');
			return;
		}

		this.context.register(id, function() {
			var o = this,
				args = arguments;	
			loader.require([id], function(module) {
				var method = typeof module === 'function' ? 
					module : module.init;
				method.apply(o, args);
			});
		});
	}

});
//~ Attach


return ModContext;


});
