(function(){var m=true,o=window,n=o.document,k=n.location.protocol;if(o.Manifold===undefined){Manifold={};m=false}var l=Manifold.globals={opener:opener,pageId:null,jsUrlRoot:"http://style.c.aliimg.com/sys/js/beacon/v2/",customize:window.WolfSmoke||{},isConflicted:m,version:"2.0"},p=Manifold.config={samplerate:l.customize.samplerate||1,siteNo:l.customize.siteNo||2,logSeverOne:k+"//dmtracking.1688.com/b.jpg",logSeverTwo:k+"//dmtracking.1688.com/c.jpg",tracelogSever:k+"//stat.1688.com/tracelog/click.html",
errorSever:k+"//stat.1688.com/dw/error.html",spmServer:k+"//stat.1688.com/spm.html",acookieSever:k+"//acookie.1688.com/1.gif",changeServer:k+"//pass.alibaba.com/read_cookie.htm",firstUserServer:k+"//check.china.alibaba.com/cta/cucrpc/getCookieId.jsonp",isSetCookieToAcookie:l.customize.isSetCookieToAcookie||true,needDefaultCookies:["cna","ali_apache_id"],isCheckLogin:true},f=Manifold.tools={is:function(c,e){return c!=null&&Object(c)instanceof e},isFunction:function(c){return typeof c==="function"||
Object.prototype.toString.apply(c)==="[object Function]"},isNumber:function(c){return typeof c==="number"&&isFinite(c)},isString:function(c){return typeof c==="string"},isArray:Array.isArray||function(c){return Object.prototype.toString.apply(c)==="[object Array]"},isEmptyObject:function(c){for(var e in c)return false;return true},spmMeta:function(){var c=document.getElementsByTagName("meta"),e=0,g,a=c.length,b;for(g=0;g<a;g++){b=c[g];if(this.tryToGetAttribute(b,"name")==="data-spm"){e=this.tryToGetAttribute(b,
"content");break}}return e},trim:function(c){return this.isString(c)?c.replace(/^\s+|\s+$/g,""):""},random:function(){return Math.round(Math.random()*2147483647)},sampling:function(){return Math.random()-p.samplerate<=0},trimHttpStr:function(c){return c.substr(c.indexOf("://")+2)},randomPageId:function(){var c=o.dmtrack_pageid||"",e="";c+=+new Date;for(c=c.substr(0,20);c.length<42;)c+=this.random();e=c.substr(0,42);l.pageId=e;return o.dmtrack_pageid=e},sendErrorInfo:function(c,e){q.send(p.errorSever,
{type:e,exception:c.message})},emptyFunction:function(){}};m=Manifold.moduleManager=function(){var c={},e=function(a){return(a=l.jsUrlHash[a])?l.jsUrlRoot+a:null},g=function(){return{load:function(a,b){var d=n.createElement("script");d.src=a;if(b)d.onload=d.onreadystatechange=function(){if(!this.readyState||"loaded"===d.readyState||"complete"===d.readyState){d.onload=d.onreadystatechange=null;b()}};a=n.getElementsByTagName("script")[0];a.parentNode.insertBefore(d,a)}}}();return{register:function(a,
b,d){this.hasRegistered(a)||(c[a]=d?b.call(Manifold):b)},require:function(a,b){var d=c[a];if(f.isFunction(d))return c[a]=d.call(Manifold);else if(d)return d;d=e(a);for(var h=false,i=(document.head||document.getElementsByTagName("head")[0]).getElementsByTagName("script"),j=0,r=i.length;j<r;j++)if(i[j].src===d)h=true;!h&&d!==null&&g.load(d,function(){c[a]=c[a].call($ns);!b||b.call(null,c[a])});return null},hasRegistered:function(a){return!!c[a]},hadUsed:function(a){return(a=c[a])&&!f.isFunction(a)}}}();
Manifold.moduleManager.register("recorder",function(){var c=function(e,g,a){g=g?"?"+g:"";var b=new Image(1,1);b.src=e+g;b.onload=function(){this.onload=null;!a||a()}};return{send:function(e,g,a){var b=g.length;if(b<=2036)c(e,g,a);else b<=8192?c(e,"len="+b+"&"+g,a):c(e,"err=len&len="+b+"&"+g,a)}}},true);var q=m.require("recorder");Manifold.moduleManager.register("cookieProcessor",function(){var c=function(a){var b=a.split(/;\s/g),d=null,h=null;h=null;var i={};if(f.isString(a)&&a.length){a=0;for(var j=
b.length;a<j;a++){h=b[a].match(/([^=]+)=/i);if(h instanceof Array){d=unescape(h[1]);h=unescape(b[a].substring(h[1].length+1))}else{d=unescape(b[a]);h=""}i[d]=h}}return i},e=function(a){a=new Date((new Date).getTime()+a);return";expires="+a.toGMTString()},g=function(a,b,d,h,i,j){a=escape(a)+"="+escape(b);if(d instanceof Date)a+="; expires="+d.toUTCString();if(f.isNumber(d)&&d!==0)a+=e(d*24*60*60*1E3);if(f.isString(h)&&h!=="")a+="; path="+h;if(f.isString(i)&&i!=="")a+="; domain="+i;if(j)a+="; secure";
return a};return{get:function(a){if(!f.isString(a)||a==="")return null;var b=c(n.cookie);return a in b?b[a]:null},getSub:function(a,b){if(a=this.getSubCookies(a)){if(!f.isString(b)||b==="")return null;return b in a?a[b]:null}else return null},getSubCookies:function(a){if(a=this.get(a))return a=f.parseParam(a,"|");else return null},set:function(a,b,d){d=d||{};if(f.isString(a)&&b!==undefined){a=g(a,b,d.expires,d.path,d.domain,d.secure);n.cookie=a}},setSub:function(a,b,d,h){if(!(!f.isString(a)||a===
""))if(!(!f.isString(b)||b===""))if(d){var i=this.getSubCookies(a),j={};if(i===null)i={};j[b]=d;this.set(a,f.combineParam(i,j,"|",true),h)}},setSubs:function(a,b,d){if(!(!f.isString(a)||a==="")){var h=this.getSubCookies(a)||{};this.set(a,f.combineParam(h,b,"|",true),d)}},remove:function(a,b){b=b||{};a=g(a,"",new Date(0),b.path,b.domain,b.secure);n.cookie=a},removeSub:function(a,b){if(!(!f.isString(a)||a===""))if(!(!f.isString(b)||b==="")){var d=this.getSubCookies(a);if(d&&d.hasOwnProperty(b)){delete d[b];
this.set(a,f.combineParam(d,{},"|"))}}}}},true);var s=m.require("cookieProcessor");Manifold.moduleManager.register("essential",function(){return{init:function(){if(f.sampling())try{var c=s.get("sync_cookie");if(!c||c!=="true")q.send(p.changeServer,"")}catch(e){f.sendErrorInfo(e,"essential")}}}},true);var t=m.require("essential");o.ex_dmtracking=function(){l.isConflicted!==true&&t.init()};ex_dmtracking()})();