/**
 * @author xiaoquan
 */
;(function($, D) {
	var form = $('#js-search-page');
	var readyFun = [

	function() {

		$('#add_role').bind('click', function(event) {
			event.preventDefault();
			showDialog();
		});
		$('.js-modification').bind('click', function(event) {
			var $self = $(this), id = $self.data('id');
			showDialog({
				id : id
			});
		});
        //FIXME 删除
		$('.js-delete').bind('click', function(event) {
			event.preventDefault();
			var $self = $(this), id = $self.data('id'), data = {
				action : 'AclRoleAction',
				event_submit_do_del_role : true,
				id : id
			};
			$.post('json.htm?_input_charset=UTF8', data, function(text) {
				var json = $.parseJSON(text);
				if(json && json.status === 'success') {
					alert('操作成功！');					
					window.location.reload();
				} else {
					alert('删除失败,请确认角色下面没有关联权限资源！');
				}
			});

		});

	}];
	
	var checkValid = function() {
		var formEl = $('#role-submit-form'), els = formEl.find('[data-valid]');
		var formValid = new FE.ui.Valid(els, {
			onValid : function(res, o) {
				var tip = $(this).nextAll('.dcms-validator-tip'), preTip = $(this).prevAll('.dcms-validator-tip'), msg;
				tip = $.merge(tip, preTip);
				if(tip.length > 1) {
					for(var i = 1, l = tip.length; i < l; i++) {
						tip.eq(i).remove();
					}
				}
				if(res === 'pass') {
					tip.hide();
					tip.removeClass('dcms-validator-error');
				} else {
					switch (res) {
						case 'required':
							//dialog显示
							msg = '请填写' + o.key;
							break;
						case 'sel-val':
							break;
						case 'float':
							msg = '宽度必须是数字（整数表示像素，小数表示百分表）';
							break;
						default:
							msg = '请填写正确的内容';
							break;
					}
					tip.show();
					tip.text(msg);
					tip.addClass('dcms-validator-error');

				}
			}
		});
		return formValid.valid();
	};


	var showDialog = function(param) {
		var query = param || {};
		$.get('editAclRole.htm', query, function(text) {

			$('.js-dialog').addClass('ext-width');
			$('footer', '.js-dialog').show();
			D.Msg['confirm']({
				'title' : '添加角色',
				'body' : text,
				'noclose' : true,
				'complete' : function() {
					//$("#to_lib").attr('checked', false);
					//

				},
				'close' : function(ext) {
					$('.js-dialog').removeClass('ext-width');
				},
				'success' : function(ext) {				
					//ajax请求，如何js验证
					if(!checkValid()){
						return;
					}
					
					
					//id是否存在
					var id=$("#role-submit-form #id").val();
					if(id && id != ''){
						$("#role-submit-form #event").attr('name',"event_submit_do_updateRole");
					}
					
					var data = $('#role-submit-form').serialize();										
					$.post('json.htm?_input_charset=UTF8', data, function(text) {
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
