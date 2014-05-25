/**
 * @author springyu
 * @userfor 使用JS加载页面设计功能，页面操作功能
 * @date 2011-12-21
 */

;(function($, D) {
    /**
     * iframe margin-top 高度
     */
    var IFRAME_MARGIN_TOP = 40;

    var readyFun = [

    /**
     * add by hongss on 2012.02.10 for 拖拽元件、保存设计的页面内容
     */
    function(){
        D.DropInPage.init({
            callback: function(doc){
                var opts = {},
                    data = {},content,
                    iconSuccess = $('.dcms-save-success'),
                    draftForm=$('#daftForm'),
                    confirmEl = $('#dcms-message-confirm');
                
                data['action'] = 'BoxDraftAction';
                data['event_submit_do_savePageDraft'] = true;
                opts['container'] = $('#design-container', doc);
                opts['pageIdInput'] = $('#pageId');
                opts['draftIdInput'] = $('#draftId');
                opts['data'] = data;
                opts['complete'] = function(){
                        iconSuccess.show(200);
                    setTimeout(function(){
                        iconSuccess.hide(200);
                    }, 1300);
                };
                opts['success'] = function(o){
                    // 设置页面参数
                    o && setLocation(o);
                };
                content = $('#textarea-content').text();
                //opts['previewUrl'] = '/page/open/preview_box_page.html';
                //初始化时往页面中填充内容
                if ($.trim(content)){
                    D.InsertHtml.init(content, opts['container'], 'html', doc);
                }
                
                //初始化“增加通栏导航”是否打勾
                D.initBannerNav(doc);
                D.initCurrentGrids(doc);
                
                //每隔5分钟自动保存
                setInterval(function(){
                    opts['isReview'] = false;
                    D.sendContent.save(opts);
                }, 5*60*1000);
                
                //手动保存设计的页面内容
                $('#dcms_box_grid_save').click(function(){
                    opts['isReview'] = false;
                    
                    D.sendContent.save(opts,doc);
                });
                
                //手动预览设计的页面内容
                $('#dcms_box_grid_pre').click(function(){
                    //opts['isReview'] = true;
                    //D.SaveDesign.init(opts);
                    var options = {};
                    options['container'] = opts['container'];
                    options['pageIdInput'] = opts['pageIdInput'];
                    options['draftIdInput'] = opts['draftIdInput'];
                    options['form'] = draftForm;
                    options['content'] = $('#textarea-content');
                    options['previewUrl'] = '/page/open/preview_box_page.html';
                    D.sendContent.review(options);
                });
                $('#dcms_box_grid_submit').click(function(){
                    var pageId = opts['pageIdInput'].val();
                    var msgTitle = '您还未设置页面属性';
		   // if($('#is-from-topic').val() == "true") {
		//	msgTitle = '专场活动页面，是否设置页面属性';
		   // }
                    if (!pageId) {
                        D.Message.confirm(confirmEl, {
                            msg: '是否现在设置页面属性?点“取消”终止本操作',
                            title: msgTitle,
                            enter:function(){
                                D.showSettingDialog(saveDraft);
                            }
                        });
                        return ;
                    }
                    
                    saveDraft();
                    
                });
                
                function submitDraft(){
                    draftForm[0].action.value = 'PageManager';
                    draftForm.find('#dcms-form-event-type').attr('name', 'event_submit_do_submitBoxPage');	
                    draftForm.attr('target', '_self');
                    draftForm.attr('action', '');
                    //var data=$('#page-setting #js-save-page').serialize();
                    
                    draftForm.submit();	
                }
                
                function saveDraft(){
                    opts['isReview'] = false;
                    opts['complete'] = submitDraft;
                    D.sendContent.save(opts);
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
    },function(){
        var docIframe = $('iframe#dcms_box_main');
        docIframe.bind('load',function(){
                $('.bar-a-refresh').click();
        });
    }
    /*,
    function (){
    	 //刷新按钮事件添加
    	 var docIframe = $('iframe#dcms_box_main');
            //docIframe.bind('load',function(){
        	var doc = docIframe.contents();
        	   var opts = {};
                opts['container'] = $('#design-container', doc);
                 $('.bar-a-refresh').bind('click', function(e){
                   var options = {};
                    options['container'] = opts['container'];
                    options['previewUrl'] = '/page/box/fresh_draft.html';
                    D.refreshContent.refresh(options,doc);
           //           });
        	
        });
    	        
                //
    }*/
    ];
 
   
    /**
     * @author zhaoyang
     * 设置页面参数
     */
    function setLocation(o){
       if(location.search.indexOf('draftId=')==-1){
          try{ 
               history.pushState(o, null, D.domain + '/page/box/page_design.html?draftId='+o.draftId+(o.pageId?'&pageId='+o.pageId:''));
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
