/*
�ҵĶ���ҳ��JS
@author xutao
@date 2011-03-28
*/
(function($, D){
	var timer=0,			//��ʼ����ʱ��
	urlId='',				//ѡ�ĵ�urlid
	urlName='';				//ѡ����urlname
	$(document).ready(function(){
		$('tbody tr','#customize').mouseenter(function(){	//�������tr����̬���ظ�����ť
			var self = $(this),fb = $('.float-button',self);
			urlId = self.data('urlid'),		//��ǰurlId��̨д��tr��data-urlId����
			urlName = self.data('urlname'); //��ǰurlName��̨д��tr��data-urlName����
			if(fb.length===0){
				var	url = self.data('url');
				if((url)&&(url!=='')&&(url!=='http://')){
					$('td:last',self).append('<div class="fd-locate"><div class="float-button"><a target="_blank" href="'+url+'" id="original">�鿴ԭҳ��</a><a href="#" class="cancel">ȡ������</a></div></div>');
				}
				else{
					$('td:last',self).append('<div class="fd-locate"><div class="float-button" style="width:64px"><a href="#" class="cancel">ȡ������</a></div></div>');
				}
				fb = $('.float-button',self);
			};
			timer = setTimeout(function(){
				fb.fadeIn('fast');
			},200);
			
		});
		
		$('tbody tr','#customize').mouseleave(function(){	//����Ƴ�tr�����ظ�����ť
			var self = $(this),fb = $('.float-button',self);
			clearTimeout(timer);
			timer = setTimeout(function(){
				fb.hide();	
			},200);
		});
		
		$('#js-reload').click(function(e){		//ҳ��ˢ�°�ť
			e.preventDefault();
			location.reload();
		});
		
		$.use('ui-dialog', function(){			//�����Ի���
			$('.cancel').live('click',function(e){	//ȡ�������¼��󶨣�live
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
			
			$('button.dcms-btn').click(function(){  //���ý�ڣ�ȡ�����ƣ����Ƴ�tr
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
