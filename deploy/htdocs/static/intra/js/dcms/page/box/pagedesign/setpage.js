/**
 * @author zhaoyang.maozy
 * @userfor 设置页面属性浮层
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
        
        /*设置页面属性*/
	    function(){
	    	// 点击设置页面属性
	    	$('#dcms_box_grid_pageattribute').click(function (e){
	    		e.preventDefault();
	    		D.showSettingDialog();
	    	});
	    },
	    // 初始化浮层
	    function(){
	    	$('body:last').append('<div style="display:none;" id="settingDiv"></div>');
	    	// 注册关闭事件
	    	$('#settingDiv').delegate('.cancelBtn', 'click', closeDialog);	
	    	// 注册保存事件
	    	$('#settingDiv').delegate('.submit-btn', 'click', saveSetting);
	    },
	    // 提交页面
	    function(){
	    	//$('#btnDraftSubmit').click(submitDraft)
	    },
            //选择域名
	    function(){
 	    	$('#settingDiv').delegate('#js-get-hostname', 'change', changeHost);
	    },
            //提交表单
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
                                msg = o.key+' 不能为空';
                                break;
                            case 'userIsWrong' :
                                msg = '用户['+o.msg+']不存在或权限不够';
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
          }
    ];
    /**
     * 添加时间控件
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
         * 选择时间或日期后的操作
         */
        function doSelect(el, e, ui) {
            var releaseTime=$(el);
            releaseTime.val(ui.date.format('yyyy-MM-dd hh:mm'));
        }
    }
    /**
     * 切换定时发布模式
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
     * 对方框初始化
     */
    function dialogInit(){
        initReleaseTimeDatepicker();
        initIntervalTime();
        //初始化类目
    	showSubmit = false;
        var categoryIdEl = $('#page-setting #selCategoryId'),
        categoryEl = $('#page-setting #selcategoryName'),
        selectCatBtn = $('#page-setting #selectCatBtn');
        popTree.show(selectCatBtn, categoryEl, categoryIdEl, false);
        selectCatBtn.click(function(){
            popTree.show(selectCatBtn, categoryEl, categoryIdEl);
        });
        //初始化表单验证器
        formValid.add('#settingDiv [vg=1]');
    }
    
    /*
     * 提交页面
     */
    /*function submitDraft(){
		// 页面ID是否为空
    	var pageId = pageIdElm.val(),draftId=draftIdElm.val(), data={'pageId':pageId, 'draftId':draftId, 'action':'PageManager', 'event_submit_do_submitBoxPage':'true'};
		if (!pageId) {
                        D.Message.confirm(confirmEl, {
                            msg: '是否现在设置页面属性?点“取消”终止本操作',
                            title: '您还未设置页面属性',
                            enter:function(){
                                 D.showSettingDialog(submitDraft);
                            }
                        });
			return ;
		}
		if (!draftId) {
                        D.Message.confirm(confirmEl, {
                            msg: '页面还未保存，请保存后再提交页面!',
                            title: '提示'
                        });
			return ;
		}
    	daftForm[0].action.value = 'PageManager';
    	daftForm.find('#dcms-form-event-type').attr('name', 'event_submit_do_submitBoxPage');	
    	var data=$('#page-setting #js-save-page').serialize();
    	daftForm.submit();		
    }    */
  
    /**
     * 保存属性
     */
    function saveSetting(e){
    	e.preventDefault();
    	showSubmit = true;
        // 验证表单
        if(formValid.valid()){
        	postSave();
        }
    }
    
    /**
     * 执行保存
     */
    function postSave(){
    	var data=$('#page-setting #js-save-page').serialize(), saveBtn =$('#page-setting .submit-btn');
        saveBtn.attr('disabled', 'disabled');
    	$.post(D.domain + '/page/box/settingBoxPage.htm?_input_charset=UTF-8', data, function(text){
                saveBtn.removeAttr('disabled');
    		if (text && text.match(/^\s*\{.+\}\s*$/mg)) {
			    var obj=$.parseJSON(text) || {};
                // 设置页面ID
			    if(!pageIdElm.val() && obj.success){
                   pageIdElm.val(obj.pageId);
                }
    			closeDialog(); 
    			// 保存后执行回调方法(如提交页面)
    			if (settingCallback) {
                            settingCallback();
                            settingCallback = 0;
    			}
    		} else {
    			removeValidCache();
    			showSetting(text);
                // 初始化类目
                dialogInit();
    		}
    	}, 'text').error(function(xhr, stat){
            saveBtn.removeAttr('disabled');
            if(stat=='timeout'){
               alert('请求超时!请稍后再试或与管理员联系！');
            } else {
               alert('保存失败!' + stat)
            }
        });    	
    }
    
    /*
     * 关闭页面属性浮层
     */
    function closeDialog(){
    	removeValidCache();
    	settingDialog && settingDialog.dialog('close');
    }
    
    /**
     * 删除验证缓存　
     */
    function removeValidCache(){
    	formValid.remove('#settingDiv [vg=1]');
    }
    
    /*
     * 显示页面属性浮层
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
     * 显示页面属性
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
            return '请选择时间';
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
