/**
 * @package FD.app.cms.viewpage
 * @author: quxiao
 * @Date: 2012-09-21
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
			// ��ȡģ���������ҳ��
			var _relatePageCount=$('#relatePageCount').val();
			// Ԥ���������ˣ��������������潫����ת������ҳ����������
            $('#btnFirstAuditPass').click(function(){
                var msg='';

                if (rscTotal&&rscTotal.val()>50) {
                    msg='��ǰģ�屻'+rscTotal.val()+'��ҳ�����ã���������';
                }
                if (rscPageList&&rscPageList.val()) {
                    msg='��ǰģ�屻<b>��ʱ(����)����</b>ҳ�����ã���������<br/>���ͨ���󣬽�����Ӧ��ʱ���Զ�����<br/>'
                        +'��ص�ҳ��ID�ǣ�<br/>'+rscPageList.val();
                }
				// û����ҳ������ʾ��ֱ�����ͨ��
                if (msg=='' && 0 == _relatePageCount) {
                    msg='ģ�����ͨ����ǰ̨ҳ�潫��Ӧ�ô�ģ�壬��Ԥ��ȷ������������ͨ��';
                }

                if(msg!==''){
                      D.Message.confirm(confirmEl, {
                      title: 'ȷ��Ҫ���ͨ����',
                      msg: msg,
                      enter: function(){
                          doAudit();
                      }
                    });
                }else{
                    doAudit();
                }
            });
			// �鿴ģ�����ҳ�����˰�ťֱ��ͨ��
            $('#btnSecondAuditPass').click(function(){
                var msg= 'ģ�����ͨ����ǰ̨ҳ�潫��Ӧ�ô�ģ�壬��Ԥ��ȷ������������ͨ��';

                D.Message.confirm(confirmEl, {
                  title: 'ȷ��Ҫ���ͨ����',
                  msg: msg,
                  enter: function(){
		  				// ֱ�����ͨ��
						form.submit();
                  }
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
     };
	 // ���
	 function doAudit(){
			// ��ȡģ���������ҳ��
			var _relatePageCount=$('#relatePageCount').val();;
			var _templateName = $('#templateName').val();
			if (_relatePageCount >0 ){
				// ����й�����ҳ�棬��ת��ʽ����ҳ���б��鿴�������
				window.location.href = D.domain + '/page/check_template_rela_page.html?action=template_manager_action&event_submit_do_check_template_rela_page=true&templateName='+_templateName;
			}else{
				var form = $('#dcms-page-audit');
				// ֱ�����ͨ��
				form.submit();
			}
	 }
 })(dcms, FE.dcms);
