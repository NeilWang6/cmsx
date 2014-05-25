/**
* FD.Bom
* BOM对象及浏览器相关操作
* 限制：必须包含core/fdev-min.js文件
*
* @author  yaosl<happyyaosl@gmail.com>
* @link    http://fd.aliued.cn/fdevlib
*/

FD.Bom=function () {
    var l=YAHOO.lang,
		parseCookieString=function (text) {
		    var cookies={};
		    if(l.isString(text)&&text.length>0) {
		        var cookieParts=text.split(/;\s/g),
	                    cookieName=null,
	                    cookieValue=null,
	                    cookieNameValue=null;
		        for(var i=0,len=cookieParts.length;i<len;i++) {
		            cookieNameValue=cookieParts[i].match(/([^=]+)=/i);
		            if(cookieNameValue instanceof Array) {
		                cookieName=unescape(cookieNameValue[1]);
		                cookieValue=unescape(cookieParts[i].substring(cookieNameValue[1].length+1));
		            } else {
		                cookieName=unescape(cookieParts[i]);
		                cookieValue='';
		            }
		            cookies[cookieName]=cookieValue;
		        }
		    }
		    return cookies;
		},
    	parseCookieHash=function (text) { //根据"|"将包含子cookie的值转化为子cookie的名/值对
    	    var hashParts=text.split('|'),
	            hashPart=null,
	            hash={};
    	    if(text.length>0) {
    	        for(var i=0,len=hashParts.length;i<len;++i) {
    	            hashPart=hashParts[i].split('=');
    	            hash[unescape(hashPart[0])]=unescape(hashPart[1]);
    	        }
    	    }
    	    return hash;
    	},
	    createCookieString=function (name,value,options) { //格式化需要设定的cookie值
	        var text=escape(name)+"="+escape(value);
	        if(l.isObject(options)) {
	            //expires Date 设置具体日期
	            if(options.expires instanceof Date) {
	                text+="; expires="+options.expires.toUTCString();
	            }
	            //expires Number型，单位是日，据现在后**日
	            if(l.isNumber(options.expires)&&options.expires!==0) {
	                var date=new Date();
	                date.setTime(date.getTime()+(options.expires*24*60*60*1000));
	                text+="; expires="+date.toUTCString();
	            }
	            //path
	            if(l.isString(options.path)&&options.path!=='') {
	                text+="; path="+options.path;
	            }
	            //domain
	            if(l.isString(options.domain)&&options.domain!=='') {
	                text+="; domain="+options.domain;
	            }
	            //secure
	            if(options.secure===true) {
	                text+="; secure";
	            }
	        }
	        return text;
	    },
	    createCookieHashString=function (hash) {
	        if(l.isObject(hash)) {
	            var text=[];
	            for(var key in hash) {
	                if(l.hasOwnProperty(hash,key)&&!l.isFunction(hash[key])&&!l.isUndefined(hash[key])) {
	                    text.push(escape(key)+'='+escape(String(hash[key])));
	                }
	            }
	            return text.join('|');
	        }
	    };

    return {
        /**
        * 获取所需要的cookie值
        * @method getCookie
        * @param {String} name cookie名称
        * @return {String} cookie 的值或者空字符串
        */
        getCookie: function (name) {
            if(!l.isString(name)||name==='') return null;
            var cookies=parseCookieString(document.cookie);
            if(l.isUndefined(cookies[name])) {
                return '';
            } else {
                return cookies[name];
            }
        },

        /**
        * 获取所需要的子cookie值(name=subname1=1|subname2=2|subname3=3)
        * @method getSubCookie
        * @param {String} name cookie名称
        * @return {String} cookie 的值或者空字符串
        */
        getSubCookie: function (name,subnames) {
            var hash=this.getSubCookies(name);
            if(hash!=null) {
                if(!l.isString(subnames)||subnames==='') {
                    return '';
                } else {
                    return hash[subnames]?hash[subnames]:'';
                }
            } else {
                return '';
            }
        },

        /**
        * 获取包含子cookie名的cookie值(子cookie的名/值对)
        * @method getSubCookies
        * @param {String} name cookie名称
        * @return {Object} 子cookie的名/值对
        */
        getSubCookies: function (name) {
            if(!l.isString(name)||name==='') return null; //检测所需的cookie名是否存在
            var cookies=this.getCookie(name);
            if(l.isString(cookies)) {
                return parseCookieHash(cookies);
            }
            return '';
        },

        /**
        * 设置cookie的值
        * @method setCookie
        * @param {String} name cookie名称
        * @param {Variant} value 需要设定的cookie的值
        * @param {Object} options 额外设定的参数
        */
        setCookie: function (name,value,options) {
            options=options||{};
            if(l.isString(name)&&!l.isUndefined(value)) {
                var text=createCookieString(name,value,options);
                document.cookie=text;
                return text;
            }
        },

        /**
        * 设置某个子cookie的值
        * @method setSubCookie
        * @param {String} name cookie名称
        * @param {String} subName 子cookie名称
        * @param {Variant} value 需要设定的cookie的值
        * @param {Object} options 额外设定的参数
        */
        setSubCookie: function (name,subName,value,options) {
            if(!l.isString(name)||name==='') return
            if(!l.isString(subName)||subName==='') return;
            if(l.isUndefined(value)) return;

            var hash=this.getSubCookies(name);
            if(!l.isObject(hash)) hash={};
            hash[subName]=value;
            return this.setSubCookies(name,hash,options);
        },

        /**
        * 设置某个包含子cookie的cookie值
        * @method setSubCookies
        * @param {String} name cookie名称
        * @param {String} subName 子cookie名称
        * @param {Variant} value 需要设定的cookie的值
        * @param {Object} options 额外设定的参数
        */
        setSubCookies: function (name,value,options) {
            if(l.isString(name)&&!l.isUndefined(value)) {
                var text=createCookieString(name,createCookieHashString(value),options);
                document.cookie=text;
                return text;
            }
        },

        /**
        * 删除cookie
        * @method removeCookie
        * @param {String} name cookie名称
        * @param {Object} options 额外设定的参数
        */
        removeCookie: function (name,options) {
            if(l.isString(name)&&!name==='') {
                options=l.merge(options||{},{
                    expires: new Date(0)
                });
                return this.setCookie(name,'',options);
            }
        },

        /**
        * 删除子cookie
        * @method removeSubCookie
        * @param {String} name cookie名称
        * @param {String} subName 子cookie名称
        */
        removeSubCookie: function (name,subName) {
            if(!l.isString(name)||name==='') return
            if(!l.isString(subName)||subName==='') return;
            //获取该cookie的所有子cookie
            var subs=this.getSubCookies(name);
            if(l.isObject(subs)&&l.hasOwnProperty(subs,subName)) {
                delete subs[subName]; 	//如果存在该子cookie则将其删除
                return this.setSubCookies(name,subs);
            }
        },

        /**
        * 添加到收藏夹
        * @method addBookmark
        * @param {String} url
        * @param {Object} title
        */
        addBookmark: function (url,title) {
            if(window.sidebar) {
                window.sidebar.addPanel(title?title:document.title,url?url:window.location.href,'');
            } else {
                try {
                    window.external.AddFavorite(url?url:location.href,title?title:document.title);
                } catch(e) {
                    alert("加入收藏失败，请使用Ctrl+D进行添加");
                }
            }
        },

        /**
        * 设为首页
        * @method setHome
        * @param {String} url
        */
        setHome: function (url) {
            url=url?url:location.href;
            try {
                document.body.style.behavior='url(#default#homepage)';
                document.body.setHomePage(url);
            } catch(e) {
                if(window.sidebar) {
                    if(window.netscape) {
                        try {
                            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                        } catch(e) {
                            alert("该操作被浏览器拒绝，假如想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
                        }
                    }
                    var prefs=Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                    prefs.setCharPref('browser.startup.homepage',url);
                }
            }
        }
    }
} ();