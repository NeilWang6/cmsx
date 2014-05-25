/**
 * @author springyu
 * @userfor 使用JS加载页面设计功能，页面操作功能
 * @date 2011-12-21
 */

;(function($, D) {
    /**
     * iframe margin-top 高度
     */
    var confirmEl = $('#dcms-message-confirm'), draftForm = $('#daftForm'), templateIdElm = draftForm.find('#templateId'), draftIdElm = draftForm.find('#draftId');

    var readyFun = [
    /**
     * add by hongss on 2012.02.10 for 拖拽元件、保存设计的页面内容
     */
    function() {
        D.DropInPage.init({
            callback : function(doc) {
                var opts = {}, data = {}, iconSuccess = $('.dcms-save-success');
                data['action'] = 'BoxDraftAction';
                data['event_submit_do_saveTemplateDraft'] = true;
                opts['container'] = $('#design-container', doc);
                opts['pageIdInput'] = templateIdElm;
                opts['draftIdInput'] = draftIdElm;
                opts['data'] = data;
                var content = $.trim($('#textarea-content').text());
                opts['success'] = function(o) {
                    setLocation(o);
                    iconSuccess.show(200);
                    setTimeout(function() {
                        iconSuccess.hide(200);
                    }, 1300);
                };
                if(content) {
                    //opts['container'].html(content);
                    D.InsertHtml.init(content, opts['container'], 'html', doc);
                }
                
                //初始化“增加通栏导航”是否打勾
                D.initBannerNav(doc);
                D.initCurrentGrids(doc);

                //每隔5分钟自动保存
                setInterval(function() {
                	saveDraft();
                }, 5 * 60 * 1000);
                //手动保存设计的页面内容
                $('#dcms_box_grid_save').click(function() {
                	saveDraft();
                });
                //手动预览设计的页面内容
                $('#dcms_box_grid_pre').click(function() {
                    var options = {};
                    options['container'] = opts['container'];
                    options['pageIdInput'] = opts['pageIdInput'];
                    options['draftIdInput'] = opts['draftIdInput'];
                    options['form'] = draftForm;
                    options['content'] = $('#textarea-content');
                    options['previewUrl'] = '/page/box/preview_draft.html';
                    D.sendContent.review(options);
                });
            	// 提交模板
        		$('#dcms_box_grid_submit').click(function () {
        				// 页面ID是否为空
        				var templateId = templateIdElm.val();
        				if (!templateId) {
        					D.Message.confirm(confirmEl, {
        						msg : '是否现在设置模板属性?点“取消”终止本操作',
        						title : '您还未设置模板属性',
        						enter : function() {
        							D.showSettingDialog(function(){
        								saveDraft(submitDraft);
        							});
        						}
        					});
        					return;
        				}
        				// 保存并提交草稿
        				saveDraft(submitDraft);
        		});  
        		
        		// 保存草稿
        	    function saveDraft(callback){
       		    	   opts['complete'] = callback;
        		   D.sendContent.save(opts);	   
        		}
        	    
        	    // 提交草稿
        	    function submitDraft(){
        	    	var draftId = draftIdElm.val();
    				if (!draftId) {
    					D.Message.confirm(confirmEl, {
    						msg : '模板还未保存，请保存后再提交页面!',
    						title : '提示'
    					});
    					return;
    				}
                                draftForm.attr('target', '_self');
    				draftForm[0].action.value = 'BoxTemplateAction';
    				draftForm.find('#dcms-form-event-type').attr('name', 'event_submit_do_submit_template');
    				draftForm.submit();        	    	
        	    }
                                //注册刷新事件
                var refreshCon = $('#design-container', doc);
                 $('.bar-a-refresh').bind('click', function(e){
                   var options = {};
                    options['container'] = refreshCon;
                    options['previewUrl'] = '/page/box/fresh_draft.html';
                    D.refreshContent.refresh(options,doc);
                 });
            }
        });
    },function(){
    	var docIframe = $('iframe#dcms_box_main');
        docIframe.bind('load',function(){
        	var _self = $(this).contents().find('#design-container');
        	var hiddenJson=_self.find(".dcms-ds-module-data");
        	if (hiddenJson&&hiddenJson.length===0){
        	_self.prepend("<input type='hidden' id = 'dcms-ds-module-data' class='dcms-ds-module-data' value=''/>");
            	hiddenJson=_self.find(".dcms-ds-module-data");
        	}
        url = D.domain+'/page/ds/ds_module_select_ds.html?action=ds_module_action&event_submit_do_fetch_page_ds_module=true';
        D.getDssData(url,hiddenJson.val());
        });
    }
   ];
        
    /**
     * @author zhaoyang
     * 设置页面参数
     */
    function setLocation(o){
       if(location.search.indexOf('draftId=')==-1){
          try{ 
        	    //这里o.pageId其实是模板Id
               history.pushState(o, null,  D.domain + '/page/box/template_design.html?draftId='+o.draftId+(o.pageId?'&templateId='+o.pageId:''));
          }catch(e){        
          }
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
