/**
 * mod by changbin.wangcb on 2011-10-09 for ���밲ȫ����
 * mod �������ܡ� ����valid�Ŀ����ַ�����
 * mod by xin.jingx on 2011-10-18 ���UMID�������߼�
 * mod by changbin.wangcb on 2011-11-02 ����Ա���¼ ȥ���Ҷȷ���
 * mod by rufeng.qianrf on 2011-11-21 ��¼�ӿ��л���https
 * mod by rufeng.qianrf on 2011-12-06 ����������ٵ�¼
 * mod by changbin.wangcb 2012-01-06 ���Ի����ű��Զ��л�
 * mod by changbin.wangcb 2012-02-27 ���tab���μ���Ĭ��tab
 * mod by changbin.wangcb 2012-03-13 ͼƬ��֤��������ȥ����imgDomain
 * mod by changbin.wangcb 2012-04-16 �ֻ�ע��ȥ�������ֶ�
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
			loginchinahttpDomain: 'http://login.1688.com',   // getLastLoginType����������ʹ��http��add by changbin.wangcb 2012.01.17
			loginchinaDomain: 'https://login.1688.com',  //login��¼������ʹ��https add by rufeng.qianrf 2011.11.21
			alipayDomain:'https://auth.alipay.com',   //֧������¼���� add by changbin.wangcb on 20110909
			logintaobaoDomain:'https://login.taobao.com',    // �Ա���¼���� add by changbin.wangcb on 2012.01.06
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
			//��֤��URL
	        checkcode: '{0}/omeocheckcode',
	        //sessionId��ȡ
	        getLastLoginType: '{0}/member/GetLastLoginType.do',
	        //��½�ύ
	        loginUrl: '{0}/member/PopSignin.do',
	        //ע��Email��֤
	        urlEmail: '{0}/member/CheckEmailJson.htm',
	        //ע���Ա����֤
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
        	// ��дĬ������
        	configs = $.extend(true, {}, defaults);
        	// �л�figo���Ի���
        	FE.test['style.exodus2.url'] && context.switchDomain();
            // ���ݴ���δ��httpЭ��
            cfgs && (cfgs = context.formatDomain(cfgs));
            // ��д��ǰ����
            configs = $.extend(true, configs, cfgs);
            $.use('web-valid', function(){
                //��ʼ��
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
                            // Ĭ��չ����Tab mob by changbin.wangcb
                            // �������tab�����������tab����Ĭ��չ��tab���������lastLoginId��Ĭ��չ��tab
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
                                // dialogConfigs����configss.dialog�ĸ���������openHandler�ظ���ֵ
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
                            
                            //umid�����ش��� add by xin.jingx on 20111007 ע�͵��Ĳ���Ϊԭ�ƻ���JS��̬�����߼������ᵼ�°�����
                            //��֧����ͬѧЭ�̣���Ϊ���ĵ����رպ�д������⣬������������Э����������iframeҳ��ִ��umid�Ľű���
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
         * ��ʼ���ṹ
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
					<h3><img alt="����Ͱ�" src="http://img.china.alibaba.com/cms/upload/member/logo2.gif" /></h3>\
					<a href="javascript:;" class="close" tabindex="9000"></a>\
				</div>\
				<div class="box">\
				<ul class="tab" style="display: none;"><li>��Ա��¼</li><li>���ע��</li><li><button type="submit"></button></li></ul>\
				<fieldset style="display: none;">\
					<div class="b2btype">\
						<div id="loginchinatype">\
                            <iframe width="310" height="270" frameborder="no" border="0" scrolling="no" /> \
						</div>\
						<div class="signin-type">\
            				<a class="taobao-login-trigger" href="javascript:;">�Ա���Ա��¼</a>\
							<a class="free-regist" target="_blank" href="' + defaults.cbuRegister + '">���ע��</a>\
						</div>\
		    			<div class="gray-bg-wrapper">\
		        			<div class="alipay-login-div">\
		                		<span>ԭʹ��֧������¼��Ա��</span><a class="alipay-login-trigger" href="javascript:;">��˽���&gt;</a>\
		                	</div>\
		            	</div>\
					</div>\
					<div class="alipaytype" style="display:none;">\
						<div class="alipay-content"><iframe width="370" height="260" scrolling="no" frameborder="0" src="'+ defaults.alipayNotice +'"></iframe></div>\
               			<div class="gray-bg-wrapper">\
	               			<div class="return-cbu-signin" style="width: 370px;">\
	               				<a href="javascript:;" class="logtype-b2b">&lt;���ذ���Ͱ��ʺŵ�¼</a>\
	                       	</div>\
	                   	</div>\
					</div>\
					<div class="taobaotype" style="display:none;">\
		                <div class="taobao-signin-title">\
		                    <b>�Ա���Ա</b>\
		                </div>\
						<div id="logintaobaotype" class="taobao-content"><iframe width="310" height="300" scrolling="no" frameborder="0" src="'+ context.generateTaobaoLoginUrl() +'"></iframe></div>\
               			<div class="gray-bg-wrapper">\
	               			<div class="return-cbu-signin">\
	               				<a href="javascript:;" class="logtype-b2b">&lt;���ذ���Ͱ��ʺŵ�¼</a>\
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
				logtaobao = $('div.taobaotype',container);   // add by changbin.wangcb for �Ա���¼container
			
			/* mod by changbin.wangcb ��Ϊȫ�ֱ���������init�е��� */
			logb2btrigger = $('a.logtype-b2b',container);
			logalipaytrigger = $('a.alipay-login-trigger',logb2b);
			logtaobaotrigger = $('.taobao-login-trigger',logb2b);   // add by changbig.wangcb for �Ա���¼�л�btn
			//format
            //�ر�
            close.click(function(e){
                e.preventDefault();
                //�رո���
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
                //2011.03.30 Denis tracelog:ע��tab�򿪵Ĵ���/��¼tab�򿪵Ĵ���
                if (e.which && !i) {
                    aClick(null, '?tracelog=signin_simple_tab');
                }else if (i === 1) {
					aClick(null, '?tracelog=reg_simple_m_tab1');
				}
                
            });

			//���ֵ�¼��ʽ���л���B2B�ʺź�֧�����˺ţ�����¼���	add by xin.jingx on 20110829  mod by changbin.wangcb ����Ա���¼���л�
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
                             * ResultSet ��Ϊ�˼���ԭ�ȵİ汾���ش�һ��ҳ�����е�
                             * csrfToken �����÷�
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
                             * ResultSet ��Ϊ�˼���ԭ�ȵİ汾���ش�һ��ҳ�����е�
                             * csrfToken �����÷�
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
         * �رո���
         */
        close: function(){
            isOpen = false;
            context.traceClose();
            container.dialog('close');
        },
        /**
         * �ύ��
         */
        submit: function(){
            // ���ﲻ���κ�����
            // ��Ϊ��¼ʹ���˿���iframe���޷�����
        },
        /**
         * @overview �رո���ʱ, ������������
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
         * �л����Ի���url add by changbin.wangcb 2012.01.05 
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
         * ���ݴ���δ��httpЭ�� add by changbin.wangcb 2012.02.03
         */
        formatDomain : function(cfgs){
        	//cfgs.imgDomain && (cfgs.imgDomain = context.getDomain(cfgs.imgDomain, 'http://'));
        	cfgs.loginchinaDomain && (cfgs.loginchinaDomain = context.getDomain(cfgs.loginchinaDomain, 'https://'));
        	cfgs.loginchinahttpDomain && (cfgs.loginchinahttpDomain = context.getDomain(cfgs.loginchinahttpDomain, 'http://'));
        	cfgs.aliDomain && (cfgs.aliDomain = context.getDomain(cfgs.aliDomain, 'http://'));
        	return cfgs;
        },
        /**
         * �ж��Ƿ���httpЭ�鲢��� add by changbin.wangcb 2012.02.03
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
		 * ����֧������¼URL add by changbin.wangcb 2011.09.09
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
		 * �����Ա���¼URL add by xin.jingx 2011.11.9
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
         * ����� <���ʺ� �� �����¼�Ĺ���>
         * �����ʺ��ǿ��Է����ͨ�������¼
         * �����������ʺ�
         * Ҳ����ͨ�������¼
         * ����
         * ���ߵ��Ǻܶ�Ӧ�ò������ʺ�
         * "����û�е�¼�����"
         * ��ЩӦ���в�ͬ�Ĵ���
         * ��Щ��������¼ҳ��
         * ��Щˢ�µ�ǰҳ��
         * ���ߵ����Ǻ����������
         * ҳ��һˢ�£������������
         * Ȼ�󸡲��أ���⵽�Ѿ���¼��ѽ
         * Ȼ�������㣬��¼�ɹ�
         * ���ˢ�£�������
         * �����⵽�ѵ�¼���������
         * ���ˢ�£�������
         * �����⵽�ѵ�¼���������
         * ���ˢ�£�������
         * ....
         * ��������������Ϊ�˷�ֹ��������
         * �������������ʺŵ�¼����
         * 1. ����ѵ�¼Ϊ���ʺţ������ṩ�����û���¼
         * 2. ���δ��¼���ṩ�������ʺŵ�¼����¼�ɹ���js��������
         *    �ڵ�¼�ɹ���ʾ����ҳ�У���Ƕ�ڸ�������iframe��
         *    �������ҳ��ˢ��һ��
         *
         * ������������д������Դ
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
