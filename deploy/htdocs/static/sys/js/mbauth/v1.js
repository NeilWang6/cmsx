/**
 * �ֻ���֤����
 * @create Denis
 */
(function($, SYS){
    //noformat
	var $substitute = $.util.substitute,
		RMOBILE = /^(0|86)?1[3458]\d{9}$/, 
		context,
		container,
        form,
		message,
		fieldset,
		done,
		send,
		mobile,
		code,
		mspan,
		mspany,
        btnSubmit,
		defaults = {
			aliDomain: 'partner.china.alibaba.com',
			appendTo: 'body',
			token: '',
			dialog: {
				center: true,
				fadeIn: 300,
				fadeOut: 300
			}
		},
		configs = {},
		isOvertime,
		cdTimer,
		closeTimer,
		token,
		isBind,
		isReady;
	//format
    context = SYS.mbauth = function(cfgs){
        if (typeof cfgs === 'string') {
            switch (cfgs) {
                case 'close':
                    context.close();
                    break;
                case 'submit':
                    context.submit();
                    break;
            }
        }
        else {
            //��д��ǰ����
            configs = $.extend(true, {}, defaults, cfgs);
            //token������ȫ��
            token = configs.token;
            $.use('web-valid', function(){
                context._init();
            });
            
        }
    };
    $.extend(SYS.mbauth, {
        //sessionId��ȡ
        checkMobileIsBinding: 'http://{0}/member/ajax/check_mobile_is_binding.do',
        //���Ͱ���֤��
        sendValidateMobileCode: 'http://{0}/member/ajax/Send_Validate_Mobile_Code.do',
        //����ȡ���󶨵���֤��
        sendCancelMobileValidateCode: 'http://{0}/member/ajax/Send_Cancel_Mobile_Validate_Code.do',
        //�ύ�󶨵���֤��
        mobileValidation: 'http://{0}/member/ajax/mobile_validation.do',
        //�ύȡ���󶨵���֤��
        cancelMobileValidation: 'http://{0}/member/ajax/Cancel_Mobile_Validation.do',
        _init: function(){
            $.ajax($substitute(context.checkMobileIsBinding, [configs.aliDomain]), {
                dataType: 'jsonp',
                data: {
                    _csrf_token: token
                },
                success: function(o){
                    if (o.success) {
                        if (!isReady) {
                            context._render();
                            context._buildEvent();
                            isReady = true;
                        }
                        isOvertime = false;
						context.vAuth.active(true);
                        if (o.data.isBind === 'true') {
                            isBind = true;
                            message.html('�����ֻ�����ǰ������ɰ�ȫ��֤��');
                            context.vAuth.active(mobile, false);
                            mobile.val(o.data.mobile).hide();
                            mspan.html(o.data.mobile).show();
                            mspany.css('visibility', 'hidden');
                            send.removeClass('send-disabled');
                        }
                        else {
                            isBind = false;
                            message.html('ͨ���ֻ���֤���������ֻ���¼����Ͱ͡��ֻ��һ�����ȷ���');
                            mobile.show();
                            if (o.data.mobile) {
                                mobile.val(o.data.mobile);
                                send.removeClass('send-disabled');
                            }
                            else {
                                mobile.val('');
                                send.addClass('send-disabled');
                            }
                            mspan.hide();
                        }
                        //��ʼ��
                        fieldset.show();
                        done.hide();
                        $.use('ui-dialog', function(){
                            var openHandler = configs.dialog.open, closeHandler = configs.dialog.close;
                            configs.dialog.open = function(){
                                $('input:visible:eq(0)', fieldset).focus();
                                openHandler && openHandler();
                            };
                            configs.dialog.close = function(){
                                context.vAuth.active(false);
                                closeHandler && closeHandler();
                            };
                            container.dialog(configs.dialog);
                        });
                    }
                }
            });
        },
        /**
         * ��ʼ���ṹ
         */
        _render: function(){
            container = $('<div>', {
                id: 'sys-mbauth',
                css: {
                    display: 'none'
                }
            }).html('<div class="wrap">\
                <div class="title fd-clr"><h3><img alt="����Ͱ�" src="http://img.china.alibaba.com/cms/upload/member/logo2.gif" /></h3><a href="javascript:;" class="close" tabindex="9000"></a></div>\
                <div class="box">\
                    <form action="" method="post" onsubmit="FE.sys.mbauth(\'submit\');return false;" hideFocus="true" autocomplete="off">\
                        <ul class="tab"><li class="current">�ֻ���֤<em class="free">new</em></li><li><button type="submit"></button></li></ul>\
                        <fieldset>\
                            <div class="message"></div>\
                            <dl class="mobile"><dt>�ֻ����룺</dt><dd><input type="text" class="text" maxlength="13" style="width: 120px;" valid="{required:true,type:\'fun\',fun:FE.sys.mbauth.vMobile,key:\'mobile\'}" vg="auth" /><span class="mspan"></span><span class="y">&nbsp;</span><a class="send send-disabled" href="javascript:;"><span class="btn-l"><em>������֤��</em></span><span class="btn-r"></span></a></dd><dd class="tips"><span class="d">������13/14/15/18��ͷ���ֻ�����</span><span class="s"></span><span class="n"></span></dd></dl>\
                            <dl class="code"><dt>��֤�룺</dt><dd><input type="text" class="text" maxlength="6" style="width: 120px;" valid="{required:true,min:6,key:\'code\'}" vg="auth" /><span class="y">&nbsp;</span></dd><dd class="tips"><span class="d">���������յ���6λ��֤��</span><span class="n"></span></dd></dl>\
                            <dl class="clause"><dt></dt><dd><input id="ma-clause" type="checkbox" checked="checked" valid="{required:true,evt:\'click\',key:\'clause\'}" vg="auth" /><label for="ma-clause">���ѿ�����ͬ��</label><a title="������Ͱ��ֻ���֤/�󶨹���" href="http://view.1688.com/cms/shichang/bangding/agreement_order.html" target="_blank">������Ͱ��ֻ���֤/�󶨹���</a></dd><dd class="tips"><span class="n"></span></dd></dl>\
                            <dl class="action"><dt>&nbsp;</dt><dd><a class="submit" href="javascript:;"><span class="btn-l"><em>ȷ&nbsp;&nbsp;��</em></span><span class="btn-r"></span></a></dd></dl>\
                        </fieldset>\
                        <div class="done" style="display: none;">\
                            <h6><img alt="" src="http://img.china.alibaba.com/images/common/icon_v02/success3.png" />��֤�ɹ���</h6>\
                            <p>��ҳ����<em>5</em>������ת��</p>\
                            <p>������������û���Զ�ˢ�£�<a class="refresh" href="javascript:FE.sys.mbauth(\'close\');" target="_self">��������</a></p>\
                        </div>\
                    </form>\
                </div>\
            </div>').appendTo(configs.appendTo || 'body');
        },
        _buildEvent: function(){
            //noformat
			var	action = $('dl.action', container), 
				close = $('a.close', container), 
				texts = $('input.text', container),
				isAuthing = false;
			//format
            //global
            message = $('div.message', container);
            mobile = $(texts[0]);
            code = $(texts[1]);
            mspan = mobile.next();
            mspany = mspan.next();
            form = $('form', container);
            fieldset = $('fieldset', container);
            done = $('div.done', container);
            send = $('a.send', fieldset);
            btnSubmit = $('a.submit', container);
            //�ر�
            close.click(function(e){
                e.preventDefault();
                context('close');
            });
            //��ʱ�ı䷢�Ͱ�ť״̬
            mobile.bind('keyup blur', function(){
            	if(!isOvertime){
	                if (RMOBILE.test(this.value) && !send.hasClass('send-cd')) {
	                    send.removeClass('send-disabled');
	                }
	                else {
	                    send.addClass('send-disabled');
	                }
                }
            });
            //������֤��
            send.click(function(e){
                e.preventDefault();
                var button = $(this);
                if (button.hasClass('send-disabled') || button.hasClass('send-cd')) {
                    return;
                }
                //noformat
	                var count = 60, 
						em = $('em:eq(0)', button),
						dl = button.closest('dl'), 
						target = $('input', dl), 
						spanS = $('span.s', dl), 
						spanN = $('span.n', dl), 
						data = {
							_csrf_token: token
						};
                	//format
                
                function initTimer(){
                    cdTimer = setInterval(function(){
                        if (count === 1) {
                            em.html('������֤��');
                            button.removeClass('send-cd');
                            //����֤����
                            if (isBind || context.vAuth.valid(target)) {
                                button.removeClass('send-disabled');
                            }
                            clearInterval(cdTimer);
                            cdTimer = null;
                        }
                        else {
                            em.html(--count + '����ط�');
                        }
                        
                    }, 1000);
                    em.html('60����ط�');
                }
                button.addClass('send-disabled send-cd');
                //request
                data.mobile = target.val().replace(/^(0|86)/, '');
                
                $.ajax($substitute(isBind ? context.sendCancelMobileValidateCode : context.sendValidateMobileCode, [configs.aliDomain]), {
                    dataType: 'jsonp',
                    data: data,
                    success: function(o){
                        if (o.success) {
                            dl.removeClass('err').addClass('ok');
                            spanS.html('��֤���ѷ��͵������ֻ�������������');
                            initTimer();
                        }
                        else {
                            var opt = context.vAuth.getConfig(target);
                            opt.isValid = false;
                            dl.removeClass('ok').addClass('err');
                            button.removeClass('send-cd');
                            if (isBind || context.vAuth.valid(target)) {
                                button.removeClass('send-disabled');
                            }
                            switch (o.data.errMsg.toUpperCase()) {
                                //����5��
                                case 'OVERTIME':
                                    spanN.html('����ȡ��֤�����Ƶ��������������');
									button.addClass('send-disabled');
									isOvertime = true;
                                    break;
                                //�ֻ��ѱ���
                                case 'VALIDATED':
                                    spanN.html('��������ֻ������ѱ�ʹ�ã�����������ֻ�����');
                                    break;
                                //�ֻ���ʽ����
                                case 'MOBILE_ERR':
                                    spanN.html('��������ȷ�ֻ���ʽ');
                                    break;
                                default://�������
                                    spanN.html('���緱æ�����Ժ�����');
                                    break;
                            }
                        }
                        
                    },
                    error: function(){
                        dl.removeClass('ok').addClass('err');
                        button.removeClass('send-cd');
                        if (isBind || context.vAuth.valid(target)) {
                            button.removeClass('send-disabled');
                        }
                        spanN.html('���緱æ�����Ժ�����');
                        
                    }
                });
            });
            //keyboard tab event
            mobile.keydown(function(e){
                if (e.keyCode && e.keyCode == 9) {
                    e.preventDefault();
                    code.focus();
                }
            });
            code.keydown(function(e){
                if (e.keyCode && e.keyCode == 9) {
                    e.preventDefault();
                    mobile.focus();
                }
            });
            //input event
            texts.focus(function(){
                if ($(this).is(':visible')) {
                    var dl = $(this).closest('dl');
                    if (dl.hasClass('err') && this.value) {
                        this.select();
                    }
                    else {
                        dl.addClass('focus')
                    }
                }
            }).blur(function(){
                $(this).closest('dl').removeClass('focus');
            });
            //valid
            this.vAuth = new FE.ui.Valid($('input[vg=auth]'), {
                onValid: function(res, o){
                    var dl = $(this).closest('dl');
                    n = $('span.n', dl).html('');
                    if (res === 'pass') {
                        dl.removeClass('err').addClass('ok');
                    }
                    else 
                        if (res === 'default') {
                            dl.removeClass('err ok');
                        }
                        else {
                            switch (res) {
                                default:
                                    break;
                                case 'required':
                                    if (o.key === 'clause') {
                                        n.html('��ͬ�⡶����Ͱ��ֻ���֤/�󶨹��򡷲ſ���֤�ֻ�');
                                    }
                                    else {
                                        n.html('����Ϊ������');
                                    }
                                    break;
                                case 'fun':
                                    o.msg && n.html(o.msg);
                                    break;
                                case 'min':
                                    n.html('���������յ���6λ��֤��');
                                    break;
                                case 'rMobile':
                                    n.html('�ֻ��ѱ�ʹ�ã�����������ֻ�');
                                    break;
                            }
                            dl.removeClass('ok').addClass('err');
                        }
                }
            });
            
            function onAuthError(){
                isAuthing = false;
            }
            btnSubmit.click(function(e){
                e.preventDefault();
                if (context.vAuth.valid()) {
                    if (isAuthing) {
                        return;
                    }
                    isAuthing = true;
                    var data = {
                        mobile: mobile.val().replace(/^(0|86)/, ''),
                        valcode: code.val(),
                        _csrf_token: token
                    };
                    if (!isBind) {
                        data.type = 'new';
                    }
                    $.ajax($substitute(isBind ? context.cancelMobileValidation : context.mobileValidation, [configs.aliDomain]), {
                        dataType: 'jsonp',
                        data: $.paramSpecial(data),
                        error: function(){
                            isAuthing = false;
                        },
                        success: function(o){
                            //deal
                            if (o.success == true) {
                                var cd = 5;
                                form[0].reset();
                                if (configs.onSuccess) {
                                    configs.onSuccess(done, data, o);
                                }
                                fieldset.hide();
                                done.show();
                                if (closeTimer) {
                                    clearInterval(closeTimer);
                                    closeTimer = null;
                                }
                                closeTimer = setInterval(function(){
                                    if (!--cd) {
                                        context('close');
                                    }
                                }, 1000);
                            }
                            else {
                                var el, msg;
                                switch (o.data.errMsg.toLocaleUpperCase()) {
                                    case 'CHECKCODE_ERROR':
                                        el = code;
                                        msg = '���������֤�벻��ȷ������������';
                                        break;
                                    case 'CHECKCODE_EXPIRED':
                                        el = code;
                                        msg = '��֤���ѹ��ڣ������»�ȡ';
                                        break;
                                    case 'MOBILE_HAS_MODIFY':
                                        el = mobile;
                                        msg = '�����ֻ����뷢���˸��ģ������»�ȡ��֤��';
                                        break;
                                    default:
                                        isAuthing = false;
                                        return;                                }
                                var dl = el.closest('dl'), err = $('span.n', dl);
                                err.html(msg);
                                dl.addClass('err');
                            }
                            isAuthing = false;
                        }
                    });
                }
            });
        },
        /**
         * �رո���
         */
        close: function(){
            if (closeTimer) {
                clearInterval(closeTimer);
                closeTimer = null;
            }
            if (cdTimer) {
                clearInterval(cdTimer);
                closeTimer = null;
                $('em:eq(0)', send).html('������֤��');
                send.removeClass('send-cd');
                //����֤����
                if (isBind || context.vAuth.valid(mobile)) {
                    send.removeClass('send-disabled');
                }
            }
            form[0].reset();
            container.dialog('close');
        },
        /**
         * �ύ��
         */
        submit: function(){
            btnSubmit.triggerHandler('click');
        },
        vMobile: function(o){
            var dl = $(this).closest('dl'), sender = $('a.send', dl), spanS = $('span.s', dl);
            if (!/^\d{11}$/.test(this.value.replace(/^(0|86)/, ''))) {
                return '������11λ����';
            }
            if (!RMOBILE.test(this.value)) {
                return '������13/14/15/18��ͷ���ֻ�����';
            }
            spanS.html('');
            return true;
        }
    });
})(jQuery, FE.sys);
