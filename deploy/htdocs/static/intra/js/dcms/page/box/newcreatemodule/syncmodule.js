/**
 * @author zhaoyang.maozy
 * @userfor ����ҳ�����Ը���
 * @date 2013-3-14
 */

;(function($, D) {
    var settingCallback, context;

    var readyFun = [
    ];    
    
    function generateModuleSettingDialog(){
    	var html = '';
    	html += '	<div class="dialog-basic" id="moduleSetting"  style="display:none;width: 860px;">';
    	html += '            <div class="dialog-b">';
    	html += '                <header>';
    	html += '                    <a href="#" class="close">�ر�</a>';
    	html += '                    <h5>��������</h5>';
    	html += '                </header>';
    	html += '                <section>';
    	html += '                </section>';
    	html += '                <footer>';
    	html += '                    <button type="button" class="btn-basic btn-blue mg-16 submit-btn">&nbsp;&nbsp;��&nbsp;&nbsp;��&nbsp;&nbsp;</button>';
    	html += '                    <button type="button" class="btn-basic btn-gray btn-cancel"> ���ر༭ </button>';
    	html += '                </footer>';    	
    	html += '            </div>';
    	html += '        </div>';
        $('body:last').append(html);
    	// $('body').append(html);
        // ע��ر��¼�
        $('#moduleSetting').delegate('.btn-cancel, .close', 'click', closeDialog);
        // ע�ᱣ���¼�
        $('#moduleSetting').delegate('.submit-btn', 'click', saveSetting);

        $('#moduleSetting').delegate('.js-preview-pagebox-updatemodule', 'click', function(){
        	var formPreview=$("#previewBoxPageWithUpdateModule");
        	
        	var pageId=$(this).data("pageid");
        	var updateModuleContent=context['content'];
        	var moduleId=context['moduleId'];
        	var url=D.domain + '/page/box/preview_box_page_with_update_module.htm';
        	formPreview.attr('action',url);
        	//window.location=url;
        	//����һ��form
        	$("#previewBoxPageWithUpdateModule #pageId").val(pageId);
        	$("#previewBoxPageWithUpdateModule #moduleId").val(moduleId);
        	$("#previewBoxPageWithUpdateModule #moduleContent").val(updateModuleContent);
        	
        	formPreview.submit();      	
        });
           	
    }
 
 
    /**
     * ��������
     */
    function saveSetting(e) {
    	//2013-04-09 11:32 qiuxq ����һ��ȷ�϶Ի���ȷ�Ϻ���з�����ȡ����رո����㡣
    	//���ҳ���й�ѡ���򵯳���ȷ��ҳ�棬���û�й�ѡ��ֱ�ӱ������
    	var pageIds="";
        $("#syncModulePageList input[name=pageId]:checked").each(function(){
        	pageIds = pageIds +$(this).val()+";";
        });
        
        if(pageIds){
        	var cancelBtn = $('.js-dialog .btn-cancel');
        	cancelBtn.css({
				"display" : 'inline'
			});
        	
        	FE.dcms.Msg.confirm({
                'title': 'ϵͳ��ʾ',
                'body': '<div class="header-dialog-content"><div class="sync_tip"><div class="font_style_bold_big">��ȷ�Ϸ��������ҳ��!</div><div class="font_style_normal_big">��������󣬽���ͬ�����µ�ѡ�е�ҳ�档<br/>��ȷ���Ƿ�ͬ����ѡ���ҳ�棿</div></div></div>',
                success:function(evt){
                	doPublish();
                },
                close:function(evt){
                	//alert('�ر�');
                }
            });
        	
        }else{
        	doPublish();
        }
    }

    /**
     * ִ�б���
     */
    function doPublish() {
    	//��Ҫ��ѡ�е�pageid�õ�,�м���;����
    	var pageIds="";
        $("#syncModulePageList input[name=pageId]:checked").each(function(){
        	pageIds = pageIds +$(this).val()+";";
        });

        var data = context, saveBtn = $('#moduleSetting .submit-btn');
        saveBtn.attr('disabled', 'disabled');
        data = $.extend(data || {} , {"action":'BoxModuleAction', "returnType":'json', "event_submit_do_submitSyncModule":true,"pageIds":pageIds});
        $.post(D.domain + '/page/box/json.htm?_input_charset=UTF-8', data, function(text) {
            saveBtn.removeAttr('disabled');
            if(text && text.match(/^\s*\{.+\}\s*$/mg)) {
                var obj = $.parseJSON(text) || {};
                if(obj.success) {
                	closeDialog();
                	/*qiuxiaoquan 03-27 �˴�Ӧ�����id���浽ҳ�棬�Ա������½����޸�*/
                	$('#module-moduleid').val(obj.id);
                	//ͬ�������ѡ�򣬴�ʱӦ�����ص���
                	$('#syncCheckBox').hide();                	
                	//alert('�����ɹ�');
                	FE.dcms.Msg.alert({
                        'title': 'ϵͳ��ʾ',
                        'body': '<div class="header-dialog-content">�����ɹ�</div>'
                    });
                }
            }
        }, 'text').error(function(xhr, stat) {
            saveBtn.removeAttr('disabled');
            if(stat == 'timeout') {
                //alert('����ʱ!���Ժ����Ի������Ա��ϵ��');
                FE.dcms.Msg.alert({
                    'title': 'ϵͳ��ʾ',
                    'body': '<div class="header-dialog-content">����ʱ!���Ժ����Ի������Ա��ϵ��</div>'
                });
            } else {
                //alert('����ʧ��!' + stat);
            	 FE.dcms.Msg.alert({
                     'title': 'ϵͳ��ʾ',
                     'body': '<div class="header-dialog-content">'+'����ʧ��!' + stat+'</div>'
                 });
            }
        });
    }

    /*
     * �ر�ҳ�����Ը���
     */
    function closeDialog() {
        settingDialog && settingDialog.dialog('close');
        $("#moduleSetting").remove();
       
    }

    /*
     * ��ʾҳ�����Ը���
     */
    D.showSyncDialog = function(moduleId, data, callback) {
        settingCallback = callback;
        context = data;
        $.ajax({
        	"url": D.domain + '/page/box/sync_module.htm',
        	"data": {"moduleId": moduleId},
        	"success": showSync,
        	"context": data,
        	"dataType": 'text'
        });
    }
    /*
     * ��ʾҳ������
     */
    function showSync(text) {
    	//03-29 ��ʼ��dialog�Ի���dialog-basic ��ͻ���ᵯ�����dialog�Ի���
    	generateModuleSettingDialog();
    	
        var $settingDiv = $('#moduleSetting');
        $('section', $settingDiv).html(text);
        //03-28
        $('#moduleSetting').delegate('#selectAll', 'click', selectAll);
      
        
        $.use(['ui-dialog', 'ui-draggable'], function() {
            settingDialog = $settingDiv.dialog({
                modal : true,
                center : true,
                draggable : false
            });
        });
    }
    function selectAll(){
    	if( $("#moduleSetting #selectAll").attr("checked") ){
    		$("#syncModulePageList input[name=pageId]").attr("checked",'true');
    	}else{
    		$("#syncModulePageList input[name=pageId]").removeAttr("checked");	    
    	}	
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
    
})(dcms, FE.dcms);
