/*
我的定制页面JS
@author xutao
@date 2011-03-28
*/
(function($, D){
	var timer=0,			//初始化定时器
	urlId='',				//选的的urlid
	urlName='';				//选定的urlname
	$(document).ready(function(){
		$('tbody tr','#customize').mouseenter(function(){	//鼠标移入tr，动态加载浮动按钮
			var self = $(this),fb = $('.float-button',self);
			urlId = self.data('urlid'),		//当前urlId后台写入tr的data-urlId属性
			urlName = self.data('urlname'); //当前urlName后台写入tr的data-urlName属性
			if(fb.length===0){
				var	url = self.data('url');
				if((url)&&(url!=='')&&(url!=='http://')){
					$('td:last',self).append('<div class="fd-locate"><div class="float-button"><a target="_blank" href="'+url+'" id="original">查看原页面</a><a href="#" class="cancel">取消定制</a></div></div>');
				}
				else{
					$('td:last',self).append('<div class="fd-locate"><div class="float-button" style="width:64px"><a href="#" class="cancel">取消定制</a></div></div>');
				}
				fb = $('.float-button',self);
			};
			timer = setTimeout(function(){
				fb.fadeIn('fast');
			},200);
			
		});
		
		$('tbody tr','#customize').mouseleave(function(){	//鼠标移出tr，隐藏浮动按钮
			var self = $(this),fb = $('.float-button',self);
			clearTimeout(timer);
			timer = setTimeout(function(){
				fb.hide();	
			},200);
		});
		
		$('#js-reload').click(function(e){		//页面刷新按钮
			e.preventDefault();
			location.reload();
		});
		
		$.use('ui-dialog', function(){			//浮出对话框
			$('.cancel').live('click',function(e){	//取消定制事件绑定，live
				e.preventDefault();
				$('#urlname').text(urlName);
				$('button.cancel-btn','#dcms-customize-confirm').show();
				$('button.dcms-btn','#dcms-customize-confirm').show();
				$('img.wait','#dcms-customize-confirm').hide();
				$('#dcms-customize-confirm').dialog({center:true});
			});

			$('button.cancel-btn').click(function(){
				$(this).closest('div.dcms-dialog').dialog('close');
			});
			
			$('button.dcms-btn').click(function(){  //调用借口，取消定制，并移除tr
				var self = $(this);
				$('button.cancel-btn','#dcms-customize-confirm').hide();
				$('button.dcms-btn','#dcms-customize-confirm').hide();
				$('img.wait','#dcms-customize-confirm').show();
				$.ajax('custom_url.htm', {
					dataType: 'jsonp',
					data: {
						urlId: urlId,
						operate:'delete'
					},
					success: function(o){
						if(o.status==='success'){
							$('tr[data-urlId="'+urlId+'"]').remove();
						}
						self.closest('div.dcms-dialog').dialog('close');
					},
					error: function(o){
						self.closest('div.dcms-dialog').dialog('close');
					}
				});	

			});
		});
		
	});
})(dcms,FE.dcms);
