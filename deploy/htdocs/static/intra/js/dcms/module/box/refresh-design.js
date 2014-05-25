/**
 * @author hongss
 * @userfor �������ҳ������ģ���е����ݲ���
 * @date  2012.02.13
 */
 	
;(function($, D, undefined){
    D.refreshContent = {
        
        /**
         * @methed  refresh ˢ��
         * @param opts ������  {container:el(jQuery���󣬴洢���ݵ�����), 
         *                        pageIdInput:input(jQuery���󣬴��pageId), 
         *                          draftIdInput:input(jQuery���󣬴��draftId), 
         *                            content:input(jQuery���󣬴��content),
         *                              form: form(jQuery����form��),
         *                                previewUrl:url
         *           doc   layout
         */
         refresh: function(opts,doc){
          opts['container'] = $('#design-container', doc);
           if (!(opts['container'])){ return;}
           //add by hongss on 2012.06.16 for ȥ�����б�ʶ
           D.DropInPage&&D.DropInPage.hideAllSingers();
           
            var url = D.domain+opts['previewUrl']+'?_input_charset=UTF-8';   //+'?draftId=' + opts['draftIdInput'].val()
            $.ajax({
               url: url,
	       timeout: 15000,
               type: "POST",
               data : {
                content : encodeURIComponent(opts['container'].html()),//����
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
                        title: '��ܰ��ʾ',
                        msg: tips,
                        enter: function(){
                            cancelBtn.show();
                        }
                      });
                }
            },
            error : function(){
            	alert("���ӳ�ʱ������ˢ�£�");
            }
        });            
        }
    }

    
})(dcms, FE.dcms);
