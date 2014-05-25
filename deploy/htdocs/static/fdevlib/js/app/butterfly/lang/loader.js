define('butterfly/lang/Loader', function() {

var exports = null;

fmd('butterfly-lofty-adapter', ['module'], function(module) {

	exports = {
		adapter: true,

		define: define,

		isDefine: function(id) {
			return module.has(id,true);
		},

		require: define,

		on: function(type, fn) {
			if (type !== 'define') {
				throw 'not implement exception';
			}

			lofty.on('saved', function(mod) {
				// lofty内部save在define之后, 而我需要在define事件中就能取到模块
				//module.save(mod);

				fn({
					id: mod.id,
					depends: mod.deps,
					factory: mod.factory
				})
			});
		},

		getModules: function() {
			var ids = [];
			for (var id in lofty.cache.modules) {
				/^\w/.test(id) && ids.push(id);
			}
			return ids;
		}
	};
});


return exports;

});
