/**
 * Baseed on jQuery Gears
 * @Author: Denis 2011.01.21
 * @update Denis 2011.08.11 移入styleDomain配置
 * @update terence.wangt 2013.06.09 FUI基础控件库兼容FDEV4
 */
(function($){
    if ($.styleDomain) {
        return;
    }
    var $util = $.util, mudules = {
        'util-achievement': {
            js: ['util/achievement'],
            css: ['util/achievement'],
            ver: '1.0'
        },
        'util-json': {
            js: ['util/json2'],
            ver: '1.0'
        },
        'util-cookie': {
            js: ['util/cookie'],
            ver: '1.1.1'
        },
        'util-date': {
            js: ['util/date'],
            ver: '1.2'
        },
        'util-debug': {
            js: ['util/debug'],
            ver: '1.0'
        },
        'util-history': {
            js: ['util/history'],
            ver: '1.5.0'
        },
        'util-storage': {
            js: ['util/storage'],
            ver: '1.0'
        },
		'util-swfstorage': {
            js: ['util/swfstorage'],
            ver: '1.0'
        },
        'fx-core':{
            js: ['fx/core'],
            ver: '1.8.13'
        },
        'ui-core': {
            js: ['ui/core'],
            ver: '1.1'
        },
        'ui-combobox': {
            requires: ['ui-core'],
            js: ['ui/combobox'],
            css: ['ui/combobox'],
            ver: '1.0'
        },
        'ui-position': {
            js: ['ui/position'],
            ver: '1.8.11'
        },
        'ui-menu': {
            requires: ['ui-core'],
            js: ['ui/menu'],
            ver: '1.8.15'
        },
        'ui-mouse': {
            requires: ['ui-core'],
            js: ['ui/mouse'],
            ver: '1.8.15'
        },
        'ui-autocomplete': {
            requires: ['ui-position', 'ui-menu'],
            js: ['ui/autocomplete'],
            ver: '1.8.16'
        },
        'ui-colorbox': {
            requires: ['ui-core'],
            css: ['ui/colorbox'],
            js: ['ui/colorbox'],
            ver: '1.0'
        },
        'ui-colorpicker': {
            requires: ['ui-mouse'],
            css: ['ui/colorpicker'],
            js: ['ui/colorpicker'],
            ver: '1.0'
        },
        'ui-draggable': {
            requires: ['ui-mouse'],
            js: ['ui/draggable'],
            ver: '1.8.11'
        },
        'ui-droppable': {
            requires: ['ui-draggable'],
            js: ['ui/droppable'],
            ver: '1.8.11'
        },
        'ui-datepicker': {
            requires: ['ui-core'],
            css: ['ui/datepicker'],
            js: ['ui/datepicker'],
            ver: '1.2'
        },
        'ui-datepicker-time': {
            requires: ['ui-datepicker'],
            js: ['ui/datepicker-time'],
            ver: '1.0'
        },
        'ui-dialog': {
            requires: ['ui-core'],
            js: ['ui/dialog'],
            ver: '1.0'
        },
        'ui-flash': {
            requires: ['ui-core'],
            js: ['ui/flash'],
            ver: '1.1'
        },
        'ui-flash-clipboard': {
            requires: ['ui-flash'],
            js: ['ui/flash-clipboard'],
            ver: '1.2'
        },
        'ui-flash-uploader': {
            requires: ['ui-flash'],
            js: ['ui/flash-uploader'],
            css: ['ui/flash-uploader'],
            ver: '1.3'
        },
        'ui-flash-uploader2': {
            requires: ['ui-flash'],
            js: ['ui/flash-uploader2'],
            css: ['ui/flash-uploader'],
            ver: '2.1'
        },
        'ui-flash-chart': {
            requires: ['ui-flash'],
            js: ['ui/flash-chart'],
            ver: '1.3'
        },
        'ui-flash-storage': {
            requires: ['ui-flash'],
            js: ['ui/flash-storage'],
            ver: '1.0'
        },
        'ui-portlets': {
            requires: ['ui-mouse'],
            js: ['ui/portlets'],
            ver: '1.1'
        },
        'ui-progressbar': {
            requires: ['ui-core'],
            js: ['ui/progressbar'],
            ver: '1.8.11'
        },
        'ui-scrollto': {
            js: ['ui/scrollto'],
            ver: '1.4.2'
        },
        'ui-sortable': {
            requires: ['ui-mouse'],
            js: ['ui/sortable'],
            ver: '1.8.12'
        },
        'ui-tabs': {
            requires: ['ui-core'],
            js: ['ui/tabs'],
            ver: '1.3'
        },
        'ui-tabs-effect': {
            requires: ['ui-tabs'],
            js: ['ui/tabs-effect'],
            ver: '1.1'
        },
        'ui-tabs-lazyload': {
            requires: ['ui-tabs'],
            js: ['ui/tabs-lazyload'],
            ver: '1.0'
        },
        'ui-timer': {
            requires: ['ui-core'],
            js: ['ui/timer'],
            ver: '1.2'
        },
		'ui-tip': {
            requires: ['ui-core'],
            js: ['ui/tip'],
            ver: '1.0'
        },
        'ui-maglev': {
            requires: ['ui-core'],
            js: ['ui/maglev'],
            ver: '1.0'
        },
        'ui-imgcolr': {
            js: ['ui/imgcolr'],
            ver: '1.0'
        },
        'web-alitalk': {
            css: ['web/alitalk'],
            js: ['web/alitalk'],
            ver: '3.2'
        },
        'web-alitalk-shunt': {
            requires: ['web-alitalk'],
            js: ['web/alitalk-shunt'],
            ver: '1.0'
        },
        'web-pca': {
            js: ['web/pca'],
            ver: '1.0'
        },
        'web-datalazyload': {
            js: ['web/datalazyload'],
            ver: '1.2'
        },
        'web-sweet': {
            js: ['web/sweet'],
            ver: '1.0'
        },
        'web-stylesheet': {
            js: ['web/stylesheet'],
            ver: '1.0'
        },
        'web-suggestion': {
            requires: ['ui-autocomplete'],
            js: ['web/suggestion'],
            css: ['web/suggestion'],
            ver: '1.1.2'
        },
        'web-valid': {
            js: ['web/valid'],
            ver: '1.0'
        },
        'ext-jasmine': {
            css: ['external/jasmine'],
            js: ['external/jasmine'],
            ver: '1.1'
        },
        'ext-jasmine-html': {
            requires: ['ext-jasmine'],
            js: ['external/jasmine-html'],
            ver: '1.1'
        },
        'ext-jasmine-jquery': {
            requires: ['ext-jasmine'],
            js: ['external/jasmine-jquery'],
            ver: '1.1'
        }
    },url = 'http://{0}/fdevlib/{t}/fdev-v4/widget/{p}-min.{t}?v={1}';
	
    //init default mudules
    for (var name in mudules) {
        var configs = mudules[name], js = configs.js, css = configs.css, j, len;
        if (js) {
            for (j = 0, len = js.length; j < len; j++) {
                js[j] = $util.substitute(url, {
                    t: 'js',
                    p: js[j]
                });
            }
        }
        if (css) {
            for (j = 0, len = css.length; j < len; j++) {
                css[j] = $util.substitute(url, {
                    t: 'css',
                    p: css[j]
                });
            }
        }
        $.add(name, configs);
    }
    //2011.8.11 Denis style域名配置
    $.styleDomain = 'style.c.aliimg.com';
    
	/** 
	 *	升级过渡阶段，保持 fdev-5 与 fdev-4 的兼容。
	 *	若使用者同时引入了fdev4-min.js 以及 lofty.js，这个定义会使应用调用 fdev4-min.js 中的jQuery对象(1.7.2版本 + fdev4扩展)
	*/
	window.lofty && ( define('gallery/jquery/jqueryLatest',function(){return jQuery;}),lofty.config({alias:{'jquery':'gallery/jquery/jqueryLatest'}}));
})(jQuery);


/*
*	FUI 组件依赖config定义
*   @added terence.wangt 2013.06.17
*/
(function($){

	$.namespace('FE.fui');
  
	$.extend(FE.fui, {
	
		fuiModules:{
			'fui-combobox': {
				requires: ['ui-core'],
				js: ['ui/combobox'],
				css: ['ui/combobox/1.0'],
				ver: '1.0'
			},
			'fui-tabs': {
				requires: ['ui-core'],
				js: ['ui/tabs'],
				css: ['ui/tabs/1.0'],
				ver: '1.0'
			},
			'fui-datepicker': {
				requires: ['ui-core','util-date'],
				js: ['ui/datepicker'],
				css: ['ui/datepicker/1.0'],
				ver: '1.2'
			},
			'fui-datepicker-time': {
				requires: ['fui-datepicker'],
				js: ['ui/datepicker-time'],
				ver: '1.0'
			},
			'fui-dialog': {
				requires: ['ui-core'],
				js: ['ui/dialog'],
				css: ['ui/dialog/1.0'],
				ver: '1.0'
			},
			'fui-loading': {
				requires: ['ui-core'],
				js: ['ui/dialog'],
				css: ['ui/loading/1.0'],
				ver: '1.0'
			},
			'fui-tip': {
				requires: ['ui-core'],
				js: ['ui/tip'],
				css: ['ui/tip/1.0'],
				ver: '1.0'
			}
		},
		url:'http://{0}/fdevlib/{t}/fdev-v4/widget/{p}-min.{t}?v={1}',
		fuiUrl:'http://{0}/fdevlib/{t}/lofty/{p}/{s}/{c}-min.{t}?v={1}',

		configSkin:function(style){

			var modules = $.extend(true, {}, this.fuiModules);
			for (var name in modules) {
				
				$.has(name) && $.remove(name);
				
				var configs = modules[name], js = configs.js, css = configs.css, j, len;
				if (js) {
					for (j = 0, len = js.length; j < len; j++) {
						js[j] = $.util.substitute(this.url, {
							t: 'js',
							p: js[j]
						});
					}
				}
				if (css) {
					for (j = 0, len = css.length; j < len; j++) {
						
						var cName = css[j].split('/')[1];
						css[j] = $.util.substitute(this.fuiUrl, {
							t: 'css',
							p: css[j],
							s: style,
							c: cName
						});
					}
				}
				$.add(name, configs);
			}
		}
	});
	
	FE.fui.configSkin('back');
	
})(jQuery);
