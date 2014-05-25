/**
* FD.widget.Valid
*
* ��֤���
* ���ƣ�
* 		1��Valid��ҪYUI��֧��
* ���÷�����
* 		����
* 		<input tabindex="40" valid="{type:'int',required:true,min:2,max:1000,key:'��������'}" validgroup="g1" type="text" />
*		����
*		<script type="text/javascript">
*           //onValid����thisָ��ָ��validGroup1 ����elΪ��ǰ��֤����oΪ��Ӧ����֤����
*           var validGroup1 = new FD.widget.Valid($$('[validgroup=g1]'), {
*               onValid: function(res, o){...}
*           });
*           ...
*           validGroup1.valid(els); 
*           validGroup1.valid(); //������(����|ָ��)����״̬�Ŀؼ�������֤
*           validGroup1.active()
*           validGroup1.add(els)
*           validGroup1.remove(els)
*		</script>
*
* @author 	Daniel Shi<swainet@126.com>
* @link    http://www.fdev-lib.cn/
* @version 2.1    ��չvalid����2������
* @update Denis&Zhangbo 2011.12.05 �޸����м��㳤���������һ�������BUG
*/
;(function(widget) {
    var regExps={
        isFloat: /^[-\+]?\d+(\.\d+)?$/,
		isUrl: /^(http|https):\/\//,
        isEmail: /^[\w\-]+(\.[\w\-]*)*@[\w\-]+([\.][\w\-]+)+$/,
        isMobile: /^1\d{10}$/,
        isInt: /^[-\+]?\d+$/,
        isID: /^\d{17}[\d|X]|\d{15}$/
    },
    rtrim=/^[\s\u00A0\u3000]+|[\s\u00A0\u3000]+$/g,
    fireEventHandler=function(el,e) {
        if(window.ActiveXObject) {
            el.fireEvent('on'+e);
        } else {
            var evt=document.createEvent('HTMLEvents');
            evt.initEvent(e,true,true);
            el.dispatchEvent(evt);
        }
    },
    enterPressHandler=function(e,el) {
        if(e.keyCode==13)
            fireEventHandler(el,'blur');
    };
    Valid=function(els,opts) {
        this._els=[];
        this._elConfigs=[];
        if(opts&&opts.onValid) this.onValid=opts.onValid;
        if(els.length) this.add(els);
    },
    //��ȡ�ؼ�value
    val=function(el,o) {
        switch(el.tagName.toLowerCase()) {
            case 'input':
                var type=el.type.toLowerCase();
                if(type=='text'||type=='password') {
                    if(o.trim) el.value=el.value.replace(rtrim,''); //����ǰ��ո�
                    return el.value;
                }
                if(type=='password') return el.value;
                if(type=='radio'||type=='checkbox') return el.checked?'checked':'';
                return el.value;
            case 'textarea':
            default:
                if(o.trim) el.value=el.value.replace(rtrim,''); //����ǰ��ո�
                return el.value;
            case 'select':
                return el.selectedIndex<0?null:el.options[el.selectedIndex].value;
        }
    },
    validHandler=function(e,obj) {
        //2010.06.09: cfg Դ������ o ��ʱ���� ����isValid����
        var el=obj['el'],cfg=obj['cfg'],o=obj['opt'],value=val(el,o);
        if(!o.active) return; //��֤δ���� ����
        //����ǰ��ո�
        if(o.lazy) {
            if(value==o.defValue) return;
            o.lazy=false;
        }
		//2011.05.19 Denis ��cacheΪfalse��ʱ�򣬴��߼���Ч
        if(o.cache && value==o.value) return; //�����ޱ仯 ������֤
        var onValid=o.onValid||this.onValid; //�Զ��巽������ ����ָ��Ĭ�Ϸ���
        //����ֵ����
        if(o.cache) cfg.value=value;
        //����֤״̬Ϊfalse
        cfg.isValid=o.isValid=false;
        //����ֵΪ��(����radio��checkbox��δѡ��) ���ж�required����
        if(!value) {
            //��֤�Ƿ������
            if(o.required)
                return onValid.call(el,'required',o);

            //������Զ��巽����֤��û��ָ��required:true������֤ͨ����������Ҫ�����Զ��巽���ٴ���֤��
            if(o.type!='fun') {
                cfg.isValid=o.isValid=true;
                return onValid.call(el,'pass',o); //��֤ͨ��
            }
        }

        switch(o.type) {
            case 'string':
                var sval = value.replace(/\r\n/g, '**').replace(/\n/g, '**');
                if(null!=o.min&&sval.length<o.min) return onValid.call(el,'min',o);
                if(null!=o.max&&sval.length>o.max) return onValid.call(el,'max',o);
                break;
            case 'float':
                if(!regExps.isFloat.test(value)) return onValid.call(el,'float',o);
                var fval=value*1;
                if(null!=o.round) fval=fval.toFixed(o.round); //���ݾ�ȷ�ȶ�ֵ������������
                if(o.cache) cfg.value=value; //ͬʱˢ�»���ֵ
                if(null!=o.min&&fval<o.min) return onValid.call(el,'min',o); //С����Сֵ
                if(null!=o.max&&fval>o.max) return onValid.call(el,'max',o); //�������ֵ
                break;
            case 'int':
                if(!regExps.isInt.test(value)) return onValid.call(el,'int',o);
                var ival=value*1;
                if(null!=o.min&&ival<o.min) return onValid.call(el,'min',o); //С����Сֵ
                if(null!=o.max&&ival>o.max) return onValid.call(el,'max',o); //�������ֵ
                break;
            case 'email':
                if(!regExps.isEmail.test(value)) return onValid.call(el,'email',o);
                break;
            case 'mobile':
                if(!regExps.isMobile.test(value)) return onValid.call(el,'mobile',o);
                break;
            case 'url':
                if(!regExps.isUrl.test(value)) return onValid.call(el,'url',o);
                break;
            case 'reg':
                if(!o.reg.test(value)) return onValid.call(el,'reg',o);
                break;
            case 'fun':
                o.msg=o.fun.call(el,o);
                if(typeof o.msg=='string') return onValid.call(el,'fun',o);
                break;
            case 'remote':
                return o.fun.call(el,{ cfg: cfg,opt: o },onValid);
                break;
            default:
                return onValid.call(el,'unkown',o); //typeָ�����ڷ�Χ�� ��Χδ֪����
        }
        cfg.isValid=o.isValid=true;
        return onValid.call(el,'pass',o); //��֤ͨ��
    },defaults={ //Ĭ������
        active: true, //�Ƿ񼤻���֤��ϵ true/false
        lazy: true, //true: ��ʼ����δ���ı� ������֤
        required: false, //�Ƿ������ Ĭ��Ϊ��
        evt: 'blur', //������֤���¼����� blur keyup��YUI֧�ֵ��κ��¼��� Ĭ��Ϊblur
        type: 'string', //���ݸ�ʽ Ĭ��Ϊ�ַ��� 'float' С��(��������) 'int' ���� 'email' ���� 'mobile' �ֻ� 'url' �����ַ 'reg' �Զ���������ʽ 'fun' �Զ�����֤����'remote'�첽��֤
        trim: true, //�Ƿ�������ֵ�������ҿո�
        round: 2, //��typeΪfloatʱ ��ȷ��С��λ�� Ĭ��2λ
        cache: true //�Ƿ񻺴�ǰһ�ε�ֵ(ÿ�δ����¼�����ֵ�Ƿ��б仯������һ����֤)
        //isValid: null, //��֤���״̬ Ĭ��Ϊδ���й���֤
        //value: null, //��������
        //min: null, //��typeΪstring float��intʱ��Ч ָ��(����)��Сֵ
        //max: null, //��typeΪstring float��intʱ��Ч ָ��(����)���ֵ
        //reg: null, //��typeΪregʱ��Ч ����������ʽ
        //fun: null, //��typeΪfunʱ��Ч ������֤��function ��function����ֵΪtrue/'�����ı�'
        //msg: null, //��typeΪfun����ʱ��Ч String�Զ�����֤�������صĴ�����ʾ��Ϣ���� 
        //key: null, //����������Ĺؼ���
        //onValid: null //�Զ�����֤���������
    };
    Valid.prototype={
        onValid: function() { return true; },
        /**
        * ��ʼ��|׷����Ԫ��
        * @method add 
        * @param {HTMLElement | Array} els ��Ҫ������֤�Ķ������󼯺�
        */
        add: function(els) {
            if(els.nodeType) els=[els]; //����Ԫ��
            var o;
            for(var i=0,j=els.length;i<j;i++) {
                if(this._els.indexOf(els[i])> -1) continue; //�Ѿ�����
                this._els.push(els[i]); //׷��Ԫ��
                try {
                    o=FD.common.applyIf(eval('('+($D.getAttribute(els[i],'valid')||'{}')+')'),defaults);
                    o.defValue=val(els[i],o);
                } catch(ex) {
                    if(window.console) console.info('����valid��ʽ����:'+$D.getAttribute(els[i],'valid'));
                }
                this._elConfigs.push(o); //׷������
                FYE.on(els[i],o.evt,validHandler,{ el: els[i],cfg: o,opt: o },this); //�����¼���
                //�����س��¼�
                if(els[i].nodeName=='INPUT')
                    FYE.on(els[i],'keydown',enterPressHandler,els[i],this);
            }
        },
        /**
        * �Ƴ���Ԫ��
        * @method valid 
        * @param {HTMLElement | Array | Number} els ��Ҫ������֤��{ ���� | ���󼯺� | ����}��ֻ�����ڵĶ����ܽ�����֤
        */
        remove: function(els) {
            if(typeof els=='number') {
                if(els<this._els.length) els=[this._els[els]];
                else return;
            }
            if(els.nodeType) els=[els]; //����Ԫ��
            var o,idx;
            for(var i=0,j=els.length;i<j;i++) {
                idx=this._els.indexOf(els[i]);
                if(idx<0) continue; //����������
                o=this._elConfigs[idx];
                FYE.removeListener(this._els[idx],o.evt,validHandler); //�Ƴ���������֤����
                //�Ƴ������س��¼�
                if(this._els[idx].nodeName=='INPUT')
                    FYE.removeListener(this._els[idx],'keydown',enterPressHandler);
                //this.active(this._els[idx],false); ���ó�δ����
                this._els.removeAt(idx);
                this._elConfigs.removeAt(idx);
            }
        },
        /**
        * ������֤
        * @method valid 
        * @param {HTMLElement | Array | Number} els ��Ҫ���м����{ ���� | ���󼯺� | ���� }��ֻ�����ڵĶ����ܽ��м���
        * @param {Boolean | String} mark (optional) true/false�򿪹رռ���״̬ 'op'�෴ѡ��(opposite����д)
        * @return {Boolean} �������а�����δ��֤ͨ���� �򷵻�false
        */
        active: function(els,mark) {
            if(typeof els=='string'||typeof els=='boolean'||els==null) {
                mark=els;
                els=this._els;
            }
            if(typeof els=='number') {
                if(els<this._els.length) els=[this._els[els]];
                else return;
            }
            if(els.nodeType) els=[els]; //����Ԫ��
            var o,idx;
            for(var i=0,j=els.length;i<j;i++) {
                idx=this._els.indexOf(els[i]);
                if(idx<0) continue; //����������
                o=this._elConfigs[idx];  //��ȡ��Ӧ����֤����
                if(mark==null||mark==true) {
                    if(o.active) continue; //ԭ���ͼ����
                    o.active=true;
                } else if(mark=='op') o.active=!o.active;
                else {
                    if(!o.active) continue; //ԭ����δ�����
                    o.active=false;
                }
                if(o.active) delete o.isValid; //����Ϊ��ʼ����֤״̬
                else {
                    (o.onValid||this.onValid).call(this._els[idx],'default',o); //ʧȥ����ʱ������֤
                    delete o.value;
                }
            }
        },
        /**
        * ��֤
        * @method valid 
        * @param {HTMLElement | Array | Number} els ��Ҫ������֤��{ ���� | ���󼯺� | ���� }��ֻ�����ڵĶ����ܽ�����֤
        * @param {Object} configs ��֤ʱ��ʱͳһ������֤����
        * @param {Boolean} disFocus �Ƿ�۽�
        */
        valid: function(els,configs,disFocus) {
            if(typeof els=='number') {
                if(els<this._els.length) els=[this._els[els]];
                else return;
            }
            if(!els) els=this._els; //�������� Ĭ��Ϊ�������ж���
            if(els.nodeType) els=[els]; //����Ԫ��
            var k;
            for(var i=0,j=els.length;i<j;i++) {
                var o={},idx=this._els.indexOf(els[i]);
                if(idx<0) continue; //����������
                FD.common.apply(o,this._elConfigs[idx]);    //��ȡ��Ӧ����֤����
                /*2010.05.24 reset configs*/
                if(configs) FD.common.apply(o,configs);
                if(!o.active) continue; //��δ������֤�� ������֤
                o.lazy=false; //��ֹlazy
                if(o.isValid!=true||!o.cache) { //����δ��ȷ��֤��Ԫ�� ����δ��֤������֤δͨ���ĺͲ�������֤״̬��
                    if(o.isValid==null||!o.cache) { //��δ��֤����Ԫ�ؽ�����֤
                        o.isValid=false; //���ڴ������֤״̬ͳһ��Ϊfalse �����½�����֤
                        delete o.defValue; //�ֶ���֤��ȥĬ��ֵ
                        validHandler.call(this,null,{ el: this._els[idx],cfg: this._elConfigs[idx],opt: o }); //������֤����
                    }
                    if(o.isValid==false&&k==null)
                        k=idx; //�����׸���֤δͨ����Ԫ������
                }
            }
            if(k!=null) { //������һ��δ��֤ͨ��
                if(!disFocus) this._els[k].focus();
                return false;
            }
            return true; //ȫ����֤ͨ��
        },
        /**
        * ��ȡѡ�����������
        * @method getConfig 
        * @param {HTMLElement | Number} els ��Ҫ������֤��{ ���� | ���󼯺� | ���� }��ֻ�����ڵĶ���������
        * @param {Object} configs ����
        */
        getConfig: function(el) {
            var i=(typeof el=='number'?el:this._els.indexOf(el));
            return i<0?null:this._elConfigs[i];
        },
        /**
        * ����ѡ�����������
        * @method setConfig 
        * @param {HTMLElement | Array | Number} els ��Ҫ������֤��{ ���� | ���󼯺� | ���� }��ֻ�����ڵĶ���������
        * @param {Object} configs ����
        */
        setConfig: function(els,configs) {
            if(typeof els=='number') {
                if(els<this._els.length) els=[this._els[els]];
                else return;
            }
            if(!els) els=this._els; //�������� Ĭ��Ϊ�������ж���
            if(els.nodeType) els=[els]; //����Ԫ��
            for(var i=0,j=els.length;i<j;i++) {
                var idx=this._els.indexOf(els[i]);
                if(idx<0) continue; //����������
                FD.common.apply(this._elConfigs[idx],configs);
            }
        }
    };
    Valid.regExps=regExps;
    widget.Valid=Valid;
})(FD.widget);