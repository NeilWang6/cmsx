/*ͷ��ͨ��js
* ҳ��ṹ�ο���ҳ
* leijun.wul
* 2010.6.24
*/
(function() {
    /**
    * �����ڳ�ʼ��ʱ��Ҫִ�еľ�̬��������
    */
    var readyFunc = [
    /**
    * No.0
    * �������ݳ�ʼ��
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
    * ������ʼ��
    * @method initSearch
    */
		function initSearch() {
			var baseConfig={baseurl:"http://s.1688.com/search/",btntxt:"��һ��",inputtip:"�������Ʒ����"};
			var sconfig=[
				{id:"s-cp",action:"offer_search.htm",suggest:true,tracelog:"zy_srch_product"},
				{id:"s-gs",action:"company_search.htm",inputtip:"�������Ʒ��˾����",tracelog:"zy_srch_company"},
				{id:"s-syj",action:"wiki_answer_search.htm",btntxt:"�Ҵ�",inputtip:"����������ؼ���"},
				{id:"s-pf",action:"business_search.htm",tracelog:"zy_srch_pifa"},
				{id:"s-qg",action:"search.htm",tracelog:"zy_srch_purchase"},
				{id:"s-xy",useurl:true,action:"http://trust.china.alibaba.com/athena/trustsearch.html",btntxt:"��һ��",inputtip:"�����빫˾����",tracelog:"zy_srch_safeguard"},
				{id:"s-zx",action:"news_search.htm",inputtip:"���������������Ϣ�Ĺؼ���"},
				{id:"s-lt",action:"forum_search.htm",inputtip:"���������������Ϣ�Ĺؼ���"},
				{id:"s-bk",action:"blog_search.htm",inputtip:"���������������Ϣ�Ĺؼ���"},
				{id:"s-sy",action:"profile_search.htm",inputtip:"���������������Ϣ�Ĺؼ���"}
			];
			var sidArray=new Array();
			for(var i=0;i<sconfig.length;i++){
				sidArray.push(sconfig[i].id);
			}
			//�����������۽�tab
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
				//tab���
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
				//������focus����ʾ�İ���suggesttion
				$E.on($('search-input'), 'focus', function() {
					if (this.value == ''|| $D.hasClass(this,"gray")) {
						$('search-input').value = '';
						$D.removeClass($('search-input'), 'gray');
					}		
				});

				//������blur����ʾ�İ�
				$E.on($('search-input'), 'blur', function() {
					if (this.value != '') return;
					setInputTip();
				});

				//��������֤
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
		    //��ʾ������ʾ�İ�
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
    * ������¼��ȡ
    * @method initSearchHistory
    */
        function initSearchHistory() {
            if ($('search-history')) {
                var keyStr = unescape(earlyFunc.getCookie('h_keys'));
                if (keyStr != '') {
                    if (keyStr.length > 10) {
                        //���ȴ���
                        keyStr = keyStr.substring(0, 10);
                        keyStr = keyStr.substring(0, keyStr.lastIndexOf('#'));
                    }
                    var keyArray = keyStr.split('#');
                    var HTMLStr = '���������';
                    for (var i = 0, len = keyArray.length; i < len; i++) {
                        HTMLStr += '<a target="_blank" href="http://s.1688.com/selloffer/' + keyArray[i] + '.html">' + keyArray[i] + '</a> ';
                    }
                    $('search-history').innerHTML = HTMLStr;
                }
            }
        }


		 
	];

    //Dom��������Ϻ�ʼִ��
    $E.onDOMReady(function() {
        //��̬��������
        for (var i = 0, len = readyFunc.length; i < len; i++) {
            try {
                readyFunc[i]();
            } catch (e) {
                if (Ali.isDebug) {	//��firebug�µ���
                    console.info('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            };
        }
    });
})();
