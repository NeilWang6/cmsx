/**
 * mod by changbin.wangcb on 2011-10-09 for 密码安全评级
 * mod 评级功能、 密码valid的可用字符改造
 * mod by xin.jingx on 2011-10-18 添加UMID打点相关逻辑
 * mod by changbin.wangcb on 2011-11-02 添加淘宝登录 去掉灰度发布
 * mod by rufeng.qianrf on 2011-11-21 登录接口切换到https
 * mod by rufeng.qianrf on 2011-12-06 添加旺旺快速登录
 * mod by changbin.wangcb 2012-01-06 测试环境脚本自动切换
 * mod by changbin.wangcb 2012-02-27 添加tab传参激活默认tab
 * mod by changbin.wangcb 2012-03-13 图片验证码升级，去掉了imgDomain
 * mod by changbin.wangcb 2012-04-16 手机注册去掉邮箱字段
 */
(function($, SYS){
    //noformat
	var $substitute = $.util.substitute,
        FU = FE.util,
		$support = $.support,
		context,
		container,
        tabs,
        logalipaytrigger,
        logtaobaotrigger,
        logb2btrigger,
		fieldsets,
        btnLogin,
        btnRegist,
		defaults = {
			//imgDomain: 'checkcode.china.alibaba.com:8888',
			//imgDomain: 'http://checkcode.china.alibaba.com',
			//aliDomain: 'exodus2-dev.china.alibaba.com:2100',
			//aliDomain: 'exodus2.china.alibaba.com:2100',
			aliDomain: 'http://exodus.1688.com',
			//loginchinaDomain: 'loginchina-test.alibaba.com:3300',
			loginchinahttpDomain: 'http://login.1688.com',   // getLastLoginType请求域名，使用http，add by changbin.wangcb 2012.01.17
			loginchinaDomain: 'https://login.1688.com',  //login登录域名，使用https add by rufeng.qianrf 2011.11.21
			alipayDomain:'https://auth.alipay.com',   //支付宝登录域名 add by changbin.wangcb on 20110909
			logintaobaoDomain:'https://login.taobao.com',    // 淘宝登录域名 add by changbin.wangcb on 2012.01.06
			jumptaobaoDomain:'http://jump.taobao.com/jump',

	        // TODO change the url loaction to online address before deploy
	        // cbuRegister: 'http://exodus2.china.alibaba.com:2100/member/join/common_join.htm',
	        // alipayNotice: 'http://member-test.china.alibaba.com:5100/member/alipay/notice_for_pop.htm',
	        // taobaoLoginPage:'http://login.daily.taobao.net/member/login.jhtml',
	        // memberwebAlipayLogin: 'http://member-test.china.alibaba.com:5100/member/alipay/notice.htm',
	        cbuRegister: 'http://exodus.1688.com/member/join/common_join.htm',
	        alipayNotice: 'http://member.1688.com/member/alipay/notice_for_pop.htm',
	        taobaoLoginPage: 'https://login.taobao.com/member/login.jhtml',
	        memberwebAlipayLogin: 'http://member.1688.com/member/alipay/notice.htm',
	        
			appendTo: 'body',
			dialog: {
				center: true,
				fadeIn: 300,
				fadeOut: 300
			}
		},
		configs = {},
		urlConfigs = {
			//验证码URL
	        checkcode: '{0}/omeocheckcode',
	        //sessionId获取
	        getLastLoginType: '{0}/member/GetLastLoginType.do',
	        //登陆提交
	        loginUrl: '{0}/member/PopSignin.do',
	        //注册Email验证
	        urlEmail: '{0}/member/CheckEmailJson.htm',
	        //注册会员名验证
	        urlId: '{0}/member/CheckLoginIdAndRecommendJson.htm',
	        registUrl: '{0}/member/join/commonPopValidateJoin.htm',
	        urlUM: '{0}/member/popSignin.htm',
	        urlMobile: '{0}/member/checkMobileValidate.htm',
	        urlSendM: '{0}/member/sendIdentityCodeByMobile.htm',
	        urlSendE: '{0}/member/sendIdentityCodeByEmail.htm'
		},
		verifyCode = false,
		registByM = true,
        tabIndex,
		sessionId,
		loginId,
		currentFocus,
		lastFocusInput,
		isReady,
        isOpen,
		loginObj,
    	userList,
    	loginchinatype;
	//format
    function aClick(pre, trace){
        var t = registByM ? 'm' : 'e';
        window.aliclick && aliclick(pre, $substitute(trace, [t]));
    }
    context = SYS.logist = function(cfgs){
        if (typeof cfgs === 'string') {
            if( typeof(context[cfgs]) === 'function' ) {
                return context[cfgs]();
            }
        }
        else {
        	// 重写默认配置
        	configs = $.extend(true, {}, defaults);
        	// 切换figo测试环境
        	FE.test['style.exodus2.url'] && context.switchDomain();
            // 兼容传参未带http协议
            cfgs && (cfgs = context.formatDomain(cfgs));
            // 重写当前配置
            configs = $.extend(true, configs, cfgs);
            $.use('web-valid', function(){
                //初始化
                context._init();
            });
        }
    };
    $.extend(SYS.logist, {
        aliclick: aClick,
        _init: function(){
            $.ajax($substitute(urlConfigs.getLastLoginType, [configs.loginchinahttpDomain]), {
                dataType: 'jsonp',
                success: function(o){
                    if (o.success) {
                        sessionId = o.checkcodetoken;
                        loginId = o.data || '';
                        verifyCode = o.verifyCode;
                        if (sessionId) {
                            if (!isReady) {
                                context._render();
                                context._buildEvent();
                                isReady = true;
                            }
                            // 默认展开的Tab mob by changbin.wangcb
                            // 如果传入tab参数，则根据tab参数默认展开tab；否则根据lastLoginId来默认展开tab
                            var tabIdx = FE.util.lastLoginId ? 0 : 1;

                            if(configs.tab) {
                            	switch(configs.tab) {
                            		case 'login' :
                            		    $(tabs[0]).triggerHandler('click');
                            			logb2btrigger.triggerHandler('click');
                            			break;
                            		case 'regist' :
                            			$(tabs[0]).triggerHandler('click');
                            			logb2btrigger.triggerHandler('click');
                            			break;
                            		case 'alipay' :
                            			$(tabs[0]).triggerHandler('click');
                            			logalipaytrigger.triggerHandler('click');
                            			break;
                            		case 'taobao' :
                            			$(tabs[0]).triggerHandler('click');
                            			logtaobaotrigger.triggerHandler('click');
                            			break;
                            		default:
                            			break;
                            	}
                            }else{
                    			$(tabs[0]).triggerHandler('click');
                    			logb2btrigger.triggerHandler('click');
                            }
                            
                            $.use('ui-dialog', function(){
                                // dialogConfigs保存configss.dialog的副本，避免openHandler重复赋值
                                var dialogConfigs = {}, openHandler = configs.dialog.open, closeHandler = configs.dialog.close;
                                $.extend(dialogConfigs,configs.dialog);
                                
                                dialogConfigs.open = function(){
                                    isOpen = true;
                                    openHandler && openHandler();
                                    aClick(null, '?tracelog=layer_simple_open');
                                };
                                dialogConfigs.close = function(){
                                    closeHandler && closeHandler();
                                };
                                container.dialog(dialogConfigs);
                            });
                            
                            //umid打点相关代码 add by xin.jingx on 20111007 注释掉的部分为原计划的JS动态加载逻辑，但会导致白屏。
                            //和支付宝同学协商，认为是文档流关闭后写入的问题，最后决定采用妥协方案，插入iframe页面执行umid的脚本。
                            if(!$('#umiframe').length){
                            	var umdiv = $('<div id="umiframe" style="display:none;"><iframe width="1" height="1" src="http://exodus.1688.com/member/get_umid.htm"></iframe></div>');
                            	$('body').append(umdiv);
                            }
                        }
                    }
                }
            });
        },
        /**
         * 初始化结构
         */
        _render: function(){
            container = $('<div>', {
                id: 'sys-logist',
                css: {
                    display: 'none'
                }
            })
            .addClass('logist-fdev4')
            .html('<div class="wrap">\
				<div class="title fd-clr">\
					<h3><img alt="阿里巴巴" src="http://img.china.alibaba.com/cms/upload/member/logo2.gif" /></h3>\
					<a href="javascript:;" class="close" tabindex="9000"></a>\
				</div>\
				<div class="box">\
				<ul class="tab" style="display: none;"><li>会员登录</li><li>免费注册</li><li><button type="submit"></button></li></ul>\
				<fieldset style="display: none;">\
					<div class="b2btype">\
						<div id="loginchinatype">\
                            <iframe width="310" height="270" frameborder="no" border="0" scrolling="no" /> \
						</div>\
						<div class="signin-type">\
            				<a class="taobao-login-trigger" href="javascript:;">淘宝会员登录</a>\
							<a class="free-regist" target="_blank" href="' + defaults.cbuRegister + '">免费注册</a>\
						</div>\
		    			<div class="gray-bg-wrapper">\
		        			<div class="alipay-login-div">\
		                		<span>原使用支付宝登录会员，</span><a class="alipay-login-trigger" href="javascript:;">点此进入&gt;</a>\
		                	</div>\
		            	</div>\
					</div>\
					<div class="alipaytype" style="display:none;">\
						<div class="alipay-content"><iframe width="370" height="260" scrolling="no" frameborder="0" src="'+ defaults.alipayNotice +'"></iframe></div>\
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
						<div id="logintaobaotype" class="taobao-content"><iframe width="310" height="300" scrolling="no" frameborder="0" src="'+ context.generateTaobaoLoginUrl() +'"></iframe></div>\
               			<div class="gray-bg-wrapper">\
	               			<div class="return-cbu-signin">\
	               				<a href="javascript:;" class="logtype-b2b">&lt;返回阿里巴巴帐号登录</a>\
	                       	</div>\
	                   	</div>\
					</div>\
				</fieldset>\
				<div class="done" style="display: none;"></div><div class="done" style="display: none;"></div>\
			</div></div>').appendTo(configs.appendTo || 'body');
        },
        _buildEvent: function(){
            //noformat
			var texts = $('input.text', container);
            //global
            tabs = $('ul.tab>li:lt(2)', container);
			fieldsets = $('fieldset', container);
            btnLogin = $('#loginchinatype a.login', container);
            btnRegist = $('a.regist', container);
				
			var	actions = $('dl.action', container), 
				dones = $('div.done', container), 
				messages = $('div.message', container), 
				close = $('a.close', container), 
				isLogining = false, 
				isRegisting = false,
				logb2b = $('div.b2btype',container),
				logalipay = $('div.alipaytype',container),
				logtaobao = $('div.taobaotype',container);   // add by changbin.wangcb for 淘宝登录container
			
			/* mod by changbin.wangcb 改为全局变量；方便init中调用 */
			logb2btrigger = $('a.logtype-b2b',container);
			logalipaytrigger = $('a.alipay-login-trigger',logb2b);
			logtaobaotrigger = $('.taobao-login-trigger',logb2b);   // add by changbig.wangcb for 淘宝登录切换btn
			//format
            //关闭
            close.click(function(e){
                e.preventDefault();
                //关闭浮层
                context('close');
            });
            
            tabs.click(function(e){
                var tab = $(this);
                if (tab.hasClass('current')) {
                    return;
                }
                var i = tabs.index(tab), input = $('input:eq(0)', fieldsets[i]);
                tabIndex = i;
                
                tabs.removeClass('current');
                tab.addClass('current');
                dones.hide();
                fieldsets.hide();
                $([fieldsets[i], actions[i] || '']).show();
                //2011.03.30 Denis tracelog:注册tab打开的次数/登录tab打开的次数
                if (e.which && !i) {
                    aClick(null, '?tracelog=signin_simple_tab');
                }else if (i === 1) {
					aClick(null, '?tracelog=reg_simple_m_tab1');
				}
                
            });

			//两种登录方式的切换（B2B帐号和支付宝账号）相关事件绑定	add by xin.jingx on 20110829  mod by changbin.wangcb 添加淘宝登录的切换
			logalipaytrigger.click(function(e){
				e.preventDefault();
				logb2b.hide();
				logtaobao.hide();
				logalipay.show();
				aClick(null, '?tracelog=zfbsigin_login_b_login');
			});
			logb2btrigger.click(function(e){
				e.preventDefault();
				logb2b.show();
				logalipay.hide();
				logtaobao.hide();
				aClick(null, '?tracelog=layer_return1688_20130322');
			});
			logtaobaotrigger.click(function(e){
				e.preventDefault();
				logb2b.hide();
				logalipay.hide();
				logtaobao.show();
				aClick(null, '?tracelog=pop_top_tb');
			});

            context.initLoginFrame();
        },

        initLoginFrame: function() {
            var b2bLoginFrame = $('#loginchinatype iframe', container);
            b2bLoginFrame.one('load', function(){
                b2bLoginFrame.on('load', context.checkIfLoginSuccess);
            });
			
            b2bLoginFrame.attr('src', context.generateB2BLoginUrl());
            
            var tbLoginFrame = $('#logintaobaotype iframe', container);
            tbLoginFrame.one('load', function(){
                tbLoginFrame.on('load', context.checkIfLoginSuccess);
            });
        },

        generateB2BLoginUrl: function() {
            return (getTestConfig('style.logindailytaobao.url') || "https://login.taobao.com") 
                + "/member/login.jhtml?from=b2b_pop&style=b2b&full_redirect=false"
                + "&reg="
                + encodeURIComponent(
                    (getTestConfig('style.exodus2.url') || 'http://exodus.1688.com') 
                    + '/member/join/common_join.htm'
                    )
                + "&redirectURL="
                + encodeURIComponent(
                    (getTestConfig('style.jumpdailytaobao.url') || "http://jump.taobao.com") 
                        + "/jump?target=" 
                        + encodeURIComponent(
                            (getTestConfig('style.loginchinahttp.url') || 'http://login.1688.com') 
                            + '/member/pop_signin_route.htm?from='
                            + encodeURIComponent(location.href)
                        )
                );
        },

        checkIfLoginSuccess: function() {
            if(!isOpen || tabIndex){
                return;
            }
            context._updateLoginInfo({
                source: ['b2b', 'taobao']
            }).always(function(){
                if( isLogin() ) {
                    if (configs.onLoginSuccess) {
                        configs.onLoginSuccess($('div.done')[0], {}, {
                            userid: FU.LoginId(),
                            /**
                             * ResultSet 是为了兼容原先的版本，回传一个页面已有的
                             * csrfToken 给调用方
                             */
                            'ResultSet': {
                                'csrf_token' : $('input[name=_csrf_token]').val()
                            }
                        });
                    }
                }
            });
        },

        _updateLoginInfo: function(cfg) {
            if('updateLoginInfo' in FU) {
                return FU.updateLoginInfo(cfg);
            } else {
                var dfd = new $.Deferred;
                dfd.resolve();
                return dfd;
            }
        },

        checkIfRegSuccess: function() {
            if(!isOpen || !tabIndex){
                return;
            }
            context._updateLoginInfo({
                source: ['b2b', 'taobao']
            }).always(function(){
                if( FU.IsLogin() ) {
                    if (configs.onRegistSuccess) {
                        configs.onRegistSuccess($('div.done')[1], {}, {
                            userid: FU.LoginId(),
                            /**
                             * ResultSet 是为了兼容原先的版本，回传一个页面已有的
                             * csrfToken 给调用方
                             */
                            'ResultSet': {
                                'csrf_token' : $('input[name=_csrf_token]').val()
                            }
                        });
                    }
                }
            });
        },

        /**
         * 关闭浮层
         */
        close: function(){
            isOpen = false;
            context.traceClose();
            container.dialog('close');
        },
        /**
         * 提交表单
         */
        submit: function(){
            // 这里不做任何事情
            // 因为登录使用了跨域iframe，无法调用
        },
        /**
         * @overview 关闭浮层时, 焦点所在域打点
         */
        traceClose: function(){
            var trace = {
                '3': 'reg_simple_{0}_close1', // id
                '4': 'reg_simple_{0}_close2', // password
                '5': 'reg_simple_{0}_close3', // repassword
                '7': 'reg_simple_{0}_close5', // mobile
                '8': 'reg_simple_{0}_close4', // emaile
                '9': 'reg_simple_{0}_close6' // vcode
            };
            aClick(null, '?tracelog=reg_simple_close');
        },
        /**
         * 切换测试环境url add by changbin.wangcb 2012.01.05 
         */
        switchDomain : function(){
        	//FE.test['style.checkcode.url'] && (configs.imgDomain = FE.test['style.checkcode.url']);
        	
        	FE.test['style.loginchina.url'] && (configs.loginchinaDomain = FE.test['style.loginchina.url']);
        	
			FE.test['style.loginchinahttp.url'] && (configs.loginchinahttpDomain = FE.test['style.loginchinahttp.url']);
        	
        	FE.test['style.exodus2.url'] && (configs.aliDomain = FE.test['style.exodus2.url']);
        	
        	FE.test['style.alipayauth.url'] && (configs.alipayDomain = FE.test['style.alipayauth.url']);
        	
        	FE.test['style.logindailytaobao.url'] && (configs.logintaobaoDomain = FE.test['style.logindailytaobao.url']);
        	
            FE.test['style.jumptaobao.url'] && (configs.jumptaobaoDomain = FE.test['style.jumptaobao.url']);
        },
        /**
         * 兼容传参未带http协议 add by changbin.wangcb 2012.02.03
         */
        formatDomain : function(cfgs){
        	//cfgs.imgDomain && (cfgs.imgDomain = context.getDomain(cfgs.imgDomain, 'http://'));
        	cfgs.loginchinaDomain && (cfgs.loginchinaDomain = context.getDomain(cfgs.loginchinaDomain, 'https://'));
        	cfgs.loginchinahttpDomain && (cfgs.loginchinahttpDomain = context.getDomain(cfgs.loginchinahttpDomain, 'http://'));
        	cfgs.aliDomain && (cfgs.aliDomain = context.getDomain(cfgs.aliDomain, 'http://'));
        	return cfgs;
        },
        /**
         * 判断是否有http协议并添加 add by changbin.wangcb 2012.02.03
         */
        getDomain : function(url, protocol){
        	var ret = '',
            index = url.indexOf('http');
            if(index === 0){
                return url;
            }

            return protocol + url;
        },
		/**
		 * 生成支付宝登录URL add by changbin.wangcb 2011.09.09
		 */
		generateAlipayLoginUrl:function(){
			var alipayLoginUrl='{0}/login/option.htm?classOption=b2b&center=false&goto={1}',
			    alipayGotoUrl='{0}/login/alibabacn_trust_login.htm?target={1}',
				alipayDo=configs.alipayDomain;
			
			alipayGotoUrl=$substitute(alipayGotoUrl, [alipayDo,encodeURIComponent(location.toString())]);	
			alipayLoginUrl=$substitute(alipayLoginUrl, [alipayDo,encodeURIComponent(alipayGotoUrl)]);
			return alipayLoginUrl;
		},
		/**
		 * 生成淘宝登录URL add by xin.jingx 2011.11.9
         * modified by hua.qiuh 2012.09.07
		 */
		generateTaobaoLoginUrl:function(){

            return defaults.taobaoLoginPage
                + "?style=mini"
                + "&full_redirect=false"
                + "&disableQuickLogin=true"
                + "&from=b2b_tb_pop"
                + "&redirectURL="
                + encodeURIComponent(         
                    (getTestConfig('style.jumpdailytaobao.url') || "http://jump.taobao.com") 
                        + "/jump?target=" 
                        + encodeURIComponent(
                            (getTestConfig('style.loginchinahttp.url') || 'http://login.1688.com') 
                            + '/member/pop_signin_route.htm?from='
                            + encodeURIComponent(location.href)
                        )
                );
		},

        isReady: function(){
            return isReady;
        },

        isOpen: function() {
            return isOpen;
        }
		
    });

    function getTestConfig(key) {
        return FE.test && FE.test[key];
    }

    function isLogin() {
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
         * 所有如你所见，为了防止杯具重演
         * 我们限制了子帐号登录浮层
         * 1. 如果已登录为子帐号，继续提供表单供用户登录
         * 2. 如果未登录，提供表单给子帐号登录；登录成功后js不做处理
         *    在登录成功提示的网页中（内嵌于浮层框里的iframe）
         *    将最外层页面刷新一下
         *
         * 这就是下面这行代码的来源
         */
        return FU.IsLogin() && !isSubAccount();
    }

    function isSubAccount() {
        return !!$.util.cookie('cn_user', { raw: true }) || /:/.test($.util.cookie('__cn_logon_id__', {raw:true}));
    }

    $(function(){
        aClick(null, '?tracelog=loginreg_' + location.host + location.pathname);
    });
})(jQuery, FE.sys);
