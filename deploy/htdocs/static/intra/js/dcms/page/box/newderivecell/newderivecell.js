/**
 * @author springyu
 * @userfor 派生CELL功能
 * @date 2011-12-21
 */

;(function($, D) {
	/**
	 * iframe margin-top 高度
	 */
	var IFRAME_MARGIN_TOP = 40, formValid, area, formEl, inputClassName = $('#cell-classname'), attrDialog = $('div.cell-derive-attr');

	var readyFun = [

	/**
	 * 初始化CELL属性设置
	 */
	function() {
		$('#page').html('编辑控件');
		//$('body:last').append('<div style="display:none;" id="settingDiv"></div>');
		$('#dcms_box_grid_pageattribute').bind('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			openCellAttrDialog();
		});

	},

	/**
	 * add by hongss on 2012.02.22
	 * 派生cell内容的iframe，动态插入
	 */
	function() {
		var pageUrl = D.domain + '/page/box/cellContent.html', 
		//
		iframe = $('<iframe id="dcms_box_main" class="dcms-box-main" src="' + pageUrl + '" onload="FE.dcms.handleLoad(this)" />');

		$('div.dcms-box-center').html('').append(iframe);
	},
	function() {
		//标签嵌套层tab页面事件绑定
		D.BoxAttr.bindEventLevelElem();
		//属性事件邦定
		D.bottomAttr.bind.init();
	}];

	/**
	 * @methed handleLoad iframe加载成功后执行
	 * @param el 指向iframe，dom节点
	 */
	D.handleLoad = function(el) {
		var iframeDoc = $(el.contentWindow.document), area = $('#content', iframeDoc), currentElem;

		D.highLightEl = $('#crazy-box-highlight-fix', iframeDoc);
		//用于高亮
		//D.jsControlEl = $('#crazy-box-js-control', iframeDoc);   //用于JS失效与否控制

		requestOriginCell(function(data) {//请求成功,
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
			//监听是否需要JS失效
			var jsControl = new D.JsControl({
				inureBtn : $('#crazy-box-control-btn', iframeDoc),
				type : 'cell-content',
				iframeDoc : iframeDoc,
				callback:function(){
					$('#panel_tab').empty();
				}
			});
			 //初始化cell下可重复标签允许上移、下移、复制功能
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

		}, function() {//请求失败
			area.html('数据加载失败，请重试！');
		});

		D.highLightEl.bind('mousedown', function(e) {
			D.BoxTools.hideHighLight();
		});

		//删除按钮事件添加
		$('.bar-a-delete').bind('click', function(e) {
			e.preventDefault();
			currentElem = delLable(currentElem, iframeDoc);
			D.BoxTools.hideHighLight();
		});

		//提交派生cell
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
				//alert('Cell数据还未加载，请稍后重试！');
				D.Msg.error({
					message : 'Cell数据还未加载，请稍后重试！'
				});
			}
		});

		//预览派生cell
		$('#dcms_box_grid_pre').click(function(e) {
			e.preventDefault();
			var content = area.html();
			if($.trim(content)) {
				$('#cell-preview-content').val(content);
				$('#cell-preview-form').submit();
			} else {
				alert('Cell数据还未加载，请稍后重试！');
			}
		});

	};
	/**
	 * @methed requestOriginCell 请求取回原生Cell的HTML代码并执行相关操作
	 * @param elem 需要删除的元素
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
			alert('此标签不允许删除！');
		}
		return elem;
	}

	/**
	 * @methed requestOriginCell 请求取回原生Cell的HTML代码并执行相关操作
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
	 * 属性对话框
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
