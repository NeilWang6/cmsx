define('butterfly/test/context/ModContext', 

['jquery', 'butterfly/lang/Loader', 'butterfly/context/ModContext'],
function($, Loader, ModContext) {

describe('butterfly/test/context/ModContext', function() {
	
	it('简单使用ModContext', function() {
		var modContext = new ModContext('test/ModContext', {
			moduleFilter: 'test/mod/',
			loader: Loader
		});

		var testNode = $('<div data-mod-id="test/mod/MyMod">'),
			testConfig = {
				url: 'http://www.1688.com'
			};

		testNode.data('modConfig', testConfig);

		$('body').append(testNode);

		var flag = false;
		define('test/mod/MyMod', function() {
			return function(node, config) {
				flag = true;
				expect(node[0]).toBe(testNode[0]);
				expect(config).toBe(testConfig);
				expect(config.url2).toBe('hello');
			};
		});

		// 事件支持
		modContext.on('mod-before-init', function(o) {
			o.config.url2 = 'hello';
		});

		modContext.start();
		expect(flag).toBeTruthy();
	});


	it('模块在Context构造之前就定义好了', function() {
		var testNode = $('<div data-mod-id="test2/mod/MyMod">');	
		$('body').append(testNode);
		var flag = false;
		define('test2/mod/MyMod', function() {
			return function(node, config) {
				flag = true;
			};
		});

		var modContext = new ModContext('test2/ModContext', {
			moduleFilter: 'test2/mod/',
			loader: Loader
		});

		modContext.start();
		expect(flag).toBeTruthy();
	});

	
});
		
});
