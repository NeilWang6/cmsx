/**
 * @userfor ����Ϊ�������
 * @author springyu
 *  * @date 2013-04-1
 */
;(function($, D) {
	var readyFun = [
	function() {
		$('#content').delegate('#dcms_box_module_save', 'click', function(event) {
			var data = {};
			$.get(D.domain + '/page/box/modulePropertieDialog.htm?_input_charset=UTF-8', data, showSettingDialog, 'text');
		});

	}];
	function showSettingDialog(text) {
		$('.js-dialog').addClass('ext-width');
		$('footer', '.js-dialog').show();
		D.Msg['confirm']({
			'title' : '�������',
			'body' : '<div class="">' + text + '</div>',
			'noclose' : true,
			'complete' : function() {
				$("#dcms_box_module_save").attr('checked', false);
				//$('.js-dialog').removeClass('ext-width');
			},
			'close' : function(ext) {
				$('.js-dialog').removeClass('ext-width');
			},
			'success' : function(ext) {
				var formEl = $('#module-submit-form'), result = checkForm(formEl);
				if(result) {
					var mainModule = $('#dcms_box_main_module');
					var doc = $(mainModule[0].contentWindow.document);
					var html = D.sendContent.getContainerHtml($('#design-container', doc));
					$('#personal_module_content').val(html);
					$.post(D.domain + '/page/app_command.html?_input_charset=UTF8', formEl.serialize(), function(text) {
						if(text) {
							var json = $.parseJSON(text);
							if(json) {
								if(json.sucess == "true") {
									//console.log(json);
									var $autoGenPic = $('#auto_gen_pic');
									if($autoGenPic && $autoGenPic.attr('checked')) {
										var tasks = {}, url, key, type = "pl_module";
										key = type + '-' + json.id;
										url = D.domain + '/open/box_view_personal_lib.html?id=' + json.id + '&type=' + type;
										tasks[key] = {
											'size' : '170x-1',
											'url' : url
										};
										tasks[key]['id'] = 'content';
										FE.dcms.Capture.start(tasks, function(text) {
											console.log(text);
										});
									}
									ext.data.dialog.dialog('close');
								} else {

								}
							}
						}
					});

				}
			}
		});
		(function() {
			var cascade = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
				params : {
					type : 'module',
					catalogId : '0'
				},
				postion : 'after',
				container : 'module_catalog'
			});
			cascade.init();
		})();

		/**
		 * ����Զ���Ӧ
		 */
		(function() {
			$("input[name='autoFit']").click(function(e) {
				e.stopPropagation();
				var checked = $(this)[0].checked;
				$('.width').css('display', checked ? 'none' : '');
				//checked && $('.width').val('');
			});
		})();
		(function() {
			// ��ɫ��ʼ����ʹ��Ĭ��ѡ�ж�Ӧ����ɫ��
			//$('.list-color .item').bind('click',function(e) {
				//e.preventDefault();
				//var $self = $(this);
				//$('.list-color .item').removeClass('current');
				//$self.addClass('current');
				//$("#hidden-module-color").val($self.find("a").text());
				//$('#hidden-module-color').trigger('blur');
				
			//	console.log($self.attr('class'));
			//});

		})();

		var errorMessage = {
			'img_too_big' : '�ļ�̫��',
			'invalid_img_type' : '�ļ����Ͳ��Ϸ�',
			'img_optimization_reuired' : '��С����',
			'unauthorized' : '��ȫУ�鲻ͨ��',
			'unknown' : 'δ֪����'
		},
		// ���ύ��ַ
		url = $('#dcms_upload_url').val(),
		// ��ťƤ��
		buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/081/364/463180_133354742.png';
		$.use('ui-flash-uploader', function() {
			//console.log($('span.local-upload'));
			$('span.local-upload').flash({
				module : 'uploader',
				width : 70,
				height : 25,
				flash : true,
				inputName : 'Filedata',
				flashvars : {
					buttonSkin : buttonSkin
				}
			}).bind('fileSelect.flash', function(e, o) {
				$(this).flash('uploadAll', url, {
					//_csrf_token: 'dcms-box'
				}, 'image', 'fname');
			}).bind('uploadCompleteData.flash', function(e, o) {
				var data = $.unparam(o.data);
				if(data.success === '1') {//�ϴ��ɹ�

					$('#thumbnail').val(data.url);
					$('#thumbimg').attr("src", data.url);
					alert('�ϴ��ɹ�');

				} else {//�ϴ�ʧ��
					alert(errorMessage[data.msg]);
				}
			});
		});

	}

	var checkForm = function(formEl) {
		var els = formEl.find('[data-valid]');
		formValid = new FE.ui.Valid(els, {
			onValid : function(res, o) {
				var tip = $(this).nextAll('.dcms-validator-tip'), msg;
				if(tip.length > 1) {
					for(var i = 1, l = tip.length; i < l; i++) {
						tip.eq(i).remove();
					}
				}
				if(res === 'pass') {
					tip.removeClass('dcms-validator-error');
				} else {
					switch (res) {
						case 'required':
							//dialog��ʾ
							msg = '����д' + o.key;
							break;
						case 'float':
							msg = '��ȱ��������֣�������ʾ���أ�С����ʾ�ٷֱ�';
							break;
						default:
							msg = '����д��ȷ������';
							break;
					}
					tip.text(msg);
					tip.addClass('dcms-validator-error');

				}
			}
		});
		return formValid.valid();
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
