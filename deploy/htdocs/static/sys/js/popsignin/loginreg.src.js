/// <reference path="../../../lib/fdev-v3/core/source/fdev.js" />
/// <reference path="../../../lib/fdev-v3/util/source/bom.js" />
/*
 Denis: Login & Regist Common Layer 2010.10.18
 Modify：yongming.baoym@alibaba-inc.com 2010.11.2 Reason：根据cookie里面的__last__loginid__取到上次登录名(有可能上次是用邮箱或者手机号登录，浮层弹出的时候要显示上次的登录方式，而不是一直显示memberid)
 Modify: qijun.weiqj@alibaba-inc.com 2010.11.16 Reason: 优化交互, 失败特定次数后才显示登录验证码, 为了交互友好情, 焦点离开时不马上进行验证
 Modify: changbin.wangcb 2011-10-10 Reason:密码安全评级，评级功能、 密码valid的可用字符改造
 Modify: xin.jingx 2011-10-18 添加UMID打点相关逻辑
 Modify: changbin.wangcb 2011-11-02 添加淘宝登录 去掉灰度发布
 @update: 2011.07.11 Denis a-b test结束
 Modify: rufeng.qianrf 2011-11-21 登录接口切换到https
 Modify: rufeng.qianrf 2011-12-06 添加旺旺快速登录
 Modify: changbin.wangcb 2012-01-06 测试环境脚本自动切换
 Modify: changbin.wangcb 2012-03-13 图片验证码升级，去掉了imgDomain
 Modify: changbin.wangcb 2012-04-16 手机注册去掉邮箱字段
 Modify: hua.qiuh 2012-08-23 使用iframe方式实现登录和注册功能
 */
YAHOO.namespace('FD.Member.LR');
(function(LR){
    var Lang = FDEV.lang, FEU = FDEV.env.ua, RMOBILE = /^(0|86)?1[3458]\d{9}$/, REMAIL = FD.widget.Valid.regExps.isEmail;

    FD.common.apply(LR, {
        mod: null,
        tabIndex: null,
        sessionId: null,
        //验证码URL
        //imgSrc: 'http://checkcode.china.alibaba.com/service/checkcode',
        checkcodeSrc: 'https://login.1688.com/omeocheckcode',
        //sessionId获取URL
        //sessionUrl: 'http://exodus.1688.com/member/CommonGetSessionId.htm',
        getLastLoginType: 'http://login.1688.com/member/GetLastLoginType.do',
        //getLastLoginType: 'http://loginchina-test.alibaba.com:3200/member/GetLastLoginType.htm',
        //登陆提交URL
        loginUrl: 'https://login.1688.com/member/PopSignin.do',
        //loginUrl:'https://loginchina-test.alibaba.com:3300/member/PopSignin.do',
        //注册提交URL
        //registUrl: 'http://exodus.1688.com/member/join/CommonPopJoin.htm',
        //urlMobile: 'http://exodus.1688.com/member/mobiletrade/is_history_mobile.htm',
        //注册Email验证URL
        urlEmail: 'http://exodus.1688.com/member/CheckEmailJson.htm',
        //注册会员名验证URL
        urlId: 'http://exodus.1688.com/member/CheckLoginIdAndRecommendJson.htm',
        
        registUrl: 'http://exodus.1688.com/member/join/commonPopValidateJoin.htm',
        //registUrl:'http://exodus2.china.alibaba.com:2100/member/join/commonPopValidateJoin.htm',
        urlSendM: 'http://exodus.1688.com/member/sendIdentityCodeByMobile.htm',
        //urlSendM:'http://exodus2.china.alibaba.com:2100/member/sendIdentityCodeByMobile.htm',
        urlSendE:'http://exodus.1688.com/member/sendIdentityCodeByEmail.htm',
        //urlSendE: 'http://exodus2.china.alibaba.com:2100/member/sendIdentityCodeByEmail.htm',
        
        urlMobile: 'http://exodus.1688.com/member/checkMobileValidate.htm',
        urlUM: 'http://exodus.1688.com/member/popSignin.htm',
		alipayLoginServer:'https://auth.alipay.com/login/option.htm',     //支付宝登录涉及的url add by changbin.wangcb on 20110909
	    alipayGoto:'https://auth.alipay.com/login/alibabacn_trust_login.htm', 
	    //taobaoLoginServer:'http://login.daily.taobao.net/member/login.jhtml?style=mini&full_redirect=true',
	    taobaoLoginServer:'https://login.taobao.com/member/login.jhtml?style=mini&full_redirect=true&disableQuickLogin=true',
	    //taobaoMiddle:'http://member1.daily.taobao.net/member/get_user_info.htm?from=alibaba',
	    taobaoMiddle:'http://member1.taobao.com/member/get_user_info.htm?from=alibaba',
	    //taobaoGoto:'http://jump.daily.taobao.net/jump',
	    taobaoGoto:'http://jump.taobao.com/jump',
        registByM: true,
        
        // TODO change the url loaction to online address before deploy
        // cbuRegister: 'http://exodus2.china.alibaba.com:2100/member/join/common_join.htm',
        // alipayNotice: 'http://member-test.china.alibaba.com:5100/member/alipay/notice_for_pop.htm',
        // taobaoLoginPage:'http://login.daily.taobao.net/member/login.jhtml',
        // memberwebAlipayLogin: 'http://member-test.china.alibaba.com:5100/member/alipay/notice.htm',
        cbuRegister: 'http://exodus.1688.com/member/join/common_join.htm',
        alipayNotice: 'http://member.1688.com/member/alipay/notice_for_pop.htm',
        taobaoLoginPage: 'https://login.taobao.com/member/login.jhtml',
        memberwebAlipayLogin: 'http://member.1688.com/member/alipay/notice.htm',

        aliclick: function(pre, trace){
            var t = this.registByM ? 'm' : 'e';
            aliclick(pre, Lang.substitute(trace, [t]));
        },
        /**
         * 初始化结构
         */
        render: function(){
            //noformat
	        var mod = FYG('modLoginReg'), 
				 loginid = this.loginid || '',//yongming.baoym@alibaba-inc.com 2010.11.2
				 infoInput = FYG('popTopInfo'),//add by xin.jingx on 20110310 for topinfo
				 topInfo = (infoInput && infoInput.value != '') ? infoInput.value : '30秒快速注册，轻松做网商';
				 
				 
			 //format
            if (!mod) {
                mod = document.createElement('div');
                mod.id = 'modLoginReg';
                mod.style.display = 'none';
                document.body.appendChild(mod);
                mod.innerHTML = ['<div class="wrap">\
			<div class="title fd-clr">\
				<h3><img alt="阿里巴巴" src="http://img.china.alibaba.com/cms/upload/member/logo2.gif" /></h3>\
				<a href="javascript:;" class="close" tabindex="9000"></a>\
			</div>\
			<div class="box">\
                <div id="msgTip-new">淘宝会员请在此登录（仅限会员名）</div>\
                <form action="" method="post" onsubmit="FD.Member.LR.submit();return false;">\
                    <ul class="tab" style="display: none;"><li>会员登录</li><li>免费注册</li><li><button type="submit"></button></li></ul>\
                    <fieldset style="display: none;">\
                        <div class="b2btype">\
                            <div id="loginchinatype">\
                                <iframe width="310" height="270" frameborder="no" border="0" scrolling="no"></iframe> \
                            </div>\
							<div class="signin-type">\
                 				<a class="taobao-login-trigger" href="javascript:;">淘宝手机号/邮箱登录</a>\
								<a class="free-regist" target="_blank" href="', LR['cbuRegister'] , '">免费注册</a>\
							</div>\
                			<div class="gray-bg-wrapper">\
                    			<div class="alipay-login-div">\
                            		<span>原使用支付宝登录会员，</span><a class="alipay-login-trigger" href="javascript:;">点此进入&gt;</a>\
                            	</div>\
                        	</div>\
                        </div>\
                        <div class="alipaytype" style="display:none;">\
                            <div class="alipay-content"><iframe width="370" height="260" scrolling="no" frameborder="0" allowtransparency="true" src="', LR['alipayNotice'] ,'"></iframe></div>\
                   			<div class="gray-bg-wrapper">\
                       			<div class="return-cbu-signin" style="width: 370px;">\
                       				<a href="javascript:;" class="logtype-b2b">&lt;返回阿里巴巴帐号登录</a>\
                               	</div>\
                           	</div>\
                        </div>\
                        <div class="taobaotype" style="display:none;">\
		                        <div class="taobao-signin-title">\
		                            <b>淘宝会员</b>\
		                        </div>\
                                <div class="taobao-content"><iframe width="310" height="300" scrolling="no" frameborder="0" src="'+ this.generateTaobaoLoginUrl() +'"></iframe></div>\
                       			<div class="gray-bg-wrapper">\
                           			<div class="return-cbu-signin">\
                           				<a href="javascript:;" class="logtype-b2b">&lt;返回阿里巴巴帐号登录</a>\
                                   	</div>\
                               	</div>\
                        </div>\
                    </fieldset>\
                    <fieldset class="register">\
                        <iframe width="384" height="414" scrolling="no" frameborder="0"></iframe>\
                    </fieldset>\
                    <div class="done" style="display: none;"></div><div class="done" style="display: none;"></div>\
                </form></div></div>'].join('');
                this.mod = mod;
            }

        },
        
        init: function(){
            //noformat
		var _this = this,
			form = FYS('form', this.mod, true), 
			tabs = FYS('ul.tab>li', this.mod), 
			fieldsets = FYS('fieldset', this.mod), 
			actions = FYS('dl.action', this.mod), 
			dones = FYS('div.done', this.mod), 
			texts = FYS('input.text', this.mod), 
			messages = FYS('div.message', this.mod), 
			close = FYS('a.close', this.mod), 
			refreshs = FYS('a.refresh', this.mod), 
			button = FYS('>button', tabs[2], true), 
			forget = FYS('a.forget', fieldsets[0], true), 
			//2011.04.25 Denis 发送验证码
			sends = FYS('a.send', fieldsets[1]),
			account = texts[0], 
			span = FYD.getNextSibling(account), 
			rdo = FYS('>input', span, true), 
			lpassword = texts[1], 
			lcode = texts[2], 
			limg = FYD.getNextSibling(lcode), 
			lvague = FYD.getNextSibling(limg), 
			userId = texts[3], 
			rpassword = texts[4],
			rrpassword = texts[5],
			switchm = FYS('dl.switch-m', fieldsets[1]),
			switche = FYS('dl.switch-e', fieldsets[1]),
			mobile = texts[6],
			emaile = texts[7],
			rcode = texts[8], 
		    loginchinatype = FYG('#loginchinatype'),
            b2bLoginFrame = FYS('#loginchinatype iframe', logb2b, true),
			btnLogin = FYS('a.login', loginchinatype, true), 
			btnRegist = FYS('a.regist', this.mod, true),
			switcher = FYS('dl.switcher>a', fieldsets[1], true),
			isLogining = false, 
			isRegisting = false,
			logb2b = FYS('.b2btype', this.mod, true),
			logalipay = FYS('.alipaytype', this.mod, true),
			logtaobao = FYS('.taobaotype', this.mod,true),    // add by changbin.wangcb for 淘宝登录container
			logalipaytrigger = FYS('a.alipay-login-trigger', logb2b, true),
			logtaobaotrigger = FYS('.taobao-login-trigger', logb2b, true),    // add by changbig.wangcb for 淘宝登录切换btn
			logb2btrigger = FYS('a.logtype-b2b', this.mod, false); 

		//format
            //提交按钮隐藏在第三个li内，请注意逻辑
            tabs.pop();
            //save it in global
            this.tabs = tabs;
            this.form = form;
            this.emaile = emaile;
            this.lcode = lcode;
            this.lcodeBox = FYD.getAncestorByClassName(lcode, 'code');
            this.lcodeActive = false;
            this.rcode = rcode;
            this.switcher = switcher;
            this.btnLogin = btnLogin;
            this.btnRegist = btnRegist;
            
            // 关闭
            FYE.on(close, 'click', function(e, o){
                FYE.preventDefault(e);
                if (o.currentFocus) {
                    var trace;
                    switch (o.currentFocus) {
                        case 'id':
                            trace = 1;
                            break;
                        case 'pwd':
                            trace = 2;
                            break;
                        case 'repwd':
                            trace = 3;
                            break;
                        case 'emaile':
                            trace = 4;
                            break;
                        case 'code':
                            trace = 6;
                            break;
                    }
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_close' + trace);
                }
                o.hide();
            }, this);
            // HTML5 已有placeholder支持此功能
            // @updated by qijun.weiqj on 20101110
            // 给用户名输入框加默认提示
            // 注： 由于IE事件调用的顺序和标准DOM相反
            //      而此方法挂接的事件blur处理函数需要在验证事件blur处理函数之前执行
            //      所以将区分是否IE, 在验证方法初始化前后分别调用，以达到期望的事件触发顺序
            // @update denis 2011.5.6 去掉复杂的IEplaceholder实现，通过背景图和验证分离，太难维护了。
            if (!('placeholder' in document.createElement('input'))) {
                FYE.on([account, emaile], 'focus', function(){
                    FYD.removeClass(this, 'placeholder');
                });
                
                FYE.on([account, emaile], 'blur', function(){
                    if (this.value === '') {

                        FYD.addClass(this, 'placeholder');
                    }
                });
            }
            else {
                FYD.removeClass([account, emaile], 'placeholder');
            }
            
            //防止虚线
            FYE.on(button, 'focus', function(){
                this.blur();
            });
            //看不清
            FYE.on(lvague, 'click', function(e, scope){
                FYE.preventDefault(e);
                LR.aliclick(null, '?tracelog=signin_simple_chgcode');
                
            });
            //tab switch event
            FYE.on(tabs, 'click', function(e, o){
                if (FYD.hasClass(this, 'current')) 
                    return;
                var i = tabs.indexOf(this);
                FYD.removeClass(tabs, 'current');
                FYD.addClass(this, 'current');
                FYD.setStyle(dones, 'display', 'none');
                FYD.setStyle(fieldsets, 'display', 'none');
                FYD.setStyle([fieldsets[i], actions[i]], 'display', '');
                if (i) {
                    LR.aliclick(null, '?tracelog=reg_simple_m_tab1');
                }
                o.tabIndex = i;
                //o.vLogin.active(i?false:true);
                //o.vRegist.active(i?true:false);
                //2011.03.30 Denis tracelog:注册tab打开的次数/登录tab打开的次数
                if (e.button == 0 && i === 0) {
                    LR.aliclick(null, '?tracelog=signin_simple_tab');
                }
            }, this);
            //刷新页面的按钮
            FYE.on(refreshs, 'click', function(e){
                FYE.preventDefault(e);
                location.reload();
            });
            //找回密码tracelog
            FYE.on(forget, 'mousedown', function(){
                LR.aliclick(null, '?tracelog=signin_simple_pass');
            });
            //2011.04.25 Denis
            FYE.on([userId, rpassword, rrpassword, emaile, rcode], 'blur', function(e, o){
                o.currentFocus = null;
            }, this);
            FYE.on([userId, rpassword, rrpassword, emaile, rcode], 'focus', function(e, o){
                o.currentFocus = o.vRegist.getConfig(this).key;
            }, this);
            //即时改变发送按钮状态
            FYE.on(mobile, 'keyup', function(){
                if (RMOBILE.test(this.value) && !FYD.hasClass(sends[0], 'send-cd')) {
                    FYD.removeClass(sends[0], 'send-disabled');
                }
                else {
                    FYD.addClass(sends[0], 'send-disabled');
                }
            });
            FYE.on(emaile, 'keyup', function(){
                if (REMAIL.test(this.value) && !FYD.hasClass(sends[1], 'send-cd')) {
                    FYD.removeClass(sends[1], 'send-disabled');
                }
                else {
                    FYD.addClass(sends[1], 'send-disabled');
                }
            });
            FYE.on(sends, 'click', function(e, o){
                FYE.preventDefault(e);
                
                if (!FYD.hasClass(this, 'send-disabled')) {
                    //noformat
                var timer, 
					count = 60, 
					em = FYS('em', this, true), 
					target = FYD.getNextSibling(this), 
					dl = FYD.getAncestorByTagName(this, 'dl'), 
					spanS = FYS('span.s', dl, true), 
					spanN = FYS('span.n', dl, true), configs = {};
                //format
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_getcode');
                    //                    if (!o.vRegist.valid(target)) {
                    //                        return;
                    //                    }
                    //改变按钮状态
                    FYD.addClass(this, 'send-disabled');
                    FYD.addClass(this, 'send-cd');
                    
                    function initTimer(){
                        timer = Lang.later(1000, this, function(){
                            if (count === 1) {
                                em.innerHTML = '发送验证码';
                                FYD.removeClass(this, 'send-cd');
                                //清验证缓存
                                if (o.vRegist.valid(target)) {
                                    FYD.removeClass(this, 'send-disabled');
                                }
                                timer.cancel();
                            }
                            else {
                                em.innerHTML = --count + '秒后重发';
                            }
                        }, null, true);
                        em.innerHTML = '60秒后重发';
                    }
                    function onFailure(){
                        FYD.removeClass(dl, 'ok');
                        FYD.addClass(dl, 'err');
                        FYD.removeClass(this, 'send-cd');
                        if (o.vRegist.valid(target)) {
                            FYD.removeClass(this, 'send-disabled');
                        }
                        spanN.innerHTML = '网络繁忙，请稍后重试';
                        
                    }
                    
                    //request
                    configs[o.registByM ? 'mobile' : 'email'] = target.value;
                    
                    FD.common.request('JSONP', FD.Member.LR[o.registByM ? 'urlSendM' : 'urlSendE'], {
                        fn: o.registByM ? 'sendm' : 'sende',
                        scope: this,
                        onCallback: function(res){
                            if (res.success) {
                                FYD.removeClass(dl, 'err');
                                FYD.addClass(dl, 'ok');
                                
                                if (o.registByM) {
                                    spanS.innerHTML = '验证码已发送到您的手机，请立即查收';
                                }
                                else {
                                    spanS.innerHTML = '验证码已发送到您的邮箱，<a href="' + res.data.emailUrl + '" onclick="FD.Member.LR.aliclick(null, \'?tracelog=reg_simple_e_check\')" target="_blank">立即查收</a>';
                                }
                                initTimer.call(this);
                            }
                            else {
                                var opt = o.vRegist.getConfig(target);
                                opt.isValid = false;
                                FYD.removeClass(dl, 'ok');
                                FYD.addClass(dl, 'err');
                                FYD.removeClass(this, 'send-cd');
                                if (o.vRegist.valid(target)) {
                                    FYD.removeClass(this, 'send-disabled');
                                }
                                switch (res.data.resultCode) {
                                    case 'MEMBER_MP_VALIDATE_MP_ERR'://手机号码错误
                                        spanN.innerHTML = '请输入正确手机格式';
                                        break;
                                    case 'MOBILE_HAS_VALIDATED'://手机已经被验证过
                                        LR.aliclick(null, '?tracelog=reg_simple_m_em2');
                                        spanN.innerHTML = '手机号码已被使用，请更换其他号码';
                                        break;
                                    case 'MOBILE_IDENTITY_CODE_TOO_FREQUENTLY'://发送手机验证码太频繁
                                        spanN.innerHTML = '您获取验证码过于频繁，请明天再试或更改号码';
                                        break;
                                    case 'DATA_ERROR'://请求错误
                                        spanN.innerHTML = '网络繁忙，请稍后重试';
                                        opt.isValid = true;
                                        break;
                                    case 'EXPIRE_CHECK_TIMES': //超过次数限制
                                        spanN.innerHTML = '您获取验证码过于频繁，请明天再试或更改邮箱';
                                        break;
                                    case 'MEMBER_EMAIL_VALIDATE_EMAIL_USED': //邮箱已被验证
                                        spanN.innerHTML = '邮箱已被使用，请更换其他邮箱';
                                        LR.aliclick(null, '?tracelog=reg_simple_{0}_ee2');
                                        break;
                                }
                            }
                        },
                        onTimeout: onFailure,
                        onFailure: onFailure
                    }, configs);
                }
            }, this);
            FYE.on(switcher, 'click', function(e, o){
                FYE.preventDefault(e);
				// 2011.09.08 changbin.wangcb 切换时a的title不改变
                var s1 = '返回手机验证', s2 = '没有手机？您还可以使用邮箱验证',t1="手机注册",t2="邮箱注册";
                //切换时清空验证码
                if (this.innerHTML === s1) {
                    LR.aliclick(null, '?tracelog=reg_simple_m_tab2');
                    FYD.setStyle(switche, 'display', 'none');
                    FYD.setStyle(switchm, 'display', '');
                    o.vRegist.active(emaile, false);
                    o.vRegist.active(mobile, true);
                    o.registByM = true;
                    this.innerHTML = s2;
					this.setAttribute('title',t2);
                }
                else {
                    LR.aliclick(null, '?tracelog=reg_simple_e_tab');
                    FYD.setStyle(switchm, 'display', 'none');
                    FYD.setStyle(switche, 'display', '');
					if(emaile.value){
						FYD.removeClass(emaile, 'placeholder');
					}
                    if (!FYD.hasClass(sends[1], 'send-cd')) {
                        FYD.removeClass(sends[1], 'send-disabled');
                    }
                    o.vRegist.active(mobile, false);
                    o.vRegist.active(emaile, true);
                    o.vRegist.active(emaile, false);
                    o.vRegist.active(emaile, true);
                    o.registByM = false;
                    this.innerHTML = s1;
					this.setAttribute('title',t1);
                }
                o.vRegist.active(rcode, false);
                rcode.value = '';
                o.vRegist.active(rcode, true);
            }, this);
            //keyboard tab event
            FYE.on(lcode, FEU.opera ? 'keypress' : 'keydown', function(e, o){
                if (!e.shiftKey && e.keyCode && e.keyCode == 9) {
                    FYE.preventDefault(e);
                    account.focus();
                }
            }, this);
            FYE.on(rcode, FEU.opera ? 'keypress' : 'keydown', function(e, o){
                if (!e.shiftKey && e.keyCode && e.keyCode == 9) {
                    FYE.preventDefault(e);
                    userId.focus();
                }
            }, this);
            FYE.on(account, FEU.opera ? 'keypress' : 'keydown', function(e, o){
                if (e.shiftKey && e.keyCode && e.keyCode == 9) {
                    FYE.preventDefault(e);
                    lcode.focus();
                }
            }, this);
            FYE.on(userId, FEU.opera ? 'keypress' : 'keydown', function(e, o){
                if (e.shiftKey && e.keyCode && e.keyCode == 9) {
                    FYE.preventDefault(e);
                    rcode.focus();
                }
            }, this);
            //input event
            FYE.on(texts, 'focus', function(e){
                var dl = FYD.getAncestorByTagName(this, 'dl');
                if (FYD.hasClass(dl, 'err') && this.value/*&&this.value!='登录名/电子邮箱/手机号码'*/) 
                    this.select();
                else FYD.addClass(dl, 'focus');
            });
            FYE.on(texts, 'blur', function(e){
                FYD.removeClass(FYD.getAncestorByTagName(this, 'dl'), 'focus');
            });
            //valid
            this.vLogin = new FD.widget.Valid(FYS('input[vg=login]', this.mod), {
                onValid: function(res, o){
                    var dl = FYD.getAncestorByTagName(this, 'dl'),
                    n = FYS('span.n', dl, true);
                    n.innerHTML = '';
                    if (res == 'pass') {
                        FYD.removeClass(dl, 'err');
                        FYD.addClass(dl, 'ok');
                        //tracelog
                        switch (o.key) {
                            case 'account':
                                LR.aliclick(null, '?tracelog=signin_simple_s1');
                                break;
                            case 'pwd':
                                LR.aliclick(null, '?tracelog=signin_simple_s2');
                                break;
                            case 'code':
                                LR.aliclick(null, '?tracelog=signin_simple_s3');
                                break;
                        }
                    }
                    else if (res == 'default') {
                        FYD.removeClass(dl, 'err');
                        FYD.removeClass(dl, 'ok');
                    }
                    else {
                        switch (res) {
                            default:
                                n.innerHTML = '请填写正确的内容。';
                                break;
                            case 'required':
                                switch (o.key) {
                                    case 'account':
                                        LR.aliclick(null, '?tracelog=signin_simple_null1');
                                        return;case 'pwd':
                                        n.innerHTML = '请输入您的密码';
                                        LR.aliclick(null, '?tracelog=signin_simple_null2');
                                        break;
                                    case 'code':
                                        n.innerHTML = '请输入验证码';
                                        LR.aliclick(null, '?tracelog=signin_simple_null3');
                                        break;
                                }
                                break;
                            case 'min':
                                n.innerHTML = '请输入4位验证码';
                                LR.aliclick(null, '?tracelog=signin_simple_ev1');
                                break;
                            case 'fun':
                                n.innerHTML = o.msg;
                                break;
                        }
                        
                        FYD.removeClass(dl, 'ok');
                        FYD.addClass(dl, 'err');
                        
                        //tracelog
                    }
                    if (this.value) {
                        //tracelog
                        switch (o.key) {
                            case 'account':
                                LR.aliclick(null, '?tracelog=signin_simple_chg1');
                                break;
                            case 'pwd':
                                LR.aliclick(null, '?tracelog=signin_simple_chg2');
                                break;
                            case 'code':
                                LR.aliclick(null, '?tracelog=signin_simple_chg6');
                                break;
                        }
                    }
                    
                }
            });
            //valid
            this.vRegist = new FD.widget.Valid(FYS('input[vg=regist],input[vg=lr]', this.mod), {
                onValid: function(res, o){
                    var dl = FYD.getAncestorByTagName(this, 'dl'),
                    n = FYS('span.n', dl, true);
                    n.innerHTML = '';
                    if (res === 'pass') {
                        FYD.removeClass(dl, 'err');
                        FYD.addClass(dl, 'ok');
                        //tracelog
                        if (FYD.getStyle(dl, 'display') !== 'none') {
                            switch (o.key) {
                                case 'id':
                                    LR.aliclick(null, '?tracelog=reg_simple_{0}_s1');
                                    break;
                                case 'pwd':
                                    LR.aliclick(null, '?tracelog=reg_simple_{0}_s2');
                                    break;
                                case 'repwd':
                                    LR.aliclick(null, '?tracelog=reg_simple_{0}_s3');
                                    break;
                                case 'emaile':
                                    LR.aliclick(null, '?tracelog=reg_simple_{0}_s4');
                                case 'mobile':
                                    LR.aliclick(null, '?tracelog=reg_simple_{0}_s5');
                                case 'code':
                                    LR.aliclick(null, '?tracelog=reg_simple_{0}_s6');
                                    break;
                            }
                        }
                    }
                    else if (res === 'default') {
                        FYD.removeClass(dl, 'err');
                        FYD.removeClass(dl, 'ok');
                    }
                    else {
                        switch (res) {
                            default:
                                break;
                            case 'required':
                                n.innerHTML = '此项为必填项';
                                switch (o.key) {
                                    case 'id':
                                        LR.aliclick(null, '?tracelog=reg_simple_{0}_null1');
                                        break;
                                    case 'pwd':
                                        LR.aliclick(null, '?tracelog=reg_simple_{0}_null2');
                                        break;
                                    case 'repwd':
                                        LR.aliclick(null, '?tracelog=reg_simple_{0}_null3');
                                        break;
                                    case 'emaile':
                                        LR.aliclick(null, '?tracelog=reg_simple_{0}_null4');
                                        break;
                                    case 'mobile':
                                        LR.aliclick(null, '?tracelog=reg_simple_{0}_null5');
                                        break;
                                    case 'code':
                                        LR.aliclick(null, '?tracelog=reg_simple_{0}_null6');
                                        break;
                                    case 'clause':
                                        n.innerHTML = '需同意《阿里巴巴服务条款》才可注册为会员';
                                        LR.aliclick(null, '?tracelog=reg_simple_{0}_privacy_cancel');
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case 'fun':
                                if (o.msg) {
                                    n.innerHTML = o.msg;
                                }
                                break;
                            case 'min':
                                n.innerHTML = '请输入您收到的6位验证码';
                                LR.aliclick(null, '?tracelog=reg_simple_{0}_e_code');
                                break;
                            case 'max':
                                n.innerHTML = '请输入50个字符以内的电子邮箱';
                                break;
                            case 'noAlidomain':
                                n.innerHTML = '不能使用以alibaba-inc.com为后缀的邮箱';
                                break;
                            case 'emaile':
                                n.innerHTML = '请输入正确格式的邮箱，如：abc@abc.com';
                                break;
                            case 'rMobile':
                                n.innerHTML = '手机已被使用，请更换其他手机';
                                break;
                            case 'id1':
                                n.innerHTML = '请输入以字母开头的会员名';
                                break;
                            case 'id2':
                                n.innerHTML = '请输入4-20位字母或数字';
                                break;
                            case 'rUser':
                                n.innerHTML = '会员名已存在';
                                break;
                        }
                        FYD.removeClass(dl, 'ok');
                        FYD.addClass(dl, 'err');
                        //tracelog
                        if (res !== 'required') {
                            switch (o.key) {
                                case 'id':
                                    LR.aliclick(null, '?tracelog=reg_simple_{0}_e_loginid');
                                    break;
                                case 'pwd':
                                    LR.aliclick(null, '?tracelog=reg_simple_{0}_e_password');
                                    break;
                                case 'repwd':
                                    LR.aliclick(null, '?tracelog=reg_simple_{0}_ecp1');
                                    break;
                                case 'code':
                                    LR.aliclick(null, '?tracelog=reg_simple_{0}_e_code');
                                    break;
                            }
                        }
                    }
                    if (this.value) {
                        //tracelog
                        switch (o.key) {
                            case 'id':
                                LR.aliclick(null, '?tracelog=reg_simple_{0}_chg1');
                                break;
                            case 'pwd':
                                LR.aliclick(null, '?tracelog=reg_simple_{0}_chg2');
                                break;
                            case 'repwd':
                                LR.aliclick(null, '?tracelog=reg_simple_{0}_chg3');
                                break;
                            case 'emaile':
                                LR.aliclick(null, '?tracelog=reg_simple_{0}_chg4');
                                break;
                            case 'mobile':
                                LR.aliclick(null, '?tracelog=reg_simple_{0}_chg5');
                                break;
                            case 'code':
                                LR.aliclick(null, '?tracelog=reg_simple_{0}_chg6');
                                break;
                        }
                    }
                    
                }
            });
            
            function onLoginError(){
                messages[0].innerHTML = '<img alt="" src="http://img.china.alibaba.com/images/common/icon_v02/warn7.png" />网络异常，请稍后重试！';
                isLogining = false;
            }
            function onRegistError(){
                messages[1].innerHTML = '<img alt="" src="http://img.china.alibaba.com/images/common/icon_v02/warn7.png" />网络异常，请稍后重试！';
                isRegisting = false;
            }
            
            b2bLoginFrame.src = 
                (getTestConfig('style.logindailytaobao.url') || "http://login.taobao.com" )
                + "/member/login.jhtml?from=b2b_pop&style=b2b&full_redirect=false"
                + "&reg=" 
                + encodeURIComponent(
                        (getTestConfig('style.exodus2.url') || 'http://exodus.1688.com') 
                        + '/member/join/common_join.htm'
                    )
                + "&redirectURL=" + 
                encodeURIComponent(
                    (getTestConfig('style.jumpdailytaobao.url') || 'http://jump.taobao.com')
                    + "/jump?target=" +
                    encodeURIComponent(
                        ( getTestConfig( 'style.loginchinahttp.url' ) || 'http://login.1688.com' ) 
                        + '/member/pop_signin_route.htm?from='
                        + encodeURIComponent(location.href)
                    )
                );

            function getTestConfig(key) {
                return FD.test && FD.test[key];
            }

            FYE.on(b2bLoginFrame, 'load', checkIfLoginSuccess, LR, true);

            function checkIfLoginSuccess() {
                var self = this;
                if(!this._isOpen || this.tabIndex) {
                    return;
                }
                var uid = LR.__cookie('__cn_logon_id__');

                /**
                 * 辛酸的 <子帐号 和 浮层登录的故事>
                 * 曾经帐号们可以方便地通过浮层登录
                 * 后来有了子帐号
                 * 也可以通过浮层登录
                 * 但是
                 * 杯具的是很多应用不认子帐号
                 * "根本没有登录嘛！！！"
                 * 这些应用有不同的处理
                 * 有些跳到主登录页面
                 * 有些刷新当前页面
                 * 杯具的正是后面这种情况
                 * 页面一刷新，浮层继续弹出
                 * 然后浮层呢，检测到已经登录了呀
                 * 然后告诉外层，登录成功
                 * 外层刷新，弹浮层
                 * 浮层检测到已登录，告诉外层
                 * 外层刷新，弹浮层
                 * 浮层检测到已登录，告诉外层
                 * 外层刷新，弹浮层
                 * ....
                 * 所有如你所见，为了杯具重演
                 * 我们限制了子帐号登录浮层
                 * 1. 如果已登录为子帐号，继续提供表单供用户登录
                 * 2. 如果未登录，提供表单给子帐号登录；登录成功后js不做处理
                 *    在登录成功提示的网页中（内嵌于浮层框里的iframe）
                 *    将最外层页面刷新一下
                 *
                 * 这就是下面这行代码的来源
                 */
                if( uid && !LR.__isSubAccount() ) {
                    onLogin.call(this, uid);
                } else {
                    var url = getTestConfig('style.logintaobao.sync.url') || 'http://b2bsync.taobao.com/tbc';

                    FD.common.request("jsonp", url, {
                        onCallback: function(o) {
                            var name = o['__cn_logon_id__'];
                            if(name) {
                                var cfg = { raw: true };
                                if(/\balibaba\.com$/.test(location.hostname)) {
                                    cfg.domain = 'alibaba.com';
                                    cfg.path = '/';
                                }
                                LR.__cookie('__cn_logon_id__', name, cfg );
                                LR.__cookie('__last_loginid__', name, FD.common.apply({expires:30}, cfg));
                                LR.__cookie('__cn_logon__', true, cfg );
                                onLogin.call(self, name);
                            }
                        }
                    });
                }
            }

            function onLogin(uid) {
                FYD.setStyle(fieldsets[0], 'display', 'none');
                FYD.setStyle(dones[0], 'display', '');
                FYD.setStyle(dones[1], 'display', 'none');
                var o = {

                    userid: uid,

                    /**
                     * ResultSet 是为了兼容原先的版本，回传一个页面已有的
                     * csrfToken 给调用方
                     */
                    'ResultSet': {
                        'csrf_token' : getCSRFToken()
                    }
                };

                if (this.onLoginSuccess) {
                    this.onLoginSuccess(dones[0], {}, o);
                }
                LR.aliclick(null, '?tracelog=signin_simple_sub');
            }

            // add by changbin.wangcb on 2011-10-10 for jQuery trigger
            /*function fireEventHandler(el,e) {
                if(0<FEU.ie&&FEU.ie<9) {
                    el.fireEvent('on'+e);
                } else {
                    var evt=document.createEvent('HTMLEvents');
                    evt.initEvent(e,true,true);
                    el.dispatchEvent(evt);
                }
            }*/

			//两种登录方式的切换（B2B帐号和支付宝账号）相关事件绑定	add by xin.jingx on 20110829  mod by changbin.wangcb 添加淘宝登录的切换
			FYE.on(logalipaytrigger,'click',function(e){
				FYE.preventDefault(e);
				FYD.setStyle(logb2b, 'display', 'none');
				FYD.setStyle(logalipay, 'display', 'block');
				
				LR.aliclick(null, '?tracelog=zfbsigin_login_b_login');
			});
			FYE.on(logb2btrigger,'click',function(e){
				FYE.preventDefault(e);
				FYD.setStyle(logb2b, 'display', 'block');
				FYD.setStyle(logalipay, 'display', 'none');
				FYD.setStyle(logtaobao, 'display', 'none');
				LR.aliclick(null, '?tracelog=layer_return1688_20130322');
			});
			FYE.on(logtaobaotrigger,'click',function(e){
				FYE.preventDefault(e);
				FYD.setStyle(logb2b, 'display', 'none');
				FYD.setStyle(logtaobao, 'display', 'block');
				
				LR.aliclick(null, '?tracelog=pop_top_tb');
			});
			
            this.handleInputsFocusTrace();
        },

        __checkIfLoginDone: function() {
        },
        
        __cookie: function(key, value, options) {
            // key and possibly options given, get cookie...
            if (value !== null && typeof value === "object") {
                options = value;
            }
            options = options || {};
            var result, 
                code = options.raw ? function(s){
                    return s;
                } : escape, 

                decode = options.raw ? function(s){
                    return s;
                } : unescape;

            // key and value given, set cookie...
            if (arguments.length > 1 && (value === null || typeof value !== "object")) {
                options = FD.common.apply({}, options);

                if (value === null) {
                    options.expires = -1;
                }

                if (typeof options.expires === 'number') {
                    var days = options.expires, t = options.expires = new Date();
                    t.setDate(t.getDate() + days);
                }
                // use expires attribute, max-age is not supported by IE
                return (document.cookie = [code(key), '=', options.raw ? String(value) : code(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
            }

            return (result = new RegExp('(?:^|; )' + escape(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
        },

        __isSubAccount: function() {
            return !!LR.__cookie('cn_user') || /:/.test(LR.__cookie('__cn_logon_id__'));
        },
        
        fireEventHandler: function(el, e){
            if (0<FEU.ie&&FEU.ie<9) {
                el.fireEvent('on' + e);
            }
            else {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent(e, true, true);
                el.dispatchEvent(evt);
            }
        },
        
        submit: function(){
            if (this.tabIndex) 
                this.fireEventHandler(this.btnRegist, 'click');
            else this.fireEventHandler(this.btnLogin, 'click');
        },
        clause: function(str){
            var ta = FYS('textarea', this.mod, true);
            this._clause = str;
            ta.value = str;
        },
        show: function(configs){
            function beforeShow(o){
                if (!this.mod) {
                    this.render();
					//this.abTest();    // mod by changbin.wangcb for 取消灰度发布
                    this.init();
                    this.passwordStrength.init();
                }
                else if (!('placeholder' in document.createElement('input'))) {
                    FYS('input[placeholder]', this.mod).forEach(function(el){
                        this.fireEventHandler(el, 'blur');
                    }, this);
                }
                
                var _this = this;
                FD.widget.block(this.mod, {
                    showOverlay: configs.showOverlay !== false,
                    iframe: true,
                    focusInput: false,
                    constrainTabKey: false,
                    onBlock: function(){
                        _this._isOpen = true;
                        _this.vLogin.active(true);
                        _this.vRegist.active(true);
                        _this.vLogin.active(_this.lcode, _this.lcodeActive);
                        //2011.05.06 ab test denis
                        if (_this.registByM === true) {
                            _this.vRegist.active(_this.emaile, false);
                        }
                        //2011.03.30 Denis tracelog:浮层打开次数
                        LR.aliclick(null, '?tracelog=layer_simple_open');
                    }
                });
                this.fireEventHandler(this.tabs[0], 'click');
                if (configs.onShow) {
                    configs.onShow.call(this);
                }
                this.onLoginSuccess = configs.onLoginSuccess;
                this.onRegistSuccess = configs.onRegistSuccess;
                
                this.activeLCodeBox(o.verifyCode);
                
                 //umid打点相关代码 add by xin.jingx on 20111007
                 if(!FYG('umiframe')){
                 	var umdiv = document.createElement('div');
                 	umdiv.id = 'umiframe';
                 	FYD.setStyle(umdiv,'display','none');
                 	umdiv.innerHTML = '<iframe width="1" height="1" src="http://exodus.1688.com/member/get_umid.htm"></iframe>';
                 	document.body.appendChild(umdiv);
                 }
            }
            configs = configs || {};
            //初始化的时候，就需要发一个请求。发这个请求有2个目的。第一就是写JSESSIONID，这个是后台框架自动写入的。第二是返回上次登录名。所以无需判断cookie里面是否有JSESSIONID了。
            //不需要把lastlogin 传给后台，后台可以直接从cookie里面取到
            //yongming.baoym@alibaba-inc.com 2010.11.2
            /**
             * mod by changbin.wangcb on 2012.01.06 for 测试环境脚本切换
             */
            if(FD.test['style.exodus2.url']){
            	if(FD.test['style.loginchina.url']){
            		['loginUrl','checkcodeSrc'].forEach(function(p){
	                    LR[p] = LR[p].replace('https://login.1688.com', FD.test['style.loginchina.url']);
	                });
            	}
            	if(FD.test['style.loginchinahttp.url']){
            		LR.getLastLoginType = LR.getLastLoginType.replace('http://login.1688.com',FD.test['style.loginchinahttp.url']);
            	}
            	if(FD.test['style.exodus2.url']){
            		['registUrl', 'urlMobile', 'urlEmail', 'urlId', 'urlSendM', 'urlSendE', 'urlUM'].forEach(function(p){
	                    LR[p] = LR[p].replace('http://exodus.1688.com', FD.test['style.exodus2.url']);
	                });
            	}
            	if(FD.test['style.alipayauth.url']){
            		['alipayLoginServer', 'alipayGoto'].forEach(function(p){
            			LR[p] = LR[p].replace('https://auth.alipay.com',FD.test['style.alipayauth.url']);
            		});
            	}
            	if(FD.test['style.logindailytaobao.url']){
            		LR.taobaoLoginServer = LR.taobaoLoginServer.replace('https://login.taobao.com', FD.test['style.logindailytaobao.url']);
            	}
            	if(FD.test['style.member1dailytaobao.url']){
            		LR.taobaoMiddle = LR.taobaoMiddle.replace('http://member1.taobao.com', FD.test['style.member1dailytaobao.url']);
            	}
		if(FD.test['style.jumptaobao.url']){
            		LR.taobaoGoto = LR.taobaoGoto.replace('http://jump.taobao.com', FD.test['style.jumptaobao.url']);
            	}
            }
            
            // if (configs.imgDomain) {
                // LR.imgSrc = LR.imgSrc.replace('http://checkcode.china.alibaba.com', configs.imgDomain);
            // }
            if (configs.loginchinaDomain) {
                ['loginUrl' , 'checkcodeSrc'].forEach(function(p){
                    LR[p] = LR[p].replace('https://login.1688.com', configs.loginchinaDomain);
                });
            }
            if (configs.loginchinahttpDomain) {
            	LR.getLastLoginType = LR.getLastLoginType.replace('http://login.1688.com', configs.loginchinahttpDomain);
            }
            if (configs.aliDomain) {
                ['registUrl', 'urlMobile', 'urlEmail', 'urlId', 'urlSendM', 'urlSendE', 'urlUM'].forEach(function(p){
                    LR[p] = LR[p].replace('http://exodus.1688.com', configs.aliDomain);
                });
            }
            if(configs.alipayDomain){
            	['alipayLoginServer','alipayGoto'].forEach(function(p){
                    LR[p] = LR[p].replace('https://auth.alipay.com', configs.alipayDomain);
                });
            }
            if(configs.logintaobaoDomain){
            	LR.taobaoLoginServer = LR.taobaoLoginServer.replace('https://login.taobao.com', configs.logintaobaoDomain);
            }
            if(configs.member1taobaoDomain){
            	LR.taobaoMiddle = LR.taobaoMiddle.replace('http://member1.taobao.com', configs.member1taobaoDomain);
            }
            
            //2011.07.11 Denis source
            this.source = configs.source;
            FD.common.request('jsonp', this.getLastLoginType, {
                scope: this,
                onCallback: function(o){
                    if (o.success) {
                        this.sessionId = o.checkcodetoken;
                        this.loginid = o.data;//给loginid赋值，todo
                        if (this.sessionId) {
                            beforeShow.call(this, o);
                            
                        }
                    }
                }
            });
        },
        hide: function(){
            var _this = this;
            this.traceClose();
            FD.widget.unblock({
                onUnblock: function(){
                    _this._isOpen = false;
                    _this.form.reset();
                    _this.vLogin.active(false);
                    _this.vRegist.active(false);
                    if (_this.tabIndex === 1) {
                        if (_this.switcher && _this.switcher.innerHTML === '返回手机验证') {
                            _this.fireEventHandler(_this.switcher, 'click');
                        }
                    }
                    FYS('input[placeholder]', _this.mod).forEach(function(el){
                        if (el.value) {
                            FYD.removeClass(el, 'placeholder');
                        }
                    }, _this);
                }
            });
            
        },
        
        // 激活(取消激活) 登录面板验证码框
        activeLCodeBox: function(active){
            FYD.setStyle(this.lcodeBox, 'display', active ? '' : 'none');
            this.lcodeActive = active;
            this.vLogin.active(this.lcode, active);
        },
        /**
         * 转义GBK下的部分特殊字符
         * @param {Object} txt
         */
        _encodeSpecial: function(txt){
            return txt.replace(/%/g, '%25').replace(/\//g, '%2F').replace(/&/g, '%26').replace(/#/g, '%23').replace(/\+/g, '%2B').replace(/\s/g, '+');
        },
        //Valid Handlers
        /*
         * @method 帐户格式验证
         * @param {Object} o 验证相关属性
         */
        vAccount: function(obj, onValid){
            //noformat
	        var LR = FD.Member.LR, 
				account = this, 
				loginId = this.value, 
				opt = obj['opt'], 
				cfg = obj['cfg'], 
				type = FYD.getNextSibling(this), 
				onFinish = function(){
	            	cfg.isValid = true;
	            	onValid.call(this, 'pass', opt);
	        	};
       		//format
            // 查看该用户名是否需要验证码
            FD.common.request('jsonp', LR.getLastLoginType, {
                onCallback: function(o){
                    var verifyCode = o.verifyCode;
                    var lcodeActive = LR.lcodeActive;
                    LR.activeLCodeBox(verifyCode);
                    
                    validateAccountRemote();
                    
                    if (lcodeActive && !verifyCode) {
                        LR.fireEventHandler(LR.btnLogin, 'click');
                    }
                }
            }, {
                loginId: loginId
            });
            
            
            function validateAccountRemote(){
                if (/^[1][3|5|8]\d{9}$/.test(loginId)) {
                    FD.common.request('jsonp', LR.urlMobile, {
                        onCallback: function(o){
                            //deal
                            if (o.isHistoryMobile == 'true') {
                                FYD.setStyle(account, 'width', '90px');
                                FYD.setStyle(type, 'display', '');
                            }
                            onFinish.call(account);
                        },
                        onTimeout: onFinish,
                        onFailure: onFinish
                    }, {
                        paramA: loginId
                    });
                }
                else {
                    FYD.setStyle(account, 'width', '170px');
                    FYD.setStyle(type, 'display', 'none');
                    cfg.isValid = true;
                    onValid.call(account, 'pass', opt);
                }
            }
            //~ validateAccountRemote
        },
        
        /*
         * @method 邮箱地址异步验证
         * @param {Object} o 验证相关属性
         */
        vEmailE: function(o){
            //noformat
	        var LR = FD.Member.LR, 
				dl = FYD.getAncestorByTagName(this, 'dl'),
				spanS = FYS('span.s', dl, true);
			if (/@alibaba-inc\.com$/.test(this.value)) {
	        	return '不能使用以alibaba-inc.com为后缀的邮箱';
	    	}
			//format
            if (!REMAIL.test(this.value)) {
                return '请输入正确格式的邮箱，如：abc@abc.com';
            }
            spanS.innerHTML = '';
            return true;
        },
        
        vID: function(obj, onValid){
            var opt = obj['opt'], cfg = obj['cfg'];
            if (!/^[A-Za-z]{1}[A-Za-z\d]{3,19}$/.test(this.value)) {
                LR.aliclick(null, '?tracelog=reg_simple_{0}_el1');
                //非字母开头
                if (/^\d+/.test(this.value)) {
                    onValid.call(this, 'id1', opt);
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_e_loginid1');
                    return;
                }
                //非法字符
                if (/[^A-Za-z\d]/.test(this.value)) {
                    onValid.call(this, 'id2', opt);
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_e_loginid2');
                    return;
                }
                if (this.value.length < 4) {
                    onValid.call(this, 'id2', opt);
                    return;
                }
                return;
            }
            //请求前重置状态
            onValid.call(this, 'default', opt);
            FD.common.request('JSONP', FD.Member.LR.urlId, {

                scope: this,
                fn: 'user',
                onCallback: function(o){
                    if (o.success) {
                        cfg.isValid = true;
                        onValid.call(this, 'pass', opt);
                    }
                    else {
                        onValid.call(this, 'rUser', opt);
                        LR.aliclick(null, '?tracelog=reg_simple_{0}_el2');
                    }
                },
                onTimeout: function(){
                    cfg.isValid = true;
                    onValid.call(this, 'pass', opt);
                },
                onFailure: function(){
                    cfg.isValid = true;
                    onValid.call(this, 'pass', opt);
                }
            }, {
                TPL_NICK: encodeURI(this.value)
            });
        },
        
        vPwd: function(o){
            var LR = FD.Member.LR;
            if (o.key == 'pwd') {
                if (!/^[\w\`\~\!\@\#\$\%\^\&\*\(\)\+\-\=\{\}\|\\\[\]\:\"\;\'\<\>\?\,\.\/]{6,20}$/.test(this.value)) {    // mod by changbin.wangcb regExp修改，对特殊字符进行支持
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_ep11');
                    return '请输入6-20位字母、数字或符号';
                }
                //noformat
            var dl = FYD.getAncestorByTagName(this, 'dl'), 
				idDl = FYD.getPreviousSibling(dl), 
				emailDls = FYS('dl.email', LR.mod),
				mobileDl = FYS('dl.mobile', LR.mod, true), 
				id = FYS('input', idDl, true), 
				mobile = FYS('input', mobileDl, true),
				emaile = FYS('input', emailDls[0], true);
           		//format
                if (LR.vRegist.getConfig(id).isValid) {
                    if (id.value == this.value) {
                        LR.aliclick(null, '?tracelog=reg_simple_{0}_ep1');
                        return '不能使用登录名作为密码';
                    }
                    if ((this.value || '').lastIndexOf(id.value) > -1) {
                        LR.aliclick(null, '?tracelog=reg_simple_{0}_ep2');
                        return '不能在密码中包含登录名';
                    }
                    if ((id.value || '').lastIndexOf(this.value) > -1) {
                        LR.aliclick(null, '?tracelog=reg_simple_{0}_ep3');
                        return '不能用登录名的一部分作为密码';
                    }
                }
                if ('012345678909876543210'.lastIndexOf(this.value) > -1) {
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_ep4');
                    return '不能使用连续的数字作为密码';
                }
                if ('ABCDEFGHIJKLMNOPQRSTUVWXYZYXWVUTSRQPONMLKJIHGFEDCBA'.lastIndexOf(this.value) > -1) {
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_ep5');
                    return '不能使用连续的字母作为密码';
                }
                if ('abcdefghijklmnopqrstuvwxyzyxwvutsrqponmlkjihgfedcba'.lastIndexOf(this.value) > -1) {
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_ep6');
                    return '不能使用连续的字母作为密码';
                }
                if (/^(\d)\1+$/.test(this.value)) {
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_ep7');
                    return '不能使用相同的数字作为密码';
                }
                if (/^([a-zA-Z])\1+$/.test(this.value)) {   // mod by changbin.wangcb for \w 包含 ‘_’
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_ep8');
                    return '不能使用相同的字母作为密码';
                }
                if(/^([\`\~\!\@\#\$\%\^\&\*\(\)\+\-\=\{\}\|\\\[\]\:\"\;\'\<\>\?\,\.\/\_])\1+$/.test(this.value)){      // add by changbin.wangcb 
                    return '不能使用相同的符号作为密码';
		        }
                if (!LR.registByM && LR.vRegist.getConfig(emaile).isValid) {
                    if (emaile.value.split('@')[0] === this.value) {
                        LR.aliclick(null, '?tracelog=reg_simple_{0}_ep9');
                        return '不能使用邮箱前缀作为密码';
                    }
                }
                if (LR.registByM && LR.vRegist.getConfig(mobile).isValid) {
                    if (this.value === mobile.value) {
                        LR.aliclick(null, '?tracelog=reg_simple_m_ep12');
                        return '不能使用手机号码作为密码';
                    }
                }
                if (this.value === 'password') {
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_ep10');
                    return '不能使用"password"作为密码';
                }
                return true;
            }
            else {
                var dl = FYD.getAncestorByTagName(this, 'dl'), pwdDl = FYD.getPreviousSibling(dl), pwd = FYS('input', pwdDl, true);
                if (!LR.vRegist.getConfig(pwd).isValid) 
                    return '请先输入正确的密码';
                if (this.value === '') {
                    LR.aliclick(null, '?tracelog=reg_simple_null3');
                    return '请重复输入密码';
                }
                if (pwd.value !== this.value) {
                    return '请重复输入密码';
                }
                return true;
            }
        },
        vMobile: function(o){
            //noformat
	        var LR = FD.Member.LR, 
				dl = FYD.getAncestorByTagName(this, 'dl'), 
				sender = FYS('a.send', dl, true),
				spanS = FYS('span.s', dl, true);
			//format
            if (!/^\d{11}$/.test(this.value.replace(/^(0|86)/, ''))) {
                LR.aliclick(null, '?tracelog=reg_simple_m_em1');
                return '请输入11位数字';
            }
            if (!RMOBILE.test(this.value)) {
                LR.aliclick(null, '?tracelog=reg_simple_m_em1');
                return '请输入13/14/15/18开头的手机号码';
            }
            spanS.innerHTML = '';
            return true;
        },
        
        /**
         * @overview 输入域获取焦点时打点
         */
        handleInputsFocusTrace: function(){
            var self = this, inputs = FYS('input.text', this.mod), trace = {
                "3": 'reg_simple_{0}_time1', // id
                "4": 'reg_simple_{0}_time2', // password
                "5": 'reg_simple_{0}_time3', // repassword
                "7": 'reg_simple_{0}_time5', // mobile
                "8": 'reg_simple_{0}_time4', // emaile
                "9": 'reg_simple_{0}_time6' // vcode
            };
            
            for (var k in trace) {
                FYE.on(inputs[k], 'focus', function(e, o){
                    self.lastFocusInput = o;
                    LR.aliclick(null, '?tracelog=' + trace[o]);
                }, k);
            }
        },
        
        /**
         * @overview 关闭浮层时, 焦点所在域打点
         */
        traceClose: function(){
            var index = this.lastFocusInput, trace = {
                3: 'reg_simple_{0}_close1', // id
                4: 'reg_simple_{0}_close2', // password
                5: 'reg_simple_{0}_close3', // repassword
                7: 'reg_simple_{0}_close5', // mobile
                8: 'reg_simple_{0}_close4', // emaile
                9: 'reg_simple_{0}_close6' // vcode
            };
            this.aliclick(null, '?tracelog=reg_simple_{0}_close');
            trace[index] && this.aliclick(null, '?tracelog=' + trace[index]);
        },
		/**
		 * 生成支付宝登录URL add by changbin.wangcb 2011.09.09
		 */
		generateAlipayLoginUrl:function(){
			var alipayLoginUrl,
			    alipayGotoUrl=LR.alipayGoto+'?target='+encodeURIComponent(location.toString());
				
			alipayLoginUrl=LR.alipayLoginServer+'?classOption=b2b&center=false&goto='+encodeURIComponent(alipayGotoUrl);
			return alipayLoginUrl;
		},

		/**
		 * 生成淘宝登录URL add by xin.jingx 2011.11.9
         * modified by hua.qiuh 2012.09.07
		 */
		generateTaobaoLoginUrl:function(){

            return LR['taobaoLoginPage']
                + "?style=mini"
                + "&full_redirect=true"
                + "&from=b2b_tb_pop"
                + "&disableQuickLogin=true"
                + "&redirectURL="
                + encodeURIComponent(
                    'http://login.1688.com/member/jump.htm?target='
                    + encodeURIComponent(
                        'http://jump.taobao.com/jump?target='
                        + encodeURIComponent(location.href)
                    )
                );
		},
		/**
		 * passwordStrength add by changbin.wangcb on 2011.10.08 for 密码安全评级
		 */
		passwordStrength:{
			init:function(){
				var passDls=FYS('dl.password',LR.mod,true),
				    pinputs=FYS('input',passDls,true),
					level={
						verdects:["","弱","中","强"],
						bground:[0,-10,-20,-30],
						color:["#e60000","#000","#010000"],
						scores:[0,35,65],
						minchars:6
					},
					flag=false;
				
				FYE.on(pinputs,'focus',function(){
					if(!flag){   // 判断该段代码只执行一次
					flag=true;
					var self=this, 
						parent=FYD.getAncestorByTagName(self,'dd'),
					    div=document.createElement('div');
					
					div.className='meter';
					div.style.display='none';
					parent.appendChild(div);
					
					div.innerHTML=['<h4>强度：</h4>\
							 <span class="meter-bar"></span><span class="meter-bar"></span><span class="meter-bar"></span>\
							 <span class="strength-txt"></span>'].join('');
				
					//内嵌相对定位的div
					if(FYS('.rela',parent).length===0){		
						var relDiv=document.createElement('div');
						relDiv.style.position='relative';
						relDiv.zIndex='1';
						
						parent.insertBefore(relDiv,parent.firstChild);
						for(var i=1;i<parent.childNodes.length;){
							relDiv.appendChild(parent.childNodes[i],null);
						}
					}
					
					/*FYE.on(self,'blur',function(e){
						if(LR.vPwd.call(self,{key:'pwd'})===true) {
					        //FYD.addClass(passDls,'ok');
					        FYD.setStyle(div,'display','none');
				        }
					});*/
					
					FYE.on(this,'keyup',function(e){
						if (this.value.length !== 0) {
							FYD.setStyle(div,'display','block');
							LR.passwordStrength.runPassword(div, this, level);
						}else{
							FYD.setStyle(div,'display','none');
						}
					});
					//为了修复wrapInner方法会使input blur的问题，进行重新聚焦
			        setTimeout(function(){self.focus();},50);
					}
				});
			},
			
			// 评级展示
			runPassword:function(div,self,level){
				var score = 0, 
				    txt = FYS('.strength-txt',div,true), 
				    meter = FYS('span.meter-bar',div);
				score = LR.passwordStrength.checkPassword(self);

				if(score <= level.scores[0]) {
					txt.innerHTML=level.verdects[0];

					meter.forEach(function(a,inx){
						FYD.setStyle(a,'backgroundPosition','0 '+level.bground[0] + 'px');
					});
				} else if(score > level.scores[0] && score < level.scores[1]) {
					txt.innerHTML=level.verdects[1];
					FYD.setStyle(txt,'color',level.color[0]);

					meter.forEach(function(a,inx){
						if(inx===0){
						    FYD.setStyle(a,'backgroundPosition','0 '+level.bground[1] + 'px');
						}else{
							FYD.setStyle(a,'backgroundPosition','0 '+level.bground[0] + 'px');
						}
					});
				} else if(score >= level.scores[1] && score <= level.scores[2]) {
					txt.innerHTML=level.verdects[2];
					FYD.setStyle(txt,'color',level.color[1]);

					meter.forEach(function(a,inx){
						if(inx===2){
						    FYD.setStyle(a,'backgroundPosition','0 '+level.bground[0] + 'px');
						}else{
							FYD.setStyle(a,'backgroundPosition','0 '+level.bground[2] + 'px');
						}
					});
				} else if(score > level.scores[2]) {
					txt.innerHTML=level.verdects[3];
					FYD.setStyle(txt,'color',level.color[2]);

					meter.forEach(function(a,inx){
						FYD.setStyle(a,'backgroundPosition','0 '+level.bground[3] + 'px');
					});
				}
			},

			// 评级记分
			checkPassword:function(self) {
				var val = self.value, 
				    score = 0,
				    passDls=FYS('dl.password',LR.mod,true);

				if(LR.vPwd.call(self,{key:'pwd'})!==true){
					score -= 100;
				} else {
					score = 0;
				}

				if(val.length == 6) {
					score += 5;
				} else if(val.length >= 7 && val.length <= 10) {
					score += 10;
				} else if(val.length > 10) {
					score += 25;
				}

				if(val.match(/\d.*\d.*\d/)) {
					score += 25;
				} else if(val.match(/\d.*\d?/)) {
					score += 10;
				}

				if(val.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
					score += 25;
				} else if(val.match(/[a-zA-Z]+/)) {
					score += 10;
				}

				if(val.match(/[\W_].*[\W_]/)) {
					score += 25;
				} else if(val.match(/[\W_]{1}/)) {
					score += 10;
				}

				return score;
			}
		}
	});

    function getCSRFToken() {
        var el = FYS('input[name=_csrf_token]', null, true);
        return el && el.value;
    }

})(FD.Member.LR);
//2011.03.30 Denis tracelog:记录引用浮层的URL
FYE.onDOMReady(function(){
    LR.aliclick(null, '?tracelog=loginreg_' + location.host + location.pathname);
});
