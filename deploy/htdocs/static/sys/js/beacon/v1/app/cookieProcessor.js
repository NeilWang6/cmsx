/**
 * cookie处理器
 * @author : yu.yuy
 * @createTime : 2011-9-24
 * @modifyTime : 2012-05-08
 */

(function($ns){
    $ns.moduleManager.register('cookieProcessor',function(){
        var that = this,
        T = that.tools,
        G = that.globals,
        DOC = G.doc,
        //将cookie字符串转化成JSON对象
        _parseCookieString = function(s){
            var parts=s.split(/;\s/g),
            name=null,
            value=null,
            a=null,
            hash = {};
            if(T.isString(s) && s.length>0) {
                for(var i=0,len=parts.length;i<len;i++) {
                    a=parts[i].match(/([^=]+)=/i);
                    if(a instanceof Array) {
                        name=unescape(a[1]);
                        value=unescape(parts[i].substring(a[1].length+1));
                    } else {
                        name=unescape(parts[i]);
                        value='';
                    }
                    hash[name]=value;
                }
            }
            return hash;
        },
        _getCookieExpires = function(timeout){
            var date = new Date;
            timeout = new Date(date.getTime() + timeout);
            return ";expires=" + timeout.toGMTString();
        },
        //创建完整的cookie串
        _createCookieString = function(name,value,expires,path,domain,secure){
            var text=escape(name)+"="+escape(value);
            //expires Date 设置具体日期
            if(expires instanceof Date) {
                text+="; expires="+expires.toUTCString();
            }
            //expires Number型，单位是日，据现在后**日
            if(T.isNumber(expires)&&expires!==0) {
                text+=_getCookieExpires(expires*24*60*60*1000);
            }
            //path
            if(T.isString(path)&&path!=='') {
                text+="; path="+path;
            }
            //domain
            if(T.isString(domain)&&domain!=='') {
                text+="; domain="+domain;
            }
            //secure
            if(secure===true) {
                text+="; secure";
            }
            return text;
        };
        return {
            //获取主cookie
            get : function(name){
                if(!T.isString(name)||name===''){
                    return null;
                }
                var cookies = _parseCookieString(DOC.cookie);
                return name in cookies?cookies[name]:null;
            },
            //获取指定主cookie中的子cookie
            getSub : function(name, subName){
                var hash = this.getSubCookies(name);
                if(hash){
                    if(!T.isString(subName)||subName===''){
                        return null;
                    }
                    return subName in hash?hash[subName]:null;
                }
                else{
                    return null;
                }
            },
            //获取主cookie，并将其转化成JSON对象
            getSubCookies : function(name){
                var s = this.get(name),
                subCookieHash;
                if(s){
                    subCookieHash = T.parseParam(s,'|');
                    return subCookieHash;
                }
                else{
                    return null;
                }
            },
            //编辑主cookie
            set : function(name,value,options){
                options=options||{};
                if(T.isString(name) && value!==undefined) {
                    var text=_createCookieString(name,value,options.expires,options.path,options.domain,options.secure);
                    DOC.cookie=text;
                }
            },
            //编辑子cookie
            setSub : function(name,subName,value,options){
                if(!T.isString(name)||name==='') return;
                if(!T.isString(subName)||subName==='') return;
                // if(T.isUndefined(value)) return;
                if(!value) return;

                var hash=this.getSubCookies(name),
                o = {};
                if(hash === null) hash={};
                o[subName]=value;
                this.set(name,T.combineParam(hash,o,'|',true),options);
            },
            //编辑多个子cookie
            setSubs : function(name,o,options){
                if(!T.isString(name)||name==='') return;
                var hash=this.getSubCookies(name) || {};
                this.set(name,T.combineParam(hash,o,'|',true),options);
            },
            //删除主cookie
            remove : function(name,options){
                options=options||{};
                var text=_createCookieString(name,'',new Date(0),options.path,options.domain,options.secure);
                DOC.cookie=text;
            },
            //删除子cookie
            removeSub : function(name,subName){
                if(!T.isString(name)||name==='') return;
                if(!T.isString(subName)||subName==='') return;
                var hash=this.getSubCookies(name);
                if(hash && hash.hasOwnProperty(subName)) {
                    delete hash[subName];
                    this.set(name,T.combineParam(hash,{},'|'));
                }
            }
        }
    },true);
})(MAGNETO);
