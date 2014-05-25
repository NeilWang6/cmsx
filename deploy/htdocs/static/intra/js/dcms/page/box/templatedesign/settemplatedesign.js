/**
 * @author zhaoyang.maozy
 * @userfor ����ҳ�����Ը���
 * @date 2012-1-12
 */

;
(function($, D) {
	var settingDialog, settingCallback, templateIdElm = $('#templateId');

	var readyFun = [

			/*����ҳ������*/
			function() {
				// �������ҳ������
				$('#dcms_box_grid_pageattribute').click(function(e) {
					e.preventDefault();
					D.showSettingDialog();
				});
			},
			// ��ʼ������
			function() {
				$('body:last').append(
						'<div style="display:none;" id="settingDiv"></div>');
				// ע��ر��¼�
				$('#settingDiv').delegate('.cancelBtn', 'click', closeDialog);
				// ע�ᱣ���¼�
				$('#settingDiv').delegate('.submit-btn', 'click', saveSetting);
			},
			// ������ɫ
			function(){
				$('#settingDiv').delegate('.item', 'click', setColor);				
			}
		];

    /**
     * ������ɫ
     */
	function setColor(e){
  		 e.preventDefault();
		 var colorVal = $(this).find("a").text();
		 if($(this).hasClass('current')){
			 colorVal = '';
			 $(this).removeClass('current');
		 } else {
			 $('.list-color .item').removeClass('current');
			 $(this).addClass('current');
		 }
		 $('#hidden-tag-color').val(colorVal);	
	}
	

	/**
	 * ��������
	 */
	function saveSetting(e) {
		e.preventDefault();
		var data = $('#template-setting #js-save-page').serialize();
		$.post(D.domain
				+ '/page/box/settingBoxTemplate.htm?_input_charset=UTF-8',
				data, function(text) {
					if (text && text.match(/^\s*\{.+\}\s*$/mg)) {
						var obj = $.parseJSON(text) || {};
						// ����ҳ��ID
						if (obj.success && !templateIdElm.val()) {
							templateIdElm.val(obj.templateId);
						}
						closeDialog();
						// �����ִ�лص�����(���ύҳ��)
						if (settingCallback) {
							settingCallback();
							settingCallback = 0;
						}
					} else {
						showSetting(text);
					}
				}, 'text');
	}

	/*
	 * �ر�ҳ�����Ը���
	 */
	function closeDialog() {
		settingDialog && settingDialog.dialog('close');
	}

	/*
	 * ��ʾҳ�����Ը���
	 */

   D.showSettingDialog = function (callback) {
		settingCallback = callback;
		var data = {
			templateId : templateIdElm.val()
		}, draftId = $('#draftId').val();
		if (draftId) {
			data.draftId = draftId;
		}
		$.get(D.domain + '/page/box/settingBoxTemplate.htm?_input_charset=UTF-8', data, showSetting, 'text');

	}

	/*
	 * ��ʾҳ������
	 */
	function showSetting(text) {
		$('#settingDiv').html(text);
		$.use('ui-dialog', function() {
			settingDialog = $('#settingDiv').dialog({
				modal : true,
				center : true 
			});
		});
		var errorMessage = {
			'img_too_big' : '�ļ�̫��',
			'invalid_img_type' : '�ļ����Ͳ��Ϸ�',
			'img_optimization_reuired' : '��С����',
			'unauthorized' : '��ȫУ�鲻ͨ��',
			'unknown' : 'δ֪����'
		},
		// ���ύ��ַ
		url = $('#dcms_upload_url').val(),
		// ��ťƤ��
		buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/654/092/290456_417709751.png';
		$.use('ui-flash-uploader', function() {
			//console.log($('span.local-upload'));
			$('span.local-upload').flash({
				module : 'uploader',
				width : 67,
				height : 25,
				flash : true,
				inputName : 'Filedata',
				flashvars : {
					buttonSkin : buttonSkin
				}
			}).bind('fileSelect.flash', function(e, o) {
				$(this).flash('uploadAll', url, {
				//_csrf_token: 'dcms-box'
				}, 'image', 'fname');
			}).bind('uploadCompleteData.flash', function(e, o) {
				var data = $.unparam(o.data);
				if (data.success === '1') { //�ϴ��ɹ�

					$('#thumbnail').val(data.url);
					$('#thumbimg').attr("src", data.url);
					alert('�ϴ��ɹ�');

				} else { //�ϴ�ʧ��
					alert(errorMessage[data.msg]);
				}
			});
		});

	}

	$(function() {
		$.each(readyFun,
				function(i, fn) {
					try {
						fn();
					} catch (e) {
						if ($.log) {
							$.log('Error at No.' + i + '; ' + e.name + ':'
									+ e.message);
						}
					}
				})
	});
})(dcms, FE.dcms);
