/**
 * @package FD.app.cms.viewpage
 * @author: hongss
 * @Date: 2011-03-011
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
            rscPageList=$('#dcms-page-audit-rsc-page-list'),
            pubIntervalTime=""+$('#pubIntervalTime').val();

            form.find('.submit-btn').click(function(){
                var msg='';
                if (rscTotal&&rscTotal.val()>50) {
                    msg='当前模板被'+rscTotal.val()+'个页面引用，审核请谨慎';
                }
                if (rscPageList&&rscPageList.val()) {
                    msg='当前模板被<b>定时(定点)发布</b>页面引用，审核请谨慎<br/>审核通过后，将在相应的时间自动上线<br/>'
                        +'相关的页面ID是：<br/>'+rscPageList.val();
                }
                if(msg!==''){
                      D.Message.confirm(confirmEl, {
                      title: '确定要审核通过？',
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
							'title' : '提示',
							'body' : '此页面被设置为“定时发布”，如果你选择立即发布，可能会将其他人待发布的区块发布上线。',
							'success' : function(evt) {
                                $("#pubNowFlag").val("true");
								form.submit();
				            }
						}, {
                            'open': function(o){
                                var dialogEl = $(this),
                                    subBtnEl = dialogEl.find('.btn-submit');
                                dialogEl.off('click.pubSetTime', '.pub-settime');
                                subBtnEl.text('立即发布');
                                if (!dialogEl.find('.pub-settime')[0]){
                                    subBtnEl.after(' <button class="btn-basic btn-gray btn-cancel pub-settime">定时发布</button>');
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
				            content = "已经向预发布机下发同步指定，等几分钟可绑定预发布机预览";
				        } else if ( data.success == false ) {
				            content = "系统错误，请联系管理员";
				        }
				        D.Message.confirm(confirmEl, {
				            msg: content,
				            title: '立即同步模板'
				        });
				    }
				})
				.fail(function() {
				    D.Message.confirm(confirmEl, {
				        msg: '向预发布机下发同步指定失败',
				        title: '立即同步模板'
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
