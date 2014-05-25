define('butterfly/test/Suite', 

[
	'butterfly/test/context/Executor',
	'butterfly/test/context/Autowire',
	'butterfly/test/context/ModContext',
	'butterfly/test/context/Application'
], 

function() {

return {
	run: function() {
		var env = jasmine.getEnv();
		env.updateInterval = 1000;

		var reporter = new jasmine.HtmlReporter();
		env.addReporter(reporter);

		env.specFilter = function(spec) {
			return reporter.specFilter(spec);
		};

		env.execute();
	}
};
//~

	
});
