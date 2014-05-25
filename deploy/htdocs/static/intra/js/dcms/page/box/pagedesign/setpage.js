/**
 * @author zhaoyang.maozy
 * @userfor ����ҳ�����Ը���
 * @date 2012-1-12
 */

;(function($, D) {
    var daftForm=$('#daftForm'),
        pageIdElm = daftForm.find('#pageId'),
        draftIdElm = daftForm.find('#draftId'),
        confirmEl = $('#dcms-message-confirm'),
        settingDialog, popTree,
        settingCallback,
        formValid,
        showSubmit = false;  
    
    var readyFun = [
	function(){
           popTree = new D.PopTree({modify: function(){
                $('#selectCatBtn').parent().find('.dcms-validator-error').css('display','none');
            }});
        },
        
        /*����ҳ������*/
	    function(){
	    	// �������ҳ������
	    	$('#dcms_box_grid_pageattribute').click(function (e){
	    		e.preventDefault();
	    		D.showSettingDialog();
	    	});
	    },
	    // ��ʼ������
	    function(){
	    	$('body:last').append('<div style="display:none;" id="settingDiv"></div>');
	    	// ע��ر��¼�
	    	$('#settingDiv').delegate('.cancelBtn', 'click', closeDialog);	
	    	// ע�ᱣ���¼�
	    	$('#settingDiv').delegate('.submit-btn', 'click', saveSetting);
	    },
	    // �ύҳ��
	    function(){
	    	//$('#btnDraftSubmit').click(submitDraft)
	    },
            //ѡ������
	    function(){
 	    	$('#settingDiv').delegate('#js-get-hostname', 'change', changeHost);
	    },
            //�ύ��
            function(){
                formValid = new FE.ui.Valid(null, {
                onValid: function(res, o){
                    var tip = $(this).nextAll('.dcms-validator-tip'), msg;
                    if (tip.length>1){
                        for (var i=0, l=tip.length-1; i<l; i++){
                            tip.eq(i).remove();
                        }
                    }
                    if (res==='pass') {
                        tip.removeClass('dcms-validator-error');
                    } else {
                    	showSubmit = false;
                        switch (res){
                            case 'required':
                                msg = o.key+' ����Ϊ��';
                                break;
                            case 'userIsWrong' :
                                msg = '�û�['+o.msg+']�����ڻ�Ȩ�޲���';
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
          }
    ];
    /**
     * ���ʱ��ؼ�
     */
    function initReleaseTimeDatepicker(){
        var releaseTimeDatepicker = $('#dcms-page-release-time');
        var nowDate = new Date().format('yyyy-MM-dd') + ' 00:00:00';
        releaseTimeDatepicker.datepicker({
            zIndex: 3000,
            triggerType: 'focus',
            minDate: new Date(),
            date: new Date.parseDate(nowDate),
            showTime: true,
            select: function(e, ui){
                doSelect(this, e, ui);
            },
            timeSelect: function(e, ui) {
                doSelect(this, e, ui);
                $(this).datepicker('hide');
            }
        });
        /**
         * ѡ��ʱ������ں�Ĳ���
         */
        function doSelect(el, e, ui) {
            var releaseTime=$(el);
            releaseTime.val(ui.date.format('yyyy-MM-dd hh:mm'));
        }
    }
    /**
     * �л���ʱ����ģʽ
     */
    function initIntervalTime(){
        var releaseTimeDatepicker = $('#dcms-page-release-time'),
            intervalTime=$('#dcms-page-interval-time');
        if ('timing'===intervalTime.val()) {
            releaseTimeDatepicker.css('display','inline');
        };
        intervalTime.change(function(){
            if('timing'===$(this).val()){
                releaseTimeDatepicker.css('display','inline');
            }else{
                releaseTimeDatepicker.css('display','none');
            }
        });
        
    }
    /**
     *
     */
     function changeHost(){
        var hostNameInput = $('#js-get-hostname'), hostNameSpan = $('#js-page-hostname'),
        hostName = hostNameInput.val();
        if (hostName){
            hostNameSpan.text('http://'+$(':selected', hostNameInput).text());
        }
        hostNameInput.change(function(){
            hostNameSpan.text('http://'+$(':selected', $(this)).text());
        });          
     }
    
    
    /**
     * �Է����ʼ��
     */
    function dialogInit(){
        initReleaseTimeDatepicker();
        initIntervalTime();
        //��ʼ����Ŀ
    	showSubmit = false;
        var categoryIdEl = $('#page-setting #selCategoryId'),
        categoryEl = $('#page-setting #selcategoryName'),
        selectCatBtn = $('#page-setting #selectCatBtn');
        popTree.show(selectCatBtn, categoryEl, categoryIdEl, false);
        selectCatBtn.click(function(){
            popTree.show(selectCatBtn, categoryEl, categoryIdEl);
        });
        //��ʼ������֤��
        formValid.add('#settingDiv [vg=1]');
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
    function saveSetting(e){
    	e.preventDefault();
    	showSubmit = true;
        // ��֤��
        if(formValid.valid()){
        	postSave();
        }
    }
    
    /**
     * ִ�б���
     */
    function postSave(){
    	var data=$('#page-setting #js-save-page').serialize(), saveBtn =$('#page-setting .submit-btn');
        saveBtn.attr('disabled', 'disabled');
    	$.post(D.domain + '/page/box/settingBoxPage.htm?_input_charset=UTF-8', data, function(text){
                saveBtn.removeAttr('disabled');
    		if (text && text.match(/^\s*\{.+\}\s*$/mg)) {
			    var obj=$.parseJSON(text) || {};
                // ����ҳ��ID
			    if(!pageIdElm.val() && obj.success){
                   pageIdElm.val(obj.pageId);
                }
    			closeDialog(); 
    			// �����ִ�лص�����(���ύҳ��)
    			if (settingCallback) {
                            settingCallback();
                            settingCallback = 0;
    			}
    		} else {
    			removeValidCache();
    			showSetting(text);
                // ��ʼ����Ŀ
                dialogInit();
    		}
    	}, 'text').error(function(xhr, stat){
            saveBtn.removeAttr('disabled');
            if(stat=='timeout'){
               alert('����ʱ!���Ժ����Ի������Ա��ϵ��');
            } else {
               alert('����ʧ��!' + stat)
            }
        });    	
    }
    
    /*
     * �ر�ҳ�����Ը���
     */
    function closeDialog(){
    	removeValidCache();
    	settingDialog && settingDialog.dialog('close');
    }
    
    /**
     * ɾ����֤���桡
     */
    function removeValidCache(){
    	formValid.remove('#settingDiv [vg=1]');
    }
    
    /*
     * ��ʾҳ�����Ը���
     */
    D.showSettingDialog = function(callback){
    	settingCallback = callback;
        var data={pageId:pageIdElm.val()}
        if (draftIdElm.val()) {
            data.draftId=draftIdElm.val();
        }		
        $.get(D.domain + '/page/box/settingBoxPage.htm', data, showSetting, 'text');    	
    }
    
    /*
     * ��ʾҳ������
     */
    function showSetting(text){
    	$('#settingDiv').html(text);
    	$.use('ui-dialog', function(){
                settingDialog = $('#settingDiv').dialog({
                  modal: true,
                  center :true,
                  draggable : true,
                  open: dialogInit
               });
    	 }); 	
    }

    $(function(){
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

    D.checkReleaseTime = function(){
        var releaseTimeDatepicker = $('#dcms-page-release-time'),
            intervalTime=$('#dcms-page-interval-time');
        if ('timing'===intervalTime.val()&&!releaseTimeDatepicker.val()) {
            return '��ѡ��ʱ��';
        }
        return true;
    }
    D.checkUserExist = function(config, handle){
        var self = this,
        userIds = $(this).val(),
        url = D.domain + '/page/check_user.html',
        opt = config['opt'],
        cfg = config['cfg'],
        data = {};
        data['users'] = userIds;
        data['permission'] = '';
        $.post(url, data, function(o){
            if (o!=='ok'){
                opt.msg = o;
                handle.call(self,'userIsWrong',opt);
            } else {
                cfg.isValid=true;
                handle.call(self,'pass',opt);
                showSubmit &&  postSave();
            }
        });
    }
})(dcms, FE.dcms);
