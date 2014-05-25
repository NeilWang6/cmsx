/**
 * @author zhaoyang.maozy
 * @userfor 设置页面属性浮层
 * @date 2012-1-12
 */

;
(function($, D) {
	var settingDialog, settingCallback, templateIdElm = $('#templateId');

	var readyFun = [

			/*设置页面属性*/
			function() {
				// 点击设置页面属性
				$('#dcms_box_grid_pageattribute').click(function(e) {
					e.preventDefault();
					D.showSettingDialog();
				});
			},
			// 初始化浮层
			function() {
				$('body:last').append(
						'<div style="display:none;" id="settingDiv"></div>');
				// 注册关闭事件
				$('#settingDiv').delegate('.cancelBtn', 'click', closeDialog);
				// 注册保存事件
				$('#settingDiv').delegate('.submit-btn', 'click', saveSetting);
			},
			// 点周颜色
			function(){
				$('#settingDiv').delegate('.item', 'click', setColor);				
			}
		];

    /**
     * 设置颜色
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
	 * 保存属性
	 */
	function saveSetting(e) {
		e.preventDefault();
		var data = $('#template-setting #js-save-page').serialize();
		$.post(D.domain
				+ '/page/box/settingBoxTemplate.htm?_input_charset=UTF-8',
				data, function(text) {
					if (text && text.match(/^\s*\{.+\}\s*$/mg)) {
						var obj = $.parseJSON(text) || {};
						// 设置页面ID
						if (obj.success && !templateIdElm.val()) {
							templateIdElm.val(obj.templateId);
						}
						closeDialog();
						// 保存后执行回调方法(如提交页面)
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
	 * 关闭页面属性浮层
	 */
	function closeDialog() {
		settingDialog && settingDialog.dialog('close');
	}

	/*
	 * 显示页面属性浮层
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
	 * 显示页面属性
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
			'img_too_big' : '文件太大',
			'invalid_img_type' : '文件类型不合法',
			'img_optimization_reuired' : '大小超标',
			'unauthorized' : '安全校验不通过',
			'unknown' : '未知错误'
		},
		// 表单提交地址
		url = $('#dcms_upload_url').val(),
		// 按钮皮肤
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
				if (data.success === '1') { //上传成功

					$('#thumbnail').val(data.url);
					$('#thumbimg').attr("src", data.url);
					alert('上传成功');

				} else { //上传失败
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
