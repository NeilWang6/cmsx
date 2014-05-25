/**
 * @author springyu
 * @userfor ʹ��JS����ҳ����ƹ��ܣ�ҳ���������
 * @date 2011-12-21
 */

;(function($, D) {
	/**
	 * iframe margin-top �߶�
	 */
	var confirmEl = $('#dcms-message-confirm'), draftForm = $('#daftForm'), templateIdElm = draftForm.find('#templateId'), draftIdElm = draftForm.find('#draftId'), templateType = draftForm.find('#template_type'), statusType = 'edit-template', tType = templateType.val();
	var globalParams = $.unparam(location.href, '&'), from = globalParams.from;
	tType = tType || globalParams.templateType || globalParams.template_type;
	var q952 = {
		'className' : 'w968',
		'class' : 'dcms-crazy-box-q952',
		'layoutType' : 'layout',
		'link' : '/static/fdevlib/css/fdev-v4/core/fdev-float.css'
	}, q990 = {
		'className' : 'screen',
		'class' : 'dcms-crazy-box-q990',
		'layoutType' : 'layoutQ990',
		'link' : '/static/fdevlib/css/fdev-v4/core/fdev-wide.css'
	}, h990 = {
		'className' : 'screen',
		'class' : 'dcms-crazy-box-h990',
		'layoutType' : 'layoutH990',
		'link' : '/static/fdevlib/css/fdev-v4/core/fdev-op.css'
	}, readyFun = [

	/**
	 * add by hongss on 2012.02.10 for ��קԪ����������Ƶ�ҳ������
	 */
	function() {
		var pageUrlParam = D.box.editor.getLayoutParam(),
        editPage = new D.DropInPage({
            pageUrlParam : pageUrlParam,
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
							message : '��ܰ��ʾ:' + o.message
						});
					} else {
						D.Msg.error({
							timeout : 5000,
							message : '��ܰ��ʾ:ʮ�ֱ�Ǹ������ʧ�ܣ�����ϵ���߿ͷ���'
						});
					}
				};

				if(content) {
					//���ͨ������
					content = D.ManagePageDate.handleBanner(content);
					//opts['container'].html(content);
					D.InsertHtml.init(content, opts['container'], 'html', doc);
				}
				//�޸��û�ʹ��ͼƬ�ؼ���banner�������޸�Ϊʹ��module��������Ȼ��ͼƬ�ؼ�ûɾ��ֻ�ǰ�ͼƬ��srcΪ������ʹ��IE�ϳ�����ͼƬ��ʾ������
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

				//�½�ģ�� ��ʾ��
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
				}
				var $module = doc.find('.crazy-box-module'), $content = $('#content', doc), $link = $('#crazy-box-fdev', doc);
				if($content.hasClass(h990['class'])) {
					$link.attr('href', h990['link']);
				}
				if($content.hasClass(q990['class'])) {
					$link.attr('href', q990['link']);
				}
				if($content.hasClass(q952['class'])) {
					$link.attr('href', q952['link']);
				}
				//data-dsmoduleparam
				//����ר��������Դ��Ϣ
				D.box.datasource.Topic.loadTopic($module);
				var $extParam = $('#ext_param'), reqTopicId = /topicId:([0-9]+)/;
				var dataList = reqTopicId.exec($extParam.val()), topicId = dataList && dataList[1];

				if(topicId) {
					D.box.datasource.YunYing.handleBlockId($module, topicId);
				}

				//D.box.editor.Grid.initCurrentGrids(doc);

				//ÿ��5�����Զ�����
				setInterval(function() {
					saveDraft();
				}, 5 * 60 * 1000);
				//�ֶ�������Ƶ�ҳ������
				$('#dcms_box_grid_save').click(function() {
					saveDraft();
				});
				//�ֶ�Ԥ����Ƶ�ҳ������
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

				// �ύģ��
				$('#dcms_box_grid_submit').click(function() {
					// ҳ��ID�Ƿ�Ϊ��
					var templateId = templateIdElm.val();
					if(!templateId) {

						D.showSettingDialog(function() {
							saveDraft(submitDraft);
						});

						return;
					}
					// ���沢�ύ�ݸ�
					saveDraft(submitDraft);
				});

				// ����ݸ�
				function saveDraft(callback) {
					opts['complete'] = callback;
					opts['flag'] = $('#flag').val();
					D.sendContent.save(opts);
				}

				// �ύ�ݸ�
				function submitDraft() {
					var draftId = draftIdElm.val();
					if(!draftId) {
						D.Message.confirm(confirmEl, {
							msg : 'ģ�廹δ���棬�뱣������ύҳ��!',
							title : '��ʾ'
						});
						return;
					}
					// draftForm.attr('target', '_self');
					//draftForm[0].action.value = 'BoxTemplateAction';
					// draftForm.find('#dcms-form-event-type').attr('name', 'event_submit_do_submit_template');
					//draftForm.submit();
					/**ģ�� �����ύ����*/
					var $tSubmit = $('#dcms_box_grid_submit');
					$tSubmit.unbind();
					$tSubmit.removeClass('btn-blue');
					$tSubmit.addClass('btn-disabled');
					D.submitSuccess();

				}

				$(document).on('refreshContent', function() {
					//ע��ˢ���¼�
					var refreshCon = $('#design-container', doc), options = {};
					options['container'] = refreshCon;
					options['previewUrl'] = '/page/box/fresh_draft.html';
					options['renderType'] = $('#preType').val();
					D.refreshContent.refresh(options, doc);
				});
				$('.bar-a-refresh').bind('click', function(e) {
					$(document).trigger('refreshContent');
				});
				$('#switch_editor').bind('click', function(event) {
					event.preventDefault();
					var that = this, $self = $(this), editor = $self.data('editor'), $DraftId, $templateType, $flag, params = '';

					if(editor === 'junior') {
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
						window.location = D.domain + "/page/box/new_template_design.html?extParam=isYunYing:false" + params;

					}

				});
                //����ҳ�汳��
                $('#dcms_box_page_background').bind('click', function(event) {
					event.preventDefault();
					D.BoxAttr.loadPageBackground(doc);
				});
				//չʾ�ײ����դ����
				$('.js-bottom-grid', doc).show();
			},
            status: 'template'
		});
		editPage.insertIframe();

		D.editPage = editPage;
	},
	function() {
		$(window).scroll(auto);
		$(window).resize(auto);
		setTimeout(auto, 50);
		D.YunYing.bind.init('.js-dialog');
	}];

	var auto = function() {
		var docIframe = $('iframe#dcms_box_main'), $win = $(window);
		$('.dcms-box-body').css('width', '100%');
		docIframe.css('height', $win.height() - $('#operation_area').outerHeight(true) - $('#main_design_page .design-more').height());
	}
	/**
	 * @author zhaoyang
	 * ����ҳ�����
	 */
	function setLocation(o) {
		if(location.search.indexOf('draftId=') == -1) {
			try {
				var obj = $.unparam(location.href, '&');
				//console.log(obj);
				//����o.pageId��ʵ��ģ��Id
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
