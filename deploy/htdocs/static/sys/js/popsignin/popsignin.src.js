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
        memberIdLabel : '��¼��/��������/�ֻ�����',
        blankMemberId : '���������ĵ�¼��/��������/�ֻ����롣', 
        blankPassword : '�������������롣', 
        blankCheckCode : '������������֤�롣', 
        signFail : {
           "FAIL_USERNAME" : '��������ʺŲ����ڣ����������롣',
           "FAIL_PASSWORD" : '����������벻��ȷ�����������롣',
           "checkCodeError" : '���������֤�벻��ȷ�����������롣',
           "FAIL_DISABLED" : '�����ʺ��޷�����ʹ�ã�����������ԭ��֮һ��<br/>1.���Ӵ������������Ϣ<a href="http://im.alisoft.com/security.html?flag=1#nogo" target="_blank">�鿴����</a><br/>2.Υ����ԱЭ�����Ͱ���ؽ��׹���<br/>3.�ʺ���ע��<br/><input type="button" class="goback" value="����" />'
        },
        unknownSignFail:'ϵͳ��æ�����Ժ����ԡ�'}
    //iframe : false,//�Ƿ���IE6���Զ�����iframe������ҳ���п��ܳ���selectʱ��Ϊtrue��Ĭ��false��
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
            //�Լ�����һ��iframe���ie6�����select����
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
                self.__reset();//����
                config.afterClose && config.afterClose.apply(self);//�����Զ���Ĺر��¼�
            },
            __showWin = function(){
                //todo
                d.removeClass(winInstance,'hide');
                config.afterShow && config.afterShow.apply(self);//�����Զ������ʾ�¼�
            };
        //�������з���
        this.getWin = function(){
            return winInstance.parentNode;
        };
        this.abortRequest = function(){
            self.__isAborted = true;
        };
        (function(){
            if(isIE){
                //�����IE���򲻼ӽ������Ե�Ч��
                self.closeWin = function(){
                    __closeWin();
                }
                self.showWin = function(){
                    __showWin();
                }
            }else{
                //�������Ե�Ч����ǿ��ģ��������ҳ�����Ѿ�������animation�࣬����ϣ����򲻼ӡ�����һ������ľ�ϲ^_^
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
            isHistoryMobile = false;//�Ƿ�Ϊ��ʷ�ֻ����룬Ĭ�ϲ���
        //����URL
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
                //������ֻ�����
                FD.common.request('JSONP',config.requestUrl3,{
                    onCallback: function(o){
                        if(o.isHistoryMobile == 'true'){
                            isHistoryMobile = true;
                            //��ʾ�û�ѡ���¼����
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
            checkHistoryMobile();//���last_loginid��history �ֻ�����һ��ʼ��ʱ��Ҳ����ֵ�ѡ��ť
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
                //������������У��û����˹رհ�ť��ȡ����¼�¼�
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
        //�����¼�
        e.on(win,'click',function(evt){
            e.stopPropagation(evt);
        });
        //�����ֹ�˲���Ҽ������޷��Ҽ�����
        //e.on(win,'contextmenu',function(evt){
            //e.stopEvent(evt);
        //});
        e.on(closeBtn,'click',function(evt){
            e.preventDefault(evt);
            //�������������У����˹رհ�ť�������κβ���
            if(!self.__isRequesting){
                self.closeWin();
            }
        });
        //�������ӻس��ύ�¼�
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
        //�ص�����
        self.__signCallback = function(result){
            //���ﻹҪ����̨���صĽ��
            if(self.__isAborted) return;//����û�ȡ���˵�¼���򷵻�
            //���صĸ�ʽӦ����������:  result = {ResultSet : {status : 'fail', failType : 'fads'}};
            if(result.ResultSet.status == 'success'){
                if(self.config.signSuccess){
                    //������Զ���ĵ�¼�ɹ��¼���������Զ����¼����Զ���ɹ��¼�����
                    self.config.signSuccess.call(self,result);
                }else{
                    //��������Ĭ�ϵĳɹ��¼�
                    self.__signSuccess(); 
                }
               
            }else if(result.ResultSet.status == 'fail'){
                self.__refreshCheckCode();//��¼ʧ����Ҫˢ����֤��
                if(self.config.signFail){
                    //������Զ���ĵ�¼ʧ��--�ʺŻ����������������Զ����¼�
                    self.config.signFail.call(self,result);
                }
                //�϶������Ĭ�ϵ�ʧ���¼�
                self.__signFail(result.ResultSet.failType);               
            }else{
                self.__refreshCheckCode();//��¼ʧ����Ҫˢ����֤��
                //����Ӧ���Ƿ������ݸ�ʽ������
                self.__signFail(self.config.tips.unknownSignFail);
            }
        }
        //���Ĭ�ϵĵ�¼�ɹ��¼�
        this.__signSuccess = function(){
            //��¼�ɹ���Ĭ�ϵ��¼���ֱ��ˢ�µ�ǰҳ��
            window.location.reload();
        }
        //���Ĭ�ϵĵ�¼ʧ���¼�--�ʺŻ����������
        this.__signFail = function(failType){
            //��¼ʧ�ܣ�����ʾ��ʾ��Ϣ
            self.__showTip(self.config.tips.signFail[failType] || self.config.tips.unknownSignFail);
            switch(failType){
                case 'checkCodeError' : checkCode.select(); break;
                case 'FAIL_USERNAME' : memberId.select(); break;
                case 'FAIL_PASSWORD' : password.select(); break;
                case 'FAIL_DISABLED' : self.__showDisabledInfo();break;
                default : break;
            }
        }
        //���Ĭ�ϵĵ�¼ʧ���¼�--�����쳣
        this.__unknowSignFail = function(){
            //��¼ʧ�ܣ�����ʾ��ʾ��Ϣ
            self.__showTip(self.config.tips.unknownSignFail);
            memberId.select();
            self.__refreshCheckCode();//��Ҫˢ����֤��
        }
        //���Ĭ�ϵĵ�¼ʧ���¼�--�˺��쳣
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
            if(self.__isRequesting) return;//������������򷵻�
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
                    if(self.__isAborted) return;//����û�ȡ���˵�¼���򷵻�
                    //���ʧ�ܣ������ֱ�ӵ����쳣��ʧ���¼�����������
                    self.__unknowSignFail();
                },
                onTimeout: function(o){
                    o.purge();
                    self.__isRequesting = false;
                    if(self.__isAborted) return;//����û�ȡ���˵�¼���򷵻�
                    //�����ʱ�������ֱ�ӵ����쳣��ʧ���¼�����������
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
        return '<div class="mod-popsignin-wrap"><div class="over-lay"></div><div class="mod-popsignin-con"><h1><em>��Ա��¼</em><a href="" title="�ر�" class="close">close</a></h1><p class="tip-line hide"></p><div class="con-wrap"><p class="top-tip">��ʹ�����ڰ���Ͱ��й�վ�Ļ�Ա�ʺŵ�¼����վ</p><p class="input-line"><em>��&nbsp;�ţ�</em><input type="text" name="memberid" title="��¼��/��������/�ֻ�����" class="input" maxlength="50" /><label class="memidlabel hide"><input type="radio" name="mtype" checked="checked" value="id" class="mtype">��¼��</label><label class="memidlabel hide"><input type="radio" name="mtype" value="mobile" class="mtype">�ֻ�</label></p><p class="input-line"><em>��&nbsp;�룺</em><input type="password" name="password" class="input" maxlength="20" /><a href="" title="�һ�����" target="_blank" class="getpasswordurl" tabindex="-1">�һ�����</a></p><p class="code-line"><em>��֤�룺</em><input type="text" name="checkcode" maxlength="4" /><img src="" class="checkcodeimg hide"><a href="#" title="�����壬��һ��" class="refreshcode hide" tabindex="-1">������</a></p><p class="success-line hide"></p><p class="loading-line hide"><img src="http://img.china.alibaba.com/images/app/member/widgets/loading.gif" alt="����Ϊ����¼�����Ժ�..." title="����Ϊ����¼�����Ժ�..." /><em>����Ϊ����¼�����Ժ�...</em></p><p class="submit-line"><input type="button" name="submitbtn" class="submit" value="�� ¼"  /><a href="" class="registerurl" target="_blank">���ע��</a></p></div></div></div>';
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
                <h1><em>��Ա��¼</em><a href="" title="�ر�" class="close">close</a></h1>
                <p class="tip-line hide"></p>
                <p class="top-tip">��ʹ�����ڰ���Ͱ��й�վ�Ļ�Ա�ʺŵ�¼����վ</p>
                <p class="input-line"><em>��&nbsp;�ţ�</em><input type="text" name="memberid" title="��¼��/��������/�ֻ�����" /></p>
                <p class="input-line"><em>��&nbsp;�룺</em><input type="password" name="password" /></p>
                <p class="code-line"><em>��֤�룺</em><input type="text" name="checkcode" /><img src="" class="checkcodeimg"><a href="#" title="�����壬��һ��" class="refreshcode">�����壿</a></p>
                <p class="success-line hide">��¼�ɹ���<em>3</em>���ˢ�µ�ǰҳ��</p>
                <p class="loading-line hide"><img src="http://img.china.alibaba.com/images/app/member/widgets/loading.gif" alt="����Ϊ����¼�����Ժ�..." title="����Ϊ����¼�����Ժ�..." /><em>����Ϊ����¼�����Ժ�...</em></p>
                <p class="submit-line hide"><input type="button" name="submitbtn" class="submit" value="�� ¼" /><a href="http://exodus.1688.com/member/retrieve_password.htm" title="�������룿" target="_blank" class="getpasswordurl">�������룿</a></p>
                <p class="bot-tip">�����ǻ�Ա������<a href="http://exodus.1688.com/member/join/common_join.htm" title="���ע��" target="_blank" class="registerurl">���ע��</a></p>
            </div>
        </div>
    </div>
    css file:http://style.c.aliimg.com/css/sys/popsignin/popsignin.css
*/
/*
    1. �޸�block�����ie6�����޷�����ֲ����ǵ����⣬��¼����Լ�����һ��iframe��� -- 20101008 by yongming.baoym@alibaba-inc.com  
*/

