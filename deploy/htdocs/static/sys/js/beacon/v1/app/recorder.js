/**
 * 请求发送器
 * @author : yu.yuy
 * @createTime : 2011-10-15
 * @modifyTime : 2012-05-08
 */
(function($ns){
    $ns.moduleManager.register('recorder', function(){
        var that = this,
        G = that.globals,
        T = that.tools,
        //以创建图片的形式发送请求
        sendByImage = function(url, params,callback){
            params = params ? ('?' + params) : '';
            
            var img = new Image(1,1);
            img.src = url + params;
            img.onload = function(){
                this.onload = null;
                (callback || T.emptyFunction)();
            }
        },
        //以ajax形式发送请求，为兼容原有服务器逻辑暂时不用
        sendByAjax = function(url,params,callback){
            var Request = G.win.XDomainRequest,       //该对象由IE8引入，web服务端需配Response.AddHeader("Access-Control-Allow-Origin","*")；
            request;
            //检测浏览器是否支持XDomainRequest对象。
            if(Request){
                request = new Request;
                request.open("POST", url);
            }
            else{
                request = new XMLHttpRequest;
                if('withCredentials' in request){
                    request.open("POST", url, true);
                    request.setRequestHeader("Content-Type", "text/plain");
                }
            }
            if(request){
                request.onreadystatechange = function(){
                    if(request.readyState == 4){
                        callback && callback();
                        request = null;
                    }
                };
                request.send(params);
                return true;
            }
            return false;
        },
        sendByIFrame = function(){
            
        },
        //64位编码
        _base64encode = function(str){
            var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
            c1, c2, c3,
            len = str.length,
            i = 0,
            out = '';
            while(i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if(i == len){
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if(i == len){
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
                out += base64EncodeChars.charAt(c3 & 0x3F);
            }
            return out;
        },
        //请求参数整合，将需要64位编码和不需要编码的参数统一整合在一个字符串上
        compileParams = function(business,other){
            var businessStr = '',
            otherStr = '',
            ret = [];
            if(business && !T.isEmptyObject(business)){
                businessStr = _base64encode(T.combineParam(business,{},'&'));
            }
            other['ver'] = G.version;
            other['t'] = +new Date();
            otherStr = T.combineParam(other,{},'&');
            if(businessStr){
                ret.push(businessStr);
            }
            if(otherStr){
                ret.push(otherStr);
            }
            return ret.join('&');
        };
        return {
            //必要信息发送接口
            sendEssentialInfo : function(url, business, other, callback){
                var that = this,
                params = compileParams(business, other);
                that.send(url, params, callback);
            },
            //普通信息发送接口
            send : function(url, params, callback){
                var l = params.length;
                //图片方式请求长度极限测试结果：1、FF8（8203），2、IE6/IE7（2083），3、chrome16（8201），3、IE8（8206），4、IE9（8205）
                //所以2K以内为安全长度
                if(l <= 2036){
                    sendByImage(url,params,callback);
                }
                //8K以内除IE6/7外，其他主流浏览器都安全，而IE6/7会忽略超出2K的所有字段，这个无法避免，这里在参数的最前面加上长度标注，以便分析排除
                else if(l <= 8192){
                    sendByImage(url,'len='+l+'&'+params,callback);
                }
                else{
                    sendByImage(url,'err=len&len='+l+'&'+params,callback);
                }
            }
        }
    },true);
})(MAGNETO);