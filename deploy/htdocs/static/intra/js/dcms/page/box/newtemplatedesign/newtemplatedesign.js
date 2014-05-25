/**
 * @author springyu
 * @userfor 使用JS加载页面设计功能，页面操作功能
 * @date 2011-12-21
 */

;(function($, D) {
	/**
	 * iframe margin-top 高度
	 */
	var confirmEl = $('#dcms-message-confirm'), draftForm = $('#daftForm'), templateIdElm = draftForm.find('#templateId'), draftIdElm = draftForm.find('#draftId'), templateType = draftForm.find('#template_type'), statusType = 'edit-template', tType = templateType.val();
	var globalParams = $.unparam(location.href, '&'), from = globalParams.from;
	tType = tType || globalParams.templateType || globalParams.template_type;
	var readyFun = [
	function() {
		if(tType === 'pl_template') {
			$('#page span').text('模版编辑');
			if(from) {
				D.ToolsPanel.addHtmlLayoutList();
				D.toolsPanelLayoutList.init(1);
			}

			statusType = 'edit-template';
			//add by hongss on 2012.11.23 for 高亮头部当前菜单
			$('.page-header .menu-template').addClass('active');
		}
		if(tType === 'pl_layout') {
			$('#page span').text('布局编辑');
			D.ToolsPanel.addHtmlLayout();
			$('#change_background').parent().hide();
			D.toolsPanelLayout();
			statusType = 'edit-template-layout';
			//add by hongss on 2012.11.23 for 高亮头部当前菜单
			$('.page-header .menu-layout').addClass('active');
		}

	},
	/**
	 * add by hongss on 2012.02.10 for 拖拽元件、保存设计的页面内容
	 */
	function() {
		var editPage = new D.DropInPage({
			status : statusType,
			callback : function(doc) {
				var opts = {}, data = {}, iconSuccess = $('.dcms-save-success');
				data['action'] = 'BoxDraftAction';
				data['event_submit_do_saveTemplateDraft'] = true;
				opts['container'] = $('#design-container', doc);
				opts['pageIdInput'] = templateIdElm;
				opts['draftIdInput'] = draftIdElm;
				opts['templateTypeInput'] = templateType;
				opts['data'] = data;
				var content = $.trim($('#textarea-content').text());
				//q990变为h990栅格
				if(globalParams && globalParams.grids === 'h990') {
					content = D.BoxTools.q990ToH990(content);
				}
				////组件没有ID可配置项
				if(globalParams && globalParams.edit_attr === 'true') {
					content = D.BoxTools.addEditAttr(content);
				}
				opts['success'] = function(o) {
					setLocation(o);
					iconSuccess.show(200);
					setTimeout(function() {
						iconSuccess.hide(200);
					}, 1300);
				};
				opts['error'] = function(o) {
					if(o && parseInt(o.code) === parseInt(-200)) {
						D.Msg.error({
							timeout : 5000,
							message : '温馨提示:' + o.message
						});
					} else {
						D.Msg.error({
							timeout : 5000,
							message : '温馨提示:十分抱歉，保存失败，请联系在线客服！'
						});
					}
				};

				if(content) {
					//添加通栏处理
					content = D.ManagePageDate.handleBanner(content);
					//opts['container'].html(content);
					D.InsertHtml.init(content, opts['container'], 'html', doc);
				}
				//修复用户使用图片控件做banner，后又修改为使用module背景做，然而图片控件没删除，只是把图片的src为空了致使在IE上出现无图片提示的问题
				var $banner = $('#crazy-box-banner', doc);
				if($banner && $banner.length) {
					$('.cell-image', $banner).each(function(index, obj) {
						var _$self = $(this), $img = $('img', obj);
						if(!$img.attr('src')) {
							_$self.remove();
						}
					});
				}
				//end add by pingchun.yupc 2013-04-07

				//新建模版 提示框
				var $module = doc.find('.crazy-box-module');
				if(tType === 'pl_template' && $module.length === 1 && from) {
					if($.trim($module.children().html()) === '') {
						$('#change_background').parent().hide();
						var $tip = $('#content_tip'), $win = $(window), $winHeight = $win.height(), $winWidth = $win.width();
						$tip.show();
						$tip.css('left', $winWidth / 2);
						$tip.css('top', $winHeight / 2);
						$('.dcms-box-center', '#main_design_page').hide();

					}
				} else {
					D.box.panel.Nav.showGrids.apply(this, [{
						type : tType
					}]);
				}
				//data-dsmoduleparam
				//加载专场区块数据源信息
				D.box.datasource.Topic.loadTopic($module);

				//初始化“增加通栏导航”是否打勾
				D.initBannerNav(doc);
				D.initCurrentGrids(doc);

				//每隔5分钟自动保存
				setInterval(function() {
					saveDraft();
				}, 5 * 60 * 1000);
				//手动保存设计的页面内容
				$('#dcms_box_grid_save').click(function() {
					saveDraft();
				});
				//手动预览设计的页面内容
				$('#dcms_box_grid_pre').click(function() {
					//var options = {};
					// options['container'] = opts['container'];
					//options['pageIdInput'] = opts['pageIdInput'];
					//options['draftIdInput'] = opts['draftIdInput'];
					//options['form'] = draftForm;
					// options['content'] = $('#textarea-content');
					//options['previewUrl'] = '/page/box/preview_draft.html';
					opts['flag'] = $('#flag').val();
					opts['preType'] = 'template';
					opts['templateId'] = $('#templateId').val();
					opts['templateType'] = $('#template_type').val();

					D.sendContent.save(opts);
					//setTimeout(D.sendContent.review(options),100);
				});
				$('#dcms_box_style').bind('click', function(event) {
					event.preventDefault();
					var _$top = $('#qincheng_style_top', doc), _top = _$top && _$top.length ? _$top.html() : '',
					//
					_$footer = $('#qincheng_style_footer', doc), _footer = _$footer && _$footer.length ? _$footer.html() : '',
					//
					$boxDoc = $('#box_doc', doc);
					D.Msg['confirm']({
						'title' : '更换样式',
						'body' : '<div class="change_style"><div class="row"><span class="txt">顶部样式:</span><textarea id="style_top">' + _top + '</textarea></div><div class="row"><span class="txt">底部样式:</span><textarea id="style_footer">' + _footer + '</textarea></div></div>',
						'noclose' : true,
						'success' : function(evt) {
							var $changeStyle = $('.change_style', '.js-dialog')
							//
							_$topText = $('#style_top', $changeStyle),
							//
							_$footerText = $('#style_footer', $changeStyle);
							var reqcss = /(http:\/\/\S+.css)/g, reqjs = /(http:\/\/\S+.js)/g, _topText = _$topText.val() || '';
							var _cssTops = _topText.match(reqcss), _jsTops = _topText.match(reqjs);

							if(_$top && _$top.length) {
								_$top.empty();
								D.BoxTools.loadStyles(_cssTops, _$top);
								D.BoxTools.loadScripts(_jsTops, _$top);
							} else {
								var _$first = $('#crazy-box-banner', $boxDoc);
								if(!(_$first && _$first.length)) {
									_$first = $('.cell-page-grids-main', $boxDoc);
								}
								_$first.before('<span id="qincheng_style_top"></span>');
								D.BoxTools.loadStyles(_cssTops, $('#qincheng_style_top', doc));
								D.BoxTools.loadScripts(_jsTops, $('#qincheng_style_top', doc));
							}
							var _footerText = _$footerText.val() || '';
							var _cssFooters = _footerText.match(reqcss), jsFooters = _footerText.match(reqjs);
							if(_$footer && _$footer.length) {
								_$footer.empty();
								D.BoxTools.loadStyles(_cssFooters, _$footer);
								D.BoxTools.loadScripts(jsFooters, _$footer);
							} else {
								$('<span id="qincheng_style_footer"></span>').appendTo($boxDoc);
								D.BoxTools.loadStyles(_cssFooters, $('#qincheng_style_footer', doc));
								D.BoxTools.loadScripts(jsFooters, $('#qincheng_style_footer', doc));
							}
							evt.data.dialog.dialog('close');
						}
					});
				});
				// 提交模板
				$('#dcms_box_grid_submit').click(function() {
					// 页面ID是否为空
					var templateId = templateIdElm.val();
					if(!templateId) {

						D.showSettingDialog(function() {
							saveDraft(submitDraft);
						});

						return;
					}
					// 保存并提交草稿
					saveDraft(submitDraft);
				});

				// 保存草稿
				function saveDraft(callback) {
					opts['complete'] = callback;
					opts['flag'] = $('#flag').val();
					D.sendContent.save(opts);
				}

				// 提交草稿
				function submitDraft() {
					var draftId = draftIdElm.val();
					if(!draftId) {
						D.Message.confirm(confirmEl, {
							msg : '模板还未保存，请保存后再提交页面!',
							title : '提示'
						});
						return;
					}
					// draftForm.attr('target', '_self');
					//draftForm[0].action.value = 'BoxTemplateAction';
					// draftForm.find('#dcms-form-event-type').attr('name', 'event_submit_do_submit_template');
					//draftForm.submit();
					/**模版 布局提交方法*/

					D.submitSuccess();

				}


				$('#switch_editor').bind('click', function(event) {
					event.preventDefault();
					var that = this, $self = $(this), editor = $self.data('editor'), $DraftId, $templateType, $flag, params = '';

					if(editor === 'senior') {
						$('#dcms_box_grid_save').trigger('click');
						$DraftId = $('#draftId');
						if($DraftId.val()) {
							params += '&draftId=' + $DraftId.val();
						}
						$templateType = $('#template_type');
						if($templateType.val()) {
							params += '&templateType=' + $templateType.val();
						}
						$flag = $('#flag');
						if($flag.val()) {
							params += '&flag=' + $flag.val();
						}
						window.location = D.domain + "/page/box/new_template_design.html?extParam=isYunYing:true" + params;

					}

				});

				//注册刷新事件
				var refreshCon = $('#design-container', doc);
				$('.bar-a-refresh').bind('click', function(e) {
					var options = {};
					options['container'] = refreshCon;
					options['previewUrl'] = '/page/box/fresh_draft.html';
					options['target'] = $('#change_page_grids');
					options['callback'] = function() {
						var target = $(this);
						D.editPage && D.editPage._hideAll();
						D.editModule && D.editModule._hideAll();
						D.box.panel.Nav.showGrids.apply(this, [{
							type : tType
						}]);
						//初始化“增加通栏导航”是否打勾
						D.initBannerNav(doc);
						D.initCurrentGrids(doc);
					};
					D.refreshContent.refresh(options, doc);
				});
				$('#dcms_box_clear_error').bind('click',function(event){
					var $self = $(this);
					 D.cleanError(doc);
				});
			}
		});
		editPage.insertIframe();

		D.editPage = editPage;
	},
	function() {
		$('#panel_nav').delegate('#change_page_grids', 'click', function(event) {
			var target = $(this);
			D.editPage && D.editPage._hideAll();
			D.editModule && D.editModule._hideAll();
			D.box.panel.Nav.showGrids.apply(this, [{
				type : tType
			}]);
			//初始化“增加通栏导航”是否打勾
			D.initBannerNav(D.editPage.iframeDoc);
			D.initCurrentGrids(D.editPage.iframeDoc);
			D.errorCheck(D.editPage.iframeDoc);
		});
		// 更换模版 更换页面背景事件 控件
		$('#panel_nav').delegate('#cell_library', 'click', function(event) {
			var target = $(this);
			D.editPage && D.editPage._hideAll();
			D.editModule && D.editModule._hideAll();
			D.box.panel.Nav.showCellLibrary.apply(this);

		});
		$('#panel_nav').delegate('#change_template', 'click', function(event) {
			var target = $(this);
			D.editPage && D.editPage._hideAll();
			D.editModule && D.editModule._hideAll()
			D.ToolsPanel.addHtmlLayoutList();
			$('#change_background').parent().show();
			$('#change_page_grids').parent().show();
			$('#change_template').parent().hide();
			D.toolsPanelLayoutList.init(1);
			D.bottomAttr.resizeWindow();

		});
		$('#panel_nav').delegate('#change_background', 'click', function(event) {
			var target = $(this);
			D.editPage && D.editPage._hideAll();
			D.editModule && D.editModule._hideAll();
			D.box.panel.Nav.showBackground.apply(this, [{
				editPage : D.editPage,
				type : tType
			}]);

			return;

		});
		//标签嵌套层tab页面事件绑定
		D.BoxAttr.bindEventLevelElem();
		//属性事件邦定
		D.bottomAttr.bind.init();
	}];

	/**
	 * @author zhaoyang
	 * 设置页面参数
	 */
	function setLocation(o) {
		if(location.search.indexOf('draftId=') == -1) {
			try {
				var obj = $.unparam(location.href, '&');
				//console.log(obj);
				//这里o.pageId其实是模板Id
				history.pushState(o, null, D.domain + '/page/box/new_template_design.html?template_type=' + obj.template_type + '&draftId=' + o.draftId + (o.pageId ? '&templateId=' + o.pageId : '') + (obj.flag ? '&flag=' + obj.flag : ''));
			} catch(e) {
			}
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
