define('recommandTopic',['jquery','util/template/1.0'], function($,Template){
	var topic = {
			recommand:function(){
				$.ajax({
					url : '/ipush/rec_topic.json',
					dataType : 'json',
					data : {size : 4, ensure : true},
					success : function(data){
						var source = 
							'<% for (var i = 0; i < list.length; i++) { %>\
								<li class="item-1st <% if (i == 0){ %> current <% } %> <% if (i == list.length - 1){ %> last <% } %>">\
									<dl class="fd-clr">\
										<dt><a target="_blank" href="<%= list[i].url %>" title="<%= list[i].name %>"><%= list[i].name %></a></dt>\
										<dd class="pic">\
											<a class="a-img" target="_blank" href="<%= list[i].url %>" title="<%= list[i].name %>"><img alt="<%= list[i].name %>" src="<%= list[i].topicLogo %>" width="120" height="65"></a>\
										</dd>\
										<dd class="subject"><a target="_blank" href="<%= list[i].url %>" title="<%= list[i].name %>"><%= list[i].name %></a></dd>\
										<dd class="apply-time">报名时间：</dd>\
										<dd class="apply-time"><%= list[i].time %></dd>\
									</dl>\
								</li>\
							<% } %>';
						var render = Template.compile(source);
						var html = render({list : data.data});
						$('#topic-recommend-list').html(html);
						$('#topic-recommend-list li').on("mouseenter",function() {
							$(this).addClass("current").siblings("li").removeClass("current");
						});
					}
				});
			}
	}
	return topic;
});
				
define(['jquery','recommandTopic'], function($,recommandTopic){

	$(function(){
		recommandTopic.recommand();
	});
		
	$('.title .refresh').on('click',function(){
		recommandTopic.recommand();
	});
	
});
