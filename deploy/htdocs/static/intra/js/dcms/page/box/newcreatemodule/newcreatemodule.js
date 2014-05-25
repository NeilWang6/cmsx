/**
 * @author springyu
 * @userfor ����CELL����
 * @date 2011-12-21
 */

;(function($, D) {
	/**
	 * iframe margin-top �߶�
	 */
	var IFRAME_MARGIN_TOP = 40, formValid, attrDialog = $('.js-module-dialog'), SYNC_MODULE = 'sync_module';

	var readyFun = [
	//�ı��һ���˵�tab������
	function() {
		$('#page span').text('դ��༭');

	},

	//���ز��ֻ�ģ��
	function() {

		var cascade = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
			params : {
				type : 'module',
				catalogId : '0'
			},
			postion : 'after',
			container : 'catalog_content'
		});
		cascade.init();
	},

	/**
	 * ��ʼ��CELL��������
	 */
	function() {
		$('#dcms_box_grid_moduleattribute').bind('click', function(e) {
			e.preventDefault();
			showModuleAttr(attrDialog);

		});

		$('#cell_cancel,.close', attrDialog).bind('click', function() {
			 
			hideModuleAttr(attrDialog);
		 
		});
		$('#cell_ok', attrDialog).bind('click', function(e) {
			if(formValid.valid() === true) {
				//attrDialog.dialog('close');
				if($('#needSync').attr('checked')){
					$('#source').val(SYNC_MODULE);
				}
				hideModuleAttr(attrDialog);
			}
		});
	},

	/**
	 * add by hongss on 2012.05.09 for ���Ԫ�ؿ�tab�л�Ĭ�ϵ���ѡ��ߴ硱
	 */
	function() {
		$('#handle-choose-width').trigger('click');
		//��ǩǶ�ײ�tabҳ���¼���
		D.BoxAttr.bindEventLevelElem();
		//�����¼��
		D.bottomAttr.bind.init();
	},

	function() {
		// ɫϵ
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
						case 'sel-val':
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

		//formEl.submit(function() {
		//   var result = formValid.valid();
		//  if(result === false) {
		/*$.use('ui-dialog', function() {
		attrDialog.dialog({
		modal : false,
		shim : true,
		draggable : true,
		center : true
		});
		});*/
		// showModuleAttr(attrDialog);
		// }
		// return result;
		// });
	},

	/**
	 * add by hongss on 2012.02.14 for ��קԪ����������Ƶ�module����
	 * modify by hongss on 2012.02.22 for ����/Ԥ����ƺ��module����
	 * modify by hongss on 2012.05.09 for ѡ��ߴ��
	 */
	function() {
		var editPage = new D.DropInPage({
			pageUrl : D.domain + '/page/box/moduleContent.html',
			dropArea : '#design-container',
			status : 'edit-module',
			callback : function(doc) {
				var contentInput = $('#page_module_content'), content = contentInput.val(), area = $('#design-container', doc), formEl = $('#module-submit-form'), $moduleId = $('#module-moduleid');
				//2013-04-02 �����ʼ������id������ȷ,��ʱ�ŵ������
				if(!!$.trim(content)) {
					D.InsertHtml.init(content, area, 'html', doc);
				}
				var $module = doc.find('.crazy-box-module');
				//data-dsmoduleparam
				//����ר����������Դ��Ϣ
				D.box.datasource.Topic.loadTopic($module);

				//�ύ��Ƶ�module����
				$('#dcms_box_grid_submit').click(function(e) {
					e.preventDefault();
					var newContent = D.sendContent.getContainerHtml(area), config = {}, toLibUrl, moduleId = $moduleId.val(), flag = $('#flag').val();
					// �����ͬ�����
					if($('#source').val() == SYNC_MODULE) {
						contentInput.val(newContent);
						var data = {};
						// ��ȡ����ֵ
						$("input,textarea,select", formEl).each(function() {
							var elm = $(this), name = elm.attr('name');
							if(name && name != 'action' && !name.match(/^event_.*/g)) {
								elm.val() && (data[name] = elm.val());
							}
						});
						D.showSyncDialog(moduleId, data);
						return;
					}
					if(!!$.trim(newContent)) {
						contentInput.val(newContent);
						if(!formValid.valid()) {
							showModuleAttr(attrDialog);
							return;
						}
						//formEl.submit();
						//console.log(formEl.serialize());
						//���˿�û���ˣ��򵥴���ֱ����ת���زĿ�
						flag='T';
						$('#flag').val(flag)
						if(flag && flag === 'T') {
							toLibUrl = D.domain + '/page/box/module_list_new.html?action=box_module_action&event_submit_do_query_module_list=true'
						}
						if(flag && flag === 'F') {
							toLibUrl = D.domain + '/page/box/personal_module_lib.html';
						}

						config = {
							'data' : formEl.serialize() + "&returnType=json",
							'url' : D.domain + '/page/box/json.html?_input_charset=utf-8',
							'toLibUrl' : toLibUrl,
							'editUrl' : D.domain + '/page/box/new_create_module.html',
							'callback' : function(json) {
								var key, flag, tasks = {}, type, id, autoGenPic = 0, url;
								//console.log(json);
								if(json) {
									autoGenPic = json.autoGenPic;
									if(autoGenPic == '1') {
										flag = json.flag;
										type = json.templateType;
										id = json.id;
										if(flag && (flag === 'F' || flag === 'f')) {
											key = type + '-' + id;
											url = D.domain + '/open/box_view_personal_lib.html?id=' + id + '&type=' + type;
										} else {
											if(type === 'pl_module') {
												type = 'module';
											}
											key = type + '-' + id;
											url = D.domain + '/open/box_view.html?id=' + id + '&type=' + type;
										}

										tasks[key] = {
											'size' : '170x-1',
											'url' : url
										};
										tasks[key]['id'] = 'content';
										//tasks[key]['class'] = 'cell-page-main';
										// console.log(tasks);
										FE.dcms.Capture.start(tasks, function(text) {
											console.log(text);
										});
									}

								}
							}
						};

						var submitComplete = new D.box.ui.SubmitComplete(config);
						submitComplete.init();
					} else {
						alert('Moduleδ����κ����ݣ�����Ӻ��ٱ��棡');
					}
				});
				//ע��ˢ���¼�
				$('.bar-a-refresh').bind('click', function(e) {
					e.preventDefault();
					var options = {};
					options['container'] = area;
					options['previewUrl'] = '/page/box/fresh_draft.html';
					options['target'] = $('#change_mod_width');
					options['callback'] = function() {
						D.ToolsPanel.addHtmlModuleGrids();
						initCheckRadio();
						initMicrolayout();
						editPage._hideAll();
						D.bottomAttr.resizeWindow();
					};
					D.refreshContent.refresh(options, doc);
				});
				//Ԥ����Ƶ�module����
				$('#dcms_box_grid_pre').click(function(e) {
					e.preventDefault();
					var newContent = D.sendContent.getContainerHtml(area);
					if(!!$.trim(newContent)) {
						$('#module-preview-content').val(newContent);
						$('#module-preview-form').submit();
					} else {
						alert('Moduleδ����κ����ݣ�����Ӻ���Ԥ����');
					}
				});

				/**
				 * ��ʼ��դ���Ⱥ�΢����
				 */
				D.BoxAttr.loadModuleGrids(doc);
				/* add by hongss on 2012.05.09 for ѡ��ߴ�� */
				initCheckRadio();

				//ע�ᡰդ��⡱�¼�
				$('.panel-nav').delegate('#change_mod_width', 'click', function(e) {
					D.ToolsPanel.addHtmlModuleGrids();
					initCheckRadio();
					initMicrolayout();
					editPage._hideAll();
					D.bottomAttr.resizeWindow();
				});

				//ע��radioѡ���¼�
				$('.list-module-width input:radio[name=radio-module-width]').live('change', function(e) {
					var mWidth = $(this).val();
					showModule(mWidth);
				});

				function initMicrolayout() {
					var microContainer = $('.edit-micro-layout .micro');
					if(microContainer.length > 0) {
						$('.micro-layout', microContainer).data(D.DropInPage.CONSTANTS.ELEMENT_DATA_HTML_CODE, D.ToolsPanel.MICRO_LAYOUT_HTML);
					}
				}

				//�ж��Ƿ��Ѿ���radio��ѡ��
				function initCheckRadio() {
					var widthRadioes = $('.list-module-width input:radio[name=radio-module-width]'), inputWidth = $('#module-width'), iWidth = inputWidth.val();
					if(!iWidth) {
						iWidth = '990';
					}
					//if(iWidth) {
					widthRadioes.each(function(i, radioEl) {
						radioEl = $(radioEl);
						if(parseInt(iWidth) === parseInt(radioEl.val())) {
							radioEl.attr('checked', 'checked');
							showModule(iWidth);
						}
					});
					//}
				}

				function showModule(mWidth) {
					var tipChoose = $('.tip-choose-width'), moduleContainer = $('#design-container', doc), inputWidth = $('#module-width'), viewWidth = $('#view-module-width');
					tipChoose.addClass('fd-hide');
					moduleContainer.removeClass('fd-hide');
					moduleContainer.width(mWidth);
					inputWidth.val(mWidth);
					viewWidth.val(mWidth);
				}

				// add by hongss on 2012.09.04 for �鿴Դ��
				var dialog = $('#cell-view-code');
				$('#dcms-box-view-code').click(function(e) {
					e.preventDefault();
					showModuleAttr(dialog);
					var code = D.sendContent.getContainerHtml(area);
					$('#cell-view-code .code-container').text(D.ManagePageDate.getModuleHtml(code));
				});

				$(' .close').click(function(e) {
					e.preventDefault();
					hideModuleAttr(dialog);
				});
				D.bottomAttr.resizeWindow();
			}
		});
		editPage.insertIframe();
		D.editPage = editPage;
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
		$('#panel_nav').delegate('button', 'click', function(event) {
			var target = $(this);
			D.editPage && D.editPage._hideAll();
			D.editModule && D.editModule._hideAll();
			if(target.attr('id') === 'cell_library') {
				var navCellParent = $('#nav_cell').parent();
				target.parent().hide();
				navCellParent.removeClass('current');
				navCellParent.siblings().removeClass('current');
				navCellParent.siblings().hide();
				$('.panel-edit-attr').hide();
				navCellParent.addClass('current');
				navCellParent.show();
				$('.panel-cell-content').show();

			}
		});
	},
	function() {
		// /108901 102484
		//D.box.datasource.Topic.queryBlocksByTopic(102484);
	}];

	function showModuleAttr(dialog) {
		$.use(['ui-dialog', 'ui-draggable'], function() {
			dialog.dialog({
				modal : false,
				shim : true,
				draggable : {
					handle : "header",
					containment : 'body'
				},
				fixed : true,
				center : true
			});
		});
	}

	function hideModuleAttr(dialog) {
		dialog.dialog('close');
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
