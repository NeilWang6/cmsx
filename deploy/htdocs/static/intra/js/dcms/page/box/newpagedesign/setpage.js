/**
 * @author zhaoyang.maozy
 * @userfor ����ҳ�����Ը���
 * @date 2012-1-12
 */

;(function($, D) {
    var daftForm = $('#daftForm'), pageIdElm = daftForm.find('#pageId'), applyDeviceElm = daftForm.find('#applyDevice'), draftIdElm = daftForm.find('#draftId'), confirmEl = $('#dcms-message-confirm'), settingDialog, popTree, settingCallback, formValid, showSubmit = false;
    var afterDialogInit;
    var readyFun = [
    function() {
        popTree = new D.PopTree({
            modify : function() {
                $('#selectCatBtn').parent().find('.dcms-validator-error').css('display', 'none');
            }
        });
    },

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
        $('body:last').append('<div class="dialog-basic setting-dialog" id="settingDiv" style="display:none;"><div class="dialog-b"><header><a href="#" class="close">�ر�</a><h5>����ҳ������</h5></header><section></section><footer><button type="button" class="btn-basic btn-blue btn-submit">�� ��</button>&nbsp;&nbsp;<button type="button" class="btn-basic btn-gray btn-cancel">ȡ ��</button></footer></div></div>');
        // ע��ر��¼�
        $('#settingDiv').delegate('.btn-cancel,.close', 'click', closeDialog);
        // ע�ᱣ���¼�
        $('#settingDiv').delegate('.btn-submit', 'click', saveSetting);
    },
    // �ύҳ��
    function() {
        //$('#btnDraftSubmit').click(submitDraft)
    },
    //ѡ������
    function() {
        $('#settingDiv').delegate('#js-get-hostname', 'change', changeHost);
    },
    //�ύ��
    function() {
        formValid = new FE.ui.Valid(null, {
            onValid : function(res, o) {
                var tip = $(this).nextAll('.dcms-validator-tip'), msg;
                if(tip.length > 1) {
                    for(var i = 0, l = tip.length - 1; i < l; i++) {
                        tip.eq(i).remove();
                    }
                }
                if(res === 'pass') {
                    tip.removeClass('dcms-validator-error');
                } else {
                    showSubmit = false;
                    switch (res) {
                        case 'required':
                            msg = o.key + ' ����Ϊ��';
                            break;
                        case 'userIsWrong' :
                            msg = '�û�[' + o.msg + ']�����ڻ�Ȩ�޲���';
                            break;
                        default:
                            msg = '����д��ȷ������';
                            break;
                    }
                    tip.text(msg);
                    tip.addClass('dcms-validator-error');
                }
            }
        });
    }];
    /**
     * ���ʱ��ؼ�
     */
    function initReleaseTimeDatepicker() {
        var releaseTimeDatepicker = $('#dcms-page-release-time');
        var nowDate = new Date().format('yyyy-MM-dd') + ' 00:00:00';
        releaseTimeDatepicker.datepicker({
            zIndex : 3000,
            triggerType : 'focus',
            minDate : new Date(),
            date : new Date.parseDate(nowDate),
            showTime : true,
            select : function(e, ui) {
                doSelect(this, e, ui);
            },
            timeSelect : function(e, ui) {
                doSelect(this, e, ui);
                $(this).datepicker('hide');
            }
        });
        /**
         * ѡ��ʱ������ں�Ĳ���
         */
        function doSelect(el, e, ui) {
            var releaseTime = $(el);
            releaseTime.val(ui.date.format('yyyy-MM-dd hh:mm'));
        }

    }

    /**
     * �л���ʱ����ģʽ
     */
    function initIntervalTime() {
        var releaseTimeDatepicker = $('#dcms-page-release-time'), intervalTime = $('#dcms-page-interval-time');
        if('timing' === intervalTime.val()) {
            releaseTimeDatepicker.css('display', 'inline');
        };
        intervalTime.change(function() {
            if('timing' === $(this).val()) {
                releaseTimeDatepicker.css('display', 'inline');
            } else {
                releaseTimeDatepicker.css('display', 'none');
            }
        });

    }

    /**
     *
     */
    function changeHost() {
        var hostNameInput = $('#js-get-hostname'), hostNameSpan = $('#js-page-hostname'), hostName = hostNameInput.val();
        if(hostName) {
            hostNameSpan.text('http://' + $(':selected', hostNameInput).text());
        }
        hostNameInput.change(function() {
            hostNameSpan.text('http://' + $(':selected', $(this)).text());
        });
    }

    /**
     * �Է����ʼ��
     */
    function dialogInit(e) {
    	new FE.tools.MultChoice({//����ҳ��
			area : '.box-page-type',
			type : 'radio',
			ableCancel : false,
			valueInput : '.box-page-type .box-page-type',
			choice : function(val, itemEl, inputEl) {
				formValid.valid(inputEl);
			}
		});
        initReleaseTimeDatepicker();
        initIntervalTime();
        //��ʼ����Ŀ
        showSubmit = false;
        var categoryIdEl = $('#page-setting #selCategoryId'), categoryEl = $('#page-setting #selcategoryName'), selectCatBtn = $('#page-setting #selectCatBtn');
        popTree.show(selectCatBtn, categoryEl, categoryIdEl, false);
        selectCatBtn.click(function() {
            popTree.show(selectCatBtn, categoryEl, categoryIdEl);
        });
        
        //�����豸-�ֻ�
        var dialogEl = $(e.target),
            deviceEl = dialogEl.find('.js-apply-device'),
            headerEl = dialogEl.find('.js-standed-header'),
            footerEl = dialogEl.find('.js-standed-footer'),
            gridHiddenEl = dialogEl.find('#hide-grid'),
            gridEl = dialogEl.find('#select-grid');
        
        deviceEl.on('change', function(e){
            if ($(this).val()==='phone'){
                headerEl.val('user_defined_header');  //�Զ���ͷ��
                footerEl.val('user_defined_footer');  //�Զ���β��
                //gridEl.val('layoutY720');  //��Ϊդ��������ԣ���ʱ�ĳɲ�����
            }
        });
        
        //��ʼ������֤��
        formValid.add('#settingDiv [vg=1]');
		$("#settingDiv").find(".btn-cancel").show();
		$("#settingDiv").find(".close").show();
        $('#settingDiv').find(".operating-area").hide();
		/*$("#page-setting").find(".adv-content-seo").hide();
		$("#page-setting").find(".adv-content-adv").hide();*/
		$("#page-setting").find(".hide-icon").removeClass("hide-icon").addClass("icon");
		$("#page-setting").find(".adv-title").width("123px");
		//�״��½�ҳ��cancel��ť�����أ������ſ�����ʾ
    	$("#page-setting").delegate(".more","click",function(e){
    		e.preventDefault();
    		var $this = $(this);
    		if($this.hasClass("hide-adv")){
    			$this.removeClass("hide-adv").addClass("show-adv");
                $('#page-setting').find('.adv-opts').show(200);
    			/*if($this.hasClass("adv-tab-seo")){
    				$("#page-setting").find(".adv-content-seo").show();
    			}else{
    				$("#page-setting").find(".adv-content-adv").show();
    			}*/
    		}else{
    			$this.removeClass("show-adv").addClass("hide-adv");
                $('#page-setting').find('.adv-opts').hide(200);
    			/*if($this.hasClass("adv-tab-seo")){
	    			$("#page-setting").find(".adv-content-seo").hide();
    			}else{
    				$("#page-setting").find(".adv-content-adv").hide();
    			}*/
    		}
    	});
        if(afterDialogInit){
        	afterDialogInit();
        }
    }

    /*
    * �ύҳ��
    */
    /*function submitDraft(){
    // ҳ��ID�Ƿ�Ϊ��
    var pageId = pageIdElm.val(),draftId=draftIdElm.val(), data={'pageId':pageId, 'draftId':draftId, 'action':'PageManager', 'event_submit_do_submitBoxPage':'true'};
    if (!pageId) {
    D.Message.confirm(confirmEl, {
    msg: '�Ƿ���������ҳ������?�㡰ȡ������ֹ������',
    title: '����δ����ҳ������',
    enter:function(){
    D.showSettingDialog(submitDraft);
    }
    });
    return ;
    }
    if (!draftId) {
    D.Message.confirm(confirmEl, {
    msg: 'ҳ�滹δ���棬�뱣������ύҳ��!',
    title: '��ʾ'
    });
    return ;
    }
    daftForm[0].action.value = 'PageManager';
    daftForm.find('#dcms-form-event-type').attr('name', 'event_submit_do_submitBoxPage');
    var data=$('#page-setting #js-save-page').serialize();
    daftForm.submit();
    }    */

    /**
     * ��������
     */
    function saveSetting(e) {
        e.preventDefault();
        showSubmit = true;
        // ��֤��
        if(formValid.valid()) {
            postSave();
        }
    }

    /**
     * ִ�б���
     */
    function postSave() {
    	//�豸������Ҫ���浽draftForm����
    	var settingApplyDevice= $('#page-setting #js-save-page #settingApplyDevice').val();
    	$('#daftForm #applyDevice').val(settingApplyDevice);
    	
        var data = $('#page-setting #js-save-page').serialize(), saveBtn = $('#page-setting .submit-btn');
        saveBtn.attr('disabled', 'disabled');
        //return;
        data += '&' + $('#is_save_content').attr('name') + '=' + $('#is_save_content').val();
        $.post(D.domain + '/page/box/settingBoxPage.htm?_input_charset=UTF-8', data, function(text) {
            saveBtn.removeAttr('disabled');
            if(text && text.match(/^\s*\{.+\}\s*$/mg)) {
                var obj = $.parseJSON(text) || {};
                // ����ҳ��ID
                if(!pageIdElm.val() && obj.success) {
                    pageIdElm.val(obj.pageId);
                }
                // ���ҳ������
                if (obj.isDynamic) $('#preType').val('dynamicPage');
                closeDialog();
                // �����ִ�лص�����(���ύҳ��)
                if(settingCallback) {

                    if(obj.success) {
                        settingCallback(obj.pageId);
                    } else {
                        settingCallback(pageIdElm.val());
                    }

                    settingCallback = 0;
                }
            } else {
                removeValidCache();
                showSetting(text);
                // ��ʼ����Ŀ
                dialogInit();
            }
        }, 'text').error(function(xhr, stat) {
            saveBtn.removeAttr('disabled');
            if(stat == 'timeout') {
                alert('����ʱ!���Ժ����Ի������Ա��ϵ��');
            } else {
                alert('����ʧ��!' + stat)
            }
        });
    }

    /*
     * �ر�ҳ�����Ը���
     */
    function closeDialog() {
        removeValidCache();
        settingDialog && settingDialog.dialog('close');
    }

    /**
     * ɾ����֤���桡
     */
    function removeValidCache() {
        formValid.remove('#settingDiv [vg=1]');
    }

    /*
     * ��ʾҳ�����Ը���
     */
    D.showSettingDialog = function(callback, dialogInitCallback,applyDevice) {
        settingCallback = callback;
        afterDialogInit = dialogInitCallback;
        var data = {
            pageId : pageIdElm.val()
        }
        if(draftIdElm.val()) {
            data.draftId = draftIdElm.val();
        }
        if(applyDeviceElm.val()) {
            data.applyDevice = applyDeviceElm.val();
        }
        $.get(D.domain + '/page/box/settingBoxPage.htm', data, showSetting, 'text');
    }
    /*
     * ��ʾҳ������
     */
    function showSetting(text) {
        var $settingDiv = $('#settingDiv');
        $settingDiv.find("section").html(text);
        $.use(['ui-dialog'], function() {
            settingDialog = $settingDiv.dialog({
                modal : true,
                center : true,
                draggable : true,
                open : dialogInit
            });
        });
    }

    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });

    D.checkReleaseTime = function() {
        var releaseTimeDatepicker = $('#dcms-page-release-time'), intervalTime = $('#dcms-page-interval-time');
        if('timing' === intervalTime.val() && !releaseTimeDatepicker.val()) {
            return '��ѡ��ʱ��';
        }
        return true;
    }
    D.checkUserExist = function(config, handle) {
        var self = this, userIds = $(this).val(), url = D.domain + '/page/check_user.html', opt = config['opt'], cfg = config['cfg'], data = {};
        data['users'] = userIds;
        data['permission'] = '';
        $.post(url, data, function(o) {
            if(o !== 'ok') {
                opt.msg = o;
                handle.call(self, 'userIsWrong', opt);
            } else {
                cfg.isValid = true;
                handle.call(self, 'pass', opt);
                showSubmit && postSave();
            }
        });
    }
})(dcms, FE.dcms);
