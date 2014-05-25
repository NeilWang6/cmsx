/**
 * @author zhaoyang.maozy
 * @userfor 设置页面属性浮层
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
    	html += '                    <a href="#" class="close">关闭</a>';
    	html += '                    <h5>发布设置</h5>';
    	html += '                </header>';
    	html += '                <section>';
    	html += '                </section>';
    	html += '                <footer>';
    	html += '                    <button type="button" class="btn-basic btn-blue mg-16 submit-btn">&nbsp;&nbsp;发&nbsp;&nbsp;布&nbsp;&nbsp;</button>';
    	html += '                    <button type="button" class="btn-basic btn-gray btn-cancel"> 返回编辑 </button>';
    	html += '                </footer>';    	
    	html += '            </div>';
    	html += '        </div>';
        $('body:last').append(html);
    	// $('body').append(html);
        // 注册关闭事件
        $('#moduleSetting').delegate('.btn-cancel, .close', 'click', closeDialog);
        // 注册保存事件
        $('#moduleSetting').delegate('.submit-btn', 'click', saveSetting);

        $('#moduleSetting').delegate('.js-preview-pagebox-updatemodule', 'click', function(){
        	var formPreview=$("#previewBoxPageWithUpdateModule");
        	
        	var pageId=$(this).data("pageid");
        	var updateModuleContent=context['content'];
        	var moduleId=context['moduleId'];
        	var url=D.domain + '/page/box/preview_box_page_with_update_module.htm';
        	formPreview.attr('action',url);
        	//window.location=url;
        	//创建一个form
        	$("#previewBoxPageWithUpdateModule #pageId").val(pageId);
        	$("#previewBoxPageWithUpdateModule #moduleId").val(moduleId);
        	$("#previewBoxPageWithUpdateModule #moduleContent").val(updateModuleContent);
        	
        	formPreview.submit();      	
        });
           	
    }
 
 
    /**
     * 保存属性
     */
    function saveSetting(e) {
    	//2013-04-09 11:32 qiuxq 增加一个确认对话框！确认后进行发布，取消则关闭浮动层。
    	//如果页面有勾选，则弹出该确认页面，如果没有勾选，直接保存组件
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
                'title': '系统提示',
                'body': '<div class="header-dialog-content"><div class="sync_tip"><div class="font_style_bold_big">请确认发布组件到页面!</div><div class="font_style_normal_big">发布组件后，将会同步更新到选中的页面。<br/>请确认是否同步到选择的页面？</div></div></div>',
                success:function(evt){
                	doPublish();
                },
                close:function(evt){
                	//alert('关闭');
                }
            });
        	
        }else{
        	doPublish();
        }
    }

    /**
     * 执行保存
     */
    function doPublish() {
    	//需要把选中的pageid拿到,中间用;隔开
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
                	/*qiuxiaoquan 03-27 此处应该组件id保存到页面，以便区分新建和修改*/
                	$('#module-moduleid').val(obj.id);
                	//同步组件复选框，此时应该隐藏掉了
                	$('#syncCheckBox').hide();                	
                	//alert('操作成功');
                	FE.dcms.Msg.alert({
                        'title': '系统提示',
                        'body': '<div class="header-dialog-content">操作成功</div>'
                    });
                }
            }
        }, 'text').error(function(xhr, stat) {
            saveBtn.removeAttr('disabled');
            if(stat == 'timeout') {
                //alert('请求超时!请稍后再试或与管理员联系！');
                FE.dcms.Msg.alert({
                    'title': '系统提示',
                    'body': '<div class="header-dialog-content">请求超时!请稍后再试或与管理员联系！</div>'
                });
            } else {
                //alert('保存失败!' + stat);
            	 FE.dcms.Msg.alert({
                     'title': '系统提示',
                     'body': '<div class="header-dialog-content">'+'保存失败!' + stat+'</div>'
                 });
            }
        });
    }

    /*
     * 关闭页面属性浮层
     */
    function closeDialog() {
        settingDialog && settingDialog.dialog('close');
        $("#moduleSetting").remove();
       
    }

    /*
     * 显示页面属性浮层
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
     * 显示页面属性
     */
    function showSync(text) {
    	//03-29 初始化dialog对话框，dialog-basic 冲突，会弹出多个dialog对话框
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
