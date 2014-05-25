/*
 * �������� 3.4
 * @author Denis 2011.02
 * @update Denis 2011.03.02 �����ӿ�֧��JSONP
 * @update Denis 2011.03.23 �޸�DOMReady����£�FF��ֵisInstalled����; �����������ͨ��iframe���У����ı�window.location; ȥ��onClickBegin
 * @update Denis 2011.06.23 ���Ѿ���ʼ�����ı�ǩ�����ظ���ʼ��
 * @update Denis 2011.09.22 �Ż�getAlitalk��Ĭ�Ͻӿڣ�������memberId����ȡonRemote����ΪĬ�Ϻ������Ż���Ĭ���İ��Ľ��������
 * @update Denis 2011.11.04 �޸�DOM���Ƴ���data��ȡʧ�ܣ�success�ص������޷�����ִ�е�BUG��
 * @update Denis 2011.12.05 �����������
 * @update Denis 2012.01.18 �޸�.data�Զ�����ת�������BUG
 * @update XuTao 2012.02.08 BUG�޸�
 * @update allenm 2012.03.01 û��װ��������ʱ�򣬳��Ե�ǰҳ���ϵ� FE.sys.webww.main.chatTo() ���������ʧ�ܣ�����ת�� webww ҳ��
 * @update Denis 2012.03.12 ���ӷ�������
 * @update Denis 2012.03.30 �޸������������GBK���������
 * @update garcia.wul 2012.07.13 �ڴ���Ĳ���������lazyLoad=true|false,���ڱ���Ƿ����ܲ�ͷʱ�ټ���
 * @update ianva 2012.10.10 mac��Ĭ������mac����
 * @update levy.jiny 2013.01.28 �޸�����win8����������pc������ͬʱ�޸���Ĭ�ϵ�prop��������offerid���������촰�������ע��offer
 * @update levy.jiny 2013.03.27 �޸������������������prop����ʱ����dataΪ�ղ������������
 * @update levy.jiny 2013.03.27 �����ڷ�ie�������ʺ��޷����Ƶ�����
 * @update levy.jiny 2013.04.7 ��������Ⱥ���췽��tribeChat
 */
/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/
('alitalk' in FE.util) ||
(function($, Util){
    jQuery.add("webww-package", {
       "js": ["http://style.c.aliimg.com/sys/js/webww/package.js"],
        "ver":"1.0" 
    });

    var ie = $.util.ua.ie, $extendIf = $.extendIf, 
    isMac = function() {
        return (navigator.platform.indexOf("Mac") > -1);
	},
    defaults = {
        //�����Ӧ����������Ϊ�Զ��塢��ť��ͼ��
        cls: {
            base: 'alitalk',
            on: 'alitalk-on',
            off: 'alitalk-off',
            mb: 'alitalk-mb'
        },
        attr: 'alitalk',
        //�������ڵ�վ�㣬
        siteID: 'cnalichn',
        //�Ƿ������û�����״̬
        remote: true,
		plugin: false,
        prop: function(){
            var data = $(this).data('alitalk');
			if(typeof(data) == "undefined" || typeof(data.offerid) == "undefined") 
				return '';
            return '&gid=' + data.offerid;
        },
		//�Ƿ�����������
		fenliu:1,
        //δ��װ��δ��⵽��װ��������ô˷���
        getAlitalk: function(id, options){
            var lazyLoad = options.lazyLoad ;
			var data = $(this).data('alitalk');
			var offerid = '';
			if(typeof(data) == "undefined") 
				offerid = "undefined";
			else
				offerid = data.offerid;
            if (lazyLoad) {
                jQuery.use("webww-package", function() {
                    if (!(FE.sys && FE.sys.webww && FE.sys.webww.main && FE.sys.webww.main.chatTo(id))) {
                        $(document).bind("webww_load_complete", function() {
                            FE.sys.webww.main.chatTo(id, true, offerid);    
                        });
                    }
                    else {
                        FE.sys.webww.main.chatTo(id, true, offerid);    
                    }
                });
            }
            else{
                if( !(FE.sys && FE.sys.webww && FE.sys.webww.main && FE.sys.webww.main.chatTo( id )) ){
                    window.open('http://webww.1688.com/message/my_chat.htm?towimmid=' + id + '&offerid=' + offerid, '_blank');
                }
            }
        },
        onRemote: function(data){
            var element = $(this);
            switch (data.online) {
                case 0:
                case 2:
                case 6:
                default: //������
                    element.html('��������').attr('title', '�Ҳ������ϣ�����������Ϣ��');
                    break;
                case 1: //����
                    element.html('������ϵ').attr('title', '���������ϣ����Ϻ���Ǣ̸');
                    break;
                case 4:
                case 5: //�ֻ�����
                    element.html('���Ҷ���').attr('title', '���ֻ����ߣ����Ϻ���Ǣ̸');
                    break;
            }
        }
    }, version = 0, isInstalled = (function(){
        if (ie) {
            var vers = {
                'aliimx.wangwangx': 6,
                'Ali_Check.InfoCheck': 5
            };
            for (var p in vers) {
                try {
                    new ActiveXObject(p);
                    version = vers[p];
                    return true;
                } 
                catch (e) {
                }
            }
        }
        if (isMac() || $.browser.mozilla || $.browser.safari) {
            var res = false;
			var self = this;
            $(function(){
                if (navigator.mimeTypes['application/ww-plugin']) {
                    var plugin = $('<embed>', {
                        type: 'application/ww-plugin',
                        css: {
							visibility: 'hidden',
							overflow:"hidden",
							display:'block',
							position:'absolute',
							top:0,
							left:0,
							width: 1,
							height: 1
                        }
                    });
                    plugin.appendTo(document.body);
                    if (isMac()||(plugin[0].NPWWVersion && numberify(plugin[0].NPWWVersion()) >= 1.003) || (plugin[0].isInstalled && plugin[0].isInstalled(1))) {
                        version = 6;
                        res = true;
                        //Denis: �ж�alitalk�Ƿ��Ѿ�����Util��DOMReady֮��use���ܣ�Util.alitalk��δ��ֵ
                        if (Util.alitalk) {
                            Util.alitalk.isInstalled = true;
                        }
                    }
                    self.plugin = plugin;//plugin.remove();
                }
            });
            return res;
        }
        return false;
    })();
    /**
     * ����ص�����
     * @param {Object} response JSON object
     * @param {Object} elements
     * @param {Object} options
     */
    function success(obj, elements, options){
        if (obj.success) {
            var arr = obj.data;
            elements.each(function(i){
                var element = $(this), data = element.data('alitalk');
                if (data) {
                    //��������״̬
                    data.online = arr[i];
                    element.addClass(data.cls.base);
                    
                    switch (data.online) {
                        case 0:
                        case 2:
                        case 6:
                        default: //������
                            element.addClass(data.cls.off);
                            break;
                        case 1: //����
                            element.addClass(data.cls.on);
                            break;
                        case 4:
                        case 5: //�ֻ�����
                            element.addClass(data.cls.mb);
                            break;
                    }
                    
                    if (data.onRemote) {
                        data.onRemote.call(element[0], data);
                    }
                }
            });
        }
        //����
        if (options.onSuccess) {
            options.onSuccess();
        }
    }
    /**
     * �����������
     */
    function invokeWW(cmd){
	    var flag = 1;
	    if(ie){
			try{
				(new ActiveXObject("aliimx.wangwangx")).ExecCmd(cmd);
				flag = 0;
			}catch(e){
			}
		}
		else{
			try{
				var mimetype = navigator.mimeTypes["application/ww-plugin"];
			    if(mimetype){
					var plugin = this.plugin;
					plugin.appendTo(document.body);
					plugin[0].SendCommand(cmd, 1);
					flag = 0;
				}
			}catch(e){
			}
		}
		if(flag == 1){
			var ifr = $('<iframe>').css('display', 'none').attr('src', cmd).appendTo('body');
			setTimeout(function(){
				ifr.remove();
			}, 200);
		}
    }
    /**
     * ����¼�������
     * @param {Object} event
     */
    function onClickHandler(event){
        var element = $(this), data, feedback, prop, info_id;
        if (event) {
            event.preventDefault();
            data = element.data('alitalk');
        }
        else {
            data = this;
        }
        //��̬ģʽ�� ����Ĭ��״̬Ϊ����
        if (!data.remote) {
            data.online = 1;
        }
        //��û�л�ȡ��״̬
        if (data.online === null) {
            return;
        }
        
        prop = data.prop;
        if (typeof prop === 'function') {
            prop = prop.call(this);
            var match = prop.match(/info_id=([^#]+)/);
            if (match && match.length === 2) {
                info_id = match[1];
            }
        }
        if(isMac()){
            feedback = '';
        }else{
            feedback = '&url2=http://dmtracking.1688.com/others/feedbackfromalitalk.html?online=' + data.online +
            '#info_id=' +
            (data.info_id || info_id || '') +
            '#type=' +
            (data.type || '') +
            '#module_ver=3#refer=' +
            encodeURI(document.URL).replace(/&/g, '$');
            //�����û�id
        }
		var loginid = encodeURIComponent(data.id);
        switch (version) {
            case 0:
            default:
                //data.getAlitalk.call(this, data.id);
                data.getAlitalk.call(this, data.id, data);
                break;
            case 5:
                invokeWW('Alitalk:Send' + (data.online === 4 ? 'Sms' : 'IM') + '?' + data.id + '&siteid=' + data.siteID + '&status=' + data.online + feedback + prop);
                break;
            case 6:
                if (data.online === 4) {
                    invokeWW('aliim:smssendmsg?touid=' + data.siteID + loginid + feedback + prop);
                }
                else {
                    invokeWW('aliim:sendmsg?touid=' + data.siteID + loginid + '&siteid=' + data.siteID + '&fenliu='+ data.fenliu +'&status=' + data.online + feedback + prop);
                }
                break;
                
        }
        if (data.onClickEnd) {
            data.onClickEnd.call(this, event);
        }
    }
    /**
     * ������¼����
     * @param {Object} id
     */
    function login(id){
        var src;
		var loginid = encodeURIComponent(id);
        if (version === 5) {
            src = 'alitalk:';
        }
        else {
            src = 'aliim:login?uid=' + (loginid || '');
        }
        invokeWW(src);
    }
    /**
     * ת��Ϊ����
     * @param {Object} s
     */
    function numberify(s){
        var c = 0;
        return parseFloat(s.replace(/\./g, function(){
            return (c++ === 0) ? '.' : '';
        }));
    }
    /*
     * ��ʼ��alitalk�ľ�̬����
     * @param {jQuery} $֧�ֵ����б�ʶ
     * @param {object} opts ���ò���
     */
    function alitalk(elements, options){
        if ($.isPlainObject(elements)) {
            options = elements;
            options.online = options.online || 1;
            $extendIf(options, defaults);
            onClickHandler.call(options);
        }
        else {
            options = options || {};
            $extendIf(options, defaults);
            elements = $(elements).filter(function(){
                return !$.data(this, options.attr);
            });
            if (elements.length) {
                //�����ӿ��Ż���֧��JSONP
                var ids = [];
                elements.each(function(i, elem){
                    elem = $(elem);
                    var data = $extendIf(eval('(' + (elem.attr(options.attr) || elem.attr('data-' + options.attr) || '{}') + ')'), options);
                    elem.data('alitalk', data);
                    ids.push(data.siteID + data.id);
                }).bind('click', onClickHandler);
                //�Ӱ��������ȡ����״̬
                if (ids.length && options.remote) {
                    $.ajax('http://amos.im.alisoft.com/mullidstatus.aw', {
                        dataType: 'jsonp',
                        data: 'uids=' + ids.join(';'), 
                        success: function(o){
                            success(o, elements, options);
                        }
                    });
                }
            }
        }
    }
    
	/*
     * ����Ⱥ����ĳ�ʼ���ӿ�
     * @param {jQuery} $֧�ֵ����б�ʶ
     */
    function tribeChat(elements){
            if (elements.length) {
                elements.bind('click', onTribeChatClickHandler);
            }
    }
	
	/**
     * ����Ⱥ�������¼�������
     * @param {Object} event
     */
    function onTribeChatClickHandler(event){
        var element = $(this), data;
        if (event) {
            event.preventDefault();
            data = element.data('alitalk');
			data = eval('(' + data + ')')
        }
        else {
            data = this;
        }
		var uid = '';
		if(data.uid)
			uid = encodeURIComponent(data.uid);
		if(uid != '' && uid.indexOf('cnalichn') < 0 && uid.indexOf('cntaobao') < 0 && uid.indexOf('enaliint') < 0)
			uid = 'cnalichn' + uid;
        switch (version) {
            case 0:
            default:
                alert("�𾴵��û�������Ҫ��װ������������ܲ���Ⱥ���죬���ȷ�Ϻ󽫽��밢����������ҳ�档");
				window.location.href="http://wangwang.1688.com";
                break;
            case 5:
            case 6:
                invokeWW('aliim:tribejoin?tribeid=' + (data.tribeid || '') + "&uid=" + uid);
                break;
                
        }
        if (data.onClickEnd) {
            data.onClickEnd.call(this, event);
        }
    }
	
    /*
     * ��̬����������
     */
    Util.alitalk = alitalk;
    /*
     * Alitalk�ͻ��˰汾
     */
    Util.alitalk.version = version;
    /*
     * �ͻ����Ƿ�װ��Alitalk
     */
    Util.alitalk.isInstalled = isInstalled;
    /*
     * �Զ�����alitalk�ͻ������
     */
    Util.alitalk.login = login;
	
	/*
     * ����Ⱥ������ýӿ�
     */
    Util.alitalk.tribeChat = tribeChat;
	
    $.add('web-alitalk');
})(jQuery, FE.util);
