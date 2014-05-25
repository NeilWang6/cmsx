/**
 * @package 
 * @author: 
 * @Date: 
 */

;(function($, D) {
	var errorMessage = {
		'img_too_big' : '�ļ�̫��',
		'invalid_img_type' : '�ļ����Ͳ��Ϸ�',
		'img_optimization_reuired' : '��С����',
		'unauthorized' : '��ȫУ�鲻ͨ��',
		'unknown' : 'δ֪����'
	}, readyFun = [
	/**
	 * �ύ��֤
	 */
	function() {
		$('#btn-sub').click(function(e) {
			var isValid = checkValid();
			if(isValid) {
				_validator();
			}
		});
		var cellId = $('#cellId');
		if(cellId.val()) {
			$('#page span').text('�༭�زĿ�');
		} else {
			$('#page span').text('�½��زĿ�');
		}

	}];

	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch (e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		});
	});
	
	var checkValid = function() {
		var formEl = $('#addCellForm'), els = formEl.find('[data-valid]');
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

	function _validator() {
		var errorMessage = $('.submit-error-message'),
		cellId = $('#cellId').val(), data;
		data = $('#addCellForm').serialize();
		
		$.ajax({
			type : "POST",
			url : "/page/box/json.html?_input_charset=UTF-8",
			data : data,
			cache : false,
			dateType : "json",
			success : function(text) {
				var json = $.parseJSON(text), htmlCode='';
				if(json && json.status === "success") {
					htmlCode += '<div class="submit-ok"><div class="ok"></div>�زĿ�<span>"' + $('#material_lib_name').val() + '"</span>���ύ�ɹ���</div>';
					htmlCode += '<div class="submit-next"><a href="/page/box/material_lab_list.html" class="btn-basic  btn-gray">�زĿ�</a></div>';
						$('footer', '.js-dialog').hide();
					D.Msg['confirm']({
						'title' : '��ʾ��Ϣ',
						'body' : '<div class="header-dialog-content">' + htmlCode + '</div>',
						'complete' : function() {
							window.location = D.domain+'/page/box/add_material_lib.html';
						}
					});

				} else {
									
					D.Msg.error({
						message : json.msg
					});
				}

			},
			error : function(o) {
				D.Msg.error({
					message : '(' + o.status + ') ' + o.statusText
				});
			}
		});
	}

})(dcms, FE.dcms);
