("fly" in FE.sys)||(function(g,k,i){var b=i.dmtrack_pageid=(typeof i.dmtrack_pageid==="undefined")?(new Date()-0+""+Math.floor((Math.random()*1000))):i.dmtrack_pageid,h=Object.prototype.hasOwnProperty,d={},j=[],f={template:"",apitype:"recommend",onTemplatePre:null,onSuccess:null,onFailure:null};var e=function(l,n,m){var t=this,q=i.location.search.substring(1).toLowerCase(),s=g.unparam(q,"&").memberid,r=k.lastLoginId,p=k.loginId,o=g.util.cookie("ali_beacon_id");if(!(t instanceof e)){return new e(l,n,m)}t.container=l||i.document;t.config=g.extend(true,{},f,m);n.uid=s||p||r||o||-1;n.pageid=b;t.params={};t.params=n;t._request()};g.extend(e.prototype,{_request:function(){var m=this,o=[],n,q=m.params,l="http://res.1688.com/fly/recommend.do";(m.config.apitype!=="commend")||(l="http://res.1688.com/fly/commend.do");for(n in q){if(h.call(q,n)){o[o.length]=n+"="+q[n]}}o=o.join("&");g.ajax({url:l+"?"+o,dataType:"script",success:function(){var p=i[q.jsonname]||i.flyResult;if(a(p)){m._onCallback(p)}else{m._onFailure()}},error:function(){m._onFailure()}})},_onCallback:function(l){var n=this,q=l.data,o=n.config,m=n.container,p;if(o.onTemplatePre!==null){q=o.onTemplatePre.call(n,q)}q.length!==0||(m.html("<p>���緱æ�����Ժ����ԣ�</p>"));!o.template||(m.html(k.sweet(o.template).applyData(q,n)));if(o.onSuccess!==null){o.onSuccess.call(n,q)}n.iclick()},_onFailure:function(){var m=this,l=m.container,n=m.config;if(n.onFailure===null){l.html('<p>���ݼ���ʧ�ܣ���<a target="_self" href="javascript:location.reload();">ˢ��</a>���ԣ�</p>')}else{n.onFailure.call(l)}},iclick:function(){var l=this;l.container.delegate("a.iclick","mousedown",function(p){var q=[],m,o=g(this).data("fly-click"),n=c(o);q.push("page="+n.page);n.objectId&&q.push("objectId="+n.objectId);n.alg&&q.push("alg="+n.alg);q.push("objectType="+n.objectType);q.push("recId="+l.params.recid);n.pid&&q.push("pid="+n.pid);q.push("st_page_id="+b);q.push("time="+(+new Date()));m="?"+q.join("&");g.getScript("http://stat.1688.com/bt/1688_click.html"+m)})}});function a(m){var l=false;if(!!m&&(m.returnCode===0)&&(g.isArray(m.data))&&m.data.length>0){l=true}return l}function c(m){var l=m.replace(/'([^']*)'/g,'"$1"');return g.parseJSON(l)}e.fitLength=function(m,l){m=g.util.unescapeHTML(m);if(m.lenB()>l){m=m.cut(l-3)+"..."}return g.util.escapeHTML(m)};e.getOfferUrl=function(m){var l=(!!m.eURL)?m.eURL:m.offerDetailUrl;return l};e.getCompanyUrl=function(l){var m=l.contact;return m};e.getBizrefUrl=function(m){var o=m.domainID,l=m.memberId,n="";!o||(n="http://"+o+".cn.1688.com/athena/bizreflist/"+o+".html");!l||(n="http://"+l+".cn.1688.com/athena/bizreflist/"+l+".html");return n};e.getPrice=function(n){var l=n.rmbPrice,m="";if((l!==0)&&(l!=="")){m='<span class="fd-cny">&yen;</span><em class="value">'+l+"</em>"}else{if(n.foreignCurrency!==""){m='<span class="fd-cny">���</span>'}else{m='<span class="fd-cny"></span>'}}return m};e.getImgUrl=function(o,m){var l=o.offerImageUrl,n=m||100,p="";if(!l){if(n<151){if(n<101){p="http://img.china.alibaba.com/cms/upload/other/nopic-100.png"}else{p="http://img.china.alibaba.com/cms/upload/other/nopic-150.png"}}else{if(n<221){p="http://img.china.alibaba.com/cms/upload/other/nopic-220.png"}else{p="http://img.china.alibaba.com/cms/upload/other/nopic-310.png"}}}else{if(n<151){if(n<101){p=l+".summ.jpg"}else{p=l+".search.jpg"}}else{if(n<221){p=l+".220x220.jpg"}else{p=l+".310x310.jpg"}}}return p};e.p4pSort=function(l){l.sort(function(o,n){var m=(!o.eURL)?1:0,p=(!n.eURL)?1:0;return m-p})};e.resizeImg=function(m,l,p){m.removeAttribute("width");m.removeAttribute("height");var n;if(i.ActiveXObject){n=new Image();n.src=m.src}else{n=m}if(n&&n.width&&n.height&&l){if(!p){p=l}if(n.width>l||n.height>p){var q=n.width/n.height,o=q>=l/p;m[o?"width":"height"]=o?l:p;if(i.ActiveXObject){m[o?"height":"width"]=(o?l:p)*(o?1/q:q)}}}};e.collect=function(n,m,l){var l=l||0;g.isArray(d[l])||(d[l]=[]);d[l][d[l].length]=[n,m]};e.iexposure=function(r,s,l,u){var w=this,q,o,n=[],p=l||0,u=u||0,v=d[u],t;if(!!v){t=v.length>s?s:v.length||v.length;j[u]="";for(q=p;q<(t+p);q++){j[u]+=v[q][0]+","+v[q][1]+";"}j[u]=j[u].slice(0,-1);n.push("object_ids="+j[u])}d={};n.push("page_id="+b);for(o in r){if(h.call(r,o)){n.push(o+"="+r[o])}}n="?"+n.join("&");g.getScript("http://ctr.1688.com/ctr.html"+n)};FE.sys.fly=e;g.add("sys-fly")})(jQuery,FE.util,window);