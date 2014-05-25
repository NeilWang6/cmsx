/**
 * @author springyu
 * @userfor
 * @date  2012-1-9
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */
;(function($, D) {
	var errorMessage = {
		'img_too_big' : '文件太大',
		'invalid_img_type' : '文件类型不合法',
		'img_optimization_required' : '大小超标',
		'unauthorized' : '安全校验不通过',
		'unknown' : '未知错误'
	};
	D.SettingBoxCell = {
		show : function(data, callback) {
			var that = this;
			//console.log(data);
			$.post(D.domain + '/page/box/settingBoxCell.htm?_input_charset=UTF-8', data, function(text) {
				that.showSetting(text, callback);
				that.catalogLoad();
				that.localupload();
				//that.checkValid();
				$("input[name='autoFit']").bind('click', function(e) {
					e.stopPropagation();
					var checked = $(this)[0].checked;
					$('.width').css('display', checked ? 'none' : '');
					checked && $('.width').val('');
				});
			}, 'text');

		},
		//弹出对话框
		showSetting : function(text, callback) {
			var that = this;
			$footer = $('footer', '.js-dialog');
			$('.js-dialog').addClass('ext-width');
			$footer.show();
			D.Msg['confirm']({
				'title' : '设置控件属性',
				'body' : text,
				'noclose' : true,
				'close' : function(ext) {
					$('.js-dialog').removeClass('ext-width');
				},
				'success' : function(evt) {
					var ret = that.checkValid(), param = '', $tDeriveContent = $('#textarea_derive_content');
					if($tDeriveContent.val()) {
						$tDeriveContent.val($('#derive_content').html());
					}

					var $dForm = $('#cell-submit-form');
					if($dForm[0].flag.value === 'T' && $dForm[0].isDerive.value === 'false') {
						$('#action_method').attr('name', 'event_submit_do_SaveCellByAjax');
						param = $dForm.serialize();
						param += '&isOrigin=0';
					} else {
						param = $dForm.serialize();
					}
					if(ret) {
						$.ajax({
							url : D.domain + '/page/box/json.html?_input_charset=UTF-8',
							type : 'POST',
							data : param,
							success : function(text) {
								var obj = $.parseJSON(text) || {};
								if(obj.status && obj.status === 'success') {
									D.Msg.tip({
										message : '保存成功！'
									});
									if(obj.data) {

										typeof callback === 'function' && callback.call(this, obj.data);
									}

									evt.data.dialog.dialog('close');
								} else {
									D.Msg.error({
										message : '保存失败！'
									});
								}

							}
						});
					}
				}
			});
		},
		/**
		 * 上传图片
		 */
		localupload : function() {
			if($('#attach').length <= 0) {
				$('.link-upload').before('<a id="attach" class="cell-upload" style="display:inline-block;">本地上传</a>');
			}
			var $input = $('#attach').browseElement();

			/****/
			$input.bind('change', function(event) {
				var dcms_upload_url = $('#dcms_upload_url').val();
				var files = this.files;
				for(var i = 0; i < files.length; i++) {
					var file = files[i];
					if(file.size > 1024 * 1024) {//>=1M
						fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString();
						D.Msg.error({
							message : "提示：文件太大，无法上传！",
							timeout : 5000
						});
						return;
					} else {//<1M
						fileSize = (Math.round(file.size * 100 / 1024) / 100).toString();
						if(fileSize > 512) {
							D.Msg.error({
								message : "提示：文件太大，无法上传！",
								timeout : 5000
							});
							return;
						}
					}
					(function(file) {
						var formData = new FormData($('<form/>')[0]);
						formData.append('Filedata', file);

						$.upload(dcms_upload_url, formData, {
							success : function(text) {
								var data = $.unparam(text);
								if(data.success === '1') {//上传成功
									$('#thumbnail').val(data.url);
									$('#thumbimg').attr("src", data.url);
									return;
								} else {//上传失败
									D.Msg.error({
										message : errorMessage[data.msg],
										timeout : 5000
									});
								}
							}
						});
					})(file);
				}

			});
		},
		//表单验证
		checkValid : function() {
			var formEl = $('#cell-submit-form'), els = formEl.find('[data-valid]');
			var formValid = new FE.ui.Valid(els, {
				onValid : function(res, o) {
					var tip = $(this).nextAll('.dcms-validator-tip'), msg;

					if(tip.length > 1) {
						for(var i = 1, l = tip.length; i < l; i++) {
							tip.eq(i).remove();
						}
					}
					if(res === 'pass') {
						tip.removeClass('dcms-validator-error');
					} else {
						switch (res) {
							case 'required':
								//dialog显示
								msg = '请填写' + o.key;
								break;
							case 'sel-val':
								break;
							case 'float':
								msg = '宽度必须是数字（整数表示像素，小数表示百分表）';
								break;
							default:
								msg = '请填写正确的内容';
								break;
						}
						tip.text(msg);
						tip.addClass('dcms-validator-error');

					}
				}
			});
			return formValid.valid();
		},
		//控件类目加载
		catalogLoad : function() {
			//加载控件类目
			(function() {
				var cascade = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
					params : {
						type : 'cell',
						catalogId : '0'
					},
					htmlCode : '',
					container : 'cell_derive_catalog_content'
				});
				cascade.init();
			})();

		}
	};

})(dcms, FE.dcms);
