/**
 * ���ݲɼ����ں�
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-09-13
 * @modifyTime : 2012-07-09
 */

var Tools = {
    isObject : function(value) {
        return value === Object(value);
    },
    isFunction : function (value) {
        return typeof value === 'function';
    },
    isNumber : function(value) {
        return typeof value === 'number' && Object.prototype.toString.call(value) == '[object Number]';
    },
    isString : function(value) {
        return typeof value === 'string' || Object.prototype.toString.call(value) == '[object String]';
    },
    isArray : Array.isArray || function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    },
    //����Ƿ�Ϊ�ն���
    isEmptyObject : function(o) {
        for (var name in o) {
            return false;
        }
        return true;
    },
    //ȥ���ַ��� ǰ��Ŀո�
    trim : function(value) {
        if (!this.isString(value)) { return ''; }
        
        if (String.prototype.trim) {
            return value.trim();
        } else {
            return value.replace(/^\s+|\s+$/g, '');
        }
    },
    btoa : function(str) {
      if (win.btoa) {
        return win.btoa(str);
      } else {
        var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        c1, c2, c3,
        len = str.length,
        i = 0,
        out = '';
        while(i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if(i === len){
                out += b64chars.charAt(c1 >> 2);
                out += b64chars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if(i === len){
                out += b64chars.charAt(c1 >> 2);
                out += b64chars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += b64chars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += b64chars.charAt(c1 >> 2);
            out += b64chars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += b64chars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
            out += b64chars.charAt(c3 & 0x3F);
        }
        return out;
      }
    },
    //������JSON����ϲ���һ��
    combineJson : function(src, des, isCover) {
        var ret = {};
        for (var i in des) {
            if (isCover || !src.hasOwnProperty(i)) {
                ret[i] = des[i];
                delete src[i];
            }
        }
        for (var j in src) {
            ret[j] = src[j];
        }
        return ret;
    },
    //������JSON����ϲ���һ�����Զ�������������ַ���
    combineParam : function(src, des, separator, isCover) {
        var ret = [];
        for (var param in des) {
            //�Ƿ񸲸�ԭ������
            if (isCover || !src.hasOwnProperty(param)) {
                ret.push(param + '=' + des[param]);
                delete src[param];
            }
        }
        for (var p in src) {
            ret.push(p + '=' + src[p]);
        }
        return ret.join(separator);
    },
    //����ַ�����cookie/url�����ȣ���json����
    parseParam : function(s, separator) {
        var parts
          , keyValueArray = null
          , hash = {};
          
        if (this.isString(s) && s.length) {
            parts = s.split(separator);
            for (var i = 0, len = parts.length; i < len; i++) {
                keyValueArray = parts[i].split('=');
                hash[keyValueArray[0]] = keyValueArray[1];
            }
        }
        
        return hash;
    },
    //���������
    random : function() {
        //ȡ0��2147483647֮�����Ȼ����32λϵͳ�������
        return Math.round(Math.random() * 2147483647);
    },
    
    //��ȡrefer
    getReferrer : function() {
        var ret = '-';

        try {
            //IE���������ȡopener.location.href����쳣
            ret = doc.referrer || Globals.opener.location.href || '-';
        } catch(e) {
            ret = '-';
        }
        
        return ret;
    },
    //�����pageId
    randomPageId : function() {
        var pageId = (win['dmtrack_pageid'] || '') + NOW;
        
        //��ȡǰ20λ����ҳ����ܻ�������ü��Σ�����ÿ�α仯����ͬ
        pageId = pageId.substr(0,20);
        //�ַ�������42λ�������
        while (pageId.length < 42) {
            pageId += Tools.random();
        }
        //pageIdֻ����42λ���ַ���
        pageId = pageId.substr(0,42);
        
        Globals.pageId = win['dmtrack_pageid'] = win['unique_pageid'] = pageId;
        
        return pageId;
    },
    //����
    sampling : function() {
        return (Math.random() - Config.samplerate) <= 0;
    },
    //ȥ��URL�е�'http:/'������Ϊ���ݺ�˷������
    trimHttpStr : function(url){
        //return encodeURIComponent(url.substr(url.indexOf("://") + 2));
        return url.substr(url.indexOf("://") + 2);
    }
};