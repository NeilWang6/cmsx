;(function($,T){
	var searchId = function(dom){
		var html = '<div class="dialog-basic convertId js-memberId-convert">\
	            <div class="dialog-b">\
	                <header>\
	                    <a href="#" class="close">关闭</a>\
	                    <h5>memberId互换loginId</h5>\
	                </header>\
	                <section class="only-txt">\
	                	<div class="convertId-content fd-clr">\
	                		<div style="float:left;">\
	                			<p style="">输入</p>\
	                			<textarea id="inputContent" style="width:130px;height:250px;resize:none;"></textarea>\
	                		</div>\
	                		<div style="float:left;height:100%;;line-height:100%;width:180px;text-align:center;">\
	                			<input type="button" style="margin-top:35%" id="js-convert-loginId" class="btn-basic btn-gray" value="memberId转换loginId"/>\
	                			<input type="button" id="js-convert-memberId" style="margin-top:15px;" class="btn-basic btn-gray" value="loginid转换memberId" />\
	                			<p class="js-outputContent-error" style="color:red;margin-top:15px;font-size:13px;text-align:left;width:170px;margin-left:15px;"></p>\
	                		</div>\
	                		<div style="float:left">\
	                			<p style="">输出</p>\
		                		<textarea id="outputContent" class="convertId-result" style="width:130px;height:250px;float:left;resize:none;" readonly>\
		                		</textarea>\
		                	</div>\
	                	</div>\
	                </section>\
	            </div>\
	        </div>';
		$('body').append(html);
		$(document).on('click',dom,function(){
			$('.js-outputContent-error').text('');
			$('#outputContent').val('');
			$('#inputContent').val('');
			$.use('ui-dialog',function(){
				$('.js-memberId-convert').dialog({
					fixed: true,
					center:true,
					modal:true,
					open: function(){
						// .off('click','#js-convert-loginId')
						$(document).off('click','#js-convert-loginId,#js-convert-memberId').on('click','#js-convert-loginId,#js-convert-memberId',function(){
							var a = $.trim($('#inputContent').val());
							var data = {ids:a.replace(/\n/g, ','),type:this.id,_csrf_token:$('input[name=_csrf_token]').val()};
							$.ajax({
								url:T.domain + '/tools/SwitchID.json',
								data:data,
								type:'post',
								dataType:'JSON'
							}).fail(function(data){
								var errorContent = $('.js-outputContent-error');
								errorContent.css('color','red').text('发生错误');
							}).done(function(data){
								// var data = {type:'success',info:'回传成功',data:'a,b,c'};
								var errorContent = $('.js-outputContent-error');
								errorContent.text('');
								var result = data.ids.replace(/\,/g,'\n');
								$('#outputContent').val(result);
								if( data.ids ){
									errorContent.css('color','green').text('成功')	
								}else{
									errorContent.css('color','red').text('输入有误')
								}
															
							})
						})

					}
				})
				$('.js-memberId-convert a.close').unbind('click').bind('click',function(){
					 $(this).closest('.js-memberId-convert').dialog('close');
				})
			})
		})
	}
	T.searchId = searchId;
})(jQuery,FE.tools)