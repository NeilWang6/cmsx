/**
 * @package FD.app.cms.viewpage
 * @author: quxiao
 * @Date: 2012-09-21
 */

 ;(function($, D){
     var confirmEl = $('#dcms-message-confirm');
     var readyFun = [
        /**
         * 隐藏/显示 规则选择模块
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
         * 提交 审核
         */
        function(){
            var form = $('#dcms-page-audit'),
            rscTotal=$('#dcms-page-audit-rsc-total'),
            rscPageList=$('#dcms-page-audit-rsc-page-list');
			// 获取模板关联多少页面
			var _relatePageCount=$('#relatePageCount').val();
			// 预览界面的审核，如果关联多个界面将会跳转到关联页面界面再审核
            $('#btnFirstAuditPass').click(function(){
                var msg='';

                if (rscTotal&&rscTotal.val()>50) {
                    msg='当前模板被'+rscTotal.val()+'个页面引用，审核请谨慎';
                }
                if (rscPageList&&rscPageList.val()) {
                    msg='当前模板被<b>定时(定点)发布</b>页面引用，审核请谨慎<br/>审核通过后，将在相应的时间自动上线<br/>'
                        +'相关的页面ID是：<br/>'+rscPageList.val();
                }
				// 没关联页面则提示下直接审核通过
                if (msg=='' && 0 == _relatePageCount) {
                    msg='模板审核通过后，前台页面将会应用此模板，请预览确认无误后再审核通过';
                }

                if(msg!==''){
                      D.Message.confirm(confirmEl, {
                      title: '确定要审核通过？',
                      msg: msg,
                      enter: function(){
                          doAudit();
                      }
                    });
                }else{
                    doAudit();
                }
            });
			// 查看模板关联页面的审核按钮直接通过
            $('#btnSecondAuditPass').click(function(){
                var msg= '模板审核通过后，前台页面将会应用此模板，请预览确认无误后再审核通过';

                D.Message.confirm(confirmEl, {
                  title: '确定要审核通过？',
                  msg: msg,
                  enter: function(){
		  				// 直接审核通过
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
	 // 审核
	 function doAudit(){
			// 获取模板关联多少页面
			var _relatePageCount=$('#relatePageCount').val();;
			var _templateName = $('#templateName').val();
			if (_relatePageCount >0 ){
				// 如果有关联的页面，跳转显式关联页面列表供查看再做审核
				window.location.href = D.domain + '/page/check_template_rela_page.html?action=template_manager_action&event_submit_do_check_template_rela_page=true&templateName='+_templateName;
			}else{
				var form = $('#dcms-page-audit');
				// 直接审核通过
				form.submit();
			}
	 }
 })(dcms, FE.dcms);
