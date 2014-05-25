define('butterfly/test/context/Application', 

['jquery', 'butterfly/lang/Loader', 'butterfly/context/Application'],

function($, Loader, Application) {
	

describe('butterfly/context/Application', function() {
		
	it('创建一个application', function() {
		var app = new Application({
			id: 'myapp',
			loader: Loader
		});

		// app is an loader
		expect(app.define).not.toBeUndefined();
		expect(app.require).not.toBeUndefined();
		expect(app.isDefine).not.toBeUndefined();

		// app also support event
		var a = 0;
		app.on('do', function() {
			a++;
		});
		app.trigger('do');
		app.trigger('do');
		expect(a).toBe(2);

		// support executor
		var flag = false;
		app.executor.execute(function() {
			flag = true;	
		});
		expect(flag).toBeTruthy();
	});


	it('支持pageContext', function() {
		var app = new Application({
			id: 'myapp2',
			loader: Loader,
			pageContext: true
		});

		$('body').data('pageConfig', {
			name: 'butterfly'
		});

		var flag = false;
		define('myapp2/page/Test', function() {
			return {
				init: function(node, config) {
					flag = true;
					expect(config.name).toBe('butterfly');
				}
			};
		});

		app.start();
		waitsFor(function() {
			return flag;
		});

		runs(function() {
			expect(flag).toBeTruthy();
		});
	});
	

	it('支持modContext', function() {
		var app = new Application({
			id: 'myapp3',
			loader: Loader,
			modContext: true
		});

		app.start();
	});


	it('支持Autowire', function() {
		var app = new Application({
			id: 'myapp4',
			loader: Loader,
			autowire: true
		});

		app.start();
	});

	it('导出模块', function() {
		var app = new Application({
			id: 'myapp5',
			loader: Loader,
			pageContext: true,
			modContext: true
		});

		var flag = false;
		app.require(['myapp5/core/Event', 'myapp5/core/Executor', 'myapp5/core/PageContext', 'myapp5/core/ModContext'], 
				function(Event, Executor, PageContext, ModContext) {
			flag = true;
			
			expect(Event).toBeDefined();
			expect(Executor).toBeDefined();
			expect(PageContext).toBeDefined();
			expect(ModContext).toBeDefined();
		});

		expect(flag).toBeTruthy();
	});


	it('callModMethod', function() {
		var app = new Application({
			id: 'myapp6',
			loader: Loader,
			modContext: true
		});
		
		for (var i = 0; i < 10; i++) {
			var node = $('<div class="myapp6">');
			node.attr('data-mod-id', 'myapp6/mod/Test');
			node.data('mod-config', {
				index: i + 1
			});
			$('body').append(node);
		}

		var sum = 0;
		define('myapp6/mod/Test', ['lofty/lang/class'], function(Class) {
			return Class({
				init: function(node, config) {
					this.config = config;
					sum = sum + config.index;	
				},

				index: function(time) {
					return this.config.index * time;
				}
			});
		});

		app.start();

		expect(sum).toBe(55);

		var sum2 = 0;
		$('div.myapp6').each(function() {
			sum2 += app.callModMethod($(this), 'index', [2]);
		});
		expect(sum2).toBe(110);
	});


	it('get set global object', function() {
		var app = new Application({
			loader: Loader
		});
		app.set('name', 'helloworld');
		app.set('other', 'hi');

		expect(app.get('name')).toBe('helloworld');

		app.on('get', function(name, value) {
			if (name === 'name') {
				return value + '2';
			}
		});

		expect(app.get('name')).toBe('helloworld2');
		expect(app.get('other')).toBe('hi');

		app.on('set', function(name, value) {
			if (name === 'yuyu') {
				return value + '123';
			}
		});

		app.set('yuyu', 'we');
		app.set('yuyu2', 'we');
		expect(app.get('yuyu')).toBe('we123');
		expect(app.get('yuyu2')).toBe('we');
	});

});
//~


});
