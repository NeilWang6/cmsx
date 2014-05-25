/**
 * @author springyu
 * @userfor 工具面版JS处理
 * @date 2011-12-21
 */

;(function($, D) {

	var readyFun = [
	/*** 绑定事件
	 */
	function() {
		// 组件属性切换事件
		$('#panel_tab').delegate('a.module-a', 'click', function() {
			var self = $(this), selfParent = self.parent();
			if(selfParent.hasClass('current') && self.attr('id') !== 'nav_attr_ds') {
				return;
			}
			selfParent.siblings().each(function(index, obj) {
				$(obj).removeClass('current');
			});
			selfParent.addClass('current');
			if(self.attr('id') === 'nav_module') {
				$('#module-page').show();
				$('.panel-module-ds').hide();
				$('.panel-edit-attr').hide();
				$('.panel-module-content').show();
				D.bottomAttr.resizeWindow();
				D.errorCheck(D.editPage.iframeDoc);
			}
			if(self.attr('id') === 'nav_attr_edit') {
				$('.panel-module-ds').hide();
				$('.panel-module-content').hide();
				$('.panel-edit-attr').show();
			}
			if(self.attr('id') === 'nav_attr_ds') {
				//$('#attr_dsModule').empty();
				var _dsModuleParam, isMultiDs = false;
				$('div.dsmodule-attr').each(function(index, obj) {
					var _target = $(obj), $html;
					var extra = _target.data(D.bottomAttr.CONSTANTS['extra']);
					if(extra && extra.obj) {
						$html = $(extra.obj), dsmoduleparam = $html.data('dsmoduleparam');
						if( dsmoduleparam instanceof Array) {
							isMultiDs = true;
						}
						_dsModuleParam = $html.attr('data-dsmoduleparam');
					}
				});
				if(!isMultiDs) {
					$('.panel-module-content').hide();
					$('.panel-edit-attr').hide();
					$('.panel-module-ds').show();
					D.bottomAttr.initDsModule(_dsModuleParam);
				} else {
					alert('目前不支持多数据源设置！');
					return;
				}

			}

		});

	},

	/**
	 *
	 */
	function() {
		$('#autocratic').bind('mouseup', function() {
			var self = this;
			$('div.attr', 'div.dialog').each(function(index, obj) {
				var _self = $(obj);
				if(_self.css('display') === 'block') {
					if(!self.checked) {
						// console.log('选中');
						$('div.attr-type', _self).each(function(m, o) {
							var $html = $(o);
							$html.data('autocratic', 'autocratic');
						});
					} else {
						// console.log('no');
						$('div.attr-type', _self).each(function(m, o) {
							var $html = $(o);
							var extra = $html.data(D.bottomAttr.CONSTANTS['extra']);
							if(extra && extra.obj && extra.key) {
								var style = extra.obj[0].style;

								$html.removeData('autocratic');
								if(extra.key === 'text') {
									D.EditContent.removeStyle({
										'elem' : extra.obj,
										'key' : 'font-weight',
										'isRemoveStyle' : true
									});
									D.EditContent.removeStyle({
										'elem' : extra.obj,
										'key' : 'font-size',
										'isRemoveStyle' : true
									});
									D.EditContent.removeStyle({
										'elem' : extra.obj,
										'key' : 'font-family',
										'isRemoveStyle' : true
									});
									D.EditContent.removeStyle({
										'elem' : extra.obj,
										'key' : 'color',
										'isRemoveStyle' : true
									});
									style.removeProperty('font-weight');
									style.removeProperty('font-size');
									style.removeProperty('font-family');
									style.removeProperty('color');
								} else {
									D.EditContent.removeStyle({
										'elem' : extra.obj,
										'key' : extra.key,
										'isRemoveStyle' : true
									});
									style.removeProperty(extra.key);
								}

							}

						});
					}
				}
			});

		});
	},
	/**
	 * 计算编辑布局和iframe的位置
	 */
	function() {
		$(window).scroll(autoRight);
		$(window).resize(autoRight);
		setTimeout(autoRight, 50);
	}];

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

	var autoRight = function() {
		D.bottomAttr && D.bottomAttr.resizeWindow && D.bottomAttr.resizeWindow();
	};
	/**
	 * @author roobin.lij
	 * @userfor 查询数据源
	 * @date 2012-05-14
	 */
	FE.dcms.getDssData = function(url, hiddenJson) {
		$.ajax({
			url : url,
			type : "POST",
			data : {
				dsModuleData : encodeURIComponent(hiddenJson)
			},
			success : function(o) {
				D.storage().setItem('dssJson', o);
			},
			error : function() {
				return;
			}
		});
	};

})(dcms, FE.dcms);
