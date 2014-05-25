/*
头部通用js
页面结构参考首页
leijun.wul
2010.6.24
*/
(function() {

    var Ali = {
        isDebug: false, 				/*是否开启调试模式*/
        memberId: '欢迎来到阿里巴巴', /*最后的登录id*/
        isSigned: false				/*是否已登录*/
    };
	/**
	 * requestM: 请求管理器
	 */
    var requestM = {
        alitalkUrl:'http://style.c.aliimg.com/js/lib/fdev-v3/widget/alitalk/alitalk-min.js',
        isAlitalkLoad:false,
        isAlitalkLoad1:false
       
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
			try{
				$('nosigned').getElementsByTagName('a')[0].href = 'http://exodus.1688.com/member/signin.htm?Done=' + location.href;	
			}catch(e){}
		    //$D.setStyle($('lead-loading'),'display','none');
		    if (FD.common.lastLoginId) {//老用户
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
    * 触摸效果初始化
    * @method initTrigger
    */
	
		function initTrigger() {
		    var timeInId, //鼠标移入定时器
			timeOutId, 	//鼠标移出定时器
			trigger=$D.getElementsByClassName('nav-trigger'); 		//上一次触发的box对象
		    //鼠标移入
		    $E.on(trigger, 'mouseover', function(e) {
		        clearTimeout(timeOutId); //清除鼠标离开的延时，如果未执行就取消隐藏事件
		        var self = this;
		        // 鼠标移上去后做个延时
		        timeInId = setTimeout(function() {
					$D.removeClass(trigger, 'cur');
					$D.addClass(self, 'cur');
					if(self.id == 'top-cxt'){
						//诚信通下拉，初始化旺旺
						if(requestM.isAlitalkLoad1){
							return;
						}else{
									new FD.widget.Alitalk($$('a[alitalk]','top-cxt'));
								
						}
					}
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
