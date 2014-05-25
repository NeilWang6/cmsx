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
	//���ù�����������
	function() {
		$('#dcms_box_grid_moduleattribute').bind('click', function(event) {
			event.preventDefault();
			D.showSettingAttr();
		});
	},

	/**
	 * add by hongss on 2012.02.14 for ��קԪ����������Ƶ�module����
	 * modify by hongss on 2012.02.22 for ����/Ԥ����ƺ��module����
	 * modify by hongss on 2012.05.09 for ѡ��ߴ��
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
							message : '��ܰ��ʾ:��û��Ȩ�ޱ༭��ҳ��!'
						});
					} else if(o && (o.lockedUser)){
						var tip='';
						if(o.internalUser){
							tip =o.lockedUser+'���ڱ༭�˹������飬�㲻��ͬʱ���б༭��<br/>����ϵ<a href="http://work.alibaba-inc.com/work/search?keywords='+o.lockedUser+'&type=person" target="_blank">'+o.lockedUser+'</a>�����ύ���������رձ༭�������ټ����༭����������!';
						} else {
							tip =o.lockedUser+'���ڱ༭�˹������飬�㲻��ͬʱ���б༭��<br/>����ϵ'+o.lockedUser+'�����ύ���������رձ༭�������ټ����༭����������!';
						}
						var $Dialog = $('.js-dialog');
						$('footer', $Dialog).show();
						$('.btn-submit', $Dialog).hide();
						$('.btn-cancel',$Dialog).html('��֪����');
						D.Msg.confirm({
							'title' : "��ʾ",
							'body' : tip,
							//'noclose' : true,
							'close' : function(evt) {
								D.closeWin();
							}
						});
					} else {
						D.Msg.error({
							timeout : 3000,
							message : '��ܰ��ʾ:ʮ�ֱ�Ǹ������ʧ�ܣ�����ϵ���߿ͷ���'
						});
					}

				};
				//2013-04-02 �����ʼ������id������ȷ,��ʱ�ŵ������
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

				//������ʾ��Ϊ�˲�Ӱ�������༭��
				area.css('margin', '27px auto 0');

				var $module = doc.find('.crazy-box-module');
				//data-dsmoduleparam
				//����ר����������Դ��Ϣ
				D.box.datasource.Topic.loadTopic($module);
				//�ύ��Ƶ�module����
				$('#dcms_box_grid_submit').click(function(e) {
					e.preventDefault();
					var newContent = D.sendContent.getContainerHtml(area);
					if (!!$.trim(newContent)) {
						var htmlCode="<div class=\"dialog-content-text\">�ύ�󣬹������齫�����������ϣ����ҳ����յ��ù���������������ѡ�<br/>��ȷ�Ϲ������������������ύ������</div>";
						
						D.Msg['confirm']({
							'title' : '��ʾ��Ϣ',
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
						alert('Moduleδ����κ����ݣ�����Ӻ��ٱ��棡');
					}
				});
				//ע��ˢ���¼�
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
				//ÿ��5�����Զ�����
				setInterval(function() {

					D.sendContent.save(opts);
				}, 5 * 60 * 1000);

				//�ֶ�������Ƶ�ҳ������
				$('#dcms_box_grid_save').click(function() {
					D.sendContent.save(opts);
				});
				//Ԥ����Ƶ�module����
				$('#dcms_box_grid_pre').click(function(e) {
					e.preventDefault();
					var newContent = D.sendContent.getContainerHtml(area);
					if (!!$.trim(newContent)) {
						newContent= D.BoxTools.handleDynamic(newContent);
						$('#module-preview-content').val(newContent);
						$('#module-preview-form').submit();
					} else {
						alert('Moduleδ����κ����ݣ�����Ӻ���Ԥ����');
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
		//��ʱ����
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
