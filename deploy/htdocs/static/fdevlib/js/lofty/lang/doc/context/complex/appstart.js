/**
*	ҳ���Ψһ���ģ�飬��������ĳ�ʼ������
*/
lofty.config({
	amd: true,
	resolve: function(id) {
		if (/^butterfly\b/.test(id)) {
			id = id.replace(/\./g, '/')
				.replace(/([a-z])([A-Z])/g, function(s, m1, m2) {
					return m1 + '-'	+ m2;
			}).toLowerCase();
			return '/static/fdevlib/js/app/' + id + '.js';
		}
	}
});

define(['jquery', 'lofty/lang/log', 'butterfly/lang/Loader', 'butterfly/context/Application'], 
		function($, Log, Loader, Application) {

	var log = new Log('ComplexApp');

	var app = new Application({
		
		id: 'loftydoc',
		namespace: 'lofty/lang/doc',

		loader: Loader,
		
		pageContext: {
			moduleFilter: /\/context\/complex\//,
		},

		error: function(e) {
			log.error(e);
		}
		
	});
	
	app.start();
});
