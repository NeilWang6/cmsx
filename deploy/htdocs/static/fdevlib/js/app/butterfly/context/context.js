/**
 * ����һ����ڵ���ص�ģ��
 * @author qijun.weiqj
 */
define('butterfly/context/Context', ['jquery', 'lofty/lang/class', 'lofty/lang/log'], 

function($, Class, Log) {

'use strict'


var Context = Class({

	/**
	 * @param {string} id context id
	 * @param {object} attachment
	 *  - moduleFilter {package|regexp|function} for auto register to filter module
	 *
	 *	- before(context) -> {boolean}
	 *	- query(name) -> node
	 *	- bind(node, item)
	 *	- resolve(node) -> name
	 */
	init: function(id, attachment) {
		this.id = id;
		
		this._log = new Log(id);
		this._log.info('init');

		this._attachment = attachment;

		/*
		 * [
		 *		{
		 *			name: name,
		 *			module: module
		 *		},
		 *		...
		 * ]
		 */
		this._modules = [];
		this._indices = {};

		this._autoRegister();
	},

	/**
	 * alias for add
	 */
	register: function() {
		return this.add.apply(this, arguments);
	},

	/**
	 * ���ģ�鵽����
	 *
	 * @param {string} name ����
	 * @param {function|object} ģ��
	 */
	add: function(name, module) {
		var item = this._get(name);
		if (item) {
			this._log.warn(name + ' is already added');
			return;
		}
		var modWrapper = this._attachment.modWrapper || (this._attachment.config ? this._attachment.config.modWrapper : undefined);
		if(modWrapper && typeof modWrapper ==='function'){
			module = modWrapper(module);
		}
		this._indices[name] = this._modules.length;
		item = { name: name, module: module, times: 0 };
		this._modules.push(item);
		
		this._log.info(name + ' is added');
		
		// ���context��start, ��ֱ�ӽ���start��ģ��
		// ����domready֮��ע��ģ������
		this._started && this._start(item);
	},

	/**
	 * ִ��������ģ��ĳ�ʼ��
	 *
	 *	attachment.before -> not false
	 *
	 *		foreach module in context
	 *			node = attachment.query(name)
	 *				attachment.bind(node, module)
	 *
	 *	attachment.after
	 */
	start: function() {
		var self = this,
			attach = this._attachment;

		this._log.info('starting...');
			
		if (attach.before && attach.before(this) === false) {
			this._started = true;
			return;
		}

		$.each(this._modules, function(index, item) {
			self._start(item);
		});
		
		this._started = true;
		this._log.info('started');
	},

	/**
	 * �󶨽ڵ��ģ��
	 * �������Ʋ�ѯ�ڵ㣬�ٽ��а�
	 */
	_start: function(item) {
		var self = this,
			attach = this._attachment,
			node = attach.query ? attach.query(item.name) : null;

		if (!node) {
			this._log.info('no node attached for module ' + item.name);
			return;
		}

		this._bind(node, item);
	},

	/**
	 * ��ģ�鵽�ڵ�
	 */
	_bind: function(node, item, options) {
		var self = this,
			attach = this._attachment;

		this._log.info('bind ' + item.name);
		attach.bind(node, item, options);
		item.times++;
	},

	/**
	 * ��node��ģ�����
	 * @param node �ڵ�, �����ǳ���Ľڵ�, һ��Ϊdom�ڵ��jquery����
	 * @param options ��ѡ�Ķ�������, ������attachment��bind����ʵ����ʹ��
	 */
	attach: function(node, options) {
		var attach = this._attachment,
			name = attach.resolve ? attach.resolve(node) : null,
			item = name ? this._get(name) : null;

		if (item) {
			this._bind(node, item, options);
			return true;
		} else {
			this._log.info('no module attached for node: ', node);
			return false;
		}
	},

	/**
	 * ȡ��ָ�����ƺ��¼���ģ��
	 * @param {string} name  ģ������
	 */
	_get: function(name) {
		var index = this._indices[name];
		return index !== undefined ? this._modules[index] : null;
	},

	/**
	 * ȡ��ָ�����ƺ��¼���ģ��
	 * @see _get
	 */
	get: function(name) {
		var item = this._get(name);
		return item ? item.module : null;
	},

	/**
	 * auto add module to context
	 */
	_autoRegister: function() {
		var self = this,
			attach = this._attachment,
			loader = attach.loader,
			filter = attach.moduleFilter;

		if (!loader || !filter) {
			return;
		}

		this._log.info('init auto register');

		var test = typeof filter === 'string' ? function(id) { return id.indexOf(filter) === 0 } :
				typeof filter === 'function' ? filter :
				filter.test ? function(id) { return filter.test(id); } : false;

		var tryRegister = function(id) {
			if (test(id)) {
				loader.require([id], function(o) {
					self.add(id, o);
				});
			}
		};

		if (loader.getModules) {
			var ids = loader.getModules();
			$.each(ids, function(index, id) {
				tryRegister(id)
			});
		}

		loader.on('define', function(module) {
			module.id && tryRegister(module.id);
		});
	}


});
//~


return Context;

		
});
