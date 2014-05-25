/**
 * @author springyu
 */
;(function($, D) {
	var form = $('#js-search-page');
	var readyFun = [

	function() {

		$('#add_skin').bind('click', function(event) {
			event.preventDefault();
			showDialog();
		});
		$('.js-modification').bind('click', function(event) {
			var $self = $(this), id = $self.data('id');
			showDialog({
				skinId : id
			});
		});

		$('.js-delete').bind('click', function(event) {
			event.preventDefault();
			var $self = $(this), id = $self.data('id'), data = {
				action : 'SkinManagerAction',
				event_submit_do_changeSkinStatus : true,
				skinId : id,
				status:$self.data('status')

			};
			$.post(D.domain + '/admin/json.html?_input_charset=UTF8', data, function(text) {
				var json = $.parseJSON(text);
				if(json && json.status === 'success') {
					alert('操作成功！');
					//ext && ext.data.dialog.dialog('close');
					window.location.reload();
				} else {
					alert('删除失败！');
				}
			});

		});
	}];

	var showDialog = function(param) {
		var query = param || {};
		$.get(D.domain + '/admin/editSkin.html', query, function(text) {

			$('.js-dialog').addClass('ext-width');
			$('footer', '.js-dialog').show();
			D.Msg['confirm']({
				'title' : '添加皮肤',
				'body' : text,
				'noclose' : true,
				'complete' : function() {
					//$("#to_lib").attr('checked', false);
				},
				'close' : function(ext) {
					$('.js-dialog').removeClass('ext-width');
				},
				'success' : function(ext) {
					var $tBody = $('tbody', '#table_sub'), $tr = $('tr', $tBody), colorList = [], $skinName = $('#skin_name'),
					//
					$category=$('#category'), $skinId = $('#skin_id'),libIds=$('#libIds').val(),boxPageType=$('#boxPageType').val();
					//如果需要判断至少选择的条件可以在这里
					if(boxPageType==""||libIds==""){
						alert("适用页面与素材库不能为空");
						return false;
					}
					if($skinName.val()==""){
						alert("请输入皮肤名称");
						return false;
					}
					;
					var eachSuccess=true;
					$tr.each(function(index, obj) {
						var $self = $(obj), $lessName = $('input[name=lessName]', $self),
						//
						$lessValue = $('input[name=lessValue]', $self), $name = $('input[name=name]', $self);
						if($lessValue.val()==""){
							eachSuccess=false;
							return false;
						}
						colorList.push({
							lessName : $lessName.val(),
							lessValue : $lessValue.val(),
							name : $name.val()
						});
					});
					if(eachSuccess==false){
						alert("色块不能为空");
						return false;
					}
					var data = {
						action : 'SkinManagerAction',
						event_submit_do_saveSkin : true,
						skinName : $skinName.val(),
						skinId : $skinId.val(),
						category : $category.val(),
						colorList : JSON.stringify(colorList),
						libIds:libIds,
						boxPageType:boxPageType
					};
					$.post(D.domain + '/admin/json.html?_input_charset=UTF8', data, function(text) {
						var json = $.parseJSON(text);
						if(json && json.status === 'success') {
							alert('保存成功！');
							ext && ext.data.dialog.dialog('close');
							window.location.reload();
						} else {
							alert('保存失败！');
						}
					});
				}
			}, {
				'open':function(){
					new FE.tools.MultChoice({
						area : '.lib-material',
						valueInput : '.lib-material .lib-ids',
						choice : function(val, itemEl, inputEl) {
						}
					});
					new FE.tools.MultChoice({
						area : '.box-page-type',
						valueInput : '.box-page-type .box-page-type',
						choice : function(val, itemEl, inputEl) {
						}
					});
				}
			});

			$('.js-less').change(function() {
				//event.preventDefault();
				var self = $(this), $color = self.parent().find('.js-color-preview');
				$color.css('background-color', '#' + self.val());

			});

			$.use('ui-colorbox', function() {
				$('.js-color-preview').colorbox({
					select : function(event, object) {
						var self = $(this);
						self.css({
							"background" : object.color
						}).colorbox('hide');
						self.parent().find('input.js-less').val(object.color.substring(1)).trigger('change');

					},
					transparent : true
				});
			});

		});
	}
	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch(e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		})
	});

})(dcms, FE.dcms);
