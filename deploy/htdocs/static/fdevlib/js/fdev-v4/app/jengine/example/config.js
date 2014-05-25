/**
 * @overview:���������Ͳ�������
 *
 * @author: hpapple.hep
 * @date: 2012-02-25
*/
!(function($) {
 
	 jQuery.namespace(
		'Searchweb', 	
		'Searchweb.Widget',
		'Searchweb.Business',
		'Searchweb.Utility',
		'Searchweb.Config'
	);

	Searchweb.Config.LazyModule={
	
		lazyModule1:{
			js: ['/static/fdevlib/js/fdev-v4/app/jengine/example/lazyloadmodule1.js'],
			css:['/static/fdevlib/js/fdev-v4/app/jengine/example/lazyloadmodule1.css']
		},
		
		//����ʾ����һ���ӳټ���ģ���ж���չ��ģʽʱ���ļ����巽ʽ��ħ����Ŀ��
		lazyModule2:{
			combine1:{
				js: ['/static/fdevlib/js/fdev-v4/app/jengine/example/lazyloadmodule2.js'],
				css:['/static/fdevlib/js/fdev-v4/app/jengine/example/lazyloadmodule21.css']
			},
			combine2:{
				js: ['/static/fdevlib/js/fdev-v4/app/jengine/example/lazyloadmodule2.js'],
				css:['/static/fdevlib/js/fdev-v4/app/jengine/example/lazyloadmodule22.css']
			},
			combine3:{
				js: ['/static/fdevlib/js/fdev-v4/app/jengine/example/lazyloadmodule2.js'],
				css:['/static/fdevlib/js/fdev-v4/app/jengine/example/lazyloadmodule33.css']
			}
		},
		
		bigRender1:{
			combine1:{
				js: ['/static/fdevlib/js/fdev-v4/app/jengine/example/bigrender1.js'],
				css:['/static/fdevlib/js/fdev-v4/app/jengine/example/bigrender1.css']
			}
		},
		end:0
	};
	
	Searchweb.Config.Events={
	
		DELETE:"module1/delete",
		end:0
	};
	
 })(jQuery);	