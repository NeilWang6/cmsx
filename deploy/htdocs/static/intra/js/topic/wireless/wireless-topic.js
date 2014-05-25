/**
 * @author cheng.zhangch
 * @date   2013.12.09
 */
   
define('wirelessEffectivTopic', ['util/template/1.0','jquery'], function(Template,$){
	var effectivTopic = {
			//默认允许重试10次
			retryTimes : 10,
			update:function(){
				$.ajax({
					url : '/topic/wireless/UpdateEffectiveTopic.do',
					success : function(data){
					}
				});
			},
			ajax:function(topic){
				$('#wireless-effective-item').addClass('state-waiting');
				$.ajax({
					url : '/topic/wireless/GetEffectiveTopic.json',
					dataType : 'json',
					success : function(data){
						topic.handler(data,topic);
					}
				});
			},
			handler:function(data,topic){
				switch(data.status){
				case 'empty': 
					$('#wireless-effective-item').removeClass('state-waiting');
					$('#wireless-effective-item .list-activity').html('<div class="without">\
                                                            <p class="txt">暂时没有可报名活动哦！</p>\
                                                            <p class="txt">敬请期待。</p>\
                                                            <div class="niu-cry"></div>\
                                                        </div>');
					break;
				case 'present':
					var html = topic.render(data.topicList);
					$('#wireless-effective-item').removeClass('state-waiting');
					$('#wireless-effective-item .list-activity').html(html);
					break;
				case 'compute':
					//2s钟更新一次,最多重试10次
					if (topic.retryTimes > 0){
						setTimeout(function(){
                            topic.ajax(topic);
                        }, 2000);
						--topic.retryTimes;
					}else{
						$('#wireless-effective-item').removeClass('state-waiting');
						//重试10次后仍然取不到值
						$('#wireless-effective-item .list-activity').html('<div class="hand-refresh">\
		                                                        <div class="niu-cry"></div>\
		                                                        <p class="txt">加载失败！</p>\
		                                                        <p class="txt">您的网络可能存在异常</p>\
		                                                        <p class="btn"><a class="btn-refresh" href="#">重新加载</a></p>\
		                                                    </div>');
					}
					break;
				}
			},
			render:function(topicList){
				var source = 
					'<% for (var i = 0; i < list.length; i++) { %>\
						<li>\
				            <a href="/topic/wireless/topic_detail.htm?topicId=<%=list[i].id%>&flag=effective">\
				                <h6><%= list[i].name%></h6>\
				                <p class="decoration"><span class="label">报名时间：</span><span class="txt"><%=list[i].promotionBeginStr%> —— <%=list[i].promotionEndStr%></span></p>\
				                <p class="decoration"><span class="label">活动时间：</span><span class="txt">\
								<% if (list[i].onBeginStr != null && list[i].onBeginStr != ""){ %>\
									<%=list[i].onBeginStr%> —— <%=list[i].onEndStr%>\
								<% }else{ %>\
									待定\
								<% } %>\
								</span></p>\
								<p class="decoration"><span class="label">行业品类：</span><span class="txt">\
								<% if (list[i].pinLeiList != null && list[i].pinLeiList != ""){ %>\
									<% for (var j = 0; j < list[i].pinLeiList.length; j++) { %>\
										<%= list[i].pinLeiList[j] %>\
										<% if (j < list[i].pinLeiList.length - 1){ %>\
											、\
										<% }%>\
									<% }%>\
								<% } else { %>\
									无\
								<% }%>\
								</span></p>\
				            </a>\
			            </li>\
					    <% } %>';
				var render = Template.compile(source);
				var html = render({list:topicList});
				return html;
			}
	};
	return effectivTopic;
});

define('wirelessEnrolledTopic', ['util/template/1.0','jquery'], function(Template,$){
	var enrolledTopic = {
			ajax:function(topic){
				var nextBtn =$('.btn-next');
				nextBtn.parent().hide();
                var conEl = $('#wireless-enrolled-item');
                conEl.addClass('state-waiting');
                $.ajax({
					url : '/topic/wireless/GetEnrolledTopic.json',
					dataType : 'json',
					success : function(data){
						conEl.removeClass('state-waiting');
						//控制是否显示更多按钮
	                    nextBtn.data('maxpage', data.maxPage);
	                    if (data.maxPage > 0){
							var html = topic.render(data.topicList);
							$('#wireless-enrolled-item .list-activity').html(html);
						}else{
							$('#wireless-enrolled-item .list-activity').html('<div class="without">\
																					<p class="txt">暂时没有已经报名的活动哦！</p>\
						                                                            <div class="niu-cry"></div>\
						                                                        </div>');
						}
						if (parseInt(nextBtn.data('current')) >= data.maxPage){
							nextBtn.parent().hide();
						}else{
							nextBtn.parent().show();
						}
					}
				});
			},
			append:function(topic, current){
				var pageEl = $('#wireless-enrolled-item .page');
                pageEl.addClass('state-waiting');
                $.ajax({
					url : '/topic/wireless/GetEnrolledTopic.json',
					dataType : 'json',
					data : { pageNum : current },
					success : function(data){
						pageEl.removeClass('state-waiting');
						//控制是否显示更多按钮
	                    var nextBtn =$('.btn-next');
	                    nextBtn.data('maxpage', data.maxPage);
						var html = topic.render(data.topicList);
						$('#wireless-enrolled-item .list-activity').append(html);
						if (parseInt(nextBtn.data('current')) >= data.maxPage){
							nextBtn.parent().hide();
						}
					}
				});
			},
			render:function(data){
				var source = 
					'<% for (var i = 0; i < list.length; i++) { %>\
						<li>\
				            <a href="/topic/wireless/topic_detail.htm?topicId=<%=list[i].id%>&flag=enrolled">\
								<input type="hidden" id="flag" name="flag" value="$!flag"/>\
								<h6><%= list[i].name %></h6>\
			        			<p class="decoration"><span class="label">报名时间：</span><span class="txt"><%= list[i].gmtCreateStr%></span></p>\
								<%if (list[i].status == "approved") {%>\
									<p class="decoration"><span class="label">审核状态：</span><span class="success">已通过<%if (list[i].needOffer){%>(商品的审核状态请至电脑端查看)<%} %></span></p>\
								<% } else if (list[i].status == "tbd") {%>\
									<p class="decoration"><span class="label">审核状态：</span><span class="fail">审核失败</span></p>\
				                    <dl class="fail-reason">\
				                        <dt class="label">失败原因：</dt>\
										<dd><%=list[i].reason%></dd>\
				                    </dl>\
								<% } else if (list[i].status == "new") { %>\
									<p class="decoration"><span class="label">审核状态：</span><span class="txt">审核中</span></p>\
								<% } %>\
		                    </a>\
		                </li>\
						<%}%>';
				var render = Template.compile(source);
				var html = render({list:data});
				return html;
			}
	};
	return enrolledTopic;
});


define('wirelessTopic',['jquery','wirelessEffectivTopic','wirelessEnrolledTopic'],function($, effectivTopic, enrolledTopic){
	
	var wirelessTopic = {
			effective:function(isBack){
				//可报名页面
				$('li.effective-topic').addClass('current');
				$('li.enrolled-topic').removeClass('current');
				$('#wireless-effective-item').show();
				$('#wireless-enrolled-item').hide();
                if (!isBack || !$.trim($('#wireless-effective-item .list-activity').html())){
                	//更新专场列表
                    effectivTopic.update();
                    //显示专场列表,最多重试10次
                    effectivTopic.ajax(effectivTopic);
                }
			},
			enrolled:function(isBack){
				//已报名页面
				$('li.effective-topic').removeClass('current');
				$('li.enrolled-topic').addClass('current');
				$('#wireless-effective-item').hide();
				$('#wireless-enrolled-item').show();
				
                //显示已报名专场列表
                if (!isBack || !$.trim($('#wireless-enrolled-item .list-activity').html())){
                	$('.btn-next').data('current', 1);
                    enrolledTopic.ajax(enrolledTopic);
                }
			},
			pull:function(){
				var current =$('.btn-next');
				current.data('current',parseInt(current.data('current')) + 1)
				if (parseInt(current.data('current')) <= parseInt(current.data('maxpage'))){
					enrolledTopic.append(enrolledTopic, current.data('current'));
				}
			}
	};
	return wirelessTopic;
});

//add by hongss on 2013.12.15 for ajax请求的history返回功能
define('ajaxhistory', ['jquery', 'wirelessTopic'], function($, wirelessTopic){
    var AjaxHistory = {
        strShould:'#shouldjoin',
        strHas: '#hasjoined',
        setHashState: function(strHash, target){
            target.href=strHash;
            window.history.pushState({hash: strHash}, '', strHash);
        },
        popState: function(){
            var self = this;
            window.addEventListener("popstate", function(e) {
                self.setHashPage(true);
            });
        },
        setHashPage: function(isback){
            var self = this,
                currentState = location.href.indexOf('topic_list.htm'),
                hash = location.hash;
            
            if (currentState!==-1){
                switch (hash){
                    case self.strShould:
                        wirelessTopic.effective(isback);
                        break;
                    case self.strHas:
                        wirelessTopic.enrolled(isback);
                        break;
                    default :
                    	wirelessTopic.effective(isback);	
                }
            }
        }
    };
    return AjaxHistory;
});

define(['jquery','wirelessTopic', 'ajaxhistory'], function($,wirelessTopic, AjaxHistory){

	$(function(){
			
		// 打点
		$('[tracelog]').on('click',function(e){
			try {
				dmtrack.clickunite({'tracelog':$(e.target).attr('traceLog')});
			} catch (e) {
			}
		});
		
		//根据popstate显示可报名页面或已报名页面
		
		//可报名页面
		$('li.effective-topic').on('click',function(e){
            AjaxHistory.setHashState(AjaxHistory.strShould, e.target);
            wirelessTopic.effective();
		});	
		
		//已报名页面
		$('li.enrolled-topic').on('click',function(e){
            AjaxHistory.setHashState(AjaxHistory.strHas, e.target);
            wirelessTopic.enrolled();
		});
		
		//下拉更新显示
		$('.btn-next').on('click',function(e){
			e.preventDefault();
			wirelessTopic.pull();
		});
        
        //AJAX返回功能
        AjaxHistory.popState();
        AjaxHistory.setHashPage();
        
        //手动刷新
        $('.hand-refresh .btn-refresh').on('click', function(e){
            location.reload();
        });
	});
	
});
