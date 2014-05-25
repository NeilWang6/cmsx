/**
 * @package FD.app.cms.viewpage
 * @author: quxiao
 * @Date: 2012-10-10
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
            var form = $('#dcms-page-audit')

            form.find('.submit-btn').click(function(){
                var msg='';
 
                if(msg!==''){
                      D.Message.confirm(confirmEl, {
                      title: '确定要审核通过？',
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
				var form=$('#choose-rule-form')[0];
				var previewStr = $(".preview-option").serialize();
				$('#dcms-view-page').attr('src', form.previewUrl.value + "&" + previewStr);
            });
            $('#blankPreview').click(function(){
            	var previewStr = $(".preview-option").serialize();
				var form=$('#choose-rule-form')[0];
				window.open(form.previewUrl.value + "&" + previewStr);
            });
            //multi browser preview
            $('#multipreview').click(function(){
            	
            	var form=$('#choose-rule-form')[0], param = '';
            	var previewStr = $(".preview-option").serialize();
            	param += 'pageId=' + form.pageId.value  + "&" + previewStr; 
            	//param += param.length > 0 ? ('&' + pos.join('&')) : '';
            	var screenUrl = 'surl=' +  encodeURIComponent(D.domain+'/page/dynamic/dynamic_view_content.html?'+param);
				$('#dcms-view-page').attr('src', D.domain + "/page/multiview.html?" + screenUrl);
            });  
            $(".preview-option").change(function(){
            	var value = $(this).val(),  name = '', detailId= $('option:selected', this).data('detailid') || '';
            	if (detailId) {
            		name = '_blk_'+$(this).data('blockid') + "_" + detailId;
            	}else if(value) {
            		name = '_blk_'+$(this).data('blockid');
            	}
            	$(this).attr('name', name);
            });
        },		
		function(){
            $('#fault-preview').click(function(){
				$('#action').val(1);
				$('#choose-rule-form').submit();
            });
        },
        function() { 
        	/**
    		 * 修改积木盒子动成页面
    		 */
    		$('.list-urls').delegate('.js-modification', 'click', function(event) {
    			event.preventDefault();
    			var _this = $(this), pageId = _this.data('page-id');
    			$.getJSON(D.domain + '/page/box/can_edit_page.htm', {
    				'pageId' : pageId
    			}, D.EditPage.edit, 'text');
    			return false
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
