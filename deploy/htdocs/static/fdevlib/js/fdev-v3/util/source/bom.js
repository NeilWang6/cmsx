/**
* FD.Bom
* BOM�����������ز���
* ���ƣ��������core/fdev-min.js�ļ�
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
    	parseCookieHash=function (text) { //����"|"��������cookie��ֵת��Ϊ��cookie����/ֵ��
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
	    createCookieString=function (name,value,options) { //��ʽ����Ҫ�趨��cookieֵ
	        var text=escape(name)+"="+escape(value);
	        if(l.isObject(options)) {
	            //expires Date ���þ�������
	            if(options.expires instanceof Date) {
	                text+="; expires="+options.expires.toUTCString();
	            }
	            //expires Number�ͣ���λ���գ������ں�**��
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
        * ��ȡ����Ҫ��cookieֵ
        * @method getCookie
        * @param {String} name cookie����
        * @return {String} cookie ��ֵ���߿��ַ���
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
        * ��ȡ����Ҫ����cookieֵ(name=subname1=1|subname2=2|subname3=3)
        * @method getSubCookie
        * @param {String} name cookie����
        * @return {String} cookie ��ֵ���߿��ַ���
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
        * ��ȡ������cookie����cookieֵ(��cookie����/ֵ��)
        * @method getSubCookies
        * @param {String} name cookie����
        * @return {Object} ��cookie����/ֵ��
        */
        getSubCookies: function (name) {
            if(!l.isString(name)||name==='') return null; //��������cookie���Ƿ����
            var cookies=this.getCookie(name);
            if(l.isString(cookies)) {
                return parseCookieHash(cookies);
            }
            return '';
        },

        /**
        * ����cookie��ֵ
        * @method setCookie
        * @param {String} name cookie����
        * @param {Variant} value ��Ҫ�趨��cookie��ֵ
        * @param {Object} options �����趨�Ĳ���
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
        * ����ĳ����cookie��ֵ
        * @method setSubCookie
        * @param {String} name cookie����
        * @param {String} subName ��cookie����
        * @param {Variant} value ��Ҫ�趨��cookie��ֵ
        * @param {Object} options �����趨�Ĳ���
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
        * ����ĳ��������cookie��cookieֵ
        * @method setSubCookies
        * @param {String} name cookie����
        * @param {String} subName ��cookie����
        * @param {Variant} value ��Ҫ�趨��cookie��ֵ
        * @param {Object} options �����趨�Ĳ���
        */
        setSubCookies: function (name,value,options) {
            if(l.isString(name)&&!l.isUndefined(value)) {
                var text=createCookieString(name,createCookieHashString(value),options);
                document.cookie=text;
                return text;
            }
        },

        /**
        * ɾ��cookie
        * @method removeCookie
        * @param {String} name cookie����
        * @param {Object} options �����趨�Ĳ���
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
        * ɾ����cookie
        * @method removeSubCookie
        * @param {String} name cookie����
        * @param {String} subName ��cookie����
        */
        removeSubCookie: function (name,subName) {
            if(!l.isString(name)||name==='') return
            if(!l.isString(subName)||subName==='') return;
            //��ȡ��cookie��������cookie
            var subs=this.getSubCookies(name);
            if(l.isObject(subs)&&l.hasOwnProperty(subs,subName)) {
                delete subs[subName]; 	//������ڸ���cookie����ɾ��
                return this.setSubCookies(name,subs);
            }
        },

        /**
        * ��ӵ��ղؼ�
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
                    alert("�����ղ�ʧ�ܣ���ʹ��Ctrl+D�������");
                }
            }
        },

        /**
        * ��Ϊ��ҳ
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
                            alert("�ò�����������ܾ������������øù��ܣ����ڵ�ַ�������� about:config,Ȼ���� signed.applets.codebase_principal_support ֵ��Ϊtrue");
                        }
                    }
                    var prefs=Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                    prefs.setCharPref('browser.startup.homepage',url);
                }
            }
        }
    }
} ();