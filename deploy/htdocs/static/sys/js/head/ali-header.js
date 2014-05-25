/*
头部通用js
页面结构参考首页
xudan
2010.3.2
*/

(function() {

    var Ali = {
        isDebug: false, 				/*是否开启调试模式*/
        memberId: '欢迎来到阿里巴巴', /*最后的登录id*/
        isSigned: false				/*是否已登录*/
    };

    var earlyFunc = {
        /**
        * 获取cookie
        * @method getCookie
        */
        getCookie: function(name) {
            var value = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
            return value ? unescape(value[1]) : '';
        }
    };

    /**
    * 定义在初始化时需要执行的静态方法集合
    */
    var readyFunc = [

    /**
    * No.0
    * 显示页面顶部的登录信息
    * @method showTopLogin
    */
		function showTopLogin() {
		    //$D.setStyle($('lead-loading'),'display','none');
		    if (FD.common.lastLoginId) {    //老用户
		        Ali.memberId = FD.common.lastLoginId || '欢迎来到阿里巴巴';
		        if (earlyFunc.getCookie('__cn_logon__') && earlyFunc.getCookie('__cn_logon__') === 'true') {
		            $D.removeClass($('signed'), 'hide');
		            $D.addClass($('nosigned'), 'hide');
		            Ali.isSigned = true;
		        }
		    }

		    $('memberId2').innerHTML = '您好, ' + Ali.memberId + '&nbsp;';
		    $('memberId1').innerHTML = '您好, ' + Ali.memberId + '&nbsp;';
		},

    /**
    * No.1
    * 搜索初始化
    * @method initSearch
    */
		function initSearch() {
		    var tabList = $('search-nav').getElementsByTagName('a'),
                timer;

		    //tab切换
		    $E.on(tabList, 'click', function(e) {
		        clearTimeout(timer);
		        $E.preventDefault(e);
		        $D.removeClass($D.getElementsByClassName('current', 'li', 'search-nav'), 'current');
		        $D.addClass(this.parentNode, 'current');
		        $D.removeClass($('search-input'), 'gray');
		        //form action更换
		        switch (this.id.toString()) {
		            case 's-cp':
		                document.forms['alisearch'].action = 'http://s.1688.com/search/offer_search.htm';
		                $D.setStyle($('search-history'), 'display', 'block');
		                $D.setStyle($('company-all'), 'display', 'none');
		                $('search-submit').innerHTML = '找一下';
		                break;
		            case 's-gs':
		                document.forms['alisearch'].action = 'http://s.1688.com/search/company_search.htm';
		                $D.setStyle($('search-history'), 'display', 'none');
		                $D.setStyle($('company-all'), 'display', 'block');
		                $('search-submit').innerHTML = '找一下';
		                break;
		            case 's-syj':
		                document.forms['alisearch'].action = 'http://s.1688.com/search/wiki_answer_search.htm';
		                $D.setStyle($('search-history'), 'display', 'none');
		                $D.setStyle($('company-all'), 'display', 'none');
		                $('search-submit').innerHTML = '找一下';
		                break;
		            case 's-pf':
		                document.forms['alisearch'].action = 'http://s.1688.com/search/business_search.htm';
		                $D.setStyle($('search-history'), 'display', 'none');
		                $D.setStyle($('company-all'), 'display', 'none');
		                $('search-submit').innerHTML = '找一下';
		                break;
		            case 's-qg':
		                document.forms['alisearch'].action = 'http://s.1688.com/search/search.htm';
		                $D.setStyle($('search-history'), 'display', 'none');
		                $D.setStyle($('company-all'), 'display', 'none');
		                $('search-submit').innerHTML = '找一下';
		                break;
		            case 's-xy':
		                document.forms['alisearch'].action = 'http://trust.china.alibaba.com/athena/trustsearch.html';
		                $D.setStyle($('search-history'), 'display', 'none');
		                $D.setStyle($('company-all'), 'display', 'none');
		                $('search-submit').innerHTML = '查一查';
		                break;
		        }
		        $('search-input').focus();
		    });

		    //搜索框focus，提示文案和suggesttion
		    $E.on($('search-input'), 'focus', function() {
		        if (this.value == ''|| this.value == '请输入产品名称' || this.value == '请输入问题关键词' || this.value == '请输入产品或公司名称' || this.value == '请输入公司名称') {
		            this.value = '';
		            $D.removeClass(this, 'gray');
		        }
		    });

		    //搜索框blur，提示文案
		    $E.on($('search-input'), 'blur', function() {
		        if (this.value != '') return;
		        setInputTip();
		    });

		    //空搜索验证
		    $E.on(document.forms['alisearch'], 'submit', function(e) {
		        clearTimeout(timer);
		        var input = $('search-input');
		        var value = input.value;
                value = FD.common.trim(value);
		        if (value == '' || value == '请输入产品名称' || value == '请输入问题关键词' || value == '请输入产品或公司名称' || value == '请输入公司名称') {
		            $E.preventDefault(e);
		            setInputTip();
		            $('search-submit').blur();
		            return false;
		        }
                input.value = value;
		    });
		    $('search-input').focus();

		    //显示搜索提示文案
		    function setInputTip() {
		        var input = $('search-input'),
                    cur = $D.getElementsByClassName('current', 'li', 'search-nav')[0].getElementsByTagName('a')[0];
		        $D.addClass(input, 'gray');
                
                if (cur.id == 's-syj') {
		            timer = setTimeout(function() {
		                input.value = '请输入问题关键词';
		            }, 100);
		        } else if (cur.id == 's-gs') {
		            timer = setTimeout(function() {
		                input.value = '请输入产品或公司名称';
		            }, 100);
		        } else if (cur.id == 's-xy') {
		            timer = setTimeout(function() {
		                input.value = '请输入公司名称';
		            }, 100);
		        } else {
		            timer = setTimeout(function() {
		                input.value = '请输入产品名称';
		            }, 100);
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
        },

    /**
    * No.3
    * 顶部topnav显示和隐藏的切换
    * @method topToggle
    */
		function topToggle() {
		    var timeInId, //鼠标移入定时器
			timeOutId, 	//鼠标移出定时器
			trigger=$D.getElementsByClassName('top-trigger'); 		//上一次触发的box对象
		    //鼠标移入
		    $E.on(trigger, 'mouseover', function(e) {
		        clearTimeout(timeOutId); //清除鼠标离开的延时，如果未执行就取消隐藏事件
		        var self = this;
		        // 鼠标移上去后做个延时
		        timeInId = setTimeout(function() {
					$D.removeClass(trigger, 'cur');
					$D.addClass(self, 'cur');					
		        }, 300);
		    });
		    // 鼠标移开
		    $E.on(trigger, 'mouseout', function(e) {
		        clearTimeout(timeInId); //清除鼠标移入的延时，如果未执行就取消显示事件
		        timeOutId = setTimeout(function() {
					$D.removeClass(trigger, 'cur');//清除所有触发对象的显示事件，如果移入另外一个，则会触发移入事件
		        }, 300);
		    });
		},

    /**
    * No.4
    * 页面js效果初始化
    * @method intWidget
    */
         function intWidget() {
			// 最新版旺旺初始化
			online=null;
			var alitalklist=FYS('[alitalk]');
			var alitalkobject = new FD.widget.Alitalk(alitalklist);
         },
		 
		 function intnavData(){
			var navList=FYG("nav-list");
			var temp="";
			try{
				for(i=0;i<navdata.length;i++){temp+=navdata[i].type;}
				for(i=0;i<navdata.length;i++){
					var pm = ['<li ','','><a ','title="','" href="','">','</a></li>'];
					if(i==temp.lastIndexOf(0)&&navdata[i].type==0){
						pm[1]=navdata[i].current?'class="current last"':'class="last"';
					}else if(navdata[i].type==0){
						pm[1]=navdata[i].current?'class="current"':'';
					}else if(navdata[i].type==1){
						pm[1]='class="rnav"';
					}
					switch(navdata[i].icon){
						case 0:
							break;
						case 1:
							pm[2]+='class="new-icon" ';
							break;
						case 2:
							pm[2]+='class="hot-icon" ';
							break;
						default:
							break;
					}
					pm[3]+=navdata[i].text;
					pm[4]+=navdata[i].link;
					pm[5]+=navdata[i].text;
					navList.innerHTML+=pm.join('');
				}
			}catch(e){}
			
			var timeInId, //鼠标移入定时器
			timeOutId, 	//鼠标移出定时器
			trigger=$D.getElementsByClassName('more-trigger'); 		//上一次触发的box对象
		    //鼠标移入
		    $E.on(trigger, 'mouseover', function(e) {
		        clearTimeout(timeOutId); //清除鼠标离开的延时，如果未执行就取消隐藏事件
		        var self = this;
		        // 鼠标移上去后做个延时
		        timeInId = setTimeout(function() {
					$D.removeClass(trigger, 'cur');
					$D.addClass(self, 'cur');					
		        }, 300);
		    });
		    // 鼠标移开
		    $E.on(trigger, 'mouseout', function(e) {
		        clearTimeout(timeInId); //清除鼠标移入的延时，如果未执行就取消显示事件
		        timeOutId = setTimeout(function() {
					$D.removeClass(trigger, 'cur');//清除所有触发对象的显示事件，如果移入另外一个，则会触发移入事件
		        }, 300);
		    });
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
