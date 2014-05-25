/*头部通用js
* 页面结构参考首页
* leijun.wul
* 2010.6.24
*/
(function() {
    /**
    * 定义在初始化时需要执行的静态方法集合
    */
    var readyFunc = [
    /**
    * No.0
    * 导航数据初始化
    * @method intnavData
    */
		function intnavData(){
			var navList=$("nav-list");
			var temp="";
			if(navdata){
			for(i=0;i<navdata.length;i++){temp+=navdata[i].type;}
				if(temp.indexOf(2)!=-1&&$("more-trigger")){
					var moreNode=document.createElement("ul");
				}
				if(temp.indexOf(3)!=-1&&!$("advanced-nav")){
					var advancedNode=document.createElement("div");
					advancedNode.id="advanced-nav";
					$D.addClass(advancedNode,"advanced-nav");
					var navright=document.createElement("div");
					$D.addClass(navright,"nav-right");
					var advancedcont=document.createElement("ul");
					$D.addClass(advancedcont,"advanced-cont");
				}
				for(i=0;i<navdata.length;i++){
					var li=document.createElement("li");
					if(navdata[i].id){
						li.id=navdata[i].id;
					}
					if(navdata[i].type==0){
						if(i==temp.lastIndexOf(0)){
							$D.addClass(li,"last");
						}
						if(navdata[i].current){
							$D.addClass(li,"current");
							$D.removeClass(li,"last");
						}
						if(navdata[i].style){
							$D.addClass(li,navdata[i].style);
						}
					}else if(navdata[i].type==1){
						$D.addClass(li,"right");
					}else if(navdata[i].type==3){
						if(navdata[i].current){
							$D.addClass(li,"current");
						}
					}
					var a=document.createElement("a");
					switch(navdata[i].icon){
						case 0:
							break;
						case 1:
							$D.addClass(a,"new-icon");
							break;
						case 2:
							$D.addClass(a,"hot-icon");
							break;
						default:
							break;
					}
					if(navdata[i].tracelog){
						aliclick(a,navdata[i].tracelog);
					}
					a.title=navdata[i].text;
					a.href=navdata[i].link;
					a.innerHTML=navdata[i].text;
					li.appendChild(a);
					if(navdata[i].type==0||navdata[i].type==1){
						navList.appendChild(li);
					}else if(navdata[i].type==2){
						moreNode.appendChild(li);
					}else if(navdata[i].type==3){
						if(!$("advanced-nav")){
							advancedcont.appendChild(li);
						}
					}
				}
				if(temp.indexOf(2)!=-1&&$("more-trigger")){
					moreNode.innerHTML+='<li class="more-bottom"></li>';
					$D.addClass(moreNode,"trigger-down");
					$("more-trigger").appendChild(moreNode);
				}
				if(temp.indexOf(3)!=-1&&!$("advanced-nav")){
					advancedNode.appendChild(navright);
					advancedNode.appendChild(advancedcont);
					if($("header")){
						$("header").appendChild(advancedNode);
					}
					
				}
			}
		 },
 
    /**
    * No.1
    * 搜索初始化
    * @method initSearch
    */
		function initSearch() {
			var baseConfig={baseurl:"http://s.1688.com/search/",btntxt:"找一下",inputtip:"请输入产品名称"};
			var sconfig=[
				{id:"s-cp",action:"offer_search.htm",suggest:true,tracelog:"zy_srch_product"},
				{id:"s-gs",action:"company_search.htm",inputtip:"请输入产品或公司名称",tracelog:"zy_srch_company"},
				{id:"s-syj",action:"wiki_answer_search.htm",btntxt:"找答案",inputtip:"请输入问题关键词"},
				{id:"s-pf",action:"business_search.htm",tracelog:"zy_srch_pifa"},
				{id:"s-qg",action:"search.htm",tracelog:"zy_srch_purchase"},
				{id:"s-xy",useurl:true,action:"http://trust.china.alibaba.com/athena/trustsearch.html",btntxt:"查一查",inputtip:"请输入公司名称",tracelog:"zy_srch_safeguard"},
				{id:"s-zx",action:"news_search.htm",inputtip:"请输入您想查找信息的关键字"},
				{id:"s-lt",action:"forum_search.htm",inputtip:"请输入您想查找信息的关键字"},
				{id:"s-bk",action:"blog_search.htm",inputtip:"请输入您想查找信息的关键字"},
				{id:"s-sy",action:"profile_search.htm",inputtip:"请输入您想查找信息的关键字"}
			];
			var sidArray=new Array();
			for(var i=0;i<sconfig.length;i++){
				sidArray.push(sconfig[i].id);
			}
			//必须有搜索聚焦tab
			if($D.getElementsByClassName('current', 'li', 'search-nav')){
				var cur = $D.getElementsByClassName('current', 'li', 'search-nav')[0].getElementsByTagName('a')[0];
				var configIndex=sidArray.indexOf(cur.id.toString());
				if(configIndex==-1){
					return;
				}
				if(sconfig[configIndex].useurl){
					document.forms['alisearch'].action=sconfig[configIndex].action;
				}else{
					document.forms['alisearch'].action=baseConfig.baseurl+sconfig[configIndex].action;
				}
				if(sconfig[configIndex].suggest){
					FD.widget.AutoComplete.init('search-input-container',{charset:'gb2312', pX:5, pY:14, pW:3, formName:'alisearch' });
				}
				if(sconfig[configIndex].btntxt){
					$('search-submit').innerHTML = sconfig[configIndex].btntxt;
				}else{
					$('search-submit').innerHTML = baseConfig.btntxt;
				}
				//tab点击
				$E.on($('search-nav').getElementsByTagName('a'), 'click', function(e) {
					$E.preventDefault(e);
					if($("s-more")&&$D.isAncestor($D.getElementsByClassName("trigger-base","div",$("s-more"))[0],this)){return;}
					if (FD.common.trim($('search-input').value) == '' || $D.hasClass('search-input',"gray")) {
						location=this.href;
						return;
					}
					var clickIndex=sidArray.indexOf(this.id.toString());
					if(sconfig[clickIndex].useurl){
						document.forms['alisearch'].action=sconfig[clickIndex].action;
					}else{
						document.forms['alisearch'].action=baseConfig.baseurl+sconfig[clickIndex].action;
					}					
					document.forms['alisearch'].submit();
				});
				//搜索框focus，提示文案和suggesttion
				$E.on($('search-input'), 'focus', function() {
					if (this.value == ''|| $D.hasClass(this,"gray")) {
						$('search-input').value = '';
						$D.removeClass($('search-input'), 'gray');
					}		
				});

				//搜索框blur，提示文案
				$E.on($('search-input'), 'blur', function() {
					if (this.value != '') return;
					setInputTip();
				});

				//空搜索验证
				$E.on(document.forms['alisearch'], 'submit', function(e){
					var input = $('search-input');
					var value = input.value;
					value = FD.common.trim(value);
					if (value == '' || $D.hasClass(input,"gray")) {
						$E.preventDefault(e);
						setInputTip();
						$('search-submit').blur();
						return false;
					}
                    if ( typeof aliclick === 'function' ){
                        if( configIndex != 0 || window.location.hostname == 'exodus.1688.com' ){
							if(sconfig[configIndex].tracelog){
								aliclick(this,'?tracelog='+sconfig[configIndex].tracelog);
							}  
                        }
                        if ( window.location.pathname === '/cp/cp5.html' ){
                            aliclick( this, '?tracelog=hy_srch_dljm' );
                        }

                    }
					input.value = value;
				});
			}
			if($('search-input')&&$('search-input').getAttribute('autofocus')!='false'){
				$('search-input').value = '';
				$('search-input').focus();
			}
		    //显示搜索提示文案
		    function setInputTip() {
		        var input = $('search-input');
				$D.addClass(input, 'gray');
				if(sconfig[configIndex].inputtip){
					input.value = sconfig[configIndex].inputtip;
				}else{
					input.value = baseConfig.inputtip;
				}
		    }
		},

    /**
    * No.2
    * 搜索记录读取
    * @method initSearchHistory
    */
        function initSearchHistory() {
            if ($('search-history')) {
                var keyStr = unescape(earlyFunc.getCookie('h_keys'));
                if (keyStr != '') {
                    if (keyStr.length > 10) {
                        //长度处理
                        keyStr = keyStr.substring(0, 10);
                        keyStr = keyStr.substring(0, keyStr.lastIndexOf('#'));
                    }
                    var keyArray = keyStr.split('#');
                    var HTMLStr = '最近搜索：';
                    for (var i = 0, len = keyArray.length; i < len; i++) {
                        HTMLStr += '<a target="_blank" href="http://s.1688.com/selloffer/' + keyArray[i] + '.html">' + keyArray[i] + '</a> ';
                    }
                    $('search-history').innerHTML = HTMLStr;
                }
            }
        }


		 
	];

    //Dom树构建完毕后开始执行
    $E.onDOMReady(function() {
        //静态方法调用
        for (var i = 0, len = readyFunc.length; i < len; i++) {
            try {
                readyFunc[i]();
            } catch (e) {
                if (Ali.isDebug) {	//在firebug下调试
                    console.info('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            };
        }
    });
})();
