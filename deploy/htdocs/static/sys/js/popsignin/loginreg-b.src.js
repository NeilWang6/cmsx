(function(){

    var Lang = FDEV.lang, FEU = FDEV.env.ua, LR = FD.Member.LR, RMOBILE = /^(0|86)?1[3458]\d{9}$/, REMAIL = FD.widget.Valid.regExps.isEmail;
    
    FD.common.apply(FD.Member.LR, {
        //注册提交URL exodus2.china.alibaba.com:2100
        registUrl: 'http://exodus.1688.com/member/join/commonPopValidateJoin.htm',
        urlUM: 'http://exodus.1688.com/member/popSignin.htm',
        urlMobile: 'http://exodus.1688.com/member/checkMobileValidate.htm',
        urlSendM: 'http://exodus.1688.com/member/sendIdentityCodeByMobile.htm',
        urlSendE: 'http://exodus.1688.com/member/sendIdentityCodeByEmail.htm',
        registByM: true,
        aliclick: function(pre, trace){
            var t = this.registByM ? 'm' : 'e';
            aliclick(pre, Lang.substitute(trace, [t]));
        },
        render: function(){
            //noformat
	        var mod = FYG('modLoginReg'), //loginid=FD.Bom.getCookie('__last_loginid__')||'';//commented by yongming.baoym@alibaba-inc.com 2010.11.2
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
				<form action="" method="post" onsubmit="FD.Member.LR.submit();return false;">\
				<ul class="tab"><li>会员登录</li><li>免费注册</li><li><button type="submit"></button></li></ul>\
				<fieldset style="display: none;">\
					<div class="message"></div>\
					<dl class="account"><dt>帐号：</dt><dd><input type="text" class="text', loginid ? '' : ' placeholder', '" maxlength="50" style="width: 170px;" value="', loginid, '" valid="{', loginid ? 'lazy:false,' : '', 'required:true,type:\'remote\',fun:FD.Member.LR.vAccount,key:\'account\'}" vg="login" placeholder="登录名/电子邮箱/手机号码" />\
							<span style="display: none;"><input id="lname" type="radio" class="rdo" name="ltype" checked="checked" /><label for="lname">登录名</label><input id="lphone" type="radio" class="rdo" name="ltype" />\
							<label for="lphone">手机</label></span><a href="http://exodus.1688.com/member/retrieve_login_id.htm?tracelog=signin_simple_loginid" target="_blank" tabindex="9001">找回登录名</a></dd>\
							<dd>&nbsp;<span class="n"></span></dd></dl>\
					<dl><dt>密码：</dt><dd><input type="password" class="text" maxlength="20" style="width: 170px;" valid="{required:true,key:\'pwd\'}" vg="login" /><a class="forget" href="http://exodus.1688.com/member/retrieve_password.htm" target="_blank" tabindex="9002">找回密码</a></dd>\
						<dd>&nbsp;<span class="n"></span></dd></dl>\
					<dl class="code" style="display:none;"><dt>验证码：</dt><dd><input type="text" class="text" maxlength="4" style="width: 60px;" valid="{required:true,min:4,key:\'code\'}" vg="login" /><img src="about:blank" alt="验证码载入中" width="100" height="30" /><a class="vague" href="javascript:;" tabindex="9003">看不清</a></dd>\
						<dd>&nbsp;<span class="d">请输入4位验证码</span><span class="n">错误信息</span></dd></dl>\
					<dl class="action"><dt>&nbsp;</dt><dd><a class="login" href="javascript:;"><span class="btn-l"><em>登&nbsp;录</em></span><span class="btn-r"></span></a></dd><dd>&nbsp;</dd></dl>\
				</fieldset>\
				<fieldset><div class="topinfo">' + topInfo + '</div><div class="message"></div>\
					<dl><dt>会员名：</dt><dd><input type="text" class="text" maxlength="20" style="width: 170px;" valid="{required:true,type:\'remote\',fun:FD.Member.LR.vID,key:\'id\'}" vg="regist" /><span class="y">&nbsp;</span></dd>\
						<dd>&nbsp;<span class="d">请输入以字母开头，4-20位字母或数字</span><span class="n"></span></dd></dl>\
					<dl><dt>密码：</dt><dd><input type="password" class="text" maxlength="20" style="width: 170px;" valid="{required:true,type:\'fun\',fun:FD.Member.LR.vPwd,cache:false,key:\'pwd\'}" vg="regist" /><span class="y">&nbsp;</span></dd>\
						<dd>&nbsp;<span class="d">请输入6-20位字母或数字</span><span class="n"></span></dd></dl>\
					<dl><dt>确认密码：</dt><dd><input type="password" class="text" maxlength="20" style="width: 170px;" valid="{required:true,type:\'fun\',fun:FD.Member.LR.vPwd,cache:false,key:\'repwd\'}" vg="regist" /><span class="y">&nbsp;</span></dd>\
						<dd>&nbsp;<span class="d">请重复输入密码</span><span class="n"></span></dd></dl>\
					<dl class="email switch-m"><dt>电子邮箱：</dt><dd><input type="text" class="text placeholder" maxlength="50" style="width: 170px;" placeholder="如：abc@abc.com" valid="{required:true,type:\'remote\',fun:FD.Member.LR.vEmail,key:\'email\'}" vg="regist" /><span class="y">&nbsp;</span></dd>\
						<dd>&nbsp;<span class="d">请输入常用的电子邮箱，便于日后找回密码</span><span class="s"></span><span class="n"></span></dd></dl>\
					<dl class="split switch-m"><dt>手机验证&nbsp;&nbsp;</dt><dd></dd></dl>\
					<dl class="split switch-e" style="display:none"><dt>邮箱验证&nbsp;&nbsp;</dt><dd></dd></dl>\
					<dl class="mobile switch-m"><dt>手机号码：</dt><dd><a class="send send-disabled" href="javascript:;"><span class="btn-l"><em>发送验证码</em></span><span class="btn-r"></span></a><input type="text" class="text" maxlength="50" style="width: 170px;" valid="{required:true,type:\'fun\',fun:FD.Member.LR.vMobile,key:\'mobile\'}" vg="regist" /><span class="y">&nbsp;</span></dd>\
						<dd>&nbsp;<span class="d">请输入13/14/15/18开头的手机号码</span><span class="s"></span><span class="n"></span></dd></dl>\
					<dl class="email switch-e" style="display:none"><dt>电子邮箱：</dt><dd><a class="send send-disabled" href="javascript:;"><span class="btn-l"><em>发送验证码</em></span><span class="btn-r"></span></a><input type="text" class="text placeholder" maxlength="50" style="width: 170px;" placeholder="如：abc@abc.com" valid="{required:true,type:\'fun\',fun:FD.Member.LR.vEmailE,key:\'emaile\'}" vg="regist" /><span class="y">&nbsp;</span></dd>\
						<dd>&nbsp;<span class="d">请输入常用的电子邮箱，便于日后找回密码</span><span class="s"></span><span class="n"></span></dd></dl>\
					<dl class="code"><dt>验证码：</dt><dd><input type="text" class="text" maxlength="6" style="width: 60px;" valid="{required:true,min:6,key:\'code\'}" vg="regist" /></dd>\
						<dd>&nbsp;<span class="d">请输入您收到的6位验证码</span><span class="n">错误信息</span></dd></dl>\
					<dl class="clause"><dt></dt><dd><input id="rclause" type="checkbox" checked="checked" valid="{required:true,evt:\'click\',key:\'clause\'}" vg="regist" /><label for="rclause">我已看过并同意</label><a title="《阿里巴巴服务条款》" href="http://info.1688.com/biznews/pages/alihome/js_fw.html" onmousedown="FD.Member.LR.aliclick(null, \'?tracelog=reg_simple_{0}_privacy_click\')" target="_blank">《阿里巴巴服务条款》</a></dd>\
						<dd>&nbsp;<span class="n"></span></dd></dl>\
					<dl class="action"><dt>&nbsp;</dt><dd><a class="regist" href="javascript:;"><span class="btn-l"><em>立即注册</em></span><span class="btn-r"></span></a></dd>\
						</dl>\
					<dl class="switcher"><a href="javascript:;" title="邮箱注册">没有手机？您还可以使用邮箱验证</a></dl>\
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
				emailm = texts[6],
				mobile = texts[7],
				emaile = texts[8],
				rcode = texts[9], 
				btnLogin = FYS('a.login', this.mod, true), 
				btnRegist = FYS('a.regist', this.mod, true),
				switcher = FYS('dl.switcher>a', fieldsets[1], true),
				isLogining = false, 
				isRegisting = false;
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
            //2011.04.25 Denis AB Test
            this.abT = FD.common.getSubCookie('loginreg');
            
            if (!this.abT) {
                this.abT = Math.random() < 0.5 ? 'A' : 'B';
                FD.common.setSubCookie('loginreg', this.abT);
            }
            
            //init Session Id
            function lcodeFresh(){
                limg.src = _this.imgSrc + '?sessionID=' + encodeURIComponent(_this.sessionId) + '&t=' + new Date().getTime();
            }
            
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
                        case 'email':
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
                FYE.on([account, emaile, emailm], 'focus', function(){
                    FYD.removeClass(this, 'placeholder');
                });
                
                FYE.on([account, emaile, emailm], 'blur', function(){
                    if (this.value === '') {
                        FYD.addClass(this, 'placeholder');
                    }
                });
            }
            else {
                FYD.removeClass([account, emaile, emailm], 'placeholder');
            }
            
            //防止虚线
            FYE.on(button, 'focus', function(){
                this.blur();
            });
            //看不清
            FYE.on(lvague, 'click', function(e, scope){
                FYE.preventDefault(e);
                lcodeFresh();
                aliclick(null, '?tracelog=signin_simple_chgcode');
                
            });
            //tab switch event
            FYE.on(tabs, 'click', function(e, o){
                if (FYD.hasClass(this, 'current')) 
                    return;
                var i = tabs.indexOf(this), input = FYS('input', fieldsets[i], true);
                FYD.removeClass(tabs, 'current');
                FYD.addClass(this, 'current');
                FYD.setStyle(dones, 'display', 'none');
                FYD.setStyle(fieldsets, 'display', 'none');
                FYD.setStyle([fieldsets[i], actions[i]], 'display', '');
                input.focus();
                input.value = input.value;//IE下面，先focus后，再设置值，光标会在值后面。否则光标会在第一个位置，yongming.baoym@alibaba-inc.com 2010.11.2
                if (!i) {
                    lcodeFresh();
                }
                else {
                    aliclick(null, '?tracelog=reg_simple_m_tab1');
                    if (switcher.innerHTML === '返回手机验证') {
                        o.fireEventHandler(switcher, 'click');
                    }
                }
                o.tabIndex = i;
                //o.vLogin.active(i?false:true);
                //o.vRegist.active(i?true:false);
                //2011.03.30 Denis tracelog:注册tab打开的次数/登录tab打开的次数
                if (e.button == 0 && i === 0) {
                    aliclick(null, '?tracelog=signin_simple_tab');
                }
            }, this);
            //刷新页面的按钮
            FYE.on(refreshs, 'click', function(e){
                FYE.preventDefault(e);
                location.reload();
            });
            //找回密码tracelog
            FYE.on(forget, 'mousedown', function(){
                aliclick(null, '?tracelog=signin_simple_pass');
            });
            //2011.04.25 Denis
            FYE.on([userId, rpassword, rrpassword, emaile, emailm, rcode], 'blur', function(e, o){
                o.currentFocus = null;
            }, this);
            FYE.on([userId, rpassword, rrpassword, emaile, emailm, rcode], 'focus', function(e, o){
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
                                    spanS.innerHTML = '验证码已发送到您的邮箱，<a href="' + res.data.emailUrl + '" onclick="aliclick(null, \'?tracelog=reg_simple_e_check\')" target="_blank">立即查收</a>';
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
                                        aliclick(null, '?tracelog=reg_simple_m_em2');
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
                var s1 = '返回手机验证', s2 = '没有手机？您还可以使用邮箱验证';
                //切换时清空验证码
                if (this.innerHTML === s1) {
                    aliclick(null, '?tracelog=reg_simple_m_tab2');
                    FYD.setStyle(switche, 'display', 'none');
                    FYD.setStyle(switchm, 'display', '');
                    if (REMAIL.test(emaile.value)) {
						FYD.removeClass(emailm, 'placeholder');
                        emailm.value = emaile.value;
                    }
                    o.vRegist.active(emaile, false);
                    o.vRegist.active([emailm, mobile], true);
                    o.registByM = true;
                    this.innerHTML = s2;
                }
                else {
                    aliclick(null, '?tracelog=reg_simple_e_tab');
                    FYD.setStyle(switchm, 'display', 'none');
                    FYD.setStyle(switche, 'display', '');
                    if (REMAIL.test(emailm.value)) {
						FYD.removeClass(emaile, 'placeholder');
                        emaile.value = emailm.value;
                        if (!FYD.hasClass(sends[1], 'send-cd')) {
                            FYD.removeClass(sends[1], 'send-disabled');
                        }
                    }
                    o.vRegist.active([emailm, mobile], false);
                    o.vRegist.active(emaile, true);
                    o.vRegist.active(emaile, false);
                    o.vRegist.active(emaile, true);
                    o.registByM = false;
                    this.innerHTML = s1;
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
                    var dl = FYD.getAncestorByTagName(this, 'dl');
                    n = FYS('span.n', dl, true);
                    n.innerHTML = '';
                    if (res == 'pass') {
                        FYD.removeClass(dl, 'err');
                        FYD.addClass(dl, 'ok');
                        //tracelog
                        switch (o.key) {
                            case 'account':
                                aliclick(null, '?tracelog=signin_simple_s1');
                                break;
                            case 'pwd':
                                aliclick(null, '?tracelog=signin_simple_s2');
                                break;
                            case 'code':
                                aliclick(null, '?tracelog=signin_simple_s3');
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
                                        aliclick(null, '?tracelog=signin_simple_null1');
                                        return;case 'pwd':
                                        n.innerHTML = '请输入您的密码';
                                        aliclick(null, '?tracelog=signin_simple_null2');
                                        break;
                                    case 'code':
                                        n.innerHTML = '请输入验证码';
                                        aliclick(null, '?tracelog=signin_simple_null3');
                                        break;
                                }
                                break;
                            case 'min':
                                n.innerHTML = '请输入4位验证码';
                                aliclick(null, '?tracelog=signin_simple_ev1');
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
                                aliclick(null, '?tracelog=signin_simple_chg1');
                                break;
                            case 'pwd':
                                aliclick(null, '?tracelog=signin_simple_chg2');
                                break;
                            case 'code':
                                aliclick(null, '?tracelog=signin_simple_chg6');
                                break;
                        }
                    }
                    
                }
            });
            //valid
            this.vRegist = new FD.widget.Valid(FYS('input[vg=regist],input[vg=lr]', this.mod), {
                onValid: function(res, o){
                    var dl = FYD.getAncestorByTagName(this, 'dl');
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
                                case 'email':
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
                                    case 'email':
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
                            case 'email':
                            case 'emaile':
                                n.innerHTML = '请输入正确格式的邮箱，如：abc@abc.com';
                                break;
                            case 'rEmail':
                                n.innerHTML = '邮箱已被使用，请更换其他邮箱';
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
                                case 'email':
                                    //case 'emaile':
                                    LR.aliclick(null, '?tracelog=reg_simple_{0}_e_email');
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
                            case 'email':
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
                lcodeFresh();
            }
            function onRegistError(){
                messages[1].innerHTML = '<img alt="" src="http://img.china.alibaba.com/images/common/icon_v02/warn7.png" />网络异常，请稍后重试！';
                isRegisting = false;
            }
            FYE.on(btnLogin, 'click', function(e, o){
                FYE.preventDefault(e);
                if (o.vLogin.valid()) {
                    if (isLogining) 
                        return;
                    isLogining = true;
                    //jsonp
                    var param = {
                        paramA: account.value,
                        //2011.2.25 denis 修复特殊字符丢失的BUG
                        paramB: o._encodeSpecial(lpassword.value),
                        checkCode: lcode.value
                    };
                    if (FYD.getStyle(span, 'display') == 'inline') 
                        param.type = (rdo.checked ? 'id' : 'mobile');
                    messages[0].innerHTML = '';
                    FD.common.request('jsonp', o.loginUrl, {
                        scope: o,
                        onCallback: function(o){
                            // 需要二次验证 added by qijun.weiqj on 2011-03-08
                            var secondValiData = o.ResultSet && o.ResultSet.secondValiData;
                            if (secondValiData) {
                                window.location = secondValiData + '&Done=' + window.location.href;
                                return;
                            }
                            
                            //deal
                            if (o['ResultSet'] && o['ResultSet']['status'] == 'success') {
                                FYD.setStyle(fieldsets[0], 'display', 'none');
                                FYD.setStyle(dones[0], 'display', '');
                                this.form.reset();
                                if (this.onLoginSuccess) {
                                    this.onLoginSuccess(dones[0], param, o);
                                }
                                aliclick(null, '?tracelog=signin_simple_sub');
                                if (/^[A-Za-z]{1}[A-Za-z\d]{3,19}$/.test(param.paramA)) {
                                    aliclick(null, '?tracelog=signin_simple_id');
                                }
                                else if (/^[1][3|5|8]\d{9}$/.test(param.paramA)) {
                                    aliclick(null, '?tracelog=signin_simple_mobile');
                                }
                                else {
                                    aliclick(null, '?tracelog=signin_simple_email');
                                }
                                
                                //登录成功，取消激活验证码
                                this.activeLCodeBox(false);
                            }
                            else {
                                var el, msg;
                                switch (o['ResultSet']['failType'].toLocaleUpperCase()) {
                                    case 'FAIL_PASSWORD':
                                        el = lpassword;
                                        msg = '您输入的密码不正确，请重新输入';
                                        LR.aliclick(null, '?tracelog=signin_simple_{0}_password');
                                        break;
                                    case 'CHECKCODEERROR':
                                        el = lcode;
                                        msg = '您输入的验证码不正确，请重新输入';
                                        LR.aliclick(null, '?tracelog=reg_simple_{0}_ev1');
                                        break;
                                    case 'FAIL_USERNAME':
                                        el = account;
                                        msg = '您输入的帐号不正确，请重新输入';
                                        aliclick(null, '?tracelog=signin_simple_ev2');
                                        LR.aliclick(null, '?tracelog=signin_simple_{0}_loginid');
                                        break;
                                    case 'FAIL_HISTORY_MOBILE':
                                        el = account;
                                        msg = 'ID和手机号码重复';
                                        break;
                                    case 'FAIL_DISABLED':
                                        el = account;
                                        msg = '您的帐号无法正常使用，可能是以下原因之一：<br/>1.涉嫌大量发布广告信息；<a href="http://im.alisoft.com/security.html?flag=1#nogo" target="_blank">查看详情</a><br/>2.违反会员协议或阿里巴巴相关交易规则；<br/>3.帐号已注销。';
                                        aliclick(null, '?tracelog=signin_simple_el1');
                                        break;
                                    default:
                                        onLoginError();
                                        return;                                }
                                var dl = FYD.getAncestorByTagName(el, 'dl'), err = FYS('span.n', dl, true);
                                err.innerHTML = msg;
                                FYD.addClass(dl, 'err');
                                
                                // 用户再次尝试登录时是否需要验证码
                                var active = o['ResultSet'] && o['ResultSet'].verifyCode;
                                this.activeLCodeBox(active);
                            }
                            isLogining = false;
                            lcodeFresh();
                        },
                        onTimeout: onLoginError,
                        onFailure: onLoginError
                    }, param);
                }
                
            }, this);
            //注册
            FYE.on(btnRegist, 'click', function(e, o){
                FYE.preventDefault(e);
                if (o.vRegist.valid()) {
                    if (isRegisting) 
                        return;
                    isRegisting = true;
                    //jsonp
                    var param = {
                        //email: emaile.value,
                        userid: userId.value,
                        //2011.2.25 修复特殊字符传输丢失的问题
                        password: o._encodeSpecial(rpassword.value),
                        checkcode: rcode.value
                    };
                    if (o.registByM) {
                        param.mobileno = mobile.value;
                        param.email = emailm.value;
                        param.joinfrom = 'POP_JOIN_M';
                    }
                    else {
                        param.email = emaile.value;
                        param.joinfrom = 'POP_JOIN_E';
                    }
                    messages[1].innerHTML = '';
                    
                    FD.common.request('jsonp', o.registUrl, {
                        scope: o,
                        onCallback: function(o){
                            //deal
                            if (o.success) {
                                FYD.setStyle(fieldsets[1], 'display', 'none');
                                FYD.setStyle(dones[1], 'display', '');
                                this.form.reset();
                                if (this.onRegistSuccess) 
                                    this.onRegistSuccess(dones[1], param, o);
                            }
                            else {
                                var el, msg;
                                switch (o.data.toLocaleUpperCase()) {
                                    case 'CHECKCODEERROR':
                                        el = rcode;
                                        msg = '您输入的验证码不正确，请重新输入';
                                        LR.aliclick(null, '?tracelog=reg_simple_{0}_ev1');
                                        break;
                                    case 'EMAIL_EXIST':
                                        el = email1;
                                        msg = '您输入的邮箱已经被使用，请重新输入';
                                        break;
                                    case 'MEMBER_EXIST':
                                        el = userId;
                                        msg = '会员名已存在';
                                        break;
                                    case 'PASSWORD_UNSAFE':
                                        el = rpassword;
                                        msg = '您输入的密码不够安全，请重新输入';
                                        break;
                                    default:
                                        onRegistError();
                                        return;                                }
                                var dl = FYD.getAncestorByTagName(el, 'dl'), err = FYS('span.n', dl, true);
                                err.innerHTML = msg;
                                FYD.removeClass(dl, 'ok');
                                FYD.addClass(dl, 'err');
                            }
                            isRegisting = false;
                        },
                        onTimeout: onRegistError,
                        onFailure: onRegistError
                    }, param);
                }
                LR.aliclick(null, '?tracelog=reg_simple_{0}_infosub_click');
            }, this);
            
            this.handleInputsFocusTrace();
        },
        //Valid Handlers
        /*
         * @method 账户格式验证
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
        vEmail: function(obj, onValid){
            //noformat
            var LR = FD.Member.LR, 
				opt = obj['opt'], 
				cfg = obj['cfg'];
				
			if (this.value.indexOf('@alibaba-inc.com') != -1) {
            	onValid.call(this, 'noAlidomain', opt);
            	return;
        	}
			//format
            if (!REMAIL.test(this.value)) {
                onValid.call(this, 'email', opt);
                LR.aliclick(null, '?tracelog=reg_simple_{0}_ee1');
                return '请输入正确格式的邮箱，如：abc@abc.com';
            }
            //请求前重置状态
            onValid.call(this, 'default', opt);
            FD.common.request('JSONP', FD.Member.LR.urlEmail, {
                scope: this,
                fn: 'email',
                onCallback: function(o){
                    if (o.success) {
                        cfg.isValid = true;
                        onValid.call(this, 'pass', opt);
                    }
                    else {
                        onValid.call(this, 'rEmail', opt);
                        LR.aliclick(null, '?tracelog=reg_simple_{0}_ee2');
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
                TPL_EMAIL: encodeURI(this.value)
            });
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
			if (this.value.indexOf('@alibaba-inc.com') != -1) {
            	onValid.call(this, 'noAlidomain', opt);
            	return;
        	}
			//format
            if (!REMAIL.test(this.value)) {
                return '请输入正确格式的邮箱，如：abc@abc.com';
            }
            spanS.innerHTML = '';
            return true;
        },
        vPwd: function(o){
            var LR = FD.Member.LR;
            if (o.key == 'pwd') {
                if (!/^[a-zA-Z\d]{6,20}$/.test(this.value)) {
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_ep11');
                    return '请输入6-20位字母或数字';
                }
                //noformat
                var dl = FYD.getAncestorByTagName(this, 'dl'), 
					idDl = FYD.getPreviousSibling(dl), 
					emailDls = FYS('dl.email', LR.mod),
					mobileDl = FYS('dl.mobile', LR.mod, true), 
					id = FYS('input', idDl, true), 
					mobile = FYS('input', mobileDl, true),
					emailm = FYS('input', emailDls[0], true), 
					emaile = FYS('input', emailDls[1], true);
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
                if (/^(\w)\1+$/.test(this.value)) {
                    LR.aliclick(null, '?tracelog=reg_simple_{0}_ep8');
                    return '不能使用相同的字母作为密码';
                }
                var tmpmail = LR.registByM ? emailm : emaile;
                if (LR.vRegist.getConfig(tmpmail).isValid) {
                    if (tmpmail.value.split('@')[0] === this.value) {
                        LR.aliclick(null, '?tracelog=reg_simple_{0}_ep9');
                        return '不能使用邮箱前缀作为密码';
                    }
                }
                if (LR.registByM && LR.vRegist.getConfig(mobile).isValid) {
                    if (this.value === mobile.value) {
                        aliclick(null, '?tracelog=reg_simple_m_ep12');
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
                    aliclick(null, '?tracelog=reg_simple_null3');
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
                aliclick(null, '?tracelog=reg_simple_m_em1');
                return '请输入11位数字';
            }
            if (!RMOBILE.test(this.value)) {
                aliclick(null, '?tracelog=reg_simple_m_em1');
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
                "6": 'reg_simple_{0}_time4', // emailm
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
                6: 'reg_simple_{0}_close4', // emailm
                7: 'reg_simple_{0}_close5', // mobile
                8: 'reg_simple_{0}_close4', // emaile
                9: 'reg_simple_{0}_close6' // vcode
            };
            this.aliclick(null, '?tracelog=reg_simple_{0}_close');
            trace[index] && this.aliclick(null, '?tracelog=' + trace[index]);
        }
    });
})();
