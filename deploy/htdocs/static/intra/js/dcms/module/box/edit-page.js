/**
 * @author zhaoyang.maozy
 * @userfor �༭ҳ�棬����ҳ��
 * @date  2012.02.28
 */

;(function($, D, undefined) {
	D.EditPage = {};
	var dDomain = $('#domain_cmsModule'), isSpecail = false;
	var domain = $('#domain_cmsModule').val();
	//ר���������ҳ��ʹ��

	if (!domain) {//����ר������Ĭ��URL
		domain = D.domain;
	} else {
		isSpecail = true;
	}
	/**
	 * �༭ҳ�洦��
	 */
	D.EditPage.edit = function(data) {

		var confirmEl = $('#dcms-message-confirm-new'), awakeEl = $('#dcms-message-awake');

		if (data) {
			var pageId = data.pageId;
			if (data.status) {
				if (!isSpecail) {
					//2013-02-22 qiuxiaoquan ����
					if (data.revertId) {
						location.href = domain + '/page/box/edit_page.htm?newPageDesign=new&pageId=' + data.pageId + '&revertId=' + revertId;
					} else {
						location.href = domain + '/page/box/edit_page.htm?newPageDesign=new&pageId=' + data.pageId;
					}
				} else {
					//parent.location.href = domain + '/page/box/edit_page.htm?pageId=' + data.pageId;
					createForm(domain + '/page/box/edit_page.htm', {
						'pageId' : data.pageId
					});
				}
			} else if (data.lockedUser) {
				// ������
				handlePageLock(confirmEl, data);

			} else if (data.hasExists) {
				handlePageDraft(confirmEl, data);
			} else if (data.noPermission) {
				//console.log(data);
				D.Msg.show(confirmEl, {
					msg : '���ã�����Ȩ�ޱ༭��ҳ��!',
					title : '��ʾ',
					buttons : [{
						name : 'apply',
						value : '����༭Ȩ��',
						className : 'page-tip-btn submit-btn btn-basic  btn-blue',
						handle : function(e, msgObj) {
							var target = $(this), value = {
								type : 'page',
								code : data.pageId
							};
							//console.log(target);

							$.post(D.domain + '/admin/add_apply_permission.html?_input_charset=UTF8', value, function(json) {
								// console.log(json);
								//console.log(json);
								if (json) {
									if (json.status === 'success') {
										alert('�ύ����ɹ�,���ͨ���󣬻���������ʾ��');
										window.location.reload();
									} else {
										alert('�ύ����ʧ�ܣ�');
									}

								}
							}, 'json');
						}
					},{
						name : 'cancel',
						value : '��֪����',
						className : 'page-tip-btn cancel-btn btn-basic  btn-gray',
						close : true
					}]
				});
			}
		}
	};
	//����ҳ��ݸ�Ի���
	var handlePageDraft = function(confirmEl, data) {
		var msg = '<div class="self-draft">���Ĳݸ������ѱ�����' + data.hasExists + '�ݸ�ҳ����޸�</div>',
		//
		draftTitle = "�༭�ݸ�";
		if (data.isSelf !== true) {
			msg = "<div class='has-draft'>��ҳ���Ѿ���" + data.draftUser + "�༭�������ڲݸ�<br/>����Խ������²�����</div>";
			draftTitle = "�༭���Ĳݸ�";
			var buttonBtns=[
			 {
					name : 'goDraft',
					value : draftTitle,
					className : 'page-tip-btn submit-btn btn-basic  btn-blue',
					handle : function(e, msgObj) {
						msgObj.dialog('close');
						if (!isSpecail) {
							location.href = domain + '/page/box/edit_page.htm?newPageDesign=new&overite=false&pageId=' + data.pageId;
						} else {
							createForm(domain + '/page/box/edit_page.htm', {
								'overite' : 'false',
								'pageId' : data.pageId
							});
						}
					}
				}, {
					name : 'overwrite',
					value : '���±༭', //�������Ҫ�Ѱ汾revertId������
					className : 'page-tip-btn submit-btn btn-basic  btn-gray',
					handle : function(e, msgObj) {
						msgObj.dialog('close');

						if (!isSpecail) {
							if (data.revertId) {
								location.href = domain + '/page/box/edit_page.htm?newPageDesign=new&pageId=' + data.pageId + '&revertId=' + data.revertId;
							} else {
								location.href = domain + '/page/box/edit_page.htm?newPageDesign=new&pageId=' + data.pageId;
							}
						} else {
							createForm(domain + '/page/box/edit_page.htm', {
								'pageId' : data.pageId

							});
						}
					}
				},
			{
					name : 'close',
					value : "��֪����",
					className : 'page-tip-btn submit-btn btn-basic  btn-gray',
					close : true
				}
			];
			// ���ڶ������
			D.Msg.show(confirmEl, {
				msg : msg,
				title : '��ʾ',
				buttons : buttonBtns
			});
		} else {
			// ���ڶ������
			var btns = [];
				btns.push({
				name : 'goDraft',
				value : draftTitle,
				className : 'page-tip-btn submit-btn btn-basic  btn-blue',
				handle : function(e, msgObj) {
					msgObj.dialog('close');
					if (!isSpecail) {
						location.href = domain + '/page/box/edit_page.htm?newPageDesign=new&overite=false&pageId=' + data.pageId;
					} else {
						createForm(domain + '/page/box/edit_page.htm', {
							'overite' : 'false',
							'pageId' : data.pageId
						});
					}
				}
			});
			btns.push({
				name : 'overwrite',
				value : '���±༭', //�������Ҫ�Ѱ汾revertId������
				className : 'page-tip-btn submit-btn btn-basic  btn-gray',
				handle : function(e, msgObj) {
					msgObj.dialog('close');

					if (!isSpecail) {
						if (data.revertId) {
							location.href = domain + '/page/box/edit_page.htm?newPageDesign=new&pageId=' + data.pageId + '&revertId=' + data.revertId;
						} else {
							location.href = domain + '/page/box/edit_page.htm?newPageDesign=new&pageId=' + data.pageId;
						}
					} else {
						createForm(domain + '/page/box/edit_page.htm', {
							'pageId' : data.pageId

						});
					}
				}
			});
			if (data.isShowLock === true) {
				btns.push({
					name : 'lock',
					value : '����',
					className : 'page-tip-btn submit-btn btn-basic  btn-gray',
					handle : function(e, msgObj) {
						var target = $(this);
						D.EditPage.unlockPage(data.pageId, msgObj, target);
					}
				});
			}
			btns.push({
				name : 'close',
				value : "��֪����",
				className : 'page-tip-btn submit-btn btn-basic  btn-gray',
				close : true
			});

			D.Msg.show(confirmEl, {
				msg : msg,
				title : '��ʾ',
				buttons : btns
			});
		}
	};
	//����ҳ��������Ի���
	var handlePageLock = function(confirmEl, data) {
		var tip = '';
		if (data.internalUser) {
			tip = '<div class="lock">'+data.lockedUser + '���ڱ༭��ҳ�棬�㲻��ͬʱ���б༭��<br/>����ϵ<a href="http://work.alibaba-inc.com/work/search?keywords=' + data.lockedUser + '&type=person" target="_blank">' + data.lockedUser + '</a>�����ύҳ���رձ༭�������ټ����༭��ҳ��!</div>';
		} else {
			tip = '<div class="lock">'+data.lockedUser + '���ڱ༭��ҳ�棬�㲻��ͬʱ���б༭��<br/>����ϵ' + data.lockedUser + '�����ύҳ���رձ༭�������ټ����༭��ҳ��!</div>';
		}
		if (data.isAllow) {
			D.Msg.show(confirmEl, {
				//msg : 'ҳ�汻' + data.lockedUser + '����! �Ƿ����ڽ���?',
				msg : tip,
				title : '��ʾ',
				buttons : [{
					name : 'cancel',
					value : '��֪����',
					className : 'page-tip-btn cancel-btn btn-basic  btn-blue',
					close : true
				}, {
					name : 'lock',
					value : '����',
					className : 'page-tip-btn submit-btn btn-basic  btn-gray',
					handle : function(e, msgObj) {
						var target = $(this);
						if (data.isAllow) {
							D.EditPage.unlockPage(data.pageId, msgObj, target);
						} else {
							D.Msg.awake(awakeEl, {
								msg : '��û�н���Ȩ�ޣ�',
								relatedEl : target
							});
						}
					}
				}]
			});
		} else {
			D.Msg.show(confirmEl, {
				//msg : 'ҳ�汻' + data.lockedUser + '����! �Ƿ����ڽ���?',
				msg : tip,
				title : '��ʾ',
				buttons : [{
					name : 'cancel',
					value : '��֪����',
					className : 'page-tip-btn cancel-btn btn-basic  btn-blue',
					close : true
				}]
			});
		}
	};

	/**
	 * ������Դ
	 */
	D.EditPage.unlockPage = function(pageId, msgObj, target) {
		var awakeEl = $('#dcms-message-awake'), params = {
			type : 'page',
			resourceCode : pageId
		}, url = domain + '/page/box/unlock_resource.htm';
		$.ajax({
			url : url,
			data : params,
			dataType : 'jsonp',
			success : function(o) {
				if (o.success === true) {
					D.Msg.awake(awakeEl, {
						msg : '�����ɹ�',
						relatedEl : target
					});
					msgObj.dialog('close');
				} else {
					var msg = '', result = o.result, end = '<br />';
					for (var i = 0, l = result.length; i < l; i++) {
						if (i === l - 1) {
							end = '';
						}
						msg += 'ҳ��' + result[i].code + '����ʧ�ܣ��������£�' + result[i].error + end;
					}
					D.Msg.awake(awakeEl, {
						msg : msg
					});
				}

			},
			error : function() {
				D.Msg.awake(awakeEl, {
					msg : '����ʧ�ܣ����Ժ����ԣ�',
					relatedEl : target
				});
				msgObj.dialog('close');
			}
		});
	};

	/**
	 * ������Դ
	 */
	D.EditPage.importPage = function(templateId, pageId, fromPage) {
		var url = domain + '/page/box/' + ( templateId ? 'import_template.htm' : 'import_new_page.htm') + '?newPageDesign=new&from=edit-page&fromPage=' + fromPage;
		if (templateId) {
			url += templateId ? ('&templateId=' + templateId) : '';
		} else {
			url += pageId ? ('&pageId=' + pageId) : '';
		}
		location.href = url;
	};

	/**
	 *create ���ύ��
	 * @param {Object} url
	 * @param {Object} obj
	 */
	var createForm = function(url, obj) {
		var temp = '<form id="dcms_submit_box" action="' + url + '" method="get" target="_blank">';
		if (obj.overite === 'false') {
			temp += '<input type="hidden" name="overite" value="' + obj.overite + '">';
		}
		temp += '<input type="hidden" name="pageId" value="' + obj.pageId + '">';
		//newPageDesign
		temp += '<input type="hidden" name="newPageDesign" value="new">';
		temp += '<input type="hidden" name="from" value="specialTools">';
		temp += '</form>';
		//
		var oForm = $(temp);
		var tempForm = $('#dcms_submit_box');
		tempForm.remove();
		oForm.appendTo('body');
		oForm.trigger('submit');
	};
})(dcms, FE.dcms);
