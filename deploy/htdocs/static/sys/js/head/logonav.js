/*
author : balibell
source need : http://style.c.aliimg.com/js/fdevlib/core/fdev-min.js

*/


/*
lnSearchForm 搜索表单的初始化，需要埋入相关html 代码
<form id="lnSearchForm"
<input id="lnSearchKeyWords"
<select id="lnSearchSelect"
*/




function searchBar(Config){
	function aliCLK(S){
		//return alert(S);
		aliclick(this,'?searchtrace='+S);
	}
	function getCookie(sName) {
		var aCookie = document.cookie.split("; ");
		for (var i=0; i < aCookie.length; i++){
			var aCrumb = aCookie[i].split("=");
			if (sName == aCrumb[0])return unescape(aCrumb[1]);
		}
		return 0;		
	}
	var searchBox={
		config:!function(){
			Config.option=[
				'产品',
				'公司',
				'生意经',
				'批发直达',
				'求购信息',
				'资讯',
				'论坛',
				'商友',
				'博客'
			];
			Config.Action=[ 
				'http://s.1688.com/search/offer_search.htm',
				'http://s.1688.com/search/company_search.htm',
				'http://s.1688.com/search/wiki_answer_search.htm',
				'http://s.1688.com/search/business_search.htm',
				'http://s.1688.com/search/search.htm',
				'http://s.1688.com/search/news_search.htm',
				'http://s.1688.com/search/forum_search.htm',
				'http://s.1688.com/search/profile_search.htm',
				'http://s.1688.com/search/blog_search.htm'
			];
			Config.Url=[ 
				'http://exodus.1688.com/',
				'http://page.1688.com/cp/cp1.html',
				'http://baike.1688.com/',
				'http://pifa.1688.com/',
				'http://page.1688.com/cp/cp8.html',
				'http://info.1688.com/',
				'http://club.1688.com/',
				'http://q.china.alibaba.com/',
				'http://blog.1688.com/'
			];
			Config.seType=[
				2,4,20,7,1,9,10,14,13
			];
			Config.aliClkParameter=[
				'searchbox_saleofferdetail_top_tab_sale',
				'searchbox_saleofferdetail_top_tab_company',
				'searchbox_saleofferdetail_top_tab_alihelp',
				'searchbox_saleofferdetail_top_tab_pifa',
				'searchbox_saleofferdetail_top_tab_buy',
				'searchbox_saleofferdetail_top_tab_info',
				'searchbox_saleofferdetail_top_tab_club',
				'searchbox_saleofferdetail_top_tab_friend_blog',
				'searchbox_saleofferdetail_top_tab_blog',
				'searchbox_saleofferdetail_top_history',
				'searchbox_saleofferdetail_top_dosearch'
			];
		}(),
		all:!function (){
			var S=FYG('search-select'),
			V=FYG('default-search'),
			K=FYG('search-input'),
			F=FYG('alisearch-detail'),
			O=FYG('search-option'),
			T=FYG('search-type'),
			I=Config.option.indexOf(V.innerHTML);
			if(I==-1) I=0;
			V.innerHTML=Config.option[I];
			O.innerHTML="";
			for(var j=0;j<Config.option.length;j++){
				O.innerHTML+='<li><a href="'+Config.Url[j]+'" title="'+Config.option[j]+'">'+Config.option[j]+"</a></li>";
			}
			F.action=Config.Action[I];
			
			FYE.on(FYS("#search-option a"),"click",function(e){
				$E.preventDefault(e);
				var i=Config.option.indexOf(this.innerHTML);
				if(I==i)return;
				I=i;
				V.innerHTML=Config.option[i];
				F.action=Config.Action[i];
				T.value=Config.seType[i];
				aliCLK(Config.aliClkParameter[i]);
		        var timeClkId = setTimeout(function() {
					FYD.removeClass("search-select",'cur');
		        }, 300);
			});
			FYE.on(FYS("#search-option a"),"focus",function(e){
				this.blur();
			});
			FYG('alisearch-detail').onsubmit = function(){
				return false;
			}
			FYE.on("search-submit","click",function(e){
				if (K.value.substr(0,3) == '请输入') {
					alert('请输入关键字');
					return!1;
				}else if(K.value == ''){
					aliCLK(Config.aliClkParameter[6]);
					var i=Config.option.indexOf(V.innerHTML);
					location = Config.Url[i];
					return!0;
				}
				aliCLK(Config.aliClkParameter[6]);
				FYG('alisearch-detail').submit();
			});
			FYG('search-submit').onclick = function(){
				
			};
		}()
	};
}
FYE.onDOMReady(function(){
	searchBar({});
})


