/**
 * @author springyu
 * @userfor 设置模版
 * @date 2012-10-4
 */

;(function($, D) {
	var layerId = "settingTemplate", settingDialog, settingCallback, templateIdElm = $('#templateId'), colors = {
		"all" : "",
		"orange" : "橙色",
		"red" : "红色",
		"blue" : "蓝色",
		"green" : "绿色",
		"white" : "白色",
		"other" : "其它"
	};

	function showToTemplateLib(callback) {
		var data = {}, pageElm = $('#pageId');
		if(pageElm.val()) {
			data.fromPage = pageElm.val();
		}
		$.get(D.domain + '/page/box/settingBoxTemplate.htm?_input_charset=UTF-8', data, showSettingDialog, 'text');
	}

	var readyFun = [

	/*设置页面属性*/
	function() {
		$("#to_lib").click(function() {
			//if($(this).attr('checked')) {
				showToTemplateLib()
			//}
		});
	},

	// 点周颜色
	function() {
		$('.js-dialog').delegate('.item', 'click', setColor);

	}];

	/**
	 * 设置颜色
	 */
	function setColor(e) {
		e.preventDefault();
		var colorVal = $(this).find("a").text();
		if($(this).hasClass('current')) {
			colorVal = '';
			$(this).removeClass('current');
		} else {
			$('.list-color .item').removeClass('current');
			$(this).addClass('current');
		}
		$('#hidden-tag-color').val(colorVal);
		$('#hidden-tag-color').trigger('blur');
	}

	function saveSetting(e) {
		e && e.preventDefault();
		var doc = $($('#dcms_box_main')[0].contentWindow.document);
		var html = D.sendContent.getContainerHtml($('#design-container', doc));
		if(!$("#js-save-page #content")[0]) {
			$('<textarea style="display:none;width:0px;height:0px" name="content" id="content"></textarea>').appendTo("#template-setting #js-save-page");
			//$('<iframe style="display:none;width:0px;height:0px" id="postForm" name="postForm"></iframe>').appendTo("#template-setting");
		}
		$("#js-save-page #content").val(html);
		$("#js-save-page #dcms-form-event-type").attr("name", "event_submit_do_importPage2Template");

		doSaveSetting(function() {
			$("#to_lib").attr('checked', false);
			 e.data.dialog.dialog('close');
		});
	}

	/**
	 * 保存模板属性
	 */
	function doSaveSetting(settingCallback) {
		var form = $('#template-setting #js-save-page');
		form.find('input[name=templateType]').val('pl_template');
		var data = form.serialize();
		$.post(D.domain + '/page/box/settingBoxTemplate.htm?_input_charset=UTF-8', data, function(text) {
			if(text && text.match(/^\s*\{.+\}\s*$/mg)) {
				var obj = $.parseJSON(text) || {};
				// 设置页面ID
				if(obj.success && !templateIdElm.val()) {
					templateIdElm.val(obj.templateId);
				}

				if(obj.success && obj.autoGenPic == '1') {
					var url, key, tasks = {}, id = obj.templateId, type = "pl_template";
					url = D.domain + '/open/box_view_personal_lib.html?id=' + id + '&type=' + type;
					key = type + '-' + id;
					tasks[key] = {
						'size' : '170x-1',
						'url' : url
					};
					tasks[key]['id'] = 'box_doc';
					tasks[key]['class'] = 'cell-page-main';
					//console.log(tasks);
					FE.dcms.Capture.start(tasks, function(text) {
						console.log(text);
					});
				}
	
				// 保存后执行回调方法(如提交页面)
				if(settingCallback) {
					settingCallback();
					settingCallback = 0;
				}
			} else {
				showSettingDialog(text);
			}
		}, 'text');
	}

	/*
	 * 显示页面属性
	 */
	function showSettingDialog(text) {
		$('.js-dialog').addClass('ext-width');
		$('footer','.js-dialog').show();
		D.Msg['confirm']({
			'title' : '保存模板',
			'body' : '<div class="">' + text + '</div>',
			'noclose' : true,
			'complete' : function() {
				$("#to_lib").attr('checked', false);
				//$('.js-dialog').removeClass('ext-width');
			},
			'close':function(ext){
				$('.js-dialog').removeClass('ext-width');
			},
			'success' : function(ext) {
				saveSetting(ext);
			}
		});
		//加载布局或模版
		(function() {
			var cascade = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
				params : {
					type : 'template',
					catalogId : '0'

				},
				htmlCode : '',
				container : 'catalog_content'
			});
			cascade.init();
		})();
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
		buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/081/364/463180_133354742.png';
		$.use('ui-flash-uploader', function() {
			//console.log($('span.local-upload'));
			$('span.local-upload').flash({
				module : 'uploader',
				width : 70,
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
				if(data.success === '1') {//上传成功

					$('#thumbnail').val(data.url);
					$('#thumbimg').attr("src", data.url);
					alert('上传成功');

				} else {//上传失败
					alert(errorMessage[data.msg]);
				}
			});
		});

	}

	/**初始化**/
	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch (e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		})
	});

})(dcms, FE.dcms);
