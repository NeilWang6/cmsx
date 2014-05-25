/*
changed by chuangui.xiecg
http://style.c.aliimg.com/js/sys/fly/core/fly.js
http://style.c.aliimg.com/js/sys/fly/core/fly_local_data.js
http://style.c.aliimg.com/js/sys/fly/widget/aliww.guess_you_like.js
*/

YAHOO.namespace("FD.sys.fly");(function(g,b,h){var a=YAHOO.lang,f=YAHOO.util.Dom,e=YAHOO.util.Event,c=YAHOO.util.Get;b.CONSTANTS={PROCESS_FLY_AO_INIT:"process:FD.sys.fly.AO.init",PROCESS_FLY_MODULE_LOAD:"process:FD.sys.fly.FlyModule.load",PROCESS_FLY_MODULE_ON_SUCCESS:"process:data load success!",ERROR_FLY_MODULE_ON_FAILURE:"error:data load failure!",PROCESS_FLY_MODULE_ON_PROCESS:"process:data loading!",ERROR_FLY_MODULE_ON_TIMEOUT:"error:data load timeout!",PROCESS_FLY_MODULE_LOAD_LOCAL_DATA:"process:load local data!",end:0};b.API_CONFIG={fly_api:"http://res.1688.com/fly/recommend.do",fly_api2:"http://res.1688.com/fly/commend.do",coase_api:"http://ctr.1688.com/ctr.html",fly_log_api:"http://stat.1688.com/bt/1688_click.html",end:0};b.API_PARAM_ITEM_MAP={memberid:"",offerids:"",catids:"",ccount:0,count:"",pid:"",ratio:"",offertype:"",querywords:"",recid:"",buid:"",catnameflg:"",catflg:"",Newflg:"",rectype:"",offersource:"",jsonname:"flyResult",end:0};b.API_LOG_MAP={page:"",objectId:"fleet",recId:"",alg:"",objectType:"offer",pid:"",end:0};b.API_PARAM_ITEM_FORMATE_FUNCTON_MAP={memberidFormate:function(i){return i},offeridsFormate:function(i){return i},catidsFormate:function(i){return i},ccountFormate:function(i){return i},countFormate:function(i){return i},pidFormate:function(i){return i},ratioFormate:function(i){return i},offertypeFormate:function(i){if(i==="sale"||i==="buy"){return i}return""},querywordsFormate:function(i){return encodeURIComponent(encodeURIComponent(i))},recidFormate:function(i){return i},defaultFormate:function(i){return i}};b.API_PARAM_ITEM_FORMATE_ACTUATOR=function(l,j){var k=l+"Formate",i=b.API_PARAM_ITEM_FORMATE_FUNCTON_MAP,m;m=i[k]?i[k]:i.defaultFormate;return m(j)};b.debug=false;b.Utils={debug:function(i){if(a.isBoolean(i)){b.debug=i}},log:function(k,i,j){if(b.debug){if(j){k=j+": "+k}if(g.console!==h&&console.info){console[i&&console[i]?i:"info"](k)}}return this},error:function(i){if(b.debug){throw i}},getCompanyURL:function(i,j,k){if(i!=16){if(j!=""){return"http://"+j+".cn.1688.com"}else{return"http://"+k+".cn.1688.com"}}else{return"http://company.1688.com/athena/"+k+".html"}},getBizrefURL:function(i,j){if(i!=""){return"http://"+i+".cn.1688.com/athena/bizreflist/"+i+".html"}if(memberId!=""){return"http://"+j+".cn.1688.com/athena/bizreflist/"+j+".html"}return""},getOfferImageURL:function(k,i){var i=i||0;var l=["http://img.china.alibaba.com/images/cn/p4p/nopic_100x100.gif","http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif","http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif","http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif"];if(k==""){return l[i]}if(k&&k.indexOf("http")){k="http://"+k}var j=[".summ.jpg",".search.jpg",".220x220.jpg",".310x310.jpg"];return k+j[i]},doSubstring:function(q,m,o){if(!q){return q}var k=0,p="",r=/[^\x00-\xff]/g,n="",j=q.replace(r,"**").length;for(var l=0;l<j;l++){n=q.charAt(l).toString();if(n.match(r)!=null){k+=2}else{k++}if(k>m){break}p+=n}if(o&&j>m){p=FD.sys.fly.Utils.doSubstring(p,m-3);p+="..."}return p},flyClick:function(k,j){if(!k){return}var l=(new Date).getTime(),i=true;if(j==1&&!YAHOO.env.ua.ie){i=false}if(document.images&&i){(new Image).src=k+"&time="+l}},iClick:function(k){var j=[],i=a.merge(b.API_LOG_MAP,k);i.objectType=i.objectType||"offer";if(i.objectType=="undefined"){i.objectType="offer"}j.push("page="+i.page);j.push("objectId="+i.objectId);j.push("recId="+i.recId);j.push("alg="+i.alg);j.push("objectType="+i.objectType);j.push("pid="+i.pid);if(typeof window.dmtrack_pageid!="undefined"){j.push("st_page_id="+dmtrack_pageid)}else{j.push("st_page_id=")}j="?"+j.join("&");if(typeof window.dmtrack!="undefined"){dmtrack.clickstat(b.API_CONFIG.fly_log_api,j)}else{d=new Date;if(document.images){(new Image).src=b.API_CONFIG.fly_log_api+j+"&time="+d.getTime()}}return true},getTime:function(){return new Date().getTime()},getPageId:function(){return typeof window.dmtrack_pageid=="undefined"?1234:window.dmtrack_pageid},getCookie:function(i){var j=document.cookie.match("(?:^|;)\\s*"+i+"=([^;]*)");return j?unescape(j[1]):""},resizeImage:function(j,i,m){j.removeAttribute("width");j.removeAttribute("height");var k;if(window.ActiveXObject){var k=new Image();k.src=j.src}else{k=j}if(k&&k.width&&k.height&&i){if(!m){m=i}if(k.width>i||k.height>m){var n=k.width/k.height,l=n>=i/m;if(window.ActiveXObject){j=j.style}j[l?"width":"height"]=l?i:m;if(window.ActiveXObject){j[l?"height":"width"]=(l?i:m)*(l?1/n:n)}}}},exposure:function(m,n){var p="",n=n||{},o=[];for(var k=0,j=m.length;k<j;k++){p+=m[k].offerId+","+m[k].alg+";"}p=p.slice(0,-1);o.push("object_ids="+p);if(typeof window.dmtrack_pageid!="undefined"){o.push("page_id="+dmtrack_pageid)}else{o.push("page_id=")}for(var k in n){o.push(k+"="+n[k])}o.push("time="+(+new Date()));o="?"+o.join("&");YAHOO.util.Get.script("http://ctr.1688.com/ctr.html"+o,{})},end:0};b.AbstractFlyView=function(k,j,i,l){this.result=k||{};this.config=j||{};this.oMergedFlyConfig=i||{};if(!l){this.coaseClick()}return this};a.augmentObject(b.AbstractFlyView.prototype,{doRequest:function(j){if(YAHOO.lang.isObject(j)){var m=YAHOO.lang.merge(this._getDefaultCoaseParamObject(),j),o=[];for(var k in m){o.push(k+"="+m[k])}var n=new Date().getTime();var l=FD.sys.fly.API_CONFIG.coase_api+"?"+o.join("&")+"&t="+n;YAHOO.util.Get.script(l,{onSuccess:function(i){},charset:"gb2312"})}},_getDefaultCoaseParamObject:function(){var l={};var i=b.Utils.getPageId(),j=parseInt(this.config.coaseType)||2,k=parseInt(this.config.recid)||"1010";l.ctr_type=j;l.page_area=k;l.page_id=i;l.category_id="";l.object_type="offer";l.object_ids="";l.keyword="";l.page_size="";l.page_no="";l.refer=escape(document.location.href);return l},coaseClick:function(){var l=this.getFunctionByDataType(this.result.datatype||"").call(this);if(l===""){return}var n=new Date().getTime();if(typeof l=="string"){var m=b.API_CONFIG.coase_api+"?"+l+"&t="+n;YAHOO.util.Get.script(m,{onSuccess:function(i){},charset:"gb2312"})}else{if(YAHOO.lang.isArray(l)){var j=[];for(var k=0;k<l.length;k++){j.push(b.API_CONFIG.coase_api+"?"+l[k]+"&t="+n)}YAHOO.util.Get.script(j,{onSuccess:function(i){},charset:"gb2312"})}}return true},getFunctionByDataType:function(i){if(a.isUndefined(i)){b.Utils.log("the callback data type is undefined!")}var j=null;switch(i.toString()){case"1":j=this.getOfferIdsByDataTypeA;break;case"2":j=this.getOfferIdsByDataTypeB;break;case"3":j=this.getOfferIdsByDataTypeC;break;default:j=this.getFunctionByDataTypeX;break}return j},getFunctionByDataTypeX:function(){b.Utils.log("coase:the callback data type cannot render!");return""},getOfferIdsByDataTypeA:function(){var j=this.result.data;if(a.isArray(j)&&j.length>0){var s=b.Utils.getPageId(),p=parseInt(this.config.coaseType)||2,q=parseInt(this.config.recid)||"1010",n="",k="",m=[],r=[];r.push("ctr_type="+p);r.push("page_area="+q);r.push("page_id="+s);r.push("category_id="+k);r.push("object_type=offer");if(j&&j.length>0){for(var l=0;l<j.length;l++){m.push(j[l].offerId+","+j[l].alg+";")}}r.push("object_ids="+m.join(""));r.push("keyword="+n);r.push("page_size=");r.push("page_no=");r.push("refer="+escape(document.location.href));return r.join("&")}return""},getOfferIdsByDataTypeB:function(){var k=this.result.data;if(a.isArray(k)&&k.length>0){var x=b.Utils.getPageId(),t=parseInt(this.config.coaseType)||2,v=parseInt(this.config.recid)||"1010",l="",r="",q=[],w=[],u=[],n=[],s=[];w.push("ctr_type="+t);w.push("page_area="+v);w.push("page_id="+x);w.push("category_id="+l);w.push("object_type=offer");u.push("ctr_type="+t);u.push("page_area="+v);u.push("page_id="+x);u.push("category_id="+l);u.push("object_type=company");if(k&&k.length>0){for(var p=0;p<k.length;p++){s.push(k[p].memberId+",0;");n=k[p]["offerIds"];for(var m=0;m<n.length;m++){q.push(n[m].offerId+","+n[m].alg+";")}}}w.push("object_ids="+q.join(""));w.push("keyword="+r);w.push("page_size=");w.push("page_no=");w.push("refer="+escape(document.location.href));u.push("object_ids="+s.join(""));u.push("keyword="+r);u.push("page_size=");u.push("page_no=");u.push("refer="+escape(document.location.href));return[w.join("&"),u.join("&")]}return""},getOfferIdsByDataTypeC:function(){var k=this.result.data;if(a.isArray(k)&&k.length>0){var v=b.Utils.getPageId(),r=parseInt(this.config.coaseType)||2,s=parseInt(this.config.recid)||"1010",q="",l="",p=[],u=[];u.push("ctr_type="+r);u.push("page_area="+s);u.push("page_id="+v);u.push("category_id="+l);u.push("object_type=offer");var t=[];if(k&&k.length>0){for(var n=0;n<k.length;n++){t=k[n].offerIds;for(var m=0;m<t.length;m++){p.push(t[m].offerId+","+t[m].alg+";")}}}u.push("object_ids="+p.join(""));u.push("keyword="+q);u.push("page_size=");u.push("page_no=");u.push("refer="+escape(document.location.href));return u.join("&")}return""},end:0});b.InterfaceFlyView=function(){};a.augmentObject(b.InterfaceFlyView.prototype,{onSuccess:function(){},onFailure:function(){},onTimeout:function(){},onProgress:function(){},end:0});b.FlyModule=function(k,i,j){var l=FD.sys.fly.Utils;this.oFlyConfig=k;this.fnFilter=i;this.oMergedFlyConfig={};this.FlyViewClass=j;this.load()};a.augmentObject(b.FlyModule.prototype,{load:function(){var i=this.getLoadUrl();var k={onSuccess:this.onSuccess,onFailure:this.onFailure,onTimeout:this.onTimeout,onProgress:this.onProgress,scope:this,charset:"gb2312",timeout:10000,data:{}};b.Utils.log(b.CONSTANTS.PROCESS_FLY_MODULE_LOAD);var j=YAHOO.util.Get.script(i,k)},getLoadUrl:function(){var i=this.getLoadApi()+"?"+this.getParamsString();if(a.isFunction(this.fnFilter)){i=this.fnFilter(i)}return i},getLoadApi:function(){if(this.oFlyConfig.apiType&&this.oFlyConfig.apiType==="commend"){return b.API_CONFIG.fly_api2}return b.API_CONFIG.fly_api},getParamsString:function(){var j=this.doParamsFormate(a.merge(b.API_PARAM_ITEM_MAP,this.oFlyConfig)),k=[];for(var l in j){k.push(l+"="+j[l])}k=k.concat(this.addDefaultParams());return k.join("&")},doParamsFormate:function(k){if(!a.isObject(k)){return k}var l={};for(var j in k){if(!a.isUndefined(b.API_PARAM_ITEM_MAP[j])&&j!="end"){l[j]=b.API_PARAM_ITEM_FORMATE_ACTUATOR(j,k[j])}}this.oMergedFlyConfig=l;return l},addDefaultParams:function(){var j=[];var k=b.Utils.getCookie("__last_loginid__");var i=b.Utils.getCookie("ali_beacon_id");if(k==""&&i==""){if(typeof window.membercookieinfo!="undefined"){i=window.membercookieinfo.lastLoginId||-1}else{i=-1}}j.push("uid="+(k!=""?k:i));j.push("pageid="+b.Utils.getPageId());j.push("t="+b.Utils.getTime());return j},onSuccess:function(){var i={};if(!a.isUndefined(this.oFlyConfig.jsonname)){i=window[this.oFlyConfig.jsonname]}else{i=window[b.API_PARAM_ITEM_MAP.jsonname]}if(a.isObject(i)&&i.returnCode.toString()=="0"&&a.isArray(i.data)&&i.data.length>0){b.Utils.log(b.CONSTANTS.PROCESS_FLY_MODULE_ON_SUCCESS);this.toDo("onSuccess",i)}else{this.onFailure()}},onFailure:function(){b.Utils.log(b.CONSTANTS.ERROR_FLY_MODULE_ON_FAILURE,"info");var j={},i=0;if(typeof FD.sys.fly.DATA_LIST!="undefined"){i=this.oFlyConfig.localDataType?parseInt(this.oFlyConfig.localDataType):0;if(i<=FD.sys.fly.DATA_LIST.length&&i){j=FD.sys.fly.DATA_LIST[i-1];b.Utils.log(j)}else{j=FD.sys.fly.DATA_LIST[0]}b.Utils.log(b.CONSTANTS.PROCESS_FLY_MODULE_LOAD_LOCAL_DATA,"info")}this.toDo("onFailure",j)},onTimeout:function(){b.Utils.log(b.CONSTANTS.ERROR_FLY_MODULE_ON_TIMEOUT,"error");this.onFailure()},onProgress:function(){b.Utils.log(b.CONSTANTS.PROCESS_FLY_MODULE_ON_PROCESS);this.toDo("onProgress",{})},toDo:function(j,i){new this.FlyViewClass(j,i,this.oFlyConfig,this.oMergedFlyConfig)},end:0});b.Ao=function(i,j){var k=this;if(!(k instanceof arguments.callee)){return new arguments.callee(i,j)}return{use:function(l){b.Utils.log(b.CONSTANTS.PROCESS_FLY_AO_INIT);new b.FlyModule(i,j,l)},end:0}}})(window,FD.sys.fly);;
if(typeof FD.sys.fly=='undefined'){
YAHOO.namespace('FD.sys.fly');
}
FD.sys.fly.DATA_A={
returnCode:"0",
returnMsg:"",
datatype:"1",
data: [
{
"useAlipay":false,
"subject":"\u4f9b\u5e94\u4fdd\u5065\u68c9\u88e4 \u68c9\u88e4 \u51ac\u5b63\u5fc5\u5907(\u56fe)",
"trustType":1,
"companyFavoriteCnt":0,
"onlineStatus":"0",
"type":0,
"contact":"http://duolekang00.cn.1688.com/",
"city":"\u5929\u6d25\u5e02",
"offerSaleCnt":0,
"rmbCurrency":"\u5143",
"trustScore":"25",
"province":"\u5929\u6d25","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/51/84/80/62/0/518480620","credit":false,"rmbPrice":0,"offerId":"518480620","alg":"a1","foreignCurrency":"","offerFavoriteCnt":0,"mainCats":"","ETC":false,"limitedTrust":true,"unit":"\u6761","foreignPrice":0,"domainID":"duolekang00","company":"\u5929\u6d25\u5e02\u591a\u4e50\u5eb7\u79d1\u6280\u53d1\u5c55\u6709\u9650\u516c\u53f8","amountGuaranteed":0,"memberId":"duolekang00","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/518480620.html"
},
{
"useAlipay":false,"subject":"\u4f9b\u5e94\u5370\u82b1\u5382 \u5e7f\u5dde\u5370\u82b1\u5382 \u670d\u88c5\u5370\u82b1\u5382 \u5370\u82b1\u52a0\u5de5","trustType":2,"companyFavoriteCnt":0,"onlineStatus":"0","type":0,"contact":"http://gzchfeng.cn.1688.com/","city":"\u5e7f\u5dde\u5e02\u767d\u4e91\u533a","offerSaleCnt":0,"rmbCurrency":"\u5143","trustScore":"25","province":"\u5e7f\u4e1c","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/51/83/89/19/8/518389198","credit":false,"rmbPrice":3,"offerId":"518389198","alg":"a1","foreignCurrency":"","offerFavoriteCnt":0,"mainCats":"","ETC":false,"limitedTrust":true,"unit":"\u4ef6","foreignPrice":0,"domainID":"gzchfeng","company":"\u5e7f\u5dde\u6625\u98ce\u670d\u88c5\u5546\u884c","amountGuaranteed":0,"memberId":"gzchfeng","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/518389198.html"
},
{
"useAlipay":false,"subject":"\u4f9b\u5e94\u5916\u8d38\u5a5a\u7eb1","trustType":1,"companyFavoriteCnt":0,"onlineStatus":"1","type":0,"contact":"http://mingshangshagz.cn.1688.com/","city":"\u5e7f\u5dde\u5e02\u6d77\u73e0\u533a","offerSaleCnt":0,"rmbCurrency":"\u5143","trustScore":"17","province":"\u5e7f\u4e1c","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/53/45/77/48/6/534577486","credit":false,"rmbPrice":0,"offerId":"534577486","alg":"a1","foreignCurrency":"","offerFavoriteCnt":0,"mainCats":"","ETC":false,"limitedTrust":true,"unit":"\u4ef6","foreignPrice":0,"domainID":"mingshangshagz","company":"\u5e7f\u5dde\u5e02\u6d77\u73e0\u533a\u540d\u5c1a\u838e\u5a5a\u7eb1\u793c\u670d\u5e97","amountGuaranteed":0,"memberId":"mingshangshagz","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/534577486.html"
},
{
"useAlipay":false,"subject":"\u4f9b\u5e94\u4fdd\u6696\u5185\u8863,\u5185\u88e4(\u56fe)","trustType":1,"companyFavoriteCnt":0,"onlineStatus":"0","type":0,"contact":"http://binlilai.cn.1688.com/","city":"\u4e49\u4e4c\u5e02","offerSaleCnt":0,"rmbCurrency":"\u5143","trustScore":"150","province":"\u6d59\u6c5f","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/29/25/15/96/7/292515967","credit":false,"rmbPrice":0,"offerId":"292515967","alg":"a1","foreignCurrency":"","offerFavoriteCnt":0,"mainCats":"","ETC":false,"limitedTrust":true,"unit":"","foreignPrice":0,"domainID":"binlilai","company":"\u6d59\u6c5f\u5bbe\u5229\u83b1\u670d\u9970\u6709\u9650\u516c\u53f8","amountGuaranteed":0,"memberId":"binlilai","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/292515967.html"
},{
"useAlipay":false,"subject":"\u539f\u521b\u54c1\u724c\u6279\u53d1 \u9ed1\u8272\u9ad8\u8d35\u6c14\u8d28\u793c\u670d\u8fde\u8863\u88d9 928133","trustType":1,"companyFavoriteCnt":0,"onlineStatus":"1","type":0,"contact":"http://elady2009.cn.1688.com/","city":"\u676d\u5dde\u5e02","offerSaleCnt":0,"rmbCurrency":"\u5143","trustScore":"27","province":"\u6d59\u6c5f","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/52/51/78/37/4/525178374","credit":false,"rmbPrice":128,"offerId":"525178374","alg":"a1","foreignCurrency":"","offerFavoriteCnt":0,"mainCats":"","ETC":false,"limitedTrust":true,"unit":"\u4ef6","foreignPrice":0,"domainID":"elady2009","company":"\u676d\u5dde\u5343\u590f\u670d\u88c5\u6709\u9650\u516c\u53f8","amountGuaranteed":0,"memberId":"elady2009","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/525178374.html"
},
{
"useAlipay":false,"subject":"\u4f9b\u5e94\u538b\u7f29T\u6064\u886b \u7403\u5f62\u538b\u7f29 \u9970\u54c1\u5c0f\u6302\u4ef6 \u5916\u8d38\u670d\u88c5","trustType":1,"companyFavoriteCnt":0,"onlineStatus":"1","type":0,"contact":"http://cssxfz.cn.1688.com/","city":"\u5e38\u719f\u5e02","offerSaleCnt":0,"rmbCurrency":"\u5143","trustScore":"59","province":"\u6c5f\u82cf","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/51/53/45/73/7/515345737","credit":false,"rmbPrice":12.8,"offerId":"515345737","alg":"a1","foreignCurrency":"","offerFavoriteCnt":0,"mainCats":"","ETC":false,"limitedTrust":true,"unit":"\u4ef6","foreignPrice":0,"domainID":"cssxfz","company":"\u5e38\u719f\u5e02\u7533\u590f\u9488\u7eba\u7ec7\u6709\u9650\u516c\u53f8","amountGuaranteed":0,"memberId":"cssxfz","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/515345737.html"
}
]
};
FD.sys.fly.DATA_B={
"returnCode":0,
"returnMsg":"ok",
"datatype":2,
"data":[
{
"useAlipay":true,"mainCats":"\u670d\u88c5BU\u7c7b\u76ee\u4fe1\u606f","trustType":1,"companyFavoriteCnt":54,"onlineStatus":"0","contact":"http://dgyiyingcai.cn.1688.com/","limitedTrust":true,"offerIds":[{"alg":"","foreignCurrency":"","offerFavoriteCnt":967,"subject":"\u4f9b\u5e94\u957f\u6b3e\u6bdb\u8863,\u7537\u5f0f\u6bdb\u8863,\u6574\u5355\u6bdb\u8863\uff0c\u97e9\u7248\u745e\u4e3d\u6bdb\u8863\u6279\u53d1","type":0,"offerSaleCnt":0,"unit":"\u4ef6","foreignPrice":0,"rmbCurrency":"\u5143","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/56/20/50/08/4/562050084","memberId":"dgyiyingcai","rmbPrice":12.8,"offerId":"562050084","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/562050084.html"},{"alg":"","foreignCurrency":"","offerFavoriteCnt":922,"subject":"\u4f9b\u5e94\u6bdb\u8863,\u7ae5\u88c5\u6bdb\u8863,\u5e93\u5b58\u6bdb\u8863\uff0c\u4e61\u9547\u6446\u644a\u9996\u9009","type":0,"offerSaleCnt":0,"unit":"\u4ef6","foreignPrice":0,"rmbCurrency":"\u5143","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/52/93/20/41/2/529320412","memberId":"dgyiyingcai","rmbPrice":5,"offerId":"529320412","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/529320412.html"},{"alg":"","foreignCurrency":"","offerFavoriteCnt":897,"subject":"\u4f9b\u5e94\u7ae5\u88e4,\u513f\u7ae5\u725b\u4ed4\u88e4,\u725b\u4ed4\u88e4\uff0c\u5382\u5bb6T\u6064\u6279\u53d1","type":0,"offerSaleCnt":0,"unit":"\u6761","foreignPrice":0,"rmbCurrency":"\u5143","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/55/90/72/27/0/559072270","memberId":"dgyiyingcai","rmbPrice":6.3,"offerId":"559072270","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/559072270.html"},{"alg":"","foreignCurrency":"","offerFavoriteCnt":708,"subject":"\u4f9b\u5e94\u7ae5\u88e4,\u513f\u7ae5\u725b\u4ed4\u88e4,\u725b\u4ed4\u88e4\uff0c\u7ae5\u88c5\u7ae5\u88e4\u6279\u53d1","type":0,"offerSaleCnt":0,"unit":"\u6761","foreignPrice":0,"rmbCurrency":"\u5143","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/55/90/28/44/3/559028443","memberId":"dgyiyingcai","rmbPrice":6.3,"offerId":"559028443","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/559028443.html"},{"alg":"","foreignCurrency":"","offerFavoriteCnt":683,"subject":"\u4f9b\u5e94\u725b\u4ed4\u77ed\u88e4\uff0c\u5e93\u5b58\u725b\u4ed4\u88e4,\u4e03\u5206\u725b\u4ed4\u88e4\uff0c\u5382\u5bb6T\u6064\u6279\u53d1","type":0,"offerSaleCnt":0,"unit":"\u6761","foreignPrice":0,"rmbCurrency":"\u5143","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer2/2009/148/251/588148251_4fb2bdf834fdcc980d86e9c34ba4c1aa","memberId":"dgyiyingcai","rmbPrice":8,"offerId":"588148251","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/588148251.html"},{"alg":"","foreignCurrency":"","offerFavoriteCnt":574,"subject":"\u4f9b\u5e94\u7ae5\u88e4\uff0c\u513f\u7ae5\u725b\u4ed4\u88e4\uff0c\u725b\u4ed4\u88e4\uff0c\u513f\u7ae5\u73a9\u5177\u9644\u5356\u4ea7\u54c1","type":0,"offerSaleCnt":0,"unit":"\u6761","foreignPrice":0,"rmbCurrency":"\u5143","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/55/89/99/44/9/558999449","memberId":"dgyiyingcai","rmbPrice":6.3,"offerId":"558999449","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/558999449.html"},{"alg":"","foreignCurrency":"","offerFavoriteCnt":463,"subject":"\u4f9b\u5e94\u6bdb\u8863,\u5973\u5f0f\u6bdb\u8863,\u6574\u5355\u6bdb\u8863\uff0c\u745e\u4e3d\uff0c\u97e9\u7248\u6bdb\u8863","type":0,"offerSaleCnt":0,"unit":"\u4ef6","foreignPrice":0,"rmbCurrency":"\u5143","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/54/60/19/48/5/546019485","memberId":"dgyiyingcai","rmbPrice":12,"offerId":"546019485","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/546019485.html"},{"alg":"","foreignCurrency":"","offerFavoriteCnt":203,"subject":"\u4f9b\u5e94\u513f\u7ae5\u725b\u4ed4\u88e4,\u7ae5\u88e4,\u725b\u4ed4\u88e4\uff0c\u5c0f\u672c\u521b\u4e1a\u81f4\u5bcc\u9996\u9009","type":0,"offerSaleCnt":0,"unit":"\u6761","foreignPrice":0,"rmbCurrency":"\u5143","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/55/91/01/41/2/559101412","memberId":"dgyiyingcai","rmbPrice":6.3,"offerId":"559101412","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/559101412.html"},{"alg":"","foreignCurrency":"","offerFavoriteCnt":156,"subject":"\u4f9b\u5e94\u5e93\u5b58\u6bdb\u8863,\u6bdb\u8863,\u5973\u5f0f\u6bdb\u8863\uff0c\u51ac\u88c5\u6bdb\u8863\uff0c6\u5143\u6bdb\u8863","type":0,"offerSaleCnt":0,"unit":"\u4ef6","foreignPrice":0,"rmbCurrency":"\u5143","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/47/37/70/98/3/473770983","memberId":"dgyiyingcai","rmbPrice":6,"offerId":"473770983","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/473770983.html"},{"alg":"","foreignCurrency":"","offerFavoriteCnt":138,"subject":"\u4f9b\u5e94\u6bdb\u8863,\u5e93\u5b58\u6bdb\u8863,\u4e2d\u8001\u5e74\u6bdb\u8863\uff0c\u51ac\u88c5\u6bdb\u8863\uff0c8\u5143\u6bdb\u8863","type":0,"offerSaleCnt":0,"unit":"\u4ef6","foreignPrice":0,"rmbCurrency":"\u5143","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/47/57/95/87/6/475795876","memberId":"dgyiyingcai","rmbPrice":7,"offerId":"475795876","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/475795876.html"},{"alg":"","foreignCurrency":"","offerFavoriteCnt":67,"subject":"\u4f9b\u5e94\u513f\u7ae5\u725b\u4ed4\u88e4,\u7ae5\u88e4\uff0c\u725b\u4ed4\u88e4","type":0,"offerSaleCnt":0,"unit":"\u6761","foreignPrice":0,"rmbCurrency":"\u5143","eURL":"","offerImageUrl":"http://img.china.alibaba.com/img/offer/55/90/95/63/8/559095638","memberId":"dgyiyingcai","rmbPrice":6.3,"offerId":"559095638","offerDetailUrl":"http://detail.1688.com/buyer/offerdetail/559095638.html"}],"city":"\u4e1c\u839e\u5e02","trustScore":"58","domainID":"dgyiyingcai","company":"\u4e1c\u839e\u5e02\u5927\u6717\u4f0a\u83b9\u5f69\u670d\u88c5\u5e97","province":"\u5e7f\u4e1c","amountGuaranteed":0,"memberId":"dgyiyingcai","credit":false}]
};
FD.sys.fly.DATA_LIST = [FD.sys.fly.DATA_A,FD.sys.fly.DATA_B];;
//是否要开启fly debug
FD.sys.fly.Utils.debug(true);
(function(win,S){
var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
/**
* 阿里旺旺-猜你喜欢
* @param {String} callback 		返回的状态 onSuccess|onFailure|onTimeout|onProgress
* @param {Object} data 			返回的数据
* @param {Object} oFlyConfig 		初始化的配置参数
* @param {Object} oMergedFlyConfig	经过mergeed后的配置参数,它跟oFlyConfig不同在于,这个参数就是真正向接口发起请求的所带的参数
*/
S.AliWWGuessYouLinkView = function(callback,data,oFlyConfig,oMergedFlyConfig){
//实例化父类
S.AliWWGuessYouLinkView.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
this.result = data;
this.oFlyConfig = oFlyConfig;
this.oMergedFlyConfig = oMergedFlyConfig;
this[callback]();
FD.sys.fly.Utils.log(data);
FD.sys.fly.Utils.log(oFlyConfig);
//FD.sys.fly.Utils.log(oMergedFlyConfig);
};
//继承父类
L.extend(S.AliWWGuessYouLinkView,S.AbstractFlyView);
//接口实例化
L.augment(S.AliWWGuessYouLinkView,S.InterfaceFlyView);
//方法封装
L.augmentObject(S.AliWWGuessYouLinkView.prototype,{
onSuccess:function(){
FD.sys.fly.Utils.log('Success:AliWWGuessYouLinkView');
this._render();
},
onFailure:function(){
FD.sys.fly.Utils.log('Failure:AliWWGuessYouLinkView');
this._render();
},
onTimeout:function(){
//do nothing
},
onProgress:function(){
//do nothing
},
_render:function(){
var html = [];
html.push(this._renderHead());
html.push(this._renderBody());
html.push(this._renderFoot());
if($(this.oFlyConfig.flyWidgetId)){
$(this.oFlyConfig.flyWidgetId).innerHTML = html.join('');
}
},
_renderHead:function(){
return '';
},
_renderBody:function(){
var _html = [];
_html.push(this._renderOfferList(this.result.data));
return _html.join('');
},
_renderOfferList:function(offerList){
var offerListHtml = [];
//最多显示5个
var maxItemLength = parseInt(this.oFlyConfig.count)||5;
for(var i=0,l = offerList.length;i<l&&i<maxItemLength;i++){
offerListHtml.push(this._renderOfferItem(offerList[i],i));
}
return offerListHtml.join('');
},
_renderOfferItem:function(offer,idx){
var offerHtml = [];
offerHtml.push('<li>');
offerHtml.push(this._renderOfferPhoto(offer));
offerHtml.push(this._renderOfferTitle(offer));
offerHtml.push('</li>');
return offerHtml.join('');
},
_renderOfferTitle:function(offer){
var detailUrl  = offer.offerDetailUrl;
if(offer.eURL!=''){
detailUrl = offer.eURL;
}
var _title = '<span class="msg"><a href="'+detailUrl+'" target="_blank" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(offer.subject,44,true)+'</a></span>';
return _title;
},
_renderOfferPhoto:function(offer){
var detailUrl  = offer.offerDetailUrl;
if(offer.type!=0){
detailUrl = offer.eURL;
}
var _photo = '<span class="img"><a href="'+detailUrl+'" target="_blank" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'" onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"></a></span>';
return _photo;
},
_renderFoot:function(){
return '';
},
end:0
},true);
})(window,FD.sys.fly);;
