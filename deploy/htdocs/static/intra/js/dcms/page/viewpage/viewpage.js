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
            rscPageList=$('#dcms-page-audit-rsc-page-list'),
            pubIntervalTime=""+$('#pubIntervalTime').val();

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
                    if(pubIntervalTime==""){
                        form.submit();
                    }else{
                    	D.Msg.confirm({
							'title' : '��ʾ',
							'body' : '��ҳ�汻����Ϊ����ʱ�������������ѡ���������������ܻὫ�����˴����������鷢�����ߡ�',
							'success' : function(evt) {
                                $("#pubNowFlag").val("true");
								form.submit();
				            }
						}, {
                            'open': function(o){
                                var dialogEl = $(this),
                                    subBtnEl = dialogEl.find('.btn-submit');
                                dialogEl.off('click.pubSetTime', '.pub-settime');
                                subBtnEl.text('��������');
                                if (!dialogEl.find('.pub-settime')[0]){
                                    subBtnEl.after(' <button class="btn-basic btn-gray btn-cancel pub-settime">��ʱ����</button>');
                                }
                                dialogEl.on('click', '.pub-settime', function(){
                                    $("#pubNowFlag").val("false");
                                    form.submit();
                                });
                            }
                        });
                    }
                }
            });
            
            
        },
		function(){
            $('#preview').click(function(){
				$('#action').val(0);
				$('#choose-rule-form').submit();
            });
            //multi browser preview
            $('#multipreview').click(function(){

            	var form=$('#choose-rule-form')[0], param = '';
            	param += 'pageId=' + form.pageId.value;
            	param += '&positionSize=' + (form.positionSize.value || 0);
            	param += '&faultPreview=' + (form.faultPreview.value || 0);
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
            $('#fault-preview').click(function(){
				$('#action').val(1);
				$('#choose-rule-form').submit();
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
