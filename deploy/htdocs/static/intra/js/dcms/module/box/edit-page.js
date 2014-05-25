/**
 * @author zhaoyang.maozy
 * @userfor 编辑页面，导入页面
 * @date  2012.02.28
 */

;(function($, D, undefined) {
	D.EditPage = {};
	var dDomain = $('#domain_cmsModule'), isSpecail = false;
	var domain = $('#domain_cmsModule').val();
	//专场调用设计页面使用

	if (!domain) {//不是专场，则默认URL
		domain = D.domain;
	} else {
		isSpecail = true;
	}
	/**
	 * 编辑页面处理
	 */
	D.EditPage.edit = function(data) {

		var confirmEl = $('#dcms-message-confirm-new'), awakeEl = $('#dcms-message-awake');

		if (data) {
			var pageId = data.pageId;
			if (data.status) {
				if (!isSpecail) {
					//2013-02-22 qiuxiaoquan 回溯
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
				// 被锁定
				handlePageLock(confirmEl, data);

			} else if (data.hasExists) {
				handlePageDraft(confirmEl, data);
			} else if (data.noPermission) {
				//console.log(data);
				D.Msg.show(confirmEl, {
					msg : '您好，你无权限编辑此页面!',
					title : '提示',
					buttons : [{
						name : 'apply',
						value : '申请编辑权限',
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
										alert('提交申请成功,审核通过后，会有旺旺提示！');
										window.location.reload();
									} else {
										alert('提交申请失败！');
									}

								}
							}, 'json');
						}
					},{
						name : 'cancel',
						value : '我知道了',
						className : 'page-tip-btn cancel-btn btn-basic  btn-gray',
						close : true
					}]
				});
			}
		}
	};
	//处理页面草稿对话框
	var handlePageDraft = function(confirmEl, data) {
		var msg = '<div class="self-draft">您的草稿箱里已保存了' + data.hasExists + '份该页面的修改</div>',
		//
		draftTitle = "编辑草稿";
		if (data.isSelf !== true) {
			msg = "<div class='has-draft'>此页面已经被" + data.draftUser + "编辑过，存在草稿<br/>你可以进行以下操作：</div>";
			draftTitle = "编辑他的草稿";
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
					value : '重新编辑', //这个还是要把版本revertId传过来
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
					value : "我知道了",
					className : 'page-tip-btn submit-btn btn-basic  btn-gray',
					close : true
				}
			];
			// 存在多个副本
			D.Msg.show(confirmEl, {
				msg : msg,
				title : '提示',
				buttons : buttonBtns
			});
		} else {
			// 存在多个副本
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
				value : '重新编辑', //这个还是要把版本revertId传过来
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
					value : '解锁',
					className : 'page-tip-btn submit-btn btn-basic  btn-gray',
					handle : function(e, msgObj) {
						var target = $(this);
						D.EditPage.unlockPage(data.pageId, msgObj, target);
					}
				});
			}
			btns.push({
				name : 'close',
				value : "我知道了",
				className : 'page-tip-btn submit-btn btn-basic  btn-gray',
				close : true
			});

			D.Msg.show(confirmEl, {
				msg : msg,
				title : '提示',
				buttons : btns
			});
		}
	};
	//处理页面存在锁对话框
	var handlePageLock = function(confirmEl, data) {
		var tip = '';
		if (data.internalUser) {
			tip = '<div class="lock">'+data.lockedUser + '正在编辑此页面，你不能同时进行编辑！<br/>请联系<a href="http://work.alibaba-inc.com/work/search?keywords=' + data.lockedUser + '&type=person" target="_blank">' + data.lockedUser + '</a>请他提交页面或关闭编辑器后你再继续编辑本页面!</div>';
		} else {
			tip = '<div class="lock">'+data.lockedUser + '正在编辑此页面，你不能同时进行编辑！<br/>请联系' + data.lockedUser + '请他提交页面或关闭编辑器后你再继续编辑本页面!</div>';
		}
		if (data.isAllow) {
			D.Msg.show(confirmEl, {
				//msg : '页面被' + data.lockedUser + '锁定! 是否现在解锁?',
				msg : tip,
				title : '提示',
				buttons : [{
					name : 'cancel',
					value : '我知道了',
					className : 'page-tip-btn cancel-btn btn-basic  btn-blue',
					close : true
				}, {
					name : 'lock',
					value : '解锁',
					className : 'page-tip-btn submit-btn btn-basic  btn-gray',
					handle : function(e, msgObj) {
						var target = $(this);
						if (data.isAllow) {
							D.EditPage.unlockPage(data.pageId, msgObj, target);
						} else {
							D.Msg.awake(awakeEl, {
								msg : '你没有解锁权限！',
								relatedEl : target
							});
						}
					}
				}]
			});
		} else {
			D.Msg.show(confirmEl, {
				//msg : '页面被' + data.lockedUser + '锁定! 是否现在解锁?',
				msg : tip,
				title : '提示',
				buttons : [{
					name : 'cancel',
					value : '我知道了',
					className : 'page-tip-btn cancel-btn btn-basic  btn-blue',
					close : true
				}]
			});
		}
	};

	/**
	 * 解锁资源
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
						msg : '解锁成功',
						relatedEl : target
					});
					msgObj.dialog('close');
				} else {
					var msg = '', result = o.result, end = '<br />';
					for (var i = 0, l = result.length; i < l; i++) {
						if (i === l - 1) {
							end = '';
						}
						msg += '页面' + result[i].code + '解锁失败，错误如下：' + result[i].error + end;
					}
					D.Msg.awake(awakeEl, {
						msg : msg
					});
				}

			},
			error : function() {
				D.Msg.awake(awakeEl, {
					msg : '解锁失败，请稍后再试！',
					relatedEl : target
				});
				msgObj.dialog('close');
			}
		});
	};

	/**
	 * 导入资源
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
	 *create 并提交表单
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
