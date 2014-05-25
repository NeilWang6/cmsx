/**
 * @package FD.app.cms.addtemplate
 * @author: arcthur.cheny
 * @Date: 2011-09-21
 * modify by hongss on 2011.10.08 for valid checkEditorIsNotExist
 */

;
(function($, D) {
	var checkFlag = false, editorFlag = false, 
		myValid = new FE.ui.Valid(
			$('.dcms-form .need-verify'), {
				onValid : function(res, o) {
					var tip = $(this).nextAll('.dcms-validator-tip'), msg;
					if (res === 'pass') {
						tip.removeClass('dcms-validator-error');
					} else {
						switch (res) {
						case 'required':
							msg = o.key + '必需填写';
							break;
						}
						tip.html(msg);
						tip.addClass('dcms-validator-error');
					}
				}
			}),

	//检查审核用户提示信息
	editorInfo = function(content) {
		$('#editorTag').css('color', 'red').html(content);
	},

	checkEditorIsNotExist = function(inputUsersObj, permission) {
		var userStrings = inputUsersObj.val(), url = D.domain
				+ '/page/check_user.html?users=' + userStrings + '&permission='
				+ permission;

		if (userStrings === '') {
			editorFlag = true;
			editorInfo('');
		} else {
			$.ajax({
				url : url,
				type : 'POST'
			}).success(
					function(checkUser) {
						if (!!checkUser) {
							if (checkUser !== "ok") {
								editorFlag = false;
								editorInfo("用户[" + checkUser
										+ "]不存在或权限不够,请将其删除");
							} else {
								editorFlag = true;
								editorInfo('');
							}
						}
					});
		}
	};

	var readyFun = [
			function() {
				$('#new-template').click(function(e) {
					e.preventDefault();
					checkEditorIsNotExist($('#editor'), '');

					if (editorFlag) {
						$('#templateForm').submit();
					} else {
						if (!editorFlag) {
							alert("请检查编辑用户是否正确");
							return;
						}

					}
				});

				$('#templateForm').submit(function() {
					return myValid.valid();
				});
			},
			function() {
				$('#editor').blur(function() {
					checkEditorIsNotExist($(this), '');
				});
			},
			function() {
				//D.popTree('selcategoryName','selcategoryName','selCategoryId','dgPopTree','admin/catalog.html');
				var categoryIdEl = $('#selCategoryId'), categoryEl = $('#selcategoryName'),
					popTree = new D.PopTree({
						modify:function(){
							myValid.valid(categoryEl);
						}
					});

				popTree.show(categoryEl, categoryEl, categoryIdEl, false);
				categoryEl.click(function() {
					popTree.show(categoryEl, categoryEl, categoryIdEl);
				});
			} ];

	$(function() {
		for ( var i = 0, l = readyFun.length; i < l; i++) {
			try {
				readyFun[i]();
			} catch (e) {
				if ($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}

	});
})(dcms, FE.dcms);