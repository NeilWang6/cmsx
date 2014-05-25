/**
 * App autowire°ó¶¨
 *
 * @author qijun.weiqj
 */
define('butterfly/context/Autowire', ['jquery', 'lofty/lang/class', 'lofty/lang/log'], 

function($, Class, Log) {

'use strict'


var log = new Log('butterfly/context/Autowire');


var Autowire = new Class({
	
	/**
	 * @param options
	 *	- executor
	 */
	init: function(div, options) {
		div = $(div);
		options = options || {};

		if (!div.length) {
			log.error('please specify parent element for autowire');
			return;
		}

		if (!options.loader) {
			log.error('please specify loader for autowire');
			return;
		}
		
		this.loader = options.loader;
		this.executor = options.executor;
		this.modWrapper = options.modWrapper;
		var self = this,
			elms = $('[data-widget-type]', div); 
		elms.length && elms.each(function() {
			self.handle($(this));
		});
	},

	handle: function(elm) {
		var self = this,
			type = elm.data('widget-type'),
			config = elm.data('widget-config') || {};
		
		if ($.isArray(type)) {
			$.each(type, function(index, item) {
				self.process(item, config[index] || {}, elm);
			});
		} else {
			self.process(type, config, elm);
		}
	},

	process: function(type, config, elm) {
		var self = this;
		
		if (config.__autowired) {
			return;
		}
		config.__autowired =  true;
		
		if(this.modWrapper && typeof this.modWrapper === 'function'){
			type = this.modWrapper(type,config,elm);
		}
		log.info('initialize ' + type);
		this.loader.require([type], function(o) {
			var fn = function() {
				if(!o._initialized){
					o._initialized = true;
					if (typeof o === 'function') {
						new o(elm, config);
					} else if (o && o.init) {
						o.init(elm, config);
					} else if (config.method && o[method]) {
						o[method](elm, config);
					} else {
						log.error('invalid module for autowire: ' + type);
					}
				}
				
			};

			self.executor ? self.executor.execute(type, fn) : fn();
		});
	}
	
});


return Autowire;


});
