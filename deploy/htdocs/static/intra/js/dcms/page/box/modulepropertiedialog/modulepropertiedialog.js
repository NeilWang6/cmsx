/**
 * @author springyu
 * @userfor ����CELL����
 * @date 2011-12-21
 */

;(function($, D) {
	/**
	 * iframe margin-top �߶�
	 */
	var IFRAME_MARGIN_TOP = 40, formValid, attrDialog = $('#cell_derive_attr');

	var readyFun = [
	//���ز��ֻ�ģ��
	function() {

		var cascade = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
			params : {
				type : 'module',
				catalogId : '0'
			},
			postion : 'after',
			container : 'module_catalog'
		});
		cascade.init();
	},

	/**
	 * ��ʼ��CELL��������
	 */
	function() {

		$('#cell_cancel', attrDialog).bind('click', function() {
			//attrDialog.dialog('close');
			hideModuleAttr(attrDialog);

		});
		$('#cell_ok', attrDialog).bind('click', function(e) {
			if(formValid.valid() === true) {
				if(parent.saveModulePropertieDlg) {
					if(parent.saveModulePropertieDlg()) {

						if(parent.getContent4ModuleDialog) {
							$('#module-content').val(parent.getContent4ModuleDialog());
						}

						$.ajax({
							url : D.domain + '/page/app_command.html?_input_charset=UTF8',
							type : "POST",
							async : false,
							data : $('#module-submit-form').serialize(),
						}).done(function(o) {
							if(o) {
								var _data = dcms.parseJSON(o);
								if(_data.sucess == "false") {
									alert("����ʧ��");
								} else {
									var $autoGenPic=$('#auto_gen_pic');
									if($autoGenPic && $autoGenPic.attr('checked')) {
										var tasks ={},url,key,type="pl_module";
										key=type+'-'+_data.id;
										url = D.domain + '/open/box_view_personal_lib.html?id=' + _data.id + '&type='+type;
										tasks[key] = {
											'size' : '170x-1',
											'url' : url
										};
										tasks[key]['id'] = 'content';
										FE.dcms.Capture.start(tasks, function(text) {
											console.log(text);
										});
									}
									//��Ҫ��module�����ô����ԡ�ʹ���������ģ�����Щ���������ϣ���ר���Զ���ʱ�����á�
									var _eleminfo = JSON.stringify(_data.eleminfo);
									parent.getContainer4ModuleDialog().find('.crazy-box-module').attr("data-eleminfo", _eleminfo);
									hideModuleAttr(attrDialog);
									initModule();

								}
							}
						}).fail(function() {
							alert('ϵͳ��������ϵ����Ա');
						});

					}
				}

			}
		});

	},

	function() {
		// ��ɫ��ʼ����ʹ��Ĭ��ѡ�ж�Ӧ����ɫ��
		var moduletag, pageColor = $('.page-color', '#module-submit-form');
		moduletag = pageColor.data('moduletag');

		$('.list-color .item').click(function(e) {
			e.preventDefault();
			var hasColor = $(this).hasClass('current');
			$('.list-color .item').removeClass('current');
			if(!hasColor) {
				$("#hidden-module-color").val($(this).find("a").text());
				$('#hidden-module-color').trigger('blur');
				$(this).addClass('current');
			}

		});
		$('.list-color .item', '.page-color').each(function(index, obj) {
			var $self = $(obj), color = $self.find("a").text();
			if($self.hasClass('current')) {
				$self.removeClass('current');
			}
			if(moduletag && moduletag.indexOf(color) !== -1) {
				$self.addClass('current');
				$('#hidden-module-color').val(color);
				$('#hidden-module-color').trigger('blur');
			}

		});
	},

	/**
	 * add by hongss on 2012.02.22 for �������� ����֤
	 */
	function() {
		var formEl = $('#module-submit-form'), els = formEl.find('[data-valid]');
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

		formEl.submit(function() {
			var result = formValid.valid();
			if(result === false) {
				$.use('ui-dialog', function() {
					attrDialog.dialog({
						modal : false,
						shim : true,
						draggable : true,
						center : true
					});
				});
			}
			return result;
		});
	},

	/**
	 * ����Զ���Ӧ
	 */
	function() {
		$("input[name='autoFit']").click(function(e) {
			e.stopPropagation();
			var checked = $(this)[0].checked;
			$('.width').css('display', checked ? 'none' : '');
			//checked && $('.width').val('');
		});
	},
	function() {
		// ��ʼ��
		initModule();
	}];


	function hideModuleAttr(dialog) {
		if(parent.closeModulePropertieDlg) {
			parent.closeModulePropertieDlg();
		}
	}

	// ��ʼ��
	var initModule = function() {
		$('#module-submit-form').get(0).reset();
		if(parent.getWidth4ModuleDialog) {
			var _width = parent.getWidth4ModuleDialog();
			$('#module-width').val(_width);
		}
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
