/**
 * @author: shanshan.hongss
 * @userfor ����Դ�����
 * @Date: 2013-06-25
 * @rely /static/intra/js/dcms/box-v2/ui/catalog-box.js  (��Ŀ)
 * @rely /static/intra/js/dcms/module/codemirror/lib/codemirror.js  (����༭�� CodeMirror����������codemirror�µ��ļ�)
 * @rely /static/intra/js/dcms/page/box/newcreatemodule/syncmodule.js  (���������Ϣ��ʾ��)
 */

;(function($, D) {
	var pcontentId = $('#com-content'), editor, SYNC_MODULE = 'sync_module', formValid, readyFun = [
	/**
	 * ��tab����������ʾ
	 */
	function() {
		var moduleId = $('#module-id');
		if (moduleId.val()) {
			$('#page span').text('�༭Դ�����');
		} else {
			$('#page span').text('�½�Դ�����');
		}
	},
	/**
	 * �������Ӧ
	 */
	function() {
		var autoEl = $('#auto-size');
		if (autoEl[0].checked === true) {
			var widthInput = autoEl.prevAll('input.width-input');
			widthInput.val('');
		}
		//����Ӧ��ѡ��
		autoEl.click(function(e) {
			var widthInput = $(this).prevAll('input.width-input');
			if (this.checked === true) {
				widthInput.val('');
				widthInput.attr('placeholder', '����Ӧ���');
				formValid.setConfig(widthInput, {
					required : false
				});
				formValid.valid(widthInput);
			} else {
				widthInput.attr('placeholder', '��������');
				//widthInput.focus();
				formValid.setConfig(widthInput, {
					required : true
				});
				formValid.valid(widthInput);
			}
		});
		//�����
		$('.form-vertical .width-input').blur(function(e) {
			var widthInput = $(this), autoCheckbox = widthInput.nextAll('input[type=checkbox]');
			if (widthInput.val() !== '') {
				widthInput.attr('placeholder', '��������');
				autoCheckbox.prop('checked', false);
				formValid.setConfig(widthInput, {
					required : true
				});
				formValid.valid(widthInput);
			}

		});
	},
	/**
	 * ��ʼ������༭��
	 */
	function() {
		editor = CodeMirror.fromTextArea(pcontentId[0], {
			lineNumbers : true,
			theme : "rubyblue",
			mode : "text/html",
			tabMode : "indent",
			matchBrackets : true,
			lineWrapping : true,
			readOnly : false,
			onCursorActivity : function() {
				editor.matchHighlight("CodeMirror-matchhighlight");
			},
			extraKeys : {
				"F11" : function() {
					var scroller = editor.getScrollerElement();
					if (scroller.className.search(/\bCodeMirror-fullscreen\b/) === -1) {
						scroller.className += " CodeMirror-fullscreen";
						scroller.style.height = "100%";
						scroller.style.width = "100%";
						editor.refresh();
					} else {
						scroller.className = scroller.className.replace(" CodeMirror-fullscreen", "");
						scroller.style.height = '';
						scroller.style.width = '';
						editor.refresh();
					}
				},
				"Esc" : function() {
					var scroller = editor.getScrollerElement();
					if (scroller.className.search(/\bCodeMirror-fullscreen\b/) !== -1) {
						scroller.className = scroller.className.replace(" CodeMirror-fullscreen", "");
						scroller.style.height = '';
						scroller.style.width = '';
						editor.refresh();
					}
				}
			}
		});
	},
	//�?��֤
	function() {
		var formEl = $('#module-submit-form');
		formValid = checkValid(formEl);

		//��ʼ�� ��� ��֤����
		var autoFixEl = $('#auto-size');
		if (autoFixEl[0].checked === true) {
			var widthEl = autoFixEl.prevAll('.width-input');
			formValid.setConfig(widthEl, {
				required : false
			});
		}
	},
	//Ԥ��
	function() {
		$('.dcms_box_grid_pre').click(function(e) {
			e.preventDefault();
			//�༭���е����ݻ���
			pcontentId.val(editor.getValue());

			var content = $('#com-content').val();

			$('#module-width').val($('#module-submit-form .width-input').val());

			$('#pre-content').val(content);
			$('#previewForm').submit();
		});
	},
	//Ԥ�����
	function() {
		$('.dcms_box_grid_pre_design').click(function(e) {
			e.preventDefault();

			//���·�����ݣ������idc�����Դ�������£����������н����жϵ�
			D.box.datasource.idcDs && D.box.datasource.idcDs.upFcDataForNewModule(editor);

			//�༭���е����ݻ���
            var editContent = editor.getValue();
			pcontentId.val(editContent);
            
			var content = $('#com-content').val();

			$('#module-width2').val($('#module-submit-form .width-input').val());

			$('#pre-content2').val(content);
			$('#module-name2').val($('#module-name').val());
            
            if (validHtml(editContent)){
                $('#previewDesignForm').submit();
            } else {
                showErrorMessage(function(){
                    $('#previewDesignForm').submit();
                });
            }
			
		});
	},
	/**
	 *����ݸ�
	 */
	function() {
		$('.dcms_box_grid_save').click(function(e) {
			//���·�����ݣ������idc�����Դ�������£����������н����жϵ�
			D.box.datasource.idcDs && D.box.datasource.idcDs.upFcDataForNewModule(editor);

			//�༭���е����ݻ���
			var editContent = editor.getValue();
			pcontentId.val(editContent);
            
			var iconSuccess = $('.dcms-save-success');
			//��Ŀ��ݻ���
			var arrCatalog = [];
			$('.catalog-content').find('.catalog-ids').each(function() {
				var val = $(this).val();
				if (val) {
					arrCatalog.push(val);
				}
			});
			$('#module-catalog').val(arrCatalog.join());
            
            if (validHtml(editContent)){
                saveDraft();
            } else {
                showErrorMessage(function(){
                    saveDraft();
                });
            }
            
            function saveDraft(){
                //�?��֤
                var formEl = $('#module-submit-form'), isValid = formValid.valid(), $self = $(this);

                if (isValid) {
                    //����
                    var moduleId = $('#module-id').val(), flag = $('#flag').val(), toLibUrl, saveConfig, sourceInput = $('#source');

                    toLibUrl = D.domain + '/page/box/module_list_new.html?action=box_module_action&event_submit_do_query_module_list=true';
                    saveConfig = {
                        'data' : formEl.serialize() + "&returnType=json",
                        'url' : D.domain + '/page/box/json.html?_input_charset=utf-8',
                        'toLibUrl' : toLibUrl,
                        'editUrl' : D.domain + '/page/box/create_code_module.html?overite=false',
                        'complete' : function() {
                            $self.removeClass('btn-disabled').addClass('btn-blue');
                            iconSuccess.show(200);
                            setTimeout(function() {
                                iconSuccess.hide(200);
                            }, 1300);

                        }
                    };

                    //����Ҫ��������
                    $.post(saveConfig.url, saveConfig.data, function(text) {
                        var json = $.parseJSON(text), htmlCode = '', _data;
                        if (json) {
                            if (json.status && json.status === 'success') {
                                saveConfig.editUrl = saveConfig.editUrl + '&moduleId=' + json.data.id;
                                window.location = saveConfig.editUrl;
                            }
                        }

                    }).complete(saveConfig.complete);
                    $self.removeClass('btn-blue').addClass('btn-disabled');
                }
            }
			
		});
	},
	/**
	 * �ύ���ȱ���ݸ壬���ύ
	 */
	function() {
		$('.dcms_box_grid_submit').click(function(e) {
			//�༭���е����ݻ���
			var editContent = editor.getValue();
			pcontentId.val(editContent);
            
			//��Ŀ��ݻ���
			var arrCatalog = [];
			$('.catalog-content').find('.catalog-ids').each(function() {
				var val = $(this).val();
				if (val) {
					arrCatalog.push(val);
				}
			});
			$('#module-catalog').val(arrCatalog.join());

			//�?��֤
			var isValid = formValid.valid();
			if (!isValid) {
				return;
			}
			//���·�����ݣ������idc�����Դ�������£����������н����жϵ�
			D.box.datasource.idcDs && D.box.datasource.idcDs.upFcDataForNewModule(editor);

            if (validHtml(editContent)){
                submitModule();
            } else {
                showErrorMessage(function(){
                    submitModule();
                });
            }
            
            function submitModule(){
                var htmlCode = '<div class="dialog-content-text">�ύ������������������ϣ����ҳ����յ�������������ѡ�<br/>��ȷ����������������д�����������ύ������</div><div class="m-remark"><textarea placeholder="����д��������,������250��������!" class="remark js-remark" name="remark"></textarea></div>';
                D.Msg['confirm']({
                    'title' : '��ʾ��Ϣ',
                    'body' : '<div class="header-dialog-content">' + htmlCode + '</div>',
                    'noclose' : true,
                    'success' : function(evt) {
                        var $remark = $('.js-remark', '.js-dialog'), remark = $remark.val(), note = $.trim(remark);
                        if (!note) {
                            alert('����д��������!');
                            return;
                        }
                        if (note.length > 250) {
                            alert('�����������̫�����������250��������!');
                            return;
                        }

                        submit_module(remark, function() {
                            evt.data.dialog.dialog('close');
                        });
                    }
                });
            }
			

			});
		//});
	},

	/**
	 * ��ʼ����Ŀ
	 */
	function() {
		/*var cascade = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
		 params : {
		 type : 'module',
		 catalogId : '0'
		 },
		 htmlCode : '',
		 container : 'catalog_content'
		 });
		 cascade.init();*/
		new D.CatalogBox(D.domain + '/page/box/query_module_catalog.html', {
			params : {
				type : 'module',
				catalogId : '0'
			},
			container : '.catalog-content',
			valueInput : '#module-catalog',
			multOpts : {
				type : 'radio',
				choice : function(val, itemEl, inputEl) {
					formValid.valid(inputEl);
				}
			},
			success : function(json, container) {
				//��Ŀ�е������������֤����
				formValid.add(container.find('input.catalog-ids'));
			}
		});
	},
	function() {
		//�����Դ
		$('#js_ds').bind('click', function(event) {
			var content = editor.getValue(), dsmoduleParam,
			//
			dsExce = /<script type="text\/dcms-ds">\s*(.*)\s*<\/script>\n*/ig;
			//console.log(editor.getLine(2));
			dataList = dsExce.exec(content);
			if (dataList) {
				dsmoduleParam = dataList[1];
			}
			D.box.datasource.showDsDialog(function(jsonArray) {
				var str = '';
				content = content.replace(dsExce, '');
				if (jsonArray && jsonArray.length) {
					str += '<script type="text\/dcms-ds">\n';
					str += JSON.stringify(jsonArray);
					str += '\n<\/script>\n';
				}
				str += content;
				editor.setValue(str);
			});
			//��ʼ�����Դtabҳ��
			if (dsmoduleParam) {
				try {
					dsmoduleParam = JSON.parse(dsmoduleParam);
				} catch(e) {
					alert('JSON��ʽת�����?');
					return;
				}

				try {
					$(document).trigger('box.datasource.MultiDs.init_datasource_event', [dsmoduleParam]);
				} catch(e) {
					alert('���?' + e);
				}
			} else {
				$(document).trigger('box.datasource.MultiDs.init_datasource_event');
			}
			D.box.datasource.idcDs && D.box.datasource.idcDs.init(null, editor);
			//��Դλ
			//D.box.datasource.Res && D.box.datasource.Res.init(dsmoduleParam,false);
			D.box.datasource.quoteDs && D.box.datasource.quoteDs.init(dsmoduleParam, true);
		});
	},
	//�زĿ�ѡ��
	function() {
		new FE.tools.MultChoice({
			area : '.lib-material',
			valueInput : '.lib-material .lib-ids',
			choice : function(val, itemEl, inputEl) {
				formValid.valid(inputEl);
			}
		});
		new FE.tools.MultChoice({
			area : '.apply-device',
			type : 'radio',
			ableCancel : false,
			valueInput : '.apply-device .apply-device-key',
			choice : function(val, itemEl, inputEl) {
				formValid.valid(inputEl);
			}
		});
	},
    
    function(){
        $('.item-form.last dd').append('<div class="con-auto-tdp"><a class="btn-basic btn-gray" id="btn-auto-tdp" href="#">�Ա���</a> <a class="btn-basic btn-gray" id="btn-redo-tdp" href="#">��ԭԴ��</a> <span>�뱣���δ����ǰ��Դ�룬���ⶪʧ��</span></div>');
        
        var oldContent;
        $('#btn-auto-tdp').click(function(e){
            e.preventDefault();
            oldContent = editor.getValue();
            
            var newContent = FE.orange.compileTDP(oldContent);
            editor.setValue(newContent);
        });
        
        $('#btn-redo-tdp').click(function(e){
            e.preventDefault();
            editor.setValue(oldContent);
        });
    },
    function(){
    	new FE.tools.MultChoice({//����ҳ��
			area : '.box-page-type',
			valueInput : '.box-page-type .box-page-type',
			choice : function(val, itemEl, inputEl) {
				formValid.valid(inputEl);
			}
		});
    }];

	var submit_module = function(remark, callback) {
		//�?��֤
		var formEl = $('#module-submit-form'), isValid = formValid.valid(), $self = $(this);

		if (isValid) {
			//����
			var moduleId = $('#module-id').val(), flag = $('#flag').val(), toLibUrl, saveConfig, sourceInput = $('#source');

			saveConfig = {
				'data' : formEl.serialize() + "&returnType=json",
				'url' : D.domain + '/page/box/json.html?_input_charset=utf-8',
				'toLibUrl' : toLibUrl,
				'editUrl' : D.domain + '/page/box/create_code_module.html',
				'complete' : function() {
					$self.removeClass('btn-disabled').addClass('btn-blue');

				}
			};
			$self.removeClass('btn-blue').addClass('btn-disabled');
			$.post(saveConfig.url, saveConfig.data, function(text) {
				var json = $.parseJSON(text);
				if (json) {
					$("#draft-id").val(json.data.draftId);
					if (json.status && json.status === 'success') {
						//�ύ,
						var data = {
							action : 'BoxModuleAction',
							'event_submit_do_submitModule' : true,
							draftId : $("#draft-id").val(),
							returnType : 'json',
							source : "module",
							remark : remark
						};
						D.submit(data, callback);

					}
				}
			}).complete(saveConfig.complete);
			;
		}

	};
    
    function validHtml(strHtml){
        //��֤JSON
        var paramHtml = $(strHtml).filter('script[type="text/dcms-param"]').html(),
            reg = /@param\(([^\)]*)\);/g,
            arrError = [], result, 
            errJson, errJsonL, errHtml;
        while ((result=reg.exec(paramHtml))!==null){
            if ((err=FE.orange.ValidGhtml.json(result[1]))!==true){
                arrError.push(errJson);
            }
        }
        errJsonL = arrError.length;
        
        //��֤��ǩ�Ƿ񶼱պ�
        errHtml = FE.orange.ValidGhtml.label(strHtml);
        if (errJsonL || errHtml!==true){
            return false;
        }
        return true;
    }
    
    function showErrorMessage(successFn){
        D.Msg['confirm']({
            'title' : '������ʾ',
            'body' : '<div class="fd-clr msg-content"><i class="tui-icon-36 icon-warning"></i><div class="msg">������ܴ��ڴ�����鿴������̨����</div></div>',
            'noclose' : true,
            'success' : function(e){
                e.data.dialog.dialog('close');
                
                successFn.call(this, arguments);
            }
        },{
            'open': function(){
                var dialog = $(this);
                dialog.addClass('dialog-error-msg');
                dialog.find('button.btn-submit').text('���Դ���');
                dialog.find('button.btn-cancel').text('�Ų����');
            },
            'close': function(){
                var dialog = $(this);
                dialog.removeClass('dialog-error-msg');
                dialog.find('button.btn-submit').text('ȷ��');
                dialog.find('button.btn-cancel').text('ȡ��');
            }
        });
    }
    
	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch (e) {
				if ($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		});
	});

	var checkValid = function(formEl) {
		var els = formEl.find('[data-valid]');
		var formValid = new FE.ui.Valid(els, {
			onValid : function(res, o) {

				var tip = $(this).nextAll('.validator-tip'), preTip = $(this).prevAll('.validator-tip'), msg;
				tip = $.merge(tip, preTip);
				if (tip.length > 1) {
					for (var i = 1, l = tip.length; i < l; i++) {
						tip.eq(i).remove();
					}
				}
				if (res === 'pass') {
					tip.hide();
					tip.removeClass('validator-error');
				} else {
					switch (res) {
						case 'required':
							//dialog��ʾ
							msg = o.key + '����Ϊ��';
							break;
						case 'sel-val':
							break;
						case 'int':
							msg = '����������';
							break;
						case 'float':
							msg = '��ȱ��������֣������ʾ���أ�С���ʾ�ٷֱ?';
							break;
						default:
							msg = '����д��ȷ������';
							break;
					}
					tip.show();
					tip.text(msg);
					tip.addClass('validator-error');

				}
			}
		});
		return formValid;
	};

})(dcms, FE.dcms);
