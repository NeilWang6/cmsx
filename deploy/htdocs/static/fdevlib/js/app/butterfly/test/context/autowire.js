define('butterfly/test/context/Autowire', 

['jquery', 'butterfly/context/Autowire'],

function($, Autowire) {
	

describe('butterfly/context/Autowire', function() {
		
	it('让页面支持标签调用', function() {		
		define('butterfly/test/context/autowire/A', function() {
			return function(div, config) {
				div.text(config.name);
			};
		});

		var elm1 = $('<div data-widget-type="butterfly/test/context/autowire/A" data-widget-config=\'{"name": "butterfly"}\'>');
		var elm2 = $('<div data-widget-type="butterfly/test/context/autowire/A" data-widget-config=\'{"name": "other"}\'>');

		var container = $('body');
		elm1.appendTo(container);
		elm2.appendTo(container);

		new Autowire(container, { loader: { require: define } });

		expect(elm1.text()).toBe('butterfly');
		expect(elm2.text()).toBe('other');

		elm1.remove();
		elm2.remove();
	});


});
//~


});
