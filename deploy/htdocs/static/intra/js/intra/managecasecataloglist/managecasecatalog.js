/**
 * @author xiaoquan
 */
;(function($, D) {
	var form = $('#js-search-page');
	var readyFun = [
	   function(){
	    	//$('#js-search-page').submit();
	    	FE.dcms.doPage();
	    },

	function() {
		$('#add_data').bind('click', function(event) {
			event.preventDefault();
			showDialog({ 
				"action":"CaseCatalogAction",
				"event_submit_do_get":"true"
			});
		});
		$('.js-modification').bind('click', function(event) {
			var $self = $(this), id = $self.data('id');
			showDialog({
				"id" : id,
				"action":"CaseCatalogAction",
				"event_submit_do_get":"true"
			});
		});

		$('.js-delete').bind('click', function(event) {
			event.preventDefault();
			var $self = $(this), id = $self.data('id'), data = {
				action : 'CaseCatalogAction',
				event_submit_do_del : true,
				id : id

			};
			$.post('json.htm?_input_charset=UTF8', data, function(text) {
				var json = $.parseJSON(text);
				if(json && json.status === 'success') {
					alert('操作成功！');
					//window.location.reload(); 
					$("#js-search-page").submit();
				} else {
					alert('删除失败！');
				}
			});

		});

	}];
	
	var checkValid = function() {
		var formEl = $('#js-submit-form'), els = formEl.find('[data-valid]');
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
							msg = '必须是数字';
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
		$.get('editCaseCatalog.htm', query, function(text) {

			$('.js-dialog').addClass('ext-width');
			$('footer', '.js-dialog').show();
			D.Msg['confirm']({
				'title' : '编辑案例分类',
				'body' : text,
				'noclose' : true,
				'complete' : function() {
					//$("#to_lib").attr('checked', false);  
				},
				'close' : function(ext) {
					$('.js-dialog').removeClass('ext-width');
				},
				'success' : function(ext) {				
					//ajax请求，如何js验证
					if(!checkValid()){
						return;
					}
					
					var data = $('#js-submit-form').serialize();
					
					$.post('json.htm?_input_charset=UTF8', data, function(text) {
						var json = $.parseJSON(text);
						if(json && json.status === 'success') {
							alert('保存成功！');
							ext && ext.data.dialog.dialog('close');
							$("#js-search-page").submit();
							//window.location.reload();
						} else {
							//alert('保存失败！');
							if(json.msg && json.msg!=''){
								alert(json.msg);
							}else{
								alert('保存失败！');
							}
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
