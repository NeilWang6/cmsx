/**
 * @author springyu
 * @userfor 使用JS加载页面设计功能，页面操作功能
 * @date 2013-7-27
 */
;(function($, D) {
	var readyFun = [];
	var module = '<div class="crazy-box-module cell-module" data-boxoptions=\'{"css":[{"key":"background","name":"背景设置","type":"background"},{"key":"padding","name":"内边距","type":"ginputs"},{"key":"margin","name":"外边距","type":"ginputs"},{"key":"border","name":"边框","type":"border"}],"ability":{"copy":{"enable":"true"}}}\'><div class="crazy-box-content crazy-box-empty"  data-boxoptions=\'{"ability":{"container":{"enableType":"cell","number":"n"}}}\'></div></div>';
	var row = '<div class="crazy-box-row cell-row" data-boxoptions=\'{"ability":{"copy":{"enable":"true"}}}\'><div class="crazy-box-box box-100" data-boxoptions=\'{"ability":{"container":{"enableType":"module","number":"1"}}}\'><div class="crazy-box-module cell-module" data-boxoptions=\'{"css":[{"key":"background","name":"背景设置","type":"background"},{"key":"padding","name":"内边距","type":"ginputs"},{"key":"margin","name":"外边距","type":"ginputs"},{"key":"border","name":"边框","type":"border"}],"ability":{"copy":{"enable":"true"}}}\'><div class="crazy-box-content crazy-box-empty"  data-boxoptions=\'{"ability":{"container":{"enableType":"cell","number":"n"}}}\'></div></div></div></div>';
	var layout = '<div class="crazy-box-layout layout cell-layout layout-col" style="margin-bottom:0" data-boxoptions=\'{"css":[{"key":"margin-bottom","name":"底部外边距","type":"input"},{"key":"width","name":"宽度","type":"input","disable":"true"}],"ability":{"copy":{"enable":"true"},"delete":{"enable":"true"}}}\'><div class="crazy-box-grid grid-24" data-boxoptions=\'{"ability":{"container":{"enableType":"row","number":"n"}}}\'><div class="crazy-box-row cell-row" data-boxoptions=\'{"ability":{"copy":{"enable":"true"}}}\'><div class="crazy-box-box box-100" data-boxoptions=\'{"ability":{"container":{"enableType":"module","number":"1"}}}\'><div class="crazy-box-module cell-module" data-boxoptions=\'{"css":[{"key":"background","name":"背景设置","type":"background"},{"key":"padding","name":"内边距","type":"ginputs"},{"key":"margin","name":"外边距","type":"ginputs"},{"key":"border","name":"边框","type":"border"}],"ability":{"copy":{"enable":"true"}}}\'><div class="crazy-box-content crazy-box-empty"  data-boxoptions=\'{"ability":{"container":{"enableType":"cell","number":"n"}}}\'></div></div></div></div></div></div>';
	D.cleanError = function(doc) {
		var $Loading = $('#crazy-box-data-loading', doc);
		if($Loading.length) {
			var $parent = $Loading.parent('.crazy-box-box');
			var $grid = $Loading.parent('.crazy-box-grid');
			if($parent.length) {
				var $row = $parent.parent('.crazy-box-row'),opts = {
					'mod' : 'container',
					'target':$parent,
					'type' : 'module'
				}, htmlcode = D.ManagePageDate.handleStyle(module, opts, true);
				if($row.siblings().length > 0){
					$row.remove();
				} else {
					$row.replaceWith(htmlcode);
				}
				
			} else if ($grid.length){
				var _$row = $grid.find('.crazy-box-row'),opts = {
					'mod' : 'container',
					'target':$grid,
					'type' : 'module'
				}, htmlcode = D.ManagePageDate.handleStyle(module, opts, true);
				if(_$row.length){
					$Loading.remove();
				} else {
					$Loading.replaceWith(htmlcode);
				}
			}else {
				var $layout = $Loading.siblings('.crazy-box-layout');

				if(!$layout.length) {
					$Loading.replaceWith(layout);
				} else {
					$Loading.remove();
				}

			}

		}
	};
	D.errorCheck=function(doc){
		//var doc = $(el.contentDocument.document || el.contentWindow.document);
		var $Loading = $('#crazy-box-data-loading', doc);
		if($Loading.length){
			D.cleanError(doc);
			return true;
		}
		return false;
	}

	$(function() {
		for(var i = 0, l = readyFun.length; i < l; i++) {
			try {
				readyFun[i]();
			} catch(e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}
	});
})(dcms, FE.dcms);
