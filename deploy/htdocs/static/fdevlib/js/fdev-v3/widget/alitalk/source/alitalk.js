/*
 * ���ļ���װ��Alitalk��ʼ�����ܣ������Ҫ�õ�online���ȫ�ֱ�����������ͻ��
 * @author Denis<danxia.shidx@alibaba-inc.com>
 * @link http://www.antku.com/v/alitalk.html
 * @version 3.4
 * @version 3.01 2010-03-10  �޸�������״̬��ȡ��·����֧�ֲ�ͬ�ӹ�˾����״̬��ȡ��
 * @version 3.02 2010-06-03  ������onClickBegin, onClickEnd2���¼��ӿڡ�
 * @version 3.03 2010-06-28  ��ȡonClickHandler�����Ӿ�̬����FD.widget.Alitalk.Talk������
 * @version 3.04 2011-0305   ��Ӷ�firefox,chrome������ļ���Լ���������
 * @update Desni 2011.12.05 ���ӷ�����Ϣ
 * @update Denis 2012.03.12 ���ӷ�������
 * @update Denis 2012.06.06 �Ż�getAlitalk�����������û�id��web����ҳ��
 */
;
window.online = null;
(function(w){
    /*
     * ʵ����Alitalk�����.
     * @param {HTMLElement|Array} Dom��һԪ�ػ�Ԫ����
     * @param {object} opts ���ò���
     */
    var Alitalk = function(els, opts){
        if (els && els.nodeType) 
            els = [els];
        if (els && els.length) 
            this.init(els, opts);
    }, //�Ƿ�ΪIE�����
 isIE = !!(FDEV.env.ua.ie), //����ó��ͨ�汾�ţ�ĿǰΪ5��6
 version, //תΪ����
 numberify = function(s){
        var c = 0;
        return parseFloat(s.replace(/\./g, function(){
            return (c++ === 0) ? '.' : '';
        }));
    }, //�Ƿ�װó��ͨ��������
 isInstalled = (function(){
        if (isIE) {
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
            version = 0;
        }
        else if (YAHOO.env.ua.gecko || YAHOO.env.ua.webkit) {
            if (navigator.mimeTypes["application/ww-plugin"]) {
                var plugin = document.createElement("embed");
                plugin.setAttribute('type', 'application/ww-plugin');
                FYD.setStyle(plugin, 'visibility', 'hidden');
                FYD.setStyle(plugin, 'width', 0);
                FYD.setStyle(plugin, 'height', 0);
                FYE.onDOMReady(function(S){
                    document.body.appendChild(plugin);
                    if ((plugin.NPWWVersion && numberify(plugin.NPWWVersion()) >= 1.003) || (plugin.isInstalled && plugin.isInstalled(1))) {
                        version = 6; //ֻ��2011��֮���֧��firefox�Լ�chrome�����
                        w.Alitalk.isInstalled = isInstalled = true;
                    }
                    if (plugin.tagName.toLowerCase() == 'embed') {
                        plugin.parentNode.removeChild(plugin);
                    }
                }, this);
            }
        }
        return false;
    })(), //�Զ���½
 autoLogin = function(id){
        var src;
        if (version == 5) 
            src = 'alitalk:';
        else src = 'aliim:login?uid=' + (id || '');
        invokeWW(src);
        //var iframe=document.createElement('iframe');
        //iframe.style.display='none';
        //document.body.appendChild(iframe);
        //iframe.src=src;
        //setTimeout(function() { document.body.removeChild(iframe); },1000);
    }, //Ĭ������
 defaults = {
        //�����Ӧ����������Ϊ�Զ��塢��ť��ͼ��
        cls: {
            base: 'iconAlitalk',
            on: 'icon-on',
            off: 'icon-off',
            mb: 'icon-mb'
        },
        //�������ڵ�վ�㣬
        siteID: 'cnalichn',
        //�Ƿ������û�����״̬
        remote: true,
        //ʵ�����������Ƿ����Զ���½
        autoLogin: false,
        beginNum: 0,
        prop: '',
        //����������������ҳ
        getAlitalk: function(id){
            window.open('http://webww.1688.com/message/my_chat.htm?towimmid=' + id, '_blank');
        }
    }, //�ص�����
 success = function(ali){
        for (var i = 0; i < ali.els.length; i++) {
            if (ali.els[i].opt.remote) { //��û��ָ��remoteΪfalse���ж�����״̬��������Ӧ��ʽ
                ali.els[i].opt.online = window.online[i]; //������״̬���浽Ԫ�������Ա��ں��ڵ���
                FYD.addClass(ali.els[i], ali.els[i].opt.cls.base); //�ϻ���ʽ
                switch (window.online[i]) {
                    case 0:
                    case 2:
                    case 6:
                    default: //������
                        FYD.addClass(ali.els[i], ali.els[i].opt.cls.off);
                        break;
                    case 1: //����
                        FYD.addClass(ali.els[i], ali.els[i].opt.cls.on);
                        break;
                    case 4:
                    case 5: //�ֻ�����
                        FYD.addClass(ali.els[i], ali.els[i].opt.cls.mb);
                        break;
                }
                if (ali.els[i].opt.onRemote) 
                    ali.els[i].opt.onRemote.call(ali.els[i]);
            }
        }
        //����
        window.online = null;
        if (ali.opts.onSuccess) 
            ali.opts.onSuccess.call(ali);
    },
    onClickHandler = function(e){
        if (e) 
            FYE.preventDefault(e);
        var o = this.opt;
        
        if (!isInstalled && o.webWW) {
            o.webWW.call(this);
            return;
        }
        if (o.onClickBegin) {
            var res = o.onClickBegin.call(this, e);
            if (!res) 
                return;
        }
        //��̬ģʽ�� ����Ĭ��״̬Ϊ����
        if (!o.remote) 
            o.online = 1;
        //��û�л�ȡ��״̬
        if (o.online == null) 
            return;
        var prop = o.prop, feedback, info_id;
        if (typeof prop == 'function') {
            prop = prop.call(this);
            var match = prop.match(/info_id=([^#]+)/);
            if(match && match.length === 2){
                info_id = match[1];
            }
        }
            
        feedback = '&url2=http://dmtracking.1688.com/others/feedbackfromalitalk.html?online=' + o.online +
            '#info_id=' +  (o.info_id || info_id || '') +
            '#type=' +  (o.type || '') +
            '#module_ver=3#refer=' +  encodeURI(document.URL).replace(/&/g, '$');
        //�����û�id
        switch (version) {
            case 0:
            default:
                o.getAlitalk.call(this, o.id); //���ذ�������
                break;
            case 5:
                invokeWW('Alitalk:Send' + (o.online == 4 ? 'Sms' : 'IM') + '?' + o.id + '&siteid=' + o.siteID + '&status=' + o.online + feedback + prop);
                break;
            case 6:
                if (o.online == 4) {
                    invokeWW('aliim:smssendmsg?touid=' + o.siteID + o.id + feedback + prop);
                }
                else {
                    invokeWW('aliim:sendmsg?touid=' + o.siteID + o.id + '&siteid=' + o.siteID + '&fenliu=1&status=' + o.online + feedback + prop);
                }
                break;
        }
        if (o.onClickEnd) 
            o.onClickEnd.call(this, e);
    },    /**
     * �����������
     */
    invokeWW = function(cmd){
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.src = cmd;
        setTimeout(function(){
            document.body.removeChild(iframe);
        }, 200);
    };
    Alitalk.prototype = {
        /*
         * ʵ����Alitalk�����. �������ʵ��Ψһ��¶����ķ���
         * @param {HTMLElement|Array} Dom��һ����������
         * @param {object} opts ���ò���
         */
        init: function(els, opts){
            //��ֹ��ε���online��ͻ
            if (window.online != null) {
                setTimeout(function(){
                    return new w.Alitalk(els, opts);
                }, Math.random() * 1000 + 1000);
                return;
            }
            else {
                this.opts = FD.common.applyIf(opts || {}, defaults);
                if (this.opts.remote) 
                    window.online = [];
                this.getAlitalk = this.opts.getAlitalk;
            }
            if (els.nodeType) 
                els = [els];
            if (!els.length) 
                return;
            this.els = els;
            var ids = '', that = this;
            for (var i = 0; i < els.length; i++) {
                var o = FD.common.applyIf(eval('(' + (FYD.getAttribute(els[i], 'alitalk') || '{}') + ')'), this.opts);
                if (!o.id || !FDEV.lang.trim(o.id)) {
                    els.splice(i, 1);
                    i--;
                }
                else {
                    els[i].opt = o;
                    ids += els[i].opt.siteID + o.id + ';';
                }
            }
            //����ťע�����¼�
            FYE.addListener(els, 'click', onClickHandler);
            //�Ӱ��������ȡ����״̬
            if (this.opts.remote) 
                FDEV.util.Get.script('http://amos.im.alisoft.com/mullidstatus.aw?beginnum=' + this.opts.beginNum + '&uids=' + ids + '&t=' + new Date().valueOf(), {
                    charset: 'gb2312',
                    onSuccess: function(){
                        success(that);
                    },
                    onFailure: function(){
                        window.online = null;
                    },
                    onTimeout: function(){
                        window.online = null;
                    }
                });
            //�Զ���¼
            if (isIE && this.opts.autoLogin) 
                autoLogin();
        }
    };
    /*
     * ��̬����������
     */
    w.Alitalk = Alitalk;
    /*
     * Alitalk�ͻ��˰汾
     */
    w.Alitalk.version = version;
    /*
     * �ͻ����Ƿ�װ��Alitalk
     */
    w.Alitalk.isInstalled = isInstalled;
    /*
     * �Զ�����alitalk�ͻ������
     */
    w.Alitalk.autoLogin = autoLogin;
    /*
     * �������쾲̬����
     */
    w.Alitalk.talk = function(o){
        var scope = {};
        scope.opt = o || {};
        scope.opt.online = scope.opt.online || 1;
        FD.common.applyIf(scope.opt, defaults);
        onClickHandler.call(scope);
    };
})(FD.widget);
