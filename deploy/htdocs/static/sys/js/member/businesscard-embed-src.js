/**
 * 新会员名片组件（内嵌版）
 * @version 2.0 
 * @author chen.chenc
 */
(function($, SYS){
	var embed_root = $('#businessCard_member'),
		configs = embed_root.data('membercard_embed'),
		//询盘打点请求
		onSuccess = function(element,configs,data){
		   $("a[data-alitalk]", element).click(function(event){
				event.preventDefault();
				var g = {
					toId:data.personInfo.memberId,
					//offerId:$("#businessCard-embed-container").attr('offerId')
					offerId:configs.offerid
				}
				traceEnquiry(g);
			});

			SYS.businessCard_core._setMaxWidth(element);
		},
		traceEnquiry = function(g){
			var last_login_id = FE.util.lastLoginId,
			   to_id = g.toId||'',
			   offer_id = g.offerId||'',
			   source = '1',
			   source_url = g.offerId&&g.offerId!=''?"http://detail.1688.com/buyer/offerdetail/"+g.offerId+".html":'',
			   cna = $.util.cookie('cna',{raw:true}),
			   time = new Date().getTime(),
			   url = 'http://interface.xp.1688.com/eq/enquiry/traceEnquiry.json';

		   if(!last_login_id){
			   return
		   }
		 
		   if(g.offerId&&g.offerId!=""){
			   source_url="http://detail.1688.com/buyer/offerdetail/"+g.offerId+".html";
		   }
			  
		   $.ajax(url, {
			 dataType:'jsonp',
			 data:{
				fromId:last_login_id,
				toId:to_id,
				offerId:offer_id,
				source:1,
				cna:cna,
				sourceUrl:source_url,
				time:time
			 },
			 success: function(o) {
			 }
		   }); 
		};

	var embed = {
		show: function(){
			$.add('sys-membercard-core', {
				css: ['http://style.c.aliimg.com/sys/css/member/businessCard_core.css'],
				js: ['http://style.c.aliimg.com/sys/js/member/businessCard_core-min.js'],
				ver: '1.0'
			});

			$.use('web-sweet');
			$.use('web-alitalk');

			$.use('sys-membercard-core', function(){
				SYS.businessCard_core.bulidCard(embed_root,configs,onSuccess);
			});	
		}
	};

	SYS.businessCard_embed = embed;

	$(function(){
		$.add('sys-membercard-core', {
			css: ['http://style.c.aliimg.com/sys/css/member/businessCard_core.css'],
			js: ['http://style.c.aliimg.com/sys/js/member/businessCard_core-min.js'],
			ver: '1.0'
		});

		$.use('web-sweet');
		$.use('web-alitalk');

		var old_embed_root = $('#businessCard-embed-container');

		//兼容老名片
		if(old_embed_root.length > 0){
			old_embed_root.append($("<div id='businessCard_member'>"));
			loginId = $(old_embed_root).attr('loginId'),
			chinaServer = $(old_embed_root).attr('domain'),
			trace = $(old_embed_root).attr('source'),
			offerid = $(old_embed_root).attr('offerid'),
			elememt = $('#businessCard_member',old_embed_root),
			configs = {
				element : elememt,
				loginId : loginId,
				assemblekey : 'abcdefghij',
				trace : trace,
				chinaServer : chinaServer,
				offerid : offerid
			};

			$.use('sys-membercard-core', function(){
				SYS.businessCard_core.bulidCard(elememt,configs,onSuccess);
			});		
		}
    });
})(jQuery, FE.sys);
