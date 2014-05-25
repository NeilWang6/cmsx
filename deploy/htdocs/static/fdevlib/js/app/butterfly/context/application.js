/**
 * ҳ�������
 * @author qijun.weiqj
 */
define('butterfly/context/Application', 

	['jquery', 'lofty/lang/class', 'lofty/lang/log', 'butterfly/lang/Event', 'butterfly/context/Executor', 
	'butterfly/context/Autowire', 'butterfly/context/Context', 'butterfly/context/ModContext'], 

function($, Class, Log, Event, Executor,
		Autowire, Context, ModContext) {

'use strict'

var log = new Log('butterfly/context/Application');


var App = Class({
	
	/**
	 * options {object} ������Ϣ
	 * - id ����
	 * - loader loader
	 * - pageContext
	 *		- node Ĭ��Ϊ'body'
	 *		- configField Ĭ��Ϊ'pageConfig'
	 * - modContext
	 *		- @see context.ModContext
	 * - exportModule ����ģ��
	 * - error
	 */
	init: function(options) {
		options = options || {};
		this.options = options;

		if (!options.loader) {
			throw 'please specify loader for application';
		}
		this.loader = options.loader;
		this.id = options.id || 'app';
		this.namespace = options.namespace || this.id.toLowerCase();
		log.info('init application:', this.id);

		this._cache = {};

		this._initApp();	
		this._initEvent();
		this._initExecutor();
		this._initPageContext();
		this._initModContext();
	},


	start: function() {
		var self = this;
		this.timestamp('start');
		$(function() {
			self.executor.execute('domready', function() {
				self.pageContext && self.pageContext.start();	
				self.modContext && self.modContext.start();
				self._startAutowire();
			});

			self.event.setLazy(false);
			self.timestamp('start');

			self._report();
		});
	},


	get: function(name) {
		var value = this._cache[name],
			o = this.event.trigger('get', name, value);
		if (o !== undefined && o !== null) {
			return o;
		}
		return value;
	},


	set: function(name, value) {
		var o = this.event.trigger('set', name, value);
		if (o !== false) {
			if (o !== undefined && o !== null) {
				value = o;
			}
			this._cache[name] = value;	
		}
	},


	_initApp: function() {
		var self = this;

		this._delegate(this.loader, ['define', 'require', 'isDefine']);
		this.loader.define(this.namespace + '/core/App', function() {
			return self;
		});
	},


	_initEvent: function() {
		var event = this.event = new Event(this);
		event.mixto(this);
		event.setLazy(true);

		this.loader.define(this.namespace + '/core/Event', function() {
			return event;
		});
	},


	_initExecutor: function() {
		var executor = new Executor({ error: $.proxy(this, '_error') });	
		this.executor = executor;
		this.loader.define(this.namespace + '/core/Executor', function() {
			return executor;
		});

		this._delegate(this.executor, ['timestamp']);
	},


	_error: function(e) {
		if (log.isEnabled('info')) {
			throw e;
		}

		if (this.options.error) {
			this.options.error(e);
		} else {
			log.error(e);
		}

		this.event.trigger('error', e);
	},


	_initPageContext: function() {
		var o = this.options.pageContext;
		if (!o) {
			return;
		}
		var modWrapper = o.modWrapper;
		var id = o.id || this.namespace + '/core/PageContext',
			executor = this.executor,
			configField = o.configField || 'pageConfig';

		log.info('init PageContext:', id);

		var config = {
			loader: this.loader,
			moduleFilter: new RegExp('^' + this.namespace + '/page/'),
			modWrapper: modWrapper,
			query: function() {
				return $(config.node || 'body');
			},

			bind: function(node, item,params) {
				executor.execute(item.name, function() {
					if(item.module._initialized) return;
					item.module._initialized = true;
					item.module.init(node, node.data(configField));	
				});
			}
		};

		$.isPlainObject(o) && $.extend(config, o);

		var pageContext = new Context(id, config);

		this.pageContext = pageContext;

		this.loader.define(id, function() {
			return pageContext;	
		});
	},


	_initModContext: function() {
		var o = this.options.modContext;
		if (!o) {
			return;
		}
		var id = o.id || this.namespace + '/core/ModContext';
		var modWrapper = o.modWrapper;
		log.info('init ModContext:', id);

		var config = {
			loader: this.loader,
			event: this.event,
			executor: this.executor,
			modWrapper: modWrapper,
			moduleFilter: new RegExp('^' + this.namespace + '/mod/')
		};

		$.isPlainObject(o) && $.extend(config, o);
		var modContext = new ModContext(id, config);

		this.modContext = modContext;

		this.loader.define(id, function() {
			return modContext;
		});

		this.callModMethod = $.proxy(modContext, 'callModMethod');
	},


	_startAutowire: function() {
		var o = this.options.autowire;
		if (!o) {
			return;
		}
		
		log.info('start Autowire');
		var modWrapper = o.modWrapper;
		var config = {
			loader: this.loader,
			executor: this.executor,
			modWrapper:modWrapper
		};

		$.isPlainObject(o) && $.extend(config, o);

		new Autowire($(o.container || 'body'), config);
	},


	_delegate: function(o, names) {
		var self = this;
		$.each(names, function(index, name) {
			self[name] = $.proxy(o, name);
		});
	},


	_report: function() {
		if (log.isEnabled('info')) {
			log.info('\n\n' + this.executor.report() + '\n\n');
		}
	}

});


return App;


});

