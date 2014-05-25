/**
 * @author xiaoquan
 */
;(function($, D) {
	var form = $('#js-search-page');
	var readyFun = [

	function() {

		$('#add_permission').bind('click', function(event) {
			event.preventDefault();
			showDialog();
		});
		$('.js-modification').bind('click', function(event) {
			var $self = $(this), id = $self.data('id');
			showDialog({
				id : id
			});
		});

		$('.js-delete').bind('click', function(event) {
			event.preventDefault();
			var $self = $(this), id = $self.data('id'), data = {
				action : 'AclPermissionAction',
				event_submit_do_del_resource : true,
				id : id

			};
			$.post(D.domain + '/admin/json.html?_input_charset=UTF8', data, function(text) {
				var json = $.parseJSON(text);
				if(json && json.status === 'success') {
					alert('�����ɹ���');
					window.location.reload();
				} else {
					alert('ɾ��ʧ�ܣ�');
				}
			});

		});

	}];
	
	var checkValid = function() {
		var formEl = $('#permission-submit-form'), els = formEl.find('[data-valid]');
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
							//dialog��ʾ
							msg = '����д' + o.key;
							break;
						case 'sel-val':
							break;
						case 'float':
							msg = '��ȱ��������֣�������ʾ���أ�С����ʾ�ٷֱ�';
							break;
						default:
							msg = '����д��ȷ������';
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
		$.get(D.domain + '/admin/editAclPermission.html', query, function(text) {

			$('.js-dialog').addClass('ext-width');
			$('footer', '.js-dialog').show();
			D.Msg['confirm']({
				'title' : '���Ȩ��',
				'body' : text,
				'noclose' : true,
				'complete' : function() {
					//$("#to_lib").attr('checked', false);
					
					

				},
				'close' : function(ext) {
					$('.js-dialog').removeClass('ext-width');
				},
				'success' : function(ext) {				
					//ajax�������js��֤
					if(!checkValid()){
						return;
					}
					
					var data = $('#permission-submit-form').serialize();
					
					$.post(D.domain + '/admin/json.html?_input_charset=UTF8', data, function(text) {
						var json = $.parseJSON(text);
						if(json && json.status === 'success') {
							alert('����ɹ���');
							ext && ext.data.dialog.dialog('close');
							window.location.reload();
						} else {
							//alert('����ʧ�ܣ�');
							if(json.msg && json.msg!=''){
								alert(json.msg);
							}else{
								alert('����ʧ�ܣ�');
							}
						}
					});
				}
			});
			/**/
			var resourceType=$("#listPageResourceType").val();
			if(!query.id || query.id ==''){
				$("#permission-submit-form #resourceType").val(resourceType);
			}
			
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
