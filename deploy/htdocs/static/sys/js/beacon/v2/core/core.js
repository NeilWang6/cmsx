/**
 * 数据采集器内核
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
    //检测是否为空对象
    isEmptyObject : function(o) {
        for (var name in o) {
            return false;
        }
        return true;
    },
    //去掉字符串 前后的空格
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
    //将两个JSON对象合并成一个
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
    //将两个JSON对象合并成一个由自定义间隔符间隔的字符串
    combineParam : function(src, des, separator, isCover) {
        var ret = [];
        for (var param in des) {
            //是否覆盖原有属性
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
    //拆解字符串（cookie/url参数等）成json对象
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
    //生成随机数
    random : function() {
        //取0到2147483647之间的自然数，32位系统最大整型
        return Math.round(Math.random() * 2147483647);
    },
    
    //获取refer
    getReferrer : function() {
        var ret = '-';

        try {
            //IE下如果跨域取opener.location.href会出异常
            ret = doc.referrer || Globals.opener.location.href || '-';
        } catch(e) {
            ret = '-';
        }
        
        return ret;
    },
    //随机化pageId
    randomPageId : function() {
        var pageId = (win['dmtrack_pageid'] || '') + NOW;
        
        //截取前20位，单页面可能会随机化好几次，保持每次变化都不同
        pageId = pageId.substr(0,20);
        //字符串不足42位则补随机数
        while (pageId.length < 42) {
            pageId += Tools.random();
        }
        //pageId只能是42位的字符串
        pageId = pageId.substr(0,42);
        
        Globals.pageId = win['dmtrack_pageid'] = win['unique_pageid'] = pageId;
        
        return pageId;
    },
    //抽样
    sampling : function() {
        return (Math.random() - Config.samplerate) <= 0;
    },
    //去除URL中的'http:/'字样，为兼容后端服务程序
    trimHttpStr : function(url){
        //return encodeURIComponent(url.substr(url.indexOf("://") + 2));
        return url.substr(url.indexOf("://") + 2);
    }
};