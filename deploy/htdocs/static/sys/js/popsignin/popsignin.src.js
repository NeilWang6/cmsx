/*!
* PopUpSignIn Window
* @author yongming.baoym@alibaba-inc.com
* @version 20100907
*/

FD.widget.PopUpSignIn = function(config){
    this.init(config);
};

FD.widget.PopUpSignIn.defConfig = {
    customCls : 'mod-popsignin-win',
    id : 'mod-popsignin-win',
    checkCodeUrl : 'http://checkcode.china.alibaba.com/service/checkcode?size=small',//for test
    freeRegisterUrl : 'http://exodus.1688.com/member/join/common_join.htm',
    getPwdUlr : 'http://exodus.1688.com/member/retrieve_password.htm',
    requestUrl : 'http://exodus.1688.com/member/CommonPopSignin.htm',//for test
    requestUrl2 : 'http://exodus.1688.com/member/CommonGetSessionId.htm',//get session if needed
    requestUrl3 : 'http://exodus.1688.com/member/mobiletrade/is_history_mobile.htm',//get session if needed
    requestMethod : 'JSONP',
    tips : {
        memberIdLabel : '登录名/电子邮箱/手机号码',
        blankMemberId : '请输入您的登录名/电子邮箱/手机号码。', 
        blankPassword : '请输入您的密码。', 
        blankCheckCode : '请输入您的验证码。', 
        signFail : {
           "FAIL_USERNAME" : '您输入的帐号不存在，请重新输入。',
           "FAIL_PASSWORD" : '您输入的密码不正确，请重新输入。',
           "checkCodeError" : '您输入的验证码不正确，请重新输入。',
           "FAIL_DISABLED" : '您的帐号无法正常使用，可能是以下原因之一：<br/>1.涉嫌大量发布广告信息<a href="http://im.alisoft.com/security.html?flag=1#nogo" target="_blank">查看详情</a><br/>2.违反会员协议或阿里巴巴相关交易规则<br/>3.帐号已注销<br/><input type="button" class="goback" value="返回" />'
        },
        unknownSignFail:'系统繁忙，请稍后再试。'}
    //iframe : false,//是否在IE6下自动生成iframe。（当页面中可能出现select时设为true，默认false）
    //fixed : false,
    //signSuccess:function(){}
    //signFail:function(){}
    //abortSign:function(){}
    //afterClose:function(){}
    //afterShow:function(){}
};

FD.widget.PopUpSignIn.prototype = {
    init: function(config){
        this.config = FD.common.applyIf(config || {}, FD.widget.PopUpSignIn.defConfig);
		this.__init();
    },
    __init:function(){
        var con = this.__getHTMLTemplate(),
            config = this.config,
            e = $E,
            d = $D,
            isIE = e.isIE,
            self = this,
            winInstance = document.createElement('div');
        winInstance.className = 'mod-popsignin-win';
        config.id ? winInstance.id = config.id : '';
        config.customCls ? d.addClass(winInstance,config.customCls) : '';
        winInstance.innerHTML = con;
        //document.body.appendChild(winInstance);
        FD.widget.block(winInstance,{showOverlay:false,iframe:false,fixed:config.fixed,focusInput:false});
        if(config.iframe && 6 == e.isIE){
            //自己生成一个iframe解决ie6下面的select问题
            var iframeSrc = /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',
                genIframe = document.createElement('iframe'),
                overLay = $$('.over-lay', winInstance, true);
            genIframe.src = iframeSrc;
            d.setStyle(genIframe,'position','absolute');
            d.setStyle(genIframe,'margin','0');
            d.setStyle(genIframe,'padding','0');
            d.setStyle(genIframe,'width','100%');
            d.setStyle(genIframe,'height','100%');
            d.setStyle(genIframe,'border','0 none');
            d.insertBefore(genIframe,overLay);
        }
        if(self.__getCookie('JSESSIONID')){
            self.__initEvent(winInstance);
        }else{
            FD.common.request('JSONP',config.requestUrl2,{
                onCallback: function(o) {
                    self.__initEvent(winInstance);
                },
                onSuccess:function(o){
                    o.purge();
                },
                onTimeout:function(o){
                    o.purge();
                },
                onFailure:function(o){
                    o.purge();
                }
            });
        }
        var hideAnim = showAnim = null,
            $EMPTYFUNC = function(){},
            __closeWin = function(){
                d.addClass(winInstance,'hide');
                self.__reset();//重置
                config.afterClose && config.afterClose.apply(self);//调用自定义的关闭事件
            },
            __showWin = function(){
                //todo
                d.removeClass(winInstance,'hide');
                config.afterShow && config.afterShow.apply(self);//调用自定义的显示事件
            };
        //公开公有方法
        this.getWin = function(){
            return winInstance.parentNode;
        };
        this.abortRequest = function(){
            self.__isAborted = true;
        };
        (function(){
            if(isIE){
                //如果是IE，则不加渐隐渐显的效果
                self.closeWin = function(){
                    __closeWin();
                }
                self.showWin = function(){
                    __showWin();
                }
            }else{
                //渐隐渐显的效果不强求的，如果发现页面中已经引入了animation类，则加上，否则不加。算是一个额外的惊喜^_^
                if(FYU.Anim){
                    hideAnim = new FYU.Anim(winInstance,{opacity : {to : 0}},.2,FYU.Easing.easeOut);
                    hideAnim.onComplete.subscribe(__closeWin);
                    showAnim = new FYU.Anim(winInstance,{opacity : {to : 1}},.2,FYU.Easing.easeOut);
                }else{
                    hideAnim = {
                        animate : function(){
                           __closeWin();
                        }
                    };
                    showAnim = {
                        init : $EMPTYFUNC,
                        onComplete : {
                            subscribe : $EMPTYFUNC
                        },
                        animate : function(){
                            __showWin();
                        }
                    };
                }
                self.closeWin = function(){
                    hideAnim.animate();
                }
                self.showWin = function(opacity){
                    if(!d.hasClass(winInstance,'hide')) return;
                    d.removeClass(winInstance,'hide');
                    showAnim.init(winInstance,{opacity : {to : opacity ? opacity : 1}},.2,FYU.Easing.easeOut);
                    showAnim.onComplete.subscribe(__showWin);
                    showAnim.animate();
                };
            }
        })();
    },
    __initEvent:function(win){
        var query = $$,
            e = $E,
            d = $D,
            self = this,
            config = this.config,
            closeBtn = query('.close',win,true),
            memberId = query('input[name=memberid]',win,true),
            memberIdTypes = query('input[name=mtype]',win),
            password = query('input[name=password]',win,true),
            checkCode = query('input[name=checkcode]',win,true),
            imgCode = query('.checkcodeimg',win,true),
            refreshCode = query('.refreshcode',win,true),
            getPwdUrl = query('.getpasswordurl',win,true),
            getRegisterUrl = query('.registerurl',win,true),
            tipLine = query('.tip-line',win,true),
            loadingLine = query('.loading-line',win,true),
            successLine = query('.success-line',win,true),
            submitLine = query('.submit-line',win,true),
            submit = query('input[name=submitbtn]',win,true),
            isHistoryMobile = false;//是否为历史手机号码，默认不是
        //设置URL
        imgCode.src = config.checkCodeUrl+'&sessionID='+encodeURIComponent(self.__getCookie('JSESSIONID')||'');
        d.removeClass(imgCode,'hide');
        d.removeClass(refreshCode,'hide');
        getPwdUrl.href = config.getPwdUlr;
        getRegisterUrl.href = config.freeRegisterUrl;
        this.__resetTypeStatus = function(){
            isHistoryMobile = false;
            var labels = query('.memidlabel',win);
            d.addClass(labels,'hide');
            d.removeClass(memberId,'sinput');
            memberIdTypes[0].checked = true;
        }
        //member id
        var checkHistoryMobile = function(){
            if(/^[1][3|5|8]\d{9}$/.test(memberId.value.trim())){
                //如果是手机号码
                FD.common.request('JSONP',config.requestUrl3,{
                    onCallback: function(o){
                        if(o.isHistoryMobile == 'true'){
                            isHistoryMobile = true;
                            //提示用户选择登录类型
                            var labels = query('.memidlabel',win);
                            d.removeClass(labels,'hide');
                            d.addClass(memberId,'sinput');
                            memberIdTypes[0].checked = true;
                        }else{
                            self.__resetTypeStatus();
                        }
                    },
                    onSuccess:function(o){
                        o.purge();
                    },
                    onTimeout:function(o){
                        o.purge();
                    },
                    onFailure:function(o){
                        o.purge();
                    }
                },{paramA:memberId.value.trim()});
            }else{
                self.__resetTypeStatus();
            }
        }
        //set last login id
        if(self.__getCookie('__last_loginid__')){
            memberId.value = self.__getCookie('__last_loginid__');
            checkHistoryMobile();//如果last_loginid是history 手机，则一开始的时候也会出现单选按钮
            password.focus();
        }else{
            memberId.focus();
        }
        //member id blur logical
        e.on(memberId,'blur',function(){
            checkHistoryMobile();
        });
        //
        this.__showTip = function(tip){
            d.removeClass([tipLine,submitLine],'hide');
            d.addClass(loadingLine,'hide');
            tipLine.innerHTML = tip;
            submit.disabled = memberId.disabled = password.disabled = checkCode.disabled = false;
            d.removeClass(submit,'disabled');
            return self;
        }
        this.__showLoading = function(){
            d.addClass([tipLine,submitLine],'hide');
            d.removeClass(loadingLine,'hide');
            submit.disabled = memberId.disabled = password.disabled = checkCode.disabled = true;
            d.addClass(submit,'disabled');
            return self;
        }
        this.__showSuccessTip = function(cancelRequest){
            if(!cancelRequest){
                window.location.reload();
            }else{
                //还在请求过程中，用户点了关闭按钮，取消登录事件
            }
            return self;
        }
        this.__reset = function(){
            d.addClass(tipLine,'hide');
            d.addClass(successLine,'hide');
            d.addClass(loadingLine,'hide');
            d.removeClass(submitLine,'hide');
            submit.disabled = memberId.disabled = password.disabled = checkCode.disabled = false;
            d.removeClass(submit,'disabled');
            return self;
        }
        this.__checkBeforeSubmit = function(){
            var tips = self.config.tips;
            if(!memberId.value.trim()){
                self.__showTip(tips.blankMemberId);
                memberId.select();
                return false;
            }
            if(!password.value.trim()){
                self.__showTip(tips.blankPassword);
                password.select();
                return false;
            }
            if(!checkCode.value.trim()){
                self.__showTip(tips.blankCheckCode);
                checkCode.select();
                return false;
            }
            return true;
        }
        //hide focus
        closeBtn.hideFocus = true;
        //其它事件
        e.on(win,'click',function(evt){
            e.stopPropagation(evt);
        });
        //如果阻止了层的右键，则无法右键拷贝
        //e.on(win,'contextmenu',function(evt){
            //e.stopEvent(evt);
        //});
        e.on(closeBtn,'click',function(evt){
            e.preventDefault(evt);
            //如果在请求过程中，点了关闭按钮，则不作任何操作
            if(!self.__isRequesting){
                self.closeWin();
            }
        });
        //输入框添加回车提交事件
        e.on([memberId,password,checkCode],'keydown',function(evt){
            if(evt.keyCode === 13){
                self.__sendRequest(memberId.value.trim(),password.value,checkCode.value);
            }
        });
        e.on([refreshCode,imgCode],'click',function(evt){
            e.stopEvent(evt);
            self.__refreshCheckCode();
			setTimeout(function(){checkCode.select();},50);
        });
        e.on(submit,'click',function(evt){
            e.preventDefault(evt);
            self.__sendRequest(memberId.value.trim(),password.value,checkCode.value);
        });
        e.on(checkCode,'focus',function(){this.select();});
        if(e.isIE == 6 || e.isIE == 7){
            e.on([memberId,password,checkCode],'focus',function(evt){
                d.addClass(this,'focus');
            });
            e.on([memberId,password,checkCode],'blur',function(evt){
                d.removeClass(this,'focus');
            });
            e.on(submit,'mouseover',function(){d.addClass(this,'over');});
            e.on(submit,'mouseout',function(){d.removeClass(this,'over');});
        }
        //回调函数
        self.__signCallback = function(result){
            //这里还要检测后台返回的结果
            if(self.__isAborted) return;//如果用户取消了登录，则返回
            //返回的格式应该是这样的:  result = {ResultSet : {status : 'fail', failType : 'fads'}};
            if(result.ResultSet.status == 'success'){
                if(self.config.signSuccess){
                    //如果有自定义的登录成功事件，则调用自定义事件，自定义成功事件优先
                    self.config.signSuccess.call(self,result);
                }else{
                    //否则会调用默认的成功事件
                    self.__signSuccess(); 
                }
               
            }else if(result.ResultSet.status == 'fail'){
                self.__refreshCheckCode();//登录失败需要刷新验证码
                if(self.config.signFail){
                    //如果有自定义的登录失败--帐号或者密码错误，则调用自定义事件
                    self.config.signFail.call(self,result);
                }
                //肯定会调用默认的失败事件
                self.__signFail(result.ResultSet.failType);               
            }else{
                self.__refreshCheckCode();//登录失败需要刷新验证码
                //这里应该是返回数据格式错误了
                self.__signFail(self.config.tips.unknownSignFail);
            }
        }
        //组件默认的登录成功事件
        this.__signSuccess = function(){
            //登录成功，默认的事件是直接刷新当前页面
            window.location.reload();
        }
        //组件默认的登录失败事件--帐号或者密码错误
        this.__signFail = function(failType){
            //登录失败，则显示提示信息
            self.__showTip(self.config.tips.signFail[failType] || self.config.tips.unknownSignFail);
            switch(failType){
                case 'checkCodeError' : checkCode.select(); break;
                case 'FAIL_USERNAME' : memberId.select(); break;
                case 'FAIL_PASSWORD' : password.select(); break;
                case 'FAIL_DISABLED' : self.__showDisabledInfo();break;
                default : break;
            }
        }
        //组件默认的登录失败事件--网络异常
        this.__unknowSignFail = function(){
            //登录失败，则显示提示信息
            self.__showTip(self.config.tips.unknownSignFail);
            memberId.select();
            self.__refreshCheckCode();//需要刷新验证码
        }
        //组件默认的登录失败事件--账号异常
        this.__showDisabledInfo = function(){
            var conWrap = query('.con-wrap',win,true),
                goBack = query('.goback',win,true);
            d.setStyle(conWrap,'visibility','hidden');
            d.addClass(tipLine,'tip-line2');
            e.on(goBack,'click',function(){
                d.setStyle(conWrap,'visibility','visible');
                d.removeClass(tipLine,'tip-line2');
                d.addClass(tipLine,'hide');
            });
        }
        this.__refreshCheckCode = function(){
            if(self.__isRequesting) return;//如果正在请求，则返回
            imgCode.src = imgCode.src + '&r='+Math.random();
        }
        this.__getMemberIdType = function(){
            if(isHistoryMobile){
                for(var i = 0, l = memberIdTypes.length; i < l; i++){
                    if(memberIdTypes[i].checked){
                        return memberIdTypes[i].value;
                    }
                }
            }
        }
    },
    __sendRequest:function(memberId,password,checkCode){
        if(!this.__checkBeforeSubmit() || this.__isRequesting) return;
        this.__isRequesting = true;
        this.__isAborted = false;
        this.__showLoading();
        var self = this,
            param = self.__getMemberIdType() ? {
                paramA : memberId,
                paramB : password,
                checkCode : checkCode,
                type : self.__getMemberIdType()
            } : {
                paramA : memberId,
                paramB : password,
                checkCode : checkCode
            },
            configs = {
                onCallback: function(o){
                    self.__isRequesting = false;
                    self.__signCallback(o);
                },
                onFailure: function(o){
                    o.purge();
                    self.__isRequesting = false;
                    if(self.__isAborted) return;//如果用户取消了登录，则返回
                    //如果失败，这里就直接调用异常的失败事件，不区分了
                    self.__unknowSignFail();
                },
                onTimeout: function(o){
                    o.purge();
                    self.__isRequesting = false;
                    if(self.__isAborted) return;//如果用户取消了登录，则返回
                    //如果超时，这里就直接调用异常的失败事件，不区分了
                    self.__unknowSignFail();
                },
                onSuccess: function(o){
                    o.purge();
                    self.__isRequesting = false;
                },
                autopurge: true
            };
        FD.common.request(self.config.requestMethod,self.config.requestUrl,configs,param);
    },
    __getHTMLTemplate:function(){
        return '<div class="mod-popsignin-wrap"><div class="over-lay"></div><div class="mod-popsignin-con"><h1><em>会员登录</em><a href="" title="关闭" class="close">close</a></h1><p class="tip-line hide"></p><div class="con-wrap"><p class="top-tip">请使用您在阿里巴巴中国站的会员帐号登录本网站</p><p class="input-line"><em>帐&nbsp;号：</em><input type="text" name="memberid" title="登录名/电子邮箱/手机号码" class="input" maxlength="50" /><label class="memidlabel hide"><input type="radio" name="mtype" checked="checked" value="id" class="mtype">登录名</label><label class="memidlabel hide"><input type="radio" name="mtype" value="mobile" class="mtype">手机</label></p><p class="input-line"><em>密&nbsp;码：</em><input type="password" name="password" class="input" maxlength="20" /><a href="" title="找回密码" target="_blank" class="getpasswordurl" tabindex="-1">找回密码</a></p><p class="code-line"><em>验证码：</em><input type="text" name="checkcode" maxlength="4" /><img src="" class="checkcodeimg hide"><a href="#" title="看不清，换一张" class="refreshcode hide" tabindex="-1">看不清</a></p><p class="success-line hide"></p><p class="loading-line hide"><img src="http://img.china.alibaba.com/images/app/member/widgets/loading.gif" alt="正在为您登录，请稍候..." title="正在为您登录，请稍候..." /><em>正在为您登录，请稍候...</em></p><p class="submit-line"><input type="button" name="submitbtn" class="submit" value="登 录"  /><a href="" class="registerurl" target="_blank">免费注册</a></p></div></div></div>';
    },
    __getCookie : function(name){
		var value = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
		return value ? unescape(value[1]) : '';
	}
};

/*Notes*/
/*
*useage--html structure
   <div class="mod-popsignin-win" id="mod-popsignin-win">
        <div class="mod-popsignin-wrap">
            <div class="over-lay"></div>
            <div class="mod-popsignin-con">
                <h1><em>会员登录</em><a href="" title="关闭" class="close">close</a></h1>
                <p class="tip-line hide"></p>
                <p class="top-tip">请使用您在阿里巴巴中国站的会员帐号登录本网站</p>
                <p class="input-line"><em>帐&nbsp;号：</em><input type="text" name="memberid" title="登录名/电子邮箱/手机号码" /></p>
                <p class="input-line"><em>密&nbsp;码：</em><input type="password" name="password" /></p>
                <p class="code-line"><em>验证码：</em><input type="text" name="checkcode" /><img src="" class="checkcodeimg"><a href="#" title="看不清，换一张" class="refreshcode">看不清？</a></p>
                <p class="success-line hide">登录成功，<em>3</em>秒后将刷新当前页面</p>
                <p class="loading-line hide"><img src="http://img.china.alibaba.com/images/app/member/widgets/loading.gif" alt="正在为您登录，请稍候..." title="正在为您登录，请稍候..." /><em>正在为您登录，请稍候...</em></p>
                <p class="submit-line hide"><input type="button" name="submitbtn" class="submit" value="登 录" /><a href="http://exodus.1688.com/member/retrieve_password.htm" title="忘记密码？" target="_blank" class="getpasswordurl">忘记密码？</a></p>
                <p class="bot-tip">还不是会员，立即<a href="http://exodus.1688.com/member/join/common_join.htm" title="免费注册" target="_blank" class="registerurl">免费注册</a></p>
            </div>
        </div>
    </div>
    css file:http://style.c.aliimg.com/css/sys/popsignin/popsignin.css
*/
/*
    1. 修改block组件在ie6下面无法满足局部覆盖的问题，登录组件自己生成一个iframe解决 -- 20101008 by yongming.baoym@alibaba-inc.com  
*/

