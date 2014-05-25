/**
 * @author springyu
 * @userfor ʹ��JS����ҳ����ƹ��ܣ�ҳ���������
 * @date 2011-12-21
 */

;(function($, D) {
	var domain_elfModule = $("#domain_elfModule").val();
	function showTemplate(text) {
		var $templateDiv = $('#templateDiv');
		$templateDiv.html(text);
		$.use(['ui-dialog'], function() {
			templateDialog = $templateDiv.dialog({
				modal : true,
				center : true,
				draggable : true,
				open : dialogInit
			});
		});
	}

	function dialogInit() {
	}


	D.showTemplateDialog = function() {
		var data = {
			action : "box_template_action",
			event_submit_do_query_topic_template_list : "true",
			template_type : "box"
		};
		$.get(D.domain + '/page/box/template_list_select.html', data, showTemplate, 'text');
	};
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
		var pageUrlParam = D.box.editor.getLayoutParam(), editPage = new D.DropInPage({
			pageUrlParam : pageUrlParam,
			callback : function(doc) {
				var opts = {}, data = {}, content, iconSuccess = $('.dcms-save-success'), draftForm = $('#daftForm'), confirmEl = $('#dcms-message-confirm');

				data['action'] = 'BoxDraftAction';
				data['event_submit_do_savePageDraft'] = true;
				opts['container'] = $('#design-container', doc);
				opts['pageIdInput'] = $('#pageId');
				opts['draftIdInput'] = $('#draftId');
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
				};
				opts['error'] = function(o) {
					if (o && (o.noPermission === true)) {
						D.Msg.error({
							timeout : 5000,
							message : '��ܰ��ʾ:��û��Ȩ�ޱ༭��ҳ��!'
						});
					} else if (o && (o.lockedUser)) {
						var tip = '';
						if (o.internalUser) {
							tip = o.lockedUser + '���ڱ༭��ҳ�棬�㲻��ͬʱ���б༭��<br/>����ϵ<a href="http://work.alibaba-inc.com/work/search?keywords=' + o.lockedUser + '&type=person" target="_blank">' + o.lockedUser + '</a>�����ύҳ���رձ༭�������ټ���༭��ҳ��!';
						} else {
							tip = o.lockedUser + '���ڱ༭��ҳ�棬�㲻��ͬʱ���б༭��<br/>����ϵ' + o.lockedUser + '�����ύҳ���رձ༭�������ټ���༭��ҳ��!';
						}
						var $Dialog = $('.js-dialog');
						$('footer', $Dialog).show();
						$('.btn-submit', $Dialog).hide();
						$('.btn-cancel', $Dialog).html('��֪����');
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

				content = $('#textarea-content').text();

				//opts['previewUrl'] = '/page/open/preview_box_page.html';
				//��ʼ��ʱ��ҳ�����������
				if ($.trim(content)) {

					//���ͨ������
					content = D.ManagePageDate.handleBanner(content);
					D.InsertHtml.init(content, opts['container'], 'html', doc);
					/*zhuliqi����ʱ����Ϲ��ܱ�ǩ*/
					var selectArea = new D.selectArea();
					selectArea.addItemLink(doc.find('div.image-maps-conrainer'));
					//���¼���ȷ�����л���ʱ��ɾ�����õ�ALINK
					selectArea._makeSure(doc);
					//ҳ���ʼ��ʱ����Ԫ��
					doc.find('.chagenTarget').hide();
					doc.find('.position-conrainer').show().css('z-index', '0').find('.map-position').show();
					//doc.find('.position-conrainer').hide();
				}
				/*zhuliqi:��������Ժ���ʾ��ɫ,����Ⱦ���ܱ༭����ɫ*/
				var select = new D.selectArea();
				select._define_css($('#dcms_box_main').contents());
				/*end:zhuliqi*/
				var $module = doc.find('.crazy-box-module'), $content = $('#content', doc), $link = $('#crazy-box-fdev', doc);
				if ($content.hasClass(h990['class'])) {
					$link.attr('href', h990['link']);
				}
				if ($content.hasClass(q990['class'])) {
					$link.attr('href', q990['link']);
				}
				if ($content.hasClass(q952['class'])) {
					$link.attr('href', q952['link']);
				}

				//data-dsmoduleparam
				//����ר��������Դ��Ϣ
				D.box.datasource.Topic.loadTopic($module);
				var $extParam = $('#ext_param'), reqTopicId = /topicId:([0-9]+)/;
				var dataList = reqTopicId.exec($extParam.val()), topicId = dataList && dataList[1];

				if (topicId) {
					D.box.datasource.YunYing.handleBlockId($module, topicId);
				}

				//D.box.editor.Grid.initCurrentGrids(doc);

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

				//�ֶ�Ԥ����Ƶ�ҳ������
				$('#dcms_box_grid_pre').click(function() {
					opts['preType'] = $('#preType').val() == 'dynamicPage' ? $('#preType').val() : 'page';
					opts['pageId'] = $('#pageId').val();
					opts['from'] = $('#from').val();

					D.sendContent.save(opts);
				});
				$('#dcms_box_grid_submit').click(function() {
					var pageId = opts['pageIdInput'].val();
					// console.log(opts['pageIdInput']);
					var msgTitle = '��δ����ҳ������';
					// if($('#is-from-topic').val() == "true") {
					//	msgTitle = 'ר���ҳ�棬�Ƿ�����ҳ������';
					// }
					if (!pageId) {
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


				$(document).on('refreshContent', function() {
					//ע��ˢ���¼�
					var refreshCon = $('#design-container', doc), options = {}, paramRefreshCon = '';
					var args = Array.prototype.slice.call(arguments, 1);
					if (args && args.length) {
						paramRefreshCon = args[0];
						if (paramRefreshCon) {
							refreshCon = paramRefreshCon;
						}
					}
					options['container'] = refreshCon;
					options['previewUrl'] = '/page/box/fresh_draft.html';
					options['renderType'] = $('#preType').val();
					options['pageId'] = $('#pageId').val();
					D.refreshContent.refresh(options, doc);
				});
				$('.bar-a-refresh').bind('click', function(e) {
					$(document).trigger('refreshContent');
				});
				$('#switch_editor').bind('click', function(event) {
					event.preventDefault();
					var that = this, $self = $(this), editor = $self.data('editor'), $DraftId;
					if (editor === 'junior') {
						$('#dcms_box_grid_save').trigger('click');
						$DraftId = $('#draftId');
						if ($DraftId.val()) {
							window.location = D.domain + "/page/box/new_page_design.html?extParam=isYunYing:false&draftId=" + $DraftId.val();
						} else {
							window.location = D.domain + "/page/box/new_page_design.html?extParam=isYunYing:false";
						}

					}

				});
				//����
				$('#page_unlock').bind('click', function(event) {
					event.preventDefault();
					var that = this, $pageId = $('#pageId'), data = {
						type : 'page',
						resourceCode : $pageId.val()
						};
					var $Dialog = $('.js-dialog');
					$('footer', $Dialog).show();
					$('.btn-submit', $Dialog).html('����');
					$('.btn-submit', $Dialog).show();
					//$('.btn-cancel',$Dialog).html('��֪����');
					D.Msg.confirm({
						'title' : "��ʾ",
						'body' : "<div style='margin:0 auto;width:300px;'>��ȷ���Ƿ��������ҳ�潫��ת��ҳ���б�ҳ!</div>",
						'noclose' : true,
						'success' : function(evt) {
							$.post(D.domain + '/page/box/unlock_resource.htm?type='+data.type+"&resourceCode="+data.resourceCode, function(json) {
								if (json.success === true) {
									location.href=D.domain+"/page/box/search_box_page.html?action=PageManager&event_submit_do_searchPageNew=true";
								}
								
							}, 'jsonp');
						}
					});
				});
				$('#dcms_box_page_background').bind('click', function(event) {
					event.preventDefault();
					D.BoxAttr.loadPageBackground(doc);
				});
				$('#dcms_box_edit_src').bind('click', function(event) {
					event.preventDefault();
					opts['isReview'] = false;
					opts['complete'] = function(json) {
						window.location = D.domain + '/page/box/edit_page_src.html?draftId=' + opts['draftIdInput'].val();
					};
					D.sendContent.save(opts, doc);

				});

			}
		});
		editPage.insertIframe();
		D.editPage = editPage;
	},
	function() {
		var docIframe = $('iframe#dcms_box_main');
		docIframe.bind('load', function() {
			var doc = $(this.contentDocument.document || this.contentWindow.document);
			var options = {};
			options['previewUrl'] = '/page/box/fresh_draft.html';
			options['renderType'] = $('#preType').val();
			options['pageId'] = $('#pageId').val();
			D.refreshContent.refresh(options, doc);
		});

		D.YunYing.bind.init('.js-dialog');

	},
	/**
	 * ����༭���ֺ�iframe��λ��
	 */
	function() {
		$(window).scroll(auto);
		$(window).resize(auto);
		setTimeout(auto, 50);
	},
	/**
	 * ����Ƿ��½�ҳ�棬������½���Ҫ�������������
	 */
	function() {
		if ($("#pageId").val() == "") {
			$('#box_choose_level .design-more').show();
			$('#box_choose_level .switch').removeClass('hide');
			if ($("#req_topicId").val() != "") {
				D.showSettingDialog(function(pageid) {
					//�ص�elf����topicid��pageid
					if ($("#req_topicId").val() != "") {
						var url = domain_elfModule + '/enroll/v2012/topicPageAction.json?pageId=' + pageid + "&topicId=" + $("#req_topicId").val();
						$.ajax({
							url : url,
							dataType : 'jsonp',
							success : function(json) {
								if (json.status == 'success') {
									window.location.href = D.domain + "/page/box/edit_page.htm?newPageDesign=new&pageId=" + pageid + "&extParam=isYunYing:true,topicId:" + $("#req_topicId").val();
								} else {
									alert("����ҳ��ʧ�ܣ����Ժ����ԡ�");
								}
							}
						});
					}
				}, function() {
					$("#settingDiv").find(".btn-cancel").hide();
					$("#settingDiv").find(".close").hide();
					if ($("#req_topicId").val() != "") {
						$("#topic_id").val($("#req_topicId").val());
					}
				});
			} else {//add by hongss on 2013.07.29 for ��
				//�½�ҳ���������ҳ������
				D.showSettingDialog(function() {
					$('#settingDiv').find('.close, .btn-cancel').show();

					//location.search = 'page_id='+$('#pageId').val()+'&setguide=true';
					window.location.href = D.domain + "/page/box/edit_page.htm?newPageDesign=new&pageId=" + $('#pageId').val() + "&extParam=setguide:true";
					//ҳ�����Ա������ʾģ��ѡ��Ի���
					/*D.YunYing.showTemplateList.apply(D.YunYing, [{
					 'width' : 850
					 }, null, null, selectTemplate]);*/
				}, function() {
					$('#settingDiv').find('.close, .btn-cancel').hide();
				});
			}
		}
	},
	//������
	function() {
		var pageId = $('#pageId').val(), extParamEl = $("#ext_param"), extParam = extParamEl.val();

		if (pageId && extParam && extParam.indexOf('setguide:true') !== -1) {
			D.YunYing.showTemplateList.apply(D.YunYing, [{
				'width' : 850
			}, null, null, selectTemplate]);

			//ȥ���򵼱�ʶ
			var newExtParam = extParam.replace(/setguide:true[,]*/g, '');
			extParamEl.val(newExtParam);
		}
	},
	function() {
		$('#dcms_box_page_template').bind('click', function(event) {
			event.preventDefault();
			D.YunYing.showTemplateList.apply(D.YunYing, [{
				'width' : 850
			}, $(event), null, selectTemplate]);
		});
		$('#ab_test').bind('click',function(event){
			event.preventDefault();
			var $pageId = $('#pageId'),pageId = $pageId.val();
			D.ab.openDialog(pageId);
		});
	}];
	
    
    
    var auto = function() {
		var docIframe = $('iframe#dcms_box_main'), $win = $(window);
		$('.dcms-box-body').css('width', '100%');
		docIframe.css('height', $win.height() - $('#operation_area').outerHeight(true) - $('#main_design_page .design-more').height());
	};
	/**
	 * @author zhaoyang
	 * ����ҳ�����
	 */
	function setLocation(o) {
		if (location.search.indexOf('draftId=') == -1) {
			try {
				var obj = $.unparam(location.href, '&');
				var from = obj.from || $('#from').val();
				history.pushState(o, null, D.domain + '/page/box/new_page_design.html?from=' + from + '&draftId=' + o.draftId + (o.pageId ? '&pageId=' + o.pageId : ''));
			} catch(e) {
			}
		}
	}

	function selectTemplate(templateid) {
		var url = "/page/box/chooseTemplate.html?_input_charset=UTF8";
		var data = {};
		data["templateId"] = templateid;
		data["topicId"] = $("#req_topicId").val();
		data["pageId"] = $("#pageId").val();
		data["draftId"] = $("#draftId").val();
		var extParam = $("#ext_param").val();
		$.ajax({
			url : url,
			type : "POST",
			data : data,
			dataType : 'json',
			success : function(json) {
				if (json["success"] == true) {
					var draftid = json["draftId"];
					var tourl = "/page/box/new_page_design.html?from=edit-page&draftId=" + draftid + "&pageId=" + $("#pageId").val() + "&extParam=" + extParam;
					tourl = tourl + "&dt=" + (new Date()).getTime();
					window.location.href = tourl;
				} else {
					alert("ѡ��ģ��ʧ�ܣ������ԡ�");
				}
			}
		});
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
