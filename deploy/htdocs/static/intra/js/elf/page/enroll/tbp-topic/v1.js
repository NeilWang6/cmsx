/**
 * @author: xiaotong.huangxt
 * @Date: 2013-03-15
 */

;(function($, T) {
	var readyFun = [
		function() {
			$(".button-area .submit").click(function(){
				//拼接body区域数据
				var offerValues=[];
				var j = 1;
				$('.item-operate').each(function(i, el){
					el = $(el);
					var value = {};
					
					if(($('.title', el).val() != "") && ($('.img', el).val() != "") && ($('.url', el).val() != "")) {
						value['id'] = String(j++);
						value['title'] = $('.title', el).val();
						value['img'] = $('.img', el).val();
						value['url'] = $('.url', el).val();
						if ( $('.open-price', el).attr("checked")){
							value['openPrice'] = 'Y';
						}else{
							value['openPrice'] = 'N';
						}
						offerValues.push(value);
					}
				});
				
				if(offerValues.length > 0) {
					$("#formSubmit .head").val($(".formBody .head").val());
					$("#formSubmit .body").val(JSON.stringify(offerValues));
					$("#formSubmit .foot").val($(".formBody .foot").val());
					if ($(".formBody .tbpInfoRec").attr("checked")){
						$("#formSubmit  .tbpInfoRec").val("Y");
					}else{
						$("#formSubmit  .tbpInfoRec").val("N");
					}
					$("#formSubmit .selfRecDisc").val($(".formBody .selfRecDisc").val());
					$("#formSubmit").submit();
				} else {
					alert("请填写主体区域offer信息，注意：每一行的三个输入框均为必填！");
				}
			});
		},
		
		function() {
			new FE.tools.AddDelMove({
				container:'.form-vertical',
			});
		},
		
		function() {	
			$('.tbp-topic-upload').on('click',function(){	
				$.use('ui-dialog', function(){
					var urlPost = T.domain + '/enroll/v2012/tbp_offer_excel_upload.json';
                    var dialog = $('.dialog-tbp-topic').dialog({
                        center: true,
                        fixed:true
                    });
                    $('.dialog-tbp-topic .btn-cancel, .dialog-tbp-topic .close').click(function(){
                        dialog.dialog('close');
                    });
                    $('.dialog-tbp-topic .btn-upload').click(function(){
                			var filePath = jQuery('.file-tbp-offer').val();
                			//判断是不是选择了上传文件，并且文件必须要以“.xls”结尾			
                			var options = {
									url:urlPost,
                			        dataType:  'json',
                			        async: false,
                			        beforeSubmit:function(){
										if(filePath && filePath.match(/.+\.xls$/ig)) {
					                        dialog.dialog('close');
											return true;
										}else{
											alert('请上传office 2003 excel文件！');
											return false;
										}
									},
									success:function(data){
	            						if(data && data != '') {
	            							if (data.fail == 'not2003excel'){
	            								alert('请上传office 2003 excel文件！');
	            							}else{
	            								dialog.dialog('close');
	            								var itemParent =  $('.item-operate:last').parent('.item-form');
	            								var cloneEl = $('.item-operate:last').clone();
	            								cloneEl.find('.icon-admm').css('display','inline-block');
	            								//清空已有的offer信息
	            								$('.item-form .item-operate').remove();
		        								var array = JSON.parse(data.offer);
		        								for (var e = 0; e < array.length; e++){
		        									cloneEl.find('.title').val(array[e].title);
		        									cloneEl.find('.img').val(array[e].img);
		        									cloneEl.find('.url').val(array[e].url);
		        									if (array[e].openPrice == 'N' || array[e].openPrice == 'n'){
		        										cloneEl.find('.open-price').removeAttr("checked");
		        									}else{
		        										cloneEl.find('.open-price').attr('checked','true');
		        									}
		        									itemParent.append(cloneEl);
		        									var cloneEl = $('.item-operate:last').clone();
		        								}
		        							} 
	            						}
									}
                			    };
                			$('#fileTbpOfferForm').unbind('submit').submit(function(){
                		        $(this).ajaxSubmit(options);
                		        return false;
                		    }); 
                    });
                    
                });
			});
		}
	];
	
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
})(jQuery, FE.tools);

