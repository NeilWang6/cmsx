/**
* FD.widget.Valid
*
* 验证组件
* 限制：
* 		1、Valid需要YUI库支持
* 调用方法：
* 		……
* 		<input tabindex="40" valid="{type:'int',required:true,min:2,max:1000,key:'订购数量'}" validgroup="g1" type="text" />
*		……
*		<script type="text/javascript">
*           //onValid函数this指针指向validGroup1 参数el为当前验证对象o为对应的验证配置
*           var validGroup1 = new FD.widget.Valid($$('[validgroup=g1]'), {
*               onValid: function(res, o){...}
*           });
*           ...
*           validGroup1.valid(els); 
*           validGroup1.valid(); //对组内(所有|指定)激活状态的控件进行验证
*           validGroup1.active()
*           validGroup1.add(els)
*           validGroup1.remove(els)
*		</script>
*
* @author 	Daniel Shi<swainet@126.com>
* @link    http://www.fdev-lib.cn/
* @version 2.1    扩展valid方法2个参数
* @update Denis&Zhangbo 2011.12.05 修复换行计算长度浏览器不一致引起的BUG
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
    //获取控件value
    val=function(el,o) {
        switch(el.tagName.toLowerCase()) {
            case 'input':
                var type=el.type.toLowerCase();
                if(type=='text'||type=='password') {
                    if(o.trim) el.value=el.value.replace(rtrim,''); //过滤前后空格
                    return el.value;
                }
                if(type=='password') return el.value;
                if(type=='radio'||type=='checkbox') return el.checked?'checked':'';
                return el.value;
            case 'textarea':
            default:
                if(o.trim) el.value=el.value.replace(rtrim,''); //过滤前后空格
                return el.value;
            case 'select':
                return el.selectedIndex<0?null:el.options[el.selectedIndex].value;
        }
    },
    validHandler=function(e,obj) {
        //2010.06.09: cfg 源生配置 o 临时配置 共享isValid属性
        var el=obj['el'],cfg=obj['cfg'],o=obj['opt'],value=val(el,o);
        if(!o.active) return; //验证未激活 返回
        //过滤前后空格
        if(o.lazy) {
            if(value==o.defValue) return;
            o.lazy=false;
        }
		//2011.05.19 Denis 当cache为false的时候，此逻辑无效
        if(o.cache && value==o.value) return; //内容无变化 跳出验证
        var onValid=o.onValid||this.onValid; //自定义方法优先 否则指向默认方法
        //把新值缓存
        if(o.cache) cfg.value=value;
        //置验证状态为false
        cfg.isValid=o.isValid=false;
        //假如值为空(对于radio或checkbox则未选中) 则判断required条件
        if(!value) {
            //验证是否必填项
            if(o.required)
                return onValid.call(el,'required',o);

            //假如非自定义方法验证，没有指定required:true，则验证通过。否则需要进行自定义方法再次验证。
            if(o.type!='fun') {
                cfg.isValid=o.isValid=true;
                return onValid.call(el,'pass',o); //验证通过
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
                if(null!=o.round) fval=fval.toFixed(o.round); //根据精确度对值进行四舍五入
                if(o.cache) cfg.value=value; //同时刷新缓存值
                if(null!=o.min&&fval<o.min) return onValid.call(el,'min',o); //小于最小值
                if(null!=o.max&&fval>o.max) return onValid.call(el,'max',o); //大于最大值
                break;
            case 'int':
                if(!regExps.isInt.test(value)) return onValid.call(el,'int',o);
                var ival=value*1;
                if(null!=o.min&&ival<o.min) return onValid.call(el,'min',o); //小于最小值
                if(null!=o.max&&ival>o.max) return onValid.call(el,'max',o); //大于最大值
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
                return onValid.call(el,'unkown',o); //type指定不在范围内 范围未知错误
        }
        cfg.isValid=o.isValid=true;
        return onValid.call(el,'pass',o); //验证通过
    },defaults={ //默认配置
        active: true, //是否激活验证体系 true/false
        lazy: true, //true: 初始内容未经改变 则不作验证
        required: false, //是否必填项 默认为否
        evt: 'blur', //触发验证的事件动作 blur keyup等YUI支持的任何事件名 默认为blur
        type: 'string', //内容格式 默认为字符串 'float' 小数(包含整数) 'int' 整数 'email' 邮箱 'mobile' 手机 'url' 网络地址 'reg' 自定义正则表达式 'fun' 自定义验证方法'remote'异步验证
        trim: true, //是否对输入框值过滤左右空格
        round: 2, //当type为float时 精确的小数位数 默认2位
        cache: true //是否缓存前一次的值(每次触发事件无论值是否有变化都进行一次验证)
        //isValid: null, //验证结果状态 默认为未进行过验证
        //value: null, //缓存内容
        //min: null, //当type为string float或int时有效 指定(长度)最小值
        //max: null, //当type为string float或int时有效 指定(长度)最大值
        //reg: null, //当type为reg时有效 输入正则表达式
        //fun: null, //当type为fun时有效 输入验证的function 此function返回值为true/'出错文本'
        //msg: null, //当type为fun类型时有效 String自定义验证方法返回的错误提示信息内容 
        //key: null, //错误表达所需的关键字
        //onValid: null //自定义验证结果处理函数
    };
    Valid.prototype={
        onValid: function() { return true; },
        /**
        * 初始化|追加子元素
        * @method add 
        * @param {HTMLElement | Array} els 需要进行验证的对象或对象集合
        */
        add: function(els) {
            if(els.nodeType) els=[els]; //单个元素
            var o;
            for(var i=0,j=els.length;i<j;i++) {
                if(this._els.indexOf(els[i])> -1) continue; //已经存在
                this._els.push(els[i]); //追加元素
                try {
                    o=FD.common.applyIf(eval('('+($D.getAttribute(els[i],'valid')||'{}')+')'),defaults);
                    o.defValue=val(els[i],o);
                } catch(ex) {
                    if(window.console) console.info('属性valid格式错误:'+$D.getAttribute(els[i],'valid'));
                }
                this._elConfigs.push(o); //追加配置
                FYE.on(els[i],o.evt,validHandler,{ el: els[i],cfg: o,opt: o },this); //动作事件绑定
                //监听回车事件
                if(els[i].nodeName=='INPUT')
                    FYE.on(els[i],'keydown',enterPressHandler,els[i],this);
            }
        },
        /**
        * 移除子元素
        * @method valid 
        * @param {HTMLElement | Array | Number} els 需要进行验证的{ 对象 | 对象集合 | 索引}，只有组内的对象能进行验证
        */
        remove: function(els) {
            if(typeof els=='number') {
                if(els<this._els.length) els=[this._els[els]];
                else return;
            }
            if(els.nodeType) els=[els]; //单个元素
            var o,idx;
            for(var i=0,j=els.length;i<j;i++) {
                idx=this._els.indexOf(els[i]);
                if(idx<0) continue; //对象不在组内
                o=this._elConfigs[idx];
                FYE.removeListener(this._els[idx],o.evt,validHandler); //移除监听的验证方法
                //移除监听回车事件
                if(this._els[idx].nodeName=='INPUT')
                    FYE.removeListener(this._els[idx],'keydown',enterPressHandler);
                //this.active(this._els[idx],false); 设置成未激活
                this._els.removeAt(idx);
                this._elConfigs.removeAt(idx);
            }
        },
        /**
        * 激活验证
        * @method valid 
        * @param {HTMLElement | Array | Number} els 需要进行激活的{ 对象 | 对象集合 | 索引 }，只有组内的对象能进行激活
        * @param {Boolean | String} mark (optional) true/false打开关闭激活状态 'op'相反选项(opposite的缩写)
        * @return {Boolean} 激活结果中包含有未验证通过的 则返回false
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
            if(els.nodeType) els=[els]; //单个元素
            var o,idx;
            for(var i=0,j=els.length;i<j;i++) {
                idx=this._els.indexOf(els[i]);
                if(idx<0) continue; //对象不在组内
                o=this._elConfigs[idx];  //获取对应的验证配置
                if(mark==null||mark==true) {
                    if(o.active) continue; //原来就激活的
                    o.active=true;
                } else if(mark=='op') o.active=!o.active;
                else {
                    if(!o.active) continue; //原来就未激活的
                    o.active=false;
                }
                if(o.active) delete o.isValid; //重置为初始化验证状态
                else {
                    (o.onValid||this.onValid).call(this._els[idx],'default',o); //失去激活时重置验证
                    delete o.value;
                }
            }
        },
        /**
        * 验证
        * @method valid 
        * @param {HTMLElement | Array | Number} els 需要进行验证的{ 对象 | 对象集合 | 索引 }，只有组内的对象能进行验证
        * @param {Object} configs 验证时临时统一更改验证配置
        * @param {Boolean} disFocus 是否聚焦
        */
        valid: function(els,configs,disFocus) {
            if(typeof els=='number') {
                if(els<this._els.length) els=[this._els[els]];
                else return;
            }
            if(!els) els=this._els; //不传参数 默认为组中所有对象
            if(els.nodeType) els=[els]; //单个元素
            var k;
            for(var i=0,j=els.length;i<j;i++) {
                var o={},idx=this._els.indexOf(els[i]);
                if(idx<0) continue; //对象不在组内
                FD.common.apply(o,this._elConfigs[idx]);    //获取对应的验证配置
                /*2010.05.24 reset configs*/
                if(configs) FD.common.apply(o,configs);
                if(!o.active) continue; //对未激活验证的 跳过验证
                o.lazy=false; //阻止lazy
                if(o.isValid!=true||!o.cache) { //遍历未正确验证的元素 包括未验证过和验证未通过的和不缓存验证状态的
                    if(o.isValid==null||!o.cache) { //对未验证过的元素进行验证
                        o.isValid=false; //对于此类把验证状态统一置为false 并重新进行验证
                        delete o.defValue; //手动验证出去默认值
                        validHandler.call(this,null,{ el: this._els[idx],cfg: this._elConfigs[idx],opt: o }); //调用验证方法
                    }
                    if(o.isValid==false&&k==null)
                        k=idx; //保存首个验证未通过的元素索引
                }
            }
            if(k!=null) { //至少有一个未验证通过
                if(!disFocus) this._els[k].focus();
                return false;
            }
            return true; //全部验证通过
        },
        /**
        * 获取选定对象的配置
        * @method getConfig 
        * @param {HTMLElement | Number} els 需要进行验证的{ 对象 | 对象集合 | 索引 }，只有组内的对象能重置
        * @param {Object} configs 配置
        */
        getConfig: function(el) {
            var i=(typeof el=='number'?el:this._els.indexOf(el));
            return i<0?null:this._elConfigs[i];
        },
        /**
        * 重置选定对象的配置
        * @method setConfig 
        * @param {HTMLElement | Array | Number} els 需要进行验证的{ 对象 | 对象集合 | 索引 }，只有组内的对象能重置
        * @param {Object} configs 配置
        */
        setConfig: function(els,configs) {
            if(typeof els=='number') {
                if(els<this._els.length) els=[this._els[els]];
                else return;
            }
            if(!els) els=this._els; //不传参数 默认为组中所有对象
            if(els.nodeType) els=[els]; //单个元素
            for(var i=0,j=els.length;i<j;i++) {
                var idx=this._els.indexOf(els[i]);
                if(idx<0) continue; //对象不在组内
                FD.common.apply(this._elConfigs[idx],configs);
            }
        }
    };
    Valid.regExps=regExps;
    widget.Valid=Valid;
})(FD.widget);