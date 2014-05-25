/**
 * @author springyu
 * @userfor ʹ��JS����ҳ����ƹ��ܣ�ҳ���������
 * @date 2011-12-21
 */

;(function($, D) {

	var $from = $('#from'), from = $from.val() || 'edit-page';
	var globalParams = $.unparam(location.href, '&');
	var readyFun = [
	function() {
		$('#page span').text('ҳ��༭');
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
	 * add by hongss on 2012.02.10 for ��קԪ����������Ƶ�ҳ������
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
					// ����ҳ�����
					o && setLocation(o);
					// ԭ��ֻ��Ҫ����һ��
					$('#prototype').val('');
				};
				opts['error'] = function(o) {
					if(o && parseInt(o.code) === parseInt(-200)) {
						D.Msg.error({
							timeout : 5000,
							message : '��ܰ��ʾ:' + o.message
						});
					} else {
						D.Msg.error({
							timeout : 5000,
							message : '��ܰ��ʾ:ʮ�ֱ�Ǹ������ʧ�ܣ�����ϵ���߿ͷ���'
						});
					}

				};

				content = $('#textarea-content').text();
				//q990��Ϊh990դ��
				if(globalParams && globalParams.grids === 'h990') {
					content = D.BoxTools.q990ToH990(content);
				}
				//���û��ID��������
				if(globalParams && globalParams.edit_attr === 'true') {
					// console.log('aaa');
					content = D.BoxTools.addEditAttr(content);
				}
				
				//opts['previewUrl'] = '/page/open/preview_box_page.html';
				//��ʼ��ʱ��ҳ�����������
				if($.trim(content)) {
					//���ͨ������
					content = D.ManagePageDate.handleBanner(content);
					D.InsertHtml.init(content, opts['container'], 'html', doc);
					/*zhuliqi����ʱ����Ϲ��ܱ�ǩ*/
					var selectArea  = new D.selectArea();
					selectArea.addItemLink(doc.find('div.image-maps-conrainer'));
					//���¼���ȷ�����л���ʱ��ɾ�����õ�ALINK
					selectArea._makeSure(doc);
					//ҳ���ʼ��ʱ����Ԫ��
					doc.find('.chagenTarget').hide();
					doc.find('.position-conrainer').show().css('z-index','0').find('.map-position').show();
				}
				var $module = doc.find('.crazy-box-module');
				//�޸��û�ʹ��ͼƬ�ؼ���banner�������޸�Ϊʹ��module��������Ȼ��ͼƬ�ؼ�ûɾ����ֻ�ǰ�ͼƬ��srcΪ������ʹ��IE�ϳ�����ͼƬ��ʾ������
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
				//����ר����������Դ��Ϣ
				D.box.datasource.Topic.loadTopic($module);

				//��ʼ��������ͨ���������Ƿ��
				D.initBannerNav(doc);
				D.initCurrentGrids(doc);

				//ÿ��5�����Զ�����
				setInterval(function() {
					opts['isReview'] = false;
					D.sendContent.save(opts);
				}, 5 * 60 * 1000);

				//�ֶ�������Ƶ�ҳ������
				$('#dcms_box_grid_save').click(function() {
					opts['isReview'] = false;
					D.sendContent.save(opts, doc);
				});
				/*zhuliqi:��������Ժ���ʾ��ɫ,����Ⱦ���ܱ༭����ɫ*/
				var select = new D.selectArea();
				select._define_css($('#dcms_box_main').contents());
				/*end:zhuliqi*/
				//�ֶ�Ԥ����Ƶ�ҳ������
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
					/*zhuliqi:�����ʽ*/
			
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
						'title' : '������ʽ',
						'body' : '<div class="change_style"><div class="row"><span class="txt">������ʽ:</span><textarea id="style_top">' + _top + '</textarea></div><div class="row"><span class="txt">�ײ���ʽ:</span><textarea id="style_footer">' + _footer + '</textarea></div></div>',
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
                
                //add by hongss on 2013.07.18 for �½�ʱ��������ҳ������
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
					var msgTitle = '����δ����ҳ������';
					// if($('#is-from-topic').val() == "true") {
					//	msgTitle = 'ר���ҳ�棬�Ƿ�����ҳ������';
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

				//ע��ˢ���¼�
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
						//��ʼ��������ͨ���������Ƿ��
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
					 * ��ʼ��ҳ�汳������
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
			//��ʼ��������ͨ���������Ƿ��
			D.initBannerNav(D.editPage.iframeDoc);
			D.initCurrentGrids(D.editPage.iframeDoc);
			D.errorCheck(D.editPage.iframeDoc);
		});
		// ����ģ�� ����ҳ�汳���¼� �ؼ�
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
		//��ǩǶ�ײ�tabҳ���¼���
		D.BoxAttr.bindEventLevelElem();
		//�����¼��
		D.bottomAttr.bind.init();
	}

	/*,
	 function (){
	 //ˢ�°�ť�¼����
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
	 * ����ҳ�����
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
