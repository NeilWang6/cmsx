/**
 * @package 
 * @author: 
 * @Date: 
 */

;(function($, D) {
	var errorMessage = {
		'img_too_big' : '文件太大',
		'invalid_img_type' : '文件类型不合法',
		'img_optimization_reuired' : '大小超标',
		'unauthorized' : '安全校验不通过',
		'unknown' : '未知错误'
	}, readyFun = [
	/**
	 * 提交验证
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
			$('#page span').text('编辑素材库');
		} else {
			$('#page span').text('新建素材库');
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
					htmlCode += '<div class="submit-ok"><div class="ok"></div>素材库<span>"' + $('#material_lib_name').val() + '"</span>已提交成功！</div>';
					htmlCode += '<div class="submit-next"><a href="/page/box/material_lab_list.html" class="btn-basic  btn-gray">素材库</a></div>';
						$('footer', '.js-dialog').hide();
					D.Msg['confirm']({
						'title' : '提示信息',
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
