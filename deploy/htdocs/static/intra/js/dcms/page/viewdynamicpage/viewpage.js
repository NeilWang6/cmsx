/**
 * @package FD.app.cms.viewpage
 * @author: hongss
 * @Date: 2011-03-011
 */

 ;(function($, D){
     var confirmEl = $('#dcms-message-confirm');
     var readyFun = [
        /**
         * ����/��ʾ ����ѡ��ģ��
         */
        function(){
            setIframeHeight();
            $('#js-show-hide-rules').click(function(e){
                $(this).parent().toggleClass('choose-hide');
                setIframeHeight();
            });
            $(window).resize(function(){
                setIframeHeight();
            });
        },
        /**
         * �ύ ���
         */
        function(){
            var form = $('#dcms-page-audit'),
            rscTotal=$('#dcms-page-audit-rsc-total'),
            rscPageList=$('#dcms-page-audit-rsc-page-list');
            form.find('.submit-btn').click(function(){
                var msg='';
                if (rscTotal&&rscTotal.val()>50) {
                    msg='��ǰģ�屻'+rscTotal.val()+'��ҳ�����ã���������';
                }
                if (rscPageList&&rscPageList.val()) {
                    msg='��ǰģ�屻<b>��ʱ(����)����</b>ҳ�����ã���������<br/>���ͨ���󣬽�����Ӧ��ʱ���Զ�����<br/>'
                        +'��ص�ҳ��ID�ǣ�<br/>'+rscPageList.val();
                }
                if(msg!==''){
                      D.Message.confirm(confirmEl, {
                      title: 'ȷ��Ҫ���ͨ����',
                      msg: msg,
                      enter: function(){
                          form.submit();
                      }
                    });
                }else{
                    form.submit();
                }
            });
        },
		function(){
            $('#preview').click(function(){
				$('#choose-rule-form').submit();
            });
            $('#preview').click();
            //multi browser preview
            $('#multipreview').click(function(){
            	
            	var form=$('#choose-rule-form')[0], param = '';
            	param += 'pageId=' + form.pageId.value; 
            	var pos = [];
            	$('input[positionCode]').each(function(){
            		var i=$(this).attr('positioncode'), 
            		templateElm=$('select[name=templateId'+i+']'),
            		posName=$(this).attr('name'),
            		posValue=$(this).val(),
            		templateName=templateElm.attr('name'),
            		templateValue=templateElm.val();
            		posName && pos.push(posName + '=' + posValue);
            		templateName && pos.push(templateName + '=' + templateValue);
            	});
            	param += param.length > 0 ? ('&' + pos.join('&')) : '';
            	var screenUrl = 'surl=' +  encodeURIComponent(D.domain+'/page/view_context.htm?'+param);
				$('#dcms-view-page').attr('src', D.domain + "/page/multiview.html?" + screenUrl);
            });            
        },		
	function(){
            $('#sync-bt').click(function(){
				var _this = $(this);
				var param = _this.data('param');
				$.ajax({
				    url: D.domain + "/page/appCommand.html?" + param,
				    type: "GET"
				})
				.done(function(o) {
				    if (!!o) {
				        var data = $.parseJSON(o);
				        var content = '';
				        if ( data.success == true ) {
				            content = "�Ѿ���Ԥ�������·�ͬ��ָ�����ȼ����ӿɰ�Ԥ������Ԥ��";
				        } else if ( data.success == false ) {
				            content = "ϵͳ��������ϵ����Ա";
				        }
				        D.Message.confirm(confirmEl, {
				            msg: content,
				            title: '����ͬ��ģ��'
				        });
				    }
				})
				.fail(function() {
				    D.Message.confirm(confirmEl, {
				        msg: '��Ԥ�������·�ͬ��ָ��ʧ��',
				        title: '����ͬ��ģ��'
				    });
				});
            });
        }
     ];
     
     $(function(){
         for (var i=0, l=readyFun.length; i<l; i++) {
             try {
                 readyFun[i]();
             } catch(e) {
                 if ($.log) {
                     $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                 }
             } finally {
                 continue;
             }
         }
     });
     
     function setIframeHeight() {
         var winHeight = $(window).height(),
         headHeight = $('.dcms-header-view').outerHeight();
         $('#dcms-view-container').css('height', (winHeight-headHeight)+'px');
         $('#dcms-view-container iframe').attr('height', winHeight-headHeight);
     }
 })(dcms, FE.dcms);
