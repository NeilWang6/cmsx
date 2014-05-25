/**
 * ��������
 * @author : yu.yuy
 * @createTime : 2011-10-15
 * @modifyTime : 2012-05-08
 */
(function($ns){
    $ns.moduleManager.register('recorder', function(){
        var that = this,
        G = that.globals,
        T = that.tools,
        //�Դ���ͼƬ����ʽ��������
        sendByImage = function(url, params,callback){
            params = params ? ('?' + params) : '';
            
            var img = new Image(1,1);
            img.src = url + params;
            img.onload = function(){
                this.onload = null;
                (callback || T.emptyFunction)();
            }
        },
        //��ajax��ʽ��������Ϊ����ԭ�з������߼���ʱ����
        sendByAjax = function(url,params,callback){
            var Request = G.win.XDomainRequest,       //�ö�����IE8���룬web���������Response.AddHeader("Access-Control-Allow-Origin","*")��
            request;
            //���������Ƿ�֧��XDomainRequest����
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
        //64λ����
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
        //����������ϣ�����Ҫ64λ����Ͳ���Ҫ����Ĳ���ͳһ������һ���ַ�����
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
            //��Ҫ��Ϣ���ͽӿ�
            sendEssentialInfo : function(url, business, other, callback){
                var that = this,
                params = compileParams(business, other);
                that.send(url, params, callback);
            },
            //��ͨ��Ϣ���ͽӿ�
            send : function(url, params, callback){
                var l = params.length;
                //ͼƬ��ʽ���󳤶ȼ��޲��Խ����1��FF8��8203����2��IE6/IE7��2083����3��chrome16��8201����3��IE8��8206����4��IE9��8205��
                //����2K����Ϊ��ȫ����
                if(l <= 2036){
                    sendByImage(url,params,callback);
                }
                //8K���ڳ�IE6/7�⣬�����������������ȫ����IE6/7����Գ���2K�������ֶΣ�����޷����⣬�����ڲ�������ǰ����ϳ��ȱ�ע���Ա�����ų�
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