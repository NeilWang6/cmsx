/**
 * @author springyu
 * @userfor ʹ��JS����ҳ����ƹ��ܣ�ҳ���������
 * @date 2011-12-21
 */

;(function($, D) {
    /**
     * iframe margin-top �߶�
     */
    var confirmEl = $('#dcms-message-confirm'), draftForm = $('#daftForm'), templateIdElm = draftForm.find('#templateId'), draftIdElm = draftForm.find('#draftId');

    var readyFun = [
    /**
     * add by hongss on 2012.02.10 for ��קԪ����������Ƶ�ҳ������
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
                
                //��ʼ��������ͨ���������Ƿ��
                D.initBannerNav(doc);
                D.initCurrentGrids(doc);

                //ÿ��5�����Զ�����
                setInterval(function() {
                	saveDraft();
                }, 5 * 60 * 1000);
                //�ֶ�������Ƶ�ҳ������
                $('#dcms_box_grid_save').click(function() {
                	saveDraft();
                });
                //�ֶ�Ԥ����Ƶ�ҳ������
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
            	// �ύģ��
        		$('#dcms_box_grid_submit').click(function () {
        				// ҳ��ID�Ƿ�Ϊ��
        				var templateId = templateIdElm.val();
        				if (!templateId) {
        					D.Message.confirm(confirmEl, {
        						msg : '�Ƿ���������ģ������?�㡰ȡ������ֹ������',
        						title : '����δ����ģ������',
        						enter : function() {
        							D.showSettingDialog(function(){
        								saveDraft(submitDraft);
        							});
        						}
        					});
        					return;
        				}
        				// ���沢�ύ�ݸ�
        				saveDraft(submitDraft);
        		});  
        		
        		// ����ݸ�
        	    function saveDraft(callback){
       		    	   opts['complete'] = callback;
        		   D.sendContent.save(opts);	   
        		}
        	    
        	    // �ύ�ݸ�
        	    function submitDraft(){
        	    	var draftId = draftIdElm.val();
    				if (!draftId) {
    					D.Message.confirm(confirmEl, {
    						msg : 'ģ�廹δ���棬�뱣������ύҳ��!',
    						title : '��ʾ'
    					});
    					return;
    				}
                                draftForm.attr('target', '_self');
    				draftForm[0].action.value = 'BoxTemplateAction';
    				draftForm.find('#dcms-form-event-type').attr('name', 'event_submit_do_submit_template');
    				draftForm.submit();        	    	
        	    }
                                //ע��ˢ���¼�
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
     * ����ҳ�����
     */
    function setLocation(o){
       if(location.search.indexOf('draftId=')==-1){
          try{ 
        	    //����o.pageId��ʵ��ģ��Id
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
