/**
 * @author springyu
 * @userfor 使用JS加载页面设计功能，页面操作功能
 * @date 2011-12-21
 */

;(function($, D) {

	var $from = $('#from'), from = $from.val() || 'edit-page';
	var globalParams = $.unparam(location.href, '&');
	var readyFun = [
	function() {
		$('#page span').text('页面编辑');
		if(from === 'edit-page') {
			D.box.panel.Nav.showGrids.apply(this, [{
				type : 'page',
				from : from
			}]);
		} else {
			var fromArray = from.split('_');
			if(fromArray&&fromArray.length > 1) {
				//camelCase
				from = fromArray[0] + fromArray[1].substring(0, 1).toUpperCase() + fromArray[1].substring(1);
				$from.val(from);

			}

		}
	},

	/**
	 * add by hongss on 2012.02.10 for 拖拽元件、保存设计的页面内容
	 */
	function() {
		var editPage = new D.DropInPage({
			status : from,
			callback : function(doc) {
				var opts = {}, data = {}, content, iconSuccess = $('.dcms-save-success'), draftForm = $('#daftForm'), confirmEl = $('#dcms-message-confirm');

				data['action'] = 'BoxDraftAction';
				data['event_submit_do_savePageDraft'] = true;
				opts['container'] = $('#design-container', doc);
				opts['pageIdInput'] = $('#pageId');
				opts['draftIdInput'] = $('#draftId');
				opts['prototypeInput'] = $('#prototype');
				opts['data'] = data;
				opts['complete'] = function() {
					iconSuccess.show(200);
					setTimeout(function() {
						iconSuccess.hide(200);
					}, 1300);
				};
				opts['success'] = function(o) {
					// 设置页面参数
					o && setLocation(o);
					// 原型只需要保存一次
					$('#prototype').val('');
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

				content = $('#textarea-content').text();
				//q990变为h990栅格
				if(globalParams && globalParams.grids === 'h990') {
					content = D.BoxTools.q990ToH990(content);
				}
				//组件没有ID可配置项
				if(globalParams && globalParams.edit_attr === 'true') {
					// console.log('aaa');
					content = D.BoxTools.addEditAttr(content);
				}
				
				//opts['previewUrl'] = '/page/open/preview_box_page.html';
				//初始化时往页面中填充内容
				if($.trim(content)) {
					//添加通栏处理
					content = D.ManagePageDate.handleBanner(content);
					D.InsertHtml.init(content, opts['container'], 'html', doc);
					/*zhuliqi加载时添加上功能标签*/
					var selectArea  = new D.selectArea();
					selectArea.addItemLink(doc.find('div.image-maps-conrainer'));
					//绑定事件，确认在切换的时候删除无用的ALINK
					selectArea._makeSure(doc);
					//页面初始化时隐藏元素
					doc.find('.chagenTarget').hide();
					doc.find('.position-conrainer').show().css('z-index','0').find('.map-position').show();
				}
				var $module = doc.find('.crazy-box-module');
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
				//data-dsmoduleparam
				//加载专场区块数据源信息
				D.box.datasource.Topic.loadTopic($module);

				//初始化“增加通栏导航”是否打勾
				D.initBannerNav(doc);
				D.initCurrentGrids(doc);

				//每隔5分钟自动保存
				setInterval(function() {
					opts['isReview'] = false;
					D.sendContent.save(opts);
				}, 5 * 60 * 1000);

				//手动保存设计的页面内容
				$('#dcms_box_grid_save').click(function() {
					opts['isReview'] = false;
					D.sendContent.save(opts, doc);
				});
				/*zhuliqi:加载完成以后显示颜色,不渲染功能编辑的颜色*/
				var select = new D.selectArea();
				select._define_css($('#dcms_box_main').contents());
				/*end:zhuliqi*/
				//手动预览设计的页面内容
				$('#dcms_box_grid_pre').click(function() {
					//opts['isReview'] = true;
					//D.SaveDesign.init(opts);
					// var options = {};
					// options['container'] = opts['container'];
					//options['pageIdInput'] = opts['pageIdInput'];
					//options['draftIdInput'] = opts['draftIdInput'];
					//options['form'] = draftForm;
					//options['content'] = $('#textarea-content');
					//options['previewUrl'] = '/page/open/preview_box_page.html';
					// D.sendContent.review(options);
					//opts['flag']=$('#flag').val();
					/*zhuliqi:清除样式*/
			
					//opts['container'] = $('#design-container', doc);
					/*zhuliqi*/
					opts['preType'] =$('#preType').val();
					opts['pageId'] = $('#pageId').val();
					opts['from'] = $('#from').val();

					D.sendContent.save(opts);
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
				$('#dcms_box_edit_src').bind('click', function(event) {
					event.preventDefault();
					opts['isReview'] = false;
					opts['complete'] = function(json) {
						var $from = $('#from');
						window.location = D.domain + '/page/box/edit_page_src.html?draftId=' + opts['draftIdInput'].val() + "&from=" + $from.val();
					}
					D.sendContent.save(opts, doc);

				});
                
                //add by hongss on 2013.07.18 for 新建时必须先填页面属性
                var pageId = opts['pageIdInput'].val();
                if (!pageId){
                    D.showSettingDialog(null, function(){
                        $('#settingDiv').find('.close, .btn-cancel').hide();
                    });
                }
                //end
                
				$('#dcms_box_grid_submit').click(function() {
					$(document).trigger('changeSaveEvent');
					
					// console.log(opts['pageIdInput']);
					var msgTitle = '您还未设置页面属性';
					// if($('#is-from-topic').val() == "true") {
					//	msgTitle = '专场活动页面，是否设置页面属性';
					// }
					if(!pageId) {
						D.showSettingDialog(saveDraft);
						return;
					}

					saveDraft();

				});

				function submitDraft() {
					draftForm[0].action.value = 'PageManager';
					draftForm.find('#dcms-form-event-type').attr('name', 'event_submit_do_submitBoxPage');
					draftForm.attr('target', '_self');
					draftForm.attr('action', '');
					//var data=$('#page-setting #js-save-page').serialize();

					draftForm.submit();
				}

				function saveDraft() {
					opts['isReview'] = false;
					opts['complete'] = submitDraft;
					D.sendContent.save(opts);
				}

				//注册刷新事件
				var refreshCon = $('#design-container', doc);
				$('.bar-a-refresh').bind('click', function(e) {
					var options = {};
					options['container'] = refreshCon;
					options['previewUrl'] = '/page/box/fresh_draft.html';
					options['renderType'] = $('#preType').val();
					options['target'] = $('#change_page_grids');
					options['callback'] = function() {
						D.editPage && D.editPage._hideAll();
						D.editModule && D.editModule._hideAll();
						D.box.panel.Nav.showGrids.apply(this, [{
							type : 'page',
							from : from
						}]);
						//初始化“增加通栏导航”是否打勾
						D.initBannerNav(doc);
						D.initCurrentGrids(doc);
					};
					D.refreshContent.refresh(options, doc);
				});
				$('#switch_editor').bind('click',function(event){
					event.preventDefault();
					var that = this,$self=$(this),editor=$self.data('editor'),$DraftId = $('#draftId');
					if(editor==='senior'){
						$('#dcms_box_grid_save').trigger('click');
						if($DraftId.val()){
							window.location=D.domain+"/page/box/new_page_design.html?extParam=isYunYing:true&draftId="+$DraftId.val();
						} else {
							window.location=D.domain+"/page/box/new_page_design.html?extParam=isYunYing:true";
						}
						
					}
					
				});
				if(from === 'specialTools') {
					/**
					 * 初始化页面背景属性
					 */
					var loadpb = (function() {
						D.ToolsPanel.addHtmlTemplate();
						$('#change_background').parent().show();
						$('#change_template').parent().hide();
						$('#panel_tab').data('pageid', opts['pageId'] || $('#pageId').val());
						D.showTemplate({
							'page' : 1,
							'pageId' : opts['pageId'] || $('#pageId').val()
						});
					});
					window.setTimeout(loadpb, 500);
				}
				
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
		if(from !== 'specialTools') {
			var docIframe = $('iframe#dcms_box_main');
			docIframe.bind('load', function() {
				$('.bar-a-refresh').click();
			});
		}
	},
	function() {
		$('#panel_nav').delegate('#change_page_grids', 'click', function(event) {
			var target = $(this);
			D.editPage && D.editPage._hideAll();
			D.editModule && D.editModule._hideAll();
			D.box.panel.Nav.showGrids.apply(this, [{
				type : 'page',
				from : from
			}]);
			//初始化“增加通栏导航”是否打勾
			D.initBannerNav(D.editPage.iframeDoc);
			D.initCurrentGrids(D.editPage.iframeDoc);
			D.errorCheck(D.editPage.iframeDoc);
		});
		// 更换模版 更换页面背景事件 控件
		$('#panel_nav').delegate('button', 'click', function(event) {
			var target = $(this);
			D.editPage && D.editPage._hideAll();
			D.editModule && D.editModule._hideAll();
			if(target.attr('id') === 'change_template') {
				D.ToolsPanel.addHtmlTemplate();
				$('#change_background').parent().show();
				$('#change_page_grids').parent().show();
				$('#change_template').parent().hide();
				//console.log($('#panel_tab').data('pageid'));
				D.showTemplate({
					'page' : 1,
					'pageId' : $('#panel_tab').data('pageid')
				});
				return;
			}
			if(target.attr('id') === 'change_background') {
				D.box.panel.Nav.showBackground.apply(this, [{
					editPage : D.editPage,
					type : 'page',
					from : from
				}]);

				return;
			}
			if(target.attr('id') === 'cell_library') {
				D.box.panel.Nav.showCellLibrary.apply(this);

			}
		});
		//标签嵌套层tab页面事件绑定
		D.BoxAttr.bindEventLevelElem();
		//属性事件邦定
		D.bottomAttr.bind.init();
	}

	/*,
	 function (){
	 //刷新按钮事件添加
	 var docIframe = $('iframe#dcms_box_main');
	 //docIframe.bind('load',function(){
	 var doc = docIframe.contents();
	 var opts = {};
	 opts['container'] = $('#design-container', doc);
	 $('.bar-a-refresh').bind('click', function(e){
	 var options = {};
	 options['container'] = opts['container'];
	 options['previewUrl'] = '/page/box/fresh_draft.html';
	 D.refreshContent.refresh(options,doc);
	 //           });

	 });

	 //
	 }*/
	];

	/**
	 * @author zhaoyang
	 * 设置页面参数
	 */
	function setLocation(o) {
		if(location.search.indexOf('draftId=') == -1) {
			try {
				var obj = $.unparam(location.href, '&');
				var from = obj.from || $('#from').val();
				history.pushState(o, null, D.domain + '/page/box/new_page_design.html?from=' + from + '&draftId=' + o.draftId + (o.pageId ? '&pageId=' + o.pageId : ''));
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
