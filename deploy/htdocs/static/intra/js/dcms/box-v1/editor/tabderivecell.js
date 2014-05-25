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

	var readyFun = [];
	/**
	 * add by hongss on 2012.02.22
	 * 派生cell内容的iframe，动态插入
	 */
	D.cellLoad = function(obj) {
		var pageUrl = D.domain + '/page/box/cellContent.html', iframe = $('<iframe id="dcms_box_cell_main" class="dcms-box-main" src="' + pageUrl + '" />');

		$('div.dcms-box-cell-center').html('').append(iframe);
		$('iframe#dcms_box_cell_main').bind('load', function(event) {
			handleLoad.call(this, this, obj);
		});
	}
	/**
	 * @methed handleLoad iframe加载成功后执行
	 * @param el 指向iframe，dom节点
	 */
	var handleLoad = function(el, obj) {
		var iframeDoc = $(el.contentWindow.document), area = $('#content', iframeDoc), currentElem;

		D.highLightEl = $('#crazy-box-highlight-fix', iframeDoc);
		if(obj && obj.width) {
			area.css('width', parseInt(obj.width));
		}
		// if(obj && obj.height) {
		// area.css('height', parseInt(obj.height));
		//}
		//用于高亮
		//D.jsControlEl = $('#crazy-box-js-control', iframeDoc);   //用于JS失效与否控制

		var htmlcode = $('#cell_content').val();
		//console.log(htmlcode);
		//area.html(D.BoxTools.replaceClassName(data.content, data.className, newClassName));
		D.InsertHtml.init(htmlcode, area, 'html', iframeDoc);
		//zhuliqi
		//进入编辑模式下隐藏selectArea功能
		var selectArea = new D.selectArea();
		selectArea.hidePosition(iframeDoc);
        //监听是否需要JS失效
        var jsControl = new D.JsControl({
            inureBtn : $('#crazy-box-control-btn', iframeDoc),
            //type : 'crazy-box-cell',
            iframeDoc : iframeDoc,
            callback:function(){
            	$('#panel_tab').empty();
            }
        });
        
        //初始化cell下可重复标签允许上移、下移、复制功能
        FE.dcms.box.editor.LabelMoveCopy.init(iframeDoc);

        area.bind('click', function(e) {
            e.preventDefault();
        });
        area.bind('mouseup', function(e) {
            var target = $(e.target);
            if(target[0] !== area[0]) {
                //D.BoxTools.showHighLight(target); 
                //modify by hongss on 2012.01.08 for cell下可重复标签允许上移、下移、复制功能
                $(document).trigger('box.editor.label_move_copy', [target]);
                
                target = jsControl.add(target);
                //console.log(target);
                //D.showAttr(target);
                $(document).trigger('box.panel.attribute.attr_handle_event',[target]);
                currentElem = target;
            }
        });

		D.highLightEl.bind('mousedown', function(e) {
			D.BoxTools.hideHighLight();

		});

		//删除按钮事件添加
		$('.delete-label').live('click', function(e) {
			e.preventDefault();
			var $self = $(this), parent = $self.closest('.current');
			currentElem = parent.find('.e-elem').data('target');
			currentElem = delLable(currentElem, iframeDoc);
			D.BoxTools.hideHighLight();
			D.ToolsPanel.addHtmlLabel();
		});

		//提交cell
		$('#dcms_box_cell_submit').click(function(e) {
			e.preventDefault();
			var newContent = area.html();

			if(!!$.trim(newContent)) {
				var $oDiv = $('<div/>'), $module;
				D.InsertHtml.init(newContent, $oDiv, 'html', false);
				$module = $oDiv.find('.crazy-box-module');

				newContent = $module.html();
				//console.log(newContent);
				D.editModule.replaceElement(newContent, 'current-edit-module');

			}
		});

		//预览派生cell
		$('#dcms_box_cell_pre').click(function(e) {
			e.preventDefault();
			var content = area.html();
			if($.trim(content)) {
				$('#cell-preview-content').val(content);
				$('#cell-preview-form').submit();
			} else {
				alert('Cell数据还未加载，请稍后重试！');
			}
		});
		//保存控件到个人库
		$('#dcms_box_cell_save').bind('click', function(event) {
			//event.preventDefault();
			event.stopPropagation();
			var that = this;
			if(that.checked) {
				//D.settingBoxCell();
				var $cell = area.find('.crazy-box-cell'), fixClassName = D.BoxTools.getClassName($cell, /^cell-/),
				//
				$module = area.find('.crazy-box-module'),elemInfo = $cell.data('eleminfo')||{},
				//
				preClassName = D.BoxTools.getClassName($module, /^(cell-module$)|(cell-module-\d+$)/),html='';
				$cell.removeAttr('data-eleminfo');
				 html = $module.html();
				html = html.replace(new RegExp("." + preClassName, "gm"), ' ');
				$.post(D.domain + '/page/box/query_cell_sequence.html', {
					cellId : elemInfo.id
				}, function(text) {
					var json = $.parseJSON(text) || {};
					if(json && json.data && json.data.sequence) {
						var cellClassName = fixClassName + '-' + json.data.sequence;
						html = html.replace(new RegExp(fixClassName, "gm"), cellClassName);
						that.checked = false;
						//console.log(elemInfo.id);
						D.SettingBoxCell.show({
							'cellClassName' : cellClassName,
							//'originId' : elemInfo.id,
							'flag' : 'F',
							'content':html,
							'isDerive' : true
						});
					}

				});

			}
		});

		//“回撤”和“恢复”功能
		//D.PageOperateHistory.init(iframeDoc.find('body'));
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
