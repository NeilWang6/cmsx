/**
 * @author wb-zhangchunyi
 * @date   2013.12.10
 */

//专场详情页
//add by cheng.zhangch 2013.10.21
define('richTextPrepare',['jquery'], function($){
	var richTextPrepare = {
			prepare: function(){
				//处理表格
				$('.rich-text table').each(function(index){
					this.style.width='100%';
				});
				
				var winWidth = $(window).width();

				//处理图片大小
				$('.rich-text img').each(function(index){
                    this.style.maxWidth = (winWidth - 20)+'px';
				});	
			}
	};
	return richTextPrepare;
});


define(['jquery','richTextPrepare'], function($,richTextPrepare){

	$(function(){
		richTextPrepare.prepare();
	});
	
	//更新图片和表格大小
	$(window).resize(function() {
		richTextPrepare.prepare();
	});
	
	$(document).on('touchend', '.activity-require > h5.title, .member-require > h5.title', function(e){
        var el = $(this).parent();
        
        if (el.hasClass('retract')){
            el.removeClass('retract');
        } else {
            el.addClass('retract');
        }
    });
	
	
	//立即报名
	$(document).on('touchend', '.join-in',function(){
		$.ajax({
			url : '/topic/wireless/join_topic.json?topic_id=' + $('#topicId').val() + '&ref=' + $('#ref').val(),
			dataType: 'json',
			success : function(data){
				var msg = '报名成功！';
				var url;
				if(data && data.success) {
					url='/topic/wireless/topic_list.htm#hasjoined';
				} else {
					//if(data && data.msg) {
					//	msg = data.msg;
					//} else {
					//	msg = '网络出错，请重试！';
					//}
					msg = '报名失败，请报名其他专场！';
					url='/topic/wireless/topic_list.htm#shouldjoin';
				}
				
				alertMsg(msg);
				window.location.href=url;
			}
		});
	});

	function alertMsg(msg) {
		if(window.alibaba && window.WindVane_Native && window.WindVane_Native.callMethod) {
			window.alibaba.call('UINavigation','sendToastTip','content=' + msg);
		} else {
			alert(msg);
		}
	}
});


