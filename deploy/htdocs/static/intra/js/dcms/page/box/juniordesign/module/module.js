/**
 * @author springyu
 * @userfor 派生CELL功能
 * @date 2011-12-21
 */

;(function($, D) {
	/**
	 * iframe margin-top 高度
	 */
	var IFRAME_MARGIN_TOP = 40, formValid, attrDialog = $('.js-module-dialog'), SYNC_MODULE = 'sync_module';

	var readyFun = [
	//设置公用区块属性
	function() {
		$('#dcms_box_grid_moduleattribute').bind('click', function(event) {
			event.preventDefault();
			D.showSettingAttr();
		});
	},

	/**
	 * add by hongss on 2012.02.14 for 拖拽元件、保存设计的module内容
	 * modify by hongss on 2012.02.22 for 保存/预览设计后的module内容
	 * modify by hongss on 2012.05.09 for 选择尺寸后
	 */
	function() {
		var pageUrlParam = getPageUrlParam(), editPage = new D.DropInPage({
			//pageUrl : D.domain + '/page/box/moduleContent.html',
			pageUrlParam : pageUrlParam,
			dropArea : '#design-container',
			status : 'edit-module',
			callback : function(doc) {
				var contentInput = $('#page_module_content'), content = contentInput.val(), area = $('#design-container', doc),
				//
				formEl = $('#module-submit-form'), $moduleId = $('#module-moduleid'),
				//
				opts = {}, data = {}, iconSuccess = $('.dcms-save-success');
				data['action'] = 'BoxDraftAction';
				data['event_submit_do_saveModuleDraft'] = true;
				opts['container'] = $('#design-container', doc);
				opts['moduleIdInput'] = $('#module-moduleid');
				opts['draftIdInput'] = $('#draftId');
				opts['data'] = data;
				opts['complete'] = function() {
					iconSuccess.show(200);
					setTimeout(function() {
						iconSuccess.hide(200);
					}, 1300);
				};
				opts['error'] = function(o) {
					if(o && (o.noPermission===true)) {
						D.Msg.error({
							timeout : 5000,
							message : '温馨提示:你没有权限编辑此页面!'
						});
					} else if(o && (o.lockedUser)){
						var tip='';
						if(o.internalUser){
							tip =o.lockedUser+'正在编辑此公用区块，你不能同时进行编辑！<br/>请联系<a href="http://work.alibaba-inc.com/work/search?keywords='+o.lockedUser+'&type=person" target="_blank">'+o.lockedUser+'</a>请他提交公用区块或关闭编辑器后你再继续编辑本公用区块!';
						} else {
							tip =o.lockedUser+'正在编辑此公用区块，你不能同时进行编辑！<br/>请联系'+o.lockedUser+'请他提交公用区块或关闭编辑器后你再继续编辑本公用区块!';
						}
						var $Dialog = $('.js-dialog');
						$('footer', $Dialog).show();
						$('.btn-submit', $Dialog).hide();
						$('.btn-cancel',$Dialog).html('我知道了');
						D.Msg.confirm({
							'title' : "提示",
							'body' : tip,
							//'noclose' : true,
							'close' : function(evt) {
								D.closeWin();
							}
						});
					} else {
						D.Msg.error({
							timeout : 3000,
							message : '温馨提示:十分抱歉，保存失败，请联系在线客服！'
						});
					}

				};
				//2013-04-02 组件初始化，把id设置正确,暂时放到服务端
				if (!!$.trim(content)) {
					D.InsertHtml.init(content, area, 'html', doc);
				}
				area.removeClass('fd-hide');
				var $width = $('#module-width');
				if ($width.val()) {
					area.css('width', $width.val() + 'px');
				} else {
					area.css('width', '990px');
				}

				//居中显示，为了不影响其他编辑器
				area.css('margin', '27px auto 0');

				var $module = doc.find('.crazy-box-module');
				//data-dsmoduleparam
				//加载专场区块数据源信息
				D.box.datasource.Topic.loadTopic($module);
				//提交设计的module内容
				$('#dcms_box_grid_submit').click(function(e) {
					e.preventDefault();
					var newContent = D.sendContent.getContainerHtml(area);
					if (!!$.trim(newContent)) {
						var htmlCode="<div class=\"dialog-content-text\">提交后，公用区块将被发布到线上，相关页面会收到该公用区块的升级提醒。<br/>请确认公用区块测试无误后，再提交发布！</div>";
						
						D.Msg['confirm']({
							'title' : '提示信息',
							'body' : '<div class="header-dialog-content">' + htmlCode + '</div>',
							'success' : function() {
								var submitDraft = function() {
									var $draftId = $('#draftId'), data = {
										action : 'PublicBlockAction',
										'event_submit_do_submitPublicBlock' : true,
										draftId : $draftId.val(),
										returnType : 'json'
									};
									D.submit(data);
								};
								opts['complete'] = submitDraft;
								D.sendContent.save(opts);
								
							}
						});
						
					} else {
						alert('Module未添加任何数据，请添加后再保存！');
					}
				});
				//注册刷新事件
				//$('.bar-a-refresh').bind('click', function(e) {
				$(document).on('refreshContent', function() {
					var options = {};
					options['container'] = area;
					options['previewUrl'] = '/page/box/fresh_draft.html';
					options['target'] = $('#change_mod_width');
					options['callback'] = function() {
						editPage._hideAll();
					};
					D.refreshContent.refresh(options, doc);
				});
				$('.bar-a-refresh').bind('click', function(e) {
					e.preventDefault();
					$(document).trigger('refreshContent');
				});
				//每隔5分钟自动保存
				setInterval(function() {

					D.sendContent.save(opts);
				}, 5 * 60 * 1000);

				//手动保存设计的页面内容
				$('#dcms_box_grid_save').click(function() {
					D.sendContent.save(opts);
				});
				//预览设计的module内容
				$('#dcms_box_grid_pre').click(function(e) {
					e.preventDefault();
					var newContent = D.sendContent.getContainerHtml(area);
					if (!!$.trim(newContent)) {
						newContent= D.BoxTools.handleDynamic(newContent);
						$('#module-preview-content').val(newContent);
						$('#module-preview-form').submit();
					} else {
						alert('Module未添加任何数据，请添加后再预览！');
					}
				});
				D.bottomAttr.resizeWindow();
			}
		});
		editPage.insertIframe();
		D.editPage = editPage;
	}];

	function getPageUrlParam() {
		var width = $('#module-width').val();
		//临时方案
		if (Number(width) === 1190) {
			return 'gridType=layoutH1190';
		} else {
			return 'gridType=layoutH990';
		}
	}

	$(function() {
		for (var i = 0, l = readyFun.length; i < l; i++) {
			try {
				readyFun[i]();
			} catch(e) {
				if ($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}
	});
})(dcms, FE.dcms);
