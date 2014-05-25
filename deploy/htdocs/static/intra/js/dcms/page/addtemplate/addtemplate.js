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
							msg = o.key + '������д';
							break;
						}
						tip.html(msg);
						tip.addClass('dcms-validator-error');
					}
				}
			}),

	//�������û���ʾ��Ϣ
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
								editorInfo("�û�[" + checkUser
										+ "]�����ڻ�Ȩ�޲���,�뽫��ɾ��");
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
							alert("����༭�û��Ƿ���ȷ");
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