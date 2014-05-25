/**
 * @author hongss
 * @userfor 保存设计页面和设计模板中的内容部分
 * @date  2012.02.13
 */
 	
;(function($, D, undefined){
    D.refreshContent = {
        
        /**
         * @methed  refresh 刷新
         * @param opts 配置项  {container:el(jQuery对象，存储内容的容器), 
         *                        pageIdInput:input(jQuery对象，存放pageId), 
         *                          draftIdInput:input(jQuery对象，存放draftId), 
         *                            content:input(jQuery对象，存放content),
         *                              form: form(jQuery对象，form表单),
         *                                previewUrl:url
         *           doc   layout
         */
         refresh: function(opts,doc){
          opts['container'] = $('#design-container', doc);
           if (!(opts['container'])){ return;}
           //add by hongss on 2012.06.16 for 去除所有标识
           D.DropInPage&&D.DropInPage.hideAllSingers();
           
            var url = D.domain+opts['previewUrl']+'?_input_charset=UTF-8';   //+'?draftId=' + opts['draftIdInput'].val()
            $.ajax({
               url: url,
	       timeout: 15000,
               type: "POST",
               data : {
                content : encodeURIComponent(opts['container'].html()),//编码
                noRemove:true
                },
            success: function(o){
            	var data = $.parseJSON(o);
            	var message=data.message;
            	var tips=data.tips;
            	if(!message){
                 D.InsertHtml.init(data.content, opts['container'], 'html', doc);
                 D.DropInPage.getGlobalAttr(doc);
                }else{
                	alert(message);
                }
                if(tips){
                    var confirmEl = $('#dcms-message-confirm');
                    var cancelBtn = $('.js-cancel-btn', confirmEl);
                    cancelBtn.hide();
                    D.Message.confirm(confirmEl, {
                        title: '温馨提示',
                        msg: tips,
                        enter: function(){
                            cancelBtn.show();
                        }
                      });
                }
            },
            error : function(){
            	alert("连接超时请重新刷新！");
            }
        });            
        }
    }

    
})(dcms, FE.dcms);
