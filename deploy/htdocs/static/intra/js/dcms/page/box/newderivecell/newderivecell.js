/**
 * @author springyu
 * @userfor ����CELL����
 * @date 2011-12-21
 */

;(function($, D) {
	/**
	 * iframe margin-top �߶�
	 */
	var IFRAME_MARGIN_TOP = 40, formValid, area, formEl, inputClassName = $('#cell-classname'), attrDialog = $('div.cell-derive-attr');

	var readyFun = [

	/**
	 * ��ʼ��CELL��������
	 */
	function() {
		$('#page').html('�༭�ؼ�');
		//$('body:last').append('<div style="display:none;" id="settingDiv"></div>');
		$('#dcms_box_grid_pageattribute').bind('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			openCellAttrDialog();
		});

	},

	/**
	 * add by hongss on 2012.02.22
	 * ����cell���ݵ�iframe����̬����
	 */
	function() {
		var pageUrl = D.domain + '/page/box/cellContent.html', 
		//
		iframe = $('<iframe id="dcms_box_main" class="dcms-box-main" src="' + pageUrl + '" onload="FE.dcms.handleLoad(this)" />');

		$('div.dcms-box-center').html('').append(iframe);
	},
	function() {
		//��ǩǶ�ײ�tabҳ���¼���
		D.BoxAttr.bindEventLevelElem();
		//�����¼��
		D.bottomAttr.bind.init();
	}];

	/**
	 * @methed handleLoad iframe���سɹ���ִ��
	 * @param el ָ��iframe��dom�ڵ�
	 */
	D.handleLoad = function(el) {
		var iframeDoc = $(el.contentWindow.document), area = $('#content', iframeDoc), currentElem;

		D.highLightEl = $('#crazy-box-highlight-fix', iframeDoc);
		//���ڸ���
		//D.jsControlEl = $('#crazy-box-js-control', iframeDoc);   //����JSʧЧ������

		requestOriginCell(function(data) {//����ɹ�,
			var newClassName = data.className + '-' + data.sequence, isDerive = data.isDerive, htmlcode;
			if(isDerive && (isDerive === 'true' || isDerive === true)) {
				htmlcode = D.BoxTools.replaceClassName(data.content, data.className, newClassName);
				inputClassName.val(newClassName);
			} else {
				htmlcode = data.content;
				inputClassName.val(data.className);
			}

			//area.html(D.BoxTools.replaceClassName(data.content, data.className, newClassName));
			D.InsertHtml.init(htmlcode, area, 'html', iframeDoc);
			//�����Ƿ���ҪJSʧЧ
			var jsControl = new D.JsControl({
				inureBtn : $('#crazy-box-control-btn', iframeDoc),
				type : 'cell-content',
				iframeDoc : iframeDoc,
				callback:function(){
					$('#panel_tab').empty();
				}
			});
			 //��ʼ��cell�¿��ظ���ǩ�������ơ����ơ����ƹ���
        FE.dcms.box.editor.LabelMoveCopy.init(iframeDoc);
			area.bind('click', function(event) {
				event.preventDefault();
			})
			area.bind('mouseup', function(e) {
				var target = $(e.target);
				if(target[0] !== area[0]) {
					D.BoxTools.showHighLight(target);
					target = jsControl.add(target);
					$(document).trigger('box.panel.attribute.attr_handle_event', [target]);
					currentElem = target;
				}
			});

		}, function() {//����ʧ��
			area.html('���ݼ���ʧ�ܣ������ԣ�');
		});

		D.highLightEl.bind('mousedown', function(e) {
			D.BoxTools.hideHighLight();
		});

		//ɾ����ť�¼����
		$('.bar-a-delete').bind('click', function(e) {
			e.preventDefault();
			currentElem = delLable(currentElem, iframeDoc);
			D.BoxTools.hideHighLight();
		});

		//�ύ����cell
		$('#btnDraftSubmit').click(function(e) {
			e.preventDefault();
			var $cellId = $('#cell-cellid'), cellId = $cellId.val(), strHtml = area.html(),
			//
			flag = $('#flag').val(), isDerive = $('#is_derive').val(),
			//
			toLibUrl = '/page/box/cell_list_new.html?action=box_cell_action&event_submit_do_query_cell_list=true';

			if(!cellId || cellId == 0) {
				openCellAttrDialog();
				return;
			}
			if(!flag) {
				flag = 'F';
			}
			flag = flag.toUpperCase();
			if(flag === 'F') {
				toLibUrl = '/page/box/personal_lib.html?resource_type=pl_cell';
			}

			if($.trim(strHtml)) {
				var data = {
					action : 'BoxCellAction',
					event_submit_do_SaveDeriveCellByAjax : 'true',
					content : strHtml,
					cellId : cellId,
					isUpdateContent : true
				};
				if (flag==='T'&&isDerive==='false'){
					data = {
					action : 'BoxCellAction',
					event_submit_do_SaveCellByAjax : 'true',
					content : strHtml,
					cellId : cellId,
					isUpdateContent : true
				};
				}
				//console.log(data);
				//return;

					var config = {
						'data' : data,
						'url' : D.domain + '/page/box/json.html?_input_charset=utf-8',
						'toLibUrl' : D.domain + toLibUrl,
						'editUrl' : D.domain + '/page/box/new_derive_cell.html',
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
										if(type === 'pl_cell') {
											type = 'cell';
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
				//alert('Cell���ݻ�δ���أ����Ժ����ԣ�');
				D.Msg.error({
					message : 'Cell���ݻ�δ���أ����Ժ����ԣ�'
				});
			}
		});

		//Ԥ������cell
		$('#dcms_box_grid_pre').click(function(e) {
			e.preventDefault();
			var content = area.html();
			if($.trim(content)) {
				$('#cell-preview-content').val(content);
				$('#cell-preview-form').submit();
			} else {
				alert('Cell���ݻ�δ���أ����Ժ����ԣ�');
			}
		});

	};
	/**
	 * @methed requestOriginCell ����ȡ��ԭ��Cell��HTML���벢ִ����ز���
	 * @param elem ��Ҫɾ����Ԫ��
	 */
	function delLable(elem, doc) {
		var options = elem.data('boxoptions');
		if(options && D.BoxTools.parseOptions(options, ['ability', 'delete', 'enable']) === "true") {
			var editDelSteps = D.EditContent.editDel({
				'elem' : elem,
				'isEdit' : true,
				'doc' : doc
			});
			elem = null;
			D.BoxTools.setEdited({
				'param' : editDelSteps,
				'callback' : null
			});
		} else {
			alert('�˱�ǩ������ɾ����');
		}
		return elem;
	}

	/**
	 * @methed requestOriginCell ����ȡ��ԭ��Cell��HTML���벢ִ����ز���
	 */
	function requestOriginCell(success, error) {
		var params = $.unparam(location.href), url = D.domain + '/page/box/derive_cell_ajax.html', paramData = {};

		paramData['originid'] = params['originid'] || $('#cell-originid').val();
		paramData['cellid'] = params['cellid'] || $('#cell-cellid').val();
		paramData['flag'] = params['flag'] || $('#flag').val();
		paramData['isDerive'] = $('#is_derive').val();
		$.ajax({
			url : url,
			type : 'POST',
			data : paramData,
			success : function(o) {
				var data = $.parseJSON(o);

				if(data.msg === 'success') {
					if(success && $.isFunction(success) === true) {
						success.call(this, data);
					}
				} else {
					if(error && $.isFunction(error) === true) {
						error.call(this);
					}
				}

			},
			error : function() {
				if(error && $.isFunction(error) === true) {
					error.call(this);
				}
			}
		});
	}

	/**
	 * ���ԶԻ���
	 */
	var openCellAttrDialog = function() {
		var cellClassName = $('#cell-classname'), originId = $('#cell-originid'), cellId = $('#cell-cellid');
		var isDerive = false;

		if(!parseInt(cellId.val()) && parseInt(originId.val())) {
			isDerive = true;
		}
		D.SettingBoxCell.show({
			'cellClassName' : cellClassName.val(),
			'cellId' : parseInt(cellId.val()),
			'originId' : parseInt(originId.val()),
			'flag' : $('#flag').val() || 'F',
			'isDerive' : $('#is_derive').val()
		}, function(data) {
			$('#cell-cellid').val(data.id);
			//$('#cell-originid').val('');
			$('#is_derive').val(data.isDerive);
			$('#flag').val(data.flag);
		});
	};

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
