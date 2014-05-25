/**
 * @author chuangui.xiecg
 * @modified arcthur.cheny updated 2011-6-21
 * @modified jiali.shijl at 2012-01-16 将获取lastLoginId方法换为fdev4的方法
 */
var p4p_jjCount = 0;//竞价条数
var p4p_pageSize = 40;//每页显示个数
var p4p_keyword = "";//关键字
var p4p_ppp = 1;//不明白的参数，具体问搜索TEAM去
var p4p_hashCode = 1;//哈希码
var p4p_alitalkMethod = "a1875796";//动态的调用贸易通的方法名
var p4p_categoryid = ""; //类目ID

function initP4pParams(jjCount,pageSize,keyword,ppp,hashCode,alitalkMethod,categoryid){
	p4p_jjCount = jjCount||0;
	p4p_pageSize = pageSize||40;
	p4p_keyword = keyword||'';
	p4p_ppp = ppp||1;
	p4p_hashCode = hashCode||1;
	p4p_alitalkMethod = alitalkMethod||'';
	p4p_categoryid = categoryid;
}

/* p4p 配置文件 */
var p4pConfig = {
	//"api":"http://match.p4p.1688.com/b2bad",//P4P调用接口
	//"api":"http://cmweb.ilike.1688.com/cmweb/cmweb/cMWeb/handleRequest.htm",//ilike调用接口（新增 by balibell）
	"api":"http://cmweb.ilike.1688.com/cmweb/hollywood/product/handleJson.htm",//ilike调用接口（新增 by balibell）
	"api2":"http://page.1688.com/html/p4p/p4pScript_test2.html",//测试接口
	"api3":"http://10.0.29.13:7001/search/p4p_api.htm",//本地测试接口2
	"entrance":"http://page.1688.com/html/p4p/pro.html?tracelog=p4plist",//我也要出现在这里的入口地址
	"noimg":{
		"x100":"http://img.china.alibaba.com/images/cn/p4p/nopic_100x100.gif",
		"x150":"http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif"
		},
	"img":"http://img.china.alibaba.com/img/offer",
	"company":"http://exodus.1688.com/company/detail/",
	"icon":{
		"p":"http://img.china.alibaba.com/images/common/icon_v01/4000812.gif",  //个人诚信通icon
		"c":"http://img.china.alibaba.com/images/common/icon_v01/4000712.gif",  //企业诚信通icon
		"u":"http://img.china.alibaba.com/images/buyer/list/trust.gif"          //统一诚信通icon
	},
	"trust":".cn.1688.com/athena/bizreflist/",
	"bdMaxOfferNum":10,
	"wangwangstate":'http://amos.im.alisoft.com/muliuserstatus.aw?uids='
}

/*
 * 打点函数
 * @param {string} url 检测打点的入口地址
 * @param {int} type 打点的类型:如果要对旺旺进行打点，则需要传入一个不为零的参数如p4pClick(url,true),其他要进行打点的，直接p4pClick(url)|p4pClick(url,false)这样调用
 * @returns {bool} true|false
*/
function p4pClick(url,type){
	var d = new Date();
    if(document.images&&(!arguments[1]||(arguments[1]&&Browser.isMsie))) {
       (new Image()).src=url+"&j=1&time=" + d.getTime();
    }
    return true;
}
function p4pTraceEnquiryClick(o){
	var fromId = '',params = [];
	//modified by jiali.shijl at 2012.01.16 将获取lastLoginId方法换为fdev4的方法
	fromId = FE.util.LastLoginId();
	if(fromId!=''){
		params.push('?fromId='+fromId);
		params.push('toId='+(o.toId||''));
		params.push('offerId='+(o.offerId||''));
		params.push('source='+(o.source||1));
		params.push('cna='+(getCookie('cna')||''));
		var offerUrl = '';
		if(o.offerId&&o.offerId!=''){
			offerUrl = 'http://detail.1688.com/buyer/offerdetail/'+o.offerId+'.html';
		}
		params.push('sourceUrl='+offerUrl);
		if(typeof window.dmtrack!="undefined"){
			dmtrack.clickstat("http://interface.xp.1688.com/eq/enquiry/traceEnquiry.json",params.join('&'));
		}else{
			d = new Date();
			if(document.images) {
				(new Image()).src="http://interface.xp.1688.com/eq/enquiry/traceEnquiry.json" + params.join('&') + "&time=" + d.getTime();
			}
		}
		return true;
	}
}
function createAlitalkStat(dataObj,ppp,hashCode){
	var javascriptStr="",imgURL="",doc="",className="",tips="";
	var memberId = dataObj.MEMBERID;
	var memberIdLen = memberId.length;
	var cutlen = memberIdLen % ppp;
	var mixnum = parseInt(hashCode / 13);
	var encodeMemberId = memberId.substring(cutlen,memberIdLen)+memberId.substring(0,cutlen)+mixnum;
	if(dataObj.onlineStatus==0){
		imgURL = 'http://img.china.alibaba.com/images/cn/buysell/070801/ww_online_22x22.gif';
		doc = "和我联系";
		tips="点此可直接与对方在线咨询产品、交流洽谈。还支持语音视频和多方商务洽谈";
		className = 'sysww_online';
	}else if(dataObj.onlineStatus==4||dataObj.onlineStatus==5){
		imgURL = 'http://img.china.alibaba.com/images/cn/buysell/070801/ww_phone_22x22.gif';
		doc = " 给我短信 ";
		tips="该用户为手机在线，点此默认发送离线消息，也可选择给对方发送短信咨询产品，交流洽谈";
		className = 'sysww_phone';
	}else{
		imgURL = 'http://img.china.alibaba.com/images/cn/buysell/070801/ww_offline_22x22.gif';
		doc = "给我留言";
		tips="";
		className = 'sysww_off';
	}
	
	javascriptStr = "'"+dataObj.id+"','"+encodeMemberId+"','isOnline','SALE','"+dataObj.memberLevel+"','"+dataObj.categoryId+"',"+dataObj.onlineStatus;
	
	return [javascriptStr,imgURL,doc,tips,className];
}
/*
 * 关键字加红
 * @param {Object} str 字符串
 * @param {Object} key 需要加红关键字
 * @returns {string} str
 */
function doRed(str,key){
		var key = key.replace(/[,\s\+]+/g, '|');
		if(key == ""){return str;}
		try {
			return str.replace(new RegExp('('+key+')', 'ig'), '<span style="color:red;">$1</span>');
		} catch (e) {
			return str;
		}
};
/*截取字符串*/
/*
 * @param {Object} str 需要进行截取的字符串
 * @param {Object} maxLength 显示字符串的最大长度
 * @param {Object} type:为2时，直接截取字符串，不加...,为1或者为空则采用默认的截取方式
 */
function doSubstring(str,maxLength,type){
	var new_str = "";
	var type = type || 1;
	var s_length = maxLength-3;
	if(str.length>maxLength){
		if (type == 1) {
			new_str = str.substring(0, s_length) + "...";
		}else if(type==4){
			new_str = str.substring(0, maxLength) + "...";
		}else{
			new_str = str.substring(0, maxLength);
		}
	}else{
		new_str = str;
	}
	return new_str;
}
function doSubstringAo(str, len, hasDot){ 
    var newLength = 0; 
    var newStr = ''; 
    var chineseRegex = /[^\x00-\xff]/g; 
    var singleChar = ''; 
    var strLength = str.replace(chineseRegex,'**').length; 
    for(var i = 0;i < strLength;i++){ 
        singleChar = str.charAt(i).toString(); 
        if(singleChar.match(chineseRegex) != null) { 
            newLength += 2; 
        }     
        else { 
            newLength++; 
        } 
        if(newLength > len) { 
            break; 
        } 
        newStr += singleChar; 
    } 
     
    if(hasDot && strLength > len) { 
        newStr += '...'; 
    }
    return newStr; 
}
//过滤YAHOO传递过来的数据，当offer的标题，EURL，RESOURCEID只要有一个为空，则被过滤
function doFitlerData(d){
		var new_data=[];
		for(var w=0; w<d.length;w++){
			if(d[w].TITLE&&d[w].TITLE!=''&&d[w].EURL&&d[w].EURL!=''&&d[w].RESOURCEID&&d[w].RESOURCEID!=''){
				d[w].EURL = d[w].EURL.replace(/"/g,'&quot;');
				d[w].TITLE = doFitlerInvalidCharacter(d[w].TITLE);
				d[w].DESC = doFitlerInvalidCharacter(d[w].DESC);
				d[w].COMPANY = doFitlerInvalidCharacter(d[w].COMPANY);
				d[w].REDKEY = doFitlerInvalidCharacter(d[w].REDKEY);
				d[w].RESOURCEID = doFitlerInvalidCharacter(d[w].RESOURCEID);
				new_data[new_data.length] = d[w];
			}
		}
		return new_data;
}
/**
 * @method 过滤无效字符
 * @param {String} s 目标字符串
 */
function doFitlerInvalidCharacter(s){
	s = s || "";
	return s.replace(/[\u0000-\u0008]|\u000b|\u000c|[\u000e-\u001f]/gi,' ');
}
/*
 * 十进制转二进制
 * @param {number} d 整数
 * returns {Array} bin 存放'0','1'的数组
 */
function dec2bin(d){
	var _dec = d;
	var bin = ["0","0","0","0","0","0","0","0","0","0"];
	var i = 9;
	while(_dec>0){
	if(_dec%2 != 0){
		bin[i] = "1";
		}
	i--;
	_dec = parseInt(_dec/2);
	}
	return bin;
}

/*判断是不是为'1'
 * @param {string} s
 * return {bool} true|false
 */
function isTrue(s){
	if(s == "1") return true;
		return false;
}
/*
* 拼装p4pURL函数
* @param {string} keyword  需要搜索的关键词，gbk编码，必须urlencode传递
* @param {string} catid    类目id，采用英文逗号(,)分隔，具体格式如下:(父类目id,类目id,子类id)
* @param {string} cat      类目名称，与类目id对应的名称,采用英文逗号(,)分隔，与catid的顺序一样，gbk编码，必须urlencode传递
* @param {string} tag      本文标签，采用英文逗号(,)分隔，gbk编码，必须urlencode传递
* @param {string} count    需要取得的广告条数
* @param {string} beginPage 当前页数
* @param {string} needNextGroup 是否需要判断有下一页数据 需要为ture 否则为false
* @param {string} pid      合作伙伴id
* @param {string} p4p      返回的广告json数组名
* @param {string} mt       keyword查询的匹配级别，e(精确)，c(中心)、ec(先精确后中心)
* @param {string} forumid  论坛ID
* @param {string} source   bd
* 

    query += _targetUrl + "?";
    query += "url=" + encodeURIComponent(encodeURIComponent(_url));
    query += "&refer=" + encodeURIComponent(encodeURIComponent(_refer));
    query += "&pt=" + encodeURIComponent(encodeURIComponent(_pt));
    query += "&cookie=" + encodeURIComponent(encodeURIComponent(_cookie));
    query += "&pageId=" + _pageId;
    query += "&ie=" + _ie;
    query += "&pid=" + _pid;
    query += "&outfmt=json";
    query += "&s=" + _s;
    query += "&n=" + _n;
    query += "&tid=" + _tid;
    query += "&rad=" + _rad;
    query += "&markId=" + _markId;
*/
function createP4PURL(keyword, catid, cat, tag, count, beginPage,needNextGroup, pid, p4p, mt, forumid, source,fixBeginPage,docid,info_catid,info_subjid,btintent,prodid){
	if(arguments.length==1&&typeof arguments[0]=="object") return createP4PURLObject(arguments[0]);
	var oriURL = p4pConfig.api; //从配置文件中获取参数
	var _keyword = keyword || "";//encodeURI(keyword);
	var _catid = catid || "";
	var _cat = cat || "";
	var _tag = tag || "";
	var _count = count || 0;
	var _beginPage = beginPage || 0;
	var _offset  = 0;
	var _fixBeginPage = fixBeginPage || 0;
	var _docid = docid || "";
	var _info_catid = info_catid || "";
	var _info_subjid = info_subjid || "";
	needNextGroup = needNextGroup||false;
	if(needNextGroup){
		_offset = parseInt(_count)*(parseInt(_beginPage)-1);
	}else{
		_offset = parseInt(_count)*(parseInt(_beginPage)-1)+_fixBeginPage;
	}
	if(_offset<0) _offset = 0;
	var _pid = pid || "";
	var _p4p = p4p || "p4pOffers";
	var _mt = mt;
	var _forumid = forumid || "";
	var _source = source || "";
    var _prodid = prodid;
	var t = new Date().getTime();
	//oriURL += "?keyword="+_keyword+"&catid="+_catid+"&cat="+_cat+"&tag="+_tag+"&count="+_count+"&offset="+_offset+"&pid="+_pid+"&p4p="+_p4p+"&mt="+_mt+"&forumid="+_forumid+"&source="+_source+"&docid="+_docid+"&category="+_info_catid+"&subject="+_info_subjid;
	//oriURL += "?n="+_count+"&s="+_offset+"&pid="+_pid;
	oriURL += "?url=" + encodeURIComponent(encodeURIComponent(document.location));
	oriURL += "&refer=" + encodeURIComponent(encodeURIComponent(document.referrer));
	
	oriURL += "&pt=" + encodeURIComponent(encodeURIComponent(document.title));
	//oriURL += "&cookie=" + encodeURIComponent(encodeURIComponent(getIlikeCookie("h_keys"))) || "";
	//oriURL += "&cookieid=" + getIlikeCookie("ali_beacon_id") || "";

	oriURL += "&ie=" + getPageCharset();
	//oriURL += "&outfmt=json";
	oriURL += "&jsonName="+_p4p;
	
	oriURL += "&cosite="+getCositeValue()+"&pageid="+getP4PPageId();

	//oriURL += "&pvtype="+bdSource();//流量来源
	oriURL += "&tag=" + encodeURIComponent(encodeURIComponent(tag));
    oriURL += "&prodid=" + _prodid;
	//oriURL += "&btintent="+btintent;
	return oriURL;
}
/**
 * 
 * 拼装p4pURL函数
 */
function createP4PURLObject(o){
	var params=[];		
	var defaultParamObject={
		keyword:"",
		catid:"",
		cat:"",
		tag:"",
		count:0,
		beginPage:0,
		fixBeginPage:0,
		docid:"",
		info_catid:"",
		info_subjid:"",
		needNextGroup:false,
		pid:"",
		p4p:"",
		mt:"",
		forumid:"",
		source:"",
		dcatid:"",
		prob:"",
        retailWholesale:'',
        isUseAlipay:'',
        mixWholesaleFlag:'',
		cosite:'',
		btintent:''
	}
	Lang.augmentObject(defaultParamObject,o);
	//alert(defaultParamObject.s);
	//params[params.length] = "keyword="+defaultParamObject.keyword;
	//params[params.length] = "catid="+defaultParamObject.catid;
	//params[params.length] = "cat="+defaultParamObject.cat;
	//params[params.length] = "tag="+defaultParamObject.tag;
	//params[params.length] = "count="+defaultParamObject.count;
	var _needNextGroup = defaultParamObject.needNextGroup;
	var _beginPage = defaultParamObject.beginPage||1;
	var _fixBeginPage = defaultParamObject.fixBeginPage
	if(_needNextGroup){
		_offset = parseInt(defaultParamObject.count)*(parseInt(_beginPage)-1);
	}else{
		_offset = parseInt(o.count)*(parseInt(_beginPage)-1)+_fixBeginPage;
	}
	//params[params.length] = "offset="+_offset;
	//params[params.length] = "pid="+defaultParamObject.pid;
	//params[params.length] = "p4p="+defaultParamObject.p4p;
	//params[params.length] = "mt="+defaultParamObject.mt;
	//params[params.length] = "forumid="+defaultParamObject.forumid;
	//params[params.length] = "source="+defaultParamObject.source;
	//params[params.length] = "docid="+defaultParamObject.docid;
	//params[params.length] = "category="+defaultParamObject.info_catid;
	//params[params.length] = "subject="+defaultParamObject.info_subjid;
	//params[params.length] = "dcatid="+defaultParamObject.dcatid;
	//params[params.length] = "prob="+defaultParamObject.prob;
	//params[params.length] = "pageid="+getP4PPageId();
	//params[params.length] = "retailWholesale="+defaultParamObject.retailWholesale;
	//params[params.length] = "isUseAlipay="+defaultParamObject.isUseAlipay;
	//params[params.length] = "mixWholesaleFlag="+defaultParamObject.mixWholesaleFlag;
	//params[params.length] = "cosite="+defaultParamObject.cosite;
	//params[params.length] = "t="+new Date().getTime();
	//var s = p4pConfig.api +"?"+params.join("&");
	s=p4pConfig.api +"?n="+defaultParamObject.count+"&s="+_offset+"&pid="+defaultParamObject.pid;	
	s += "&url=" + encodeURIComponent(encodeURIComponent(document.location));
	s += "&refer=" + encodeURIComponent(encodeURIComponent(document.referrer));	
	s += "&pt=" + encodeURIComponent(encodeURIComponent(document.title));	
	s += "&cookie=" + encodeURIComponent(encodeURIComponent(getIlikeCookie("h_keys"))) || "";
	s += "&tag=" + encodeURIComponent(encodeURIComponent(defaultParamObject.tag));
	s += "&cookieid=" + getIlikeCookie("ali_beacon_id") || "";
	s += "&ie=" + getPageCharset();	
	s += "&outfmt=json";
	s += "&jsonName="+defaultParamObject.p4p;
	s += "&pvtype="+bdSource();//流量来源
	s += "&btintent="+defaultParamObject.btintent;
	s += "&cosite="+getCositeValue()+"&pageid="+getP4PPageId();
	return s;
}

/*获取页面的page_id*/
function getP4PPageId(){
	return typeof window.dmtrack_pageid === 'undefined' ? (new Date() - 0 + '' + Math.floor((Math.random() * 1000))) : window.dmtrack_pageid;
}
/*替换方法,过滤title的html标签,主要是"<>"
 * stringObj为需要替换字符串
 */
function doReplace(stringObj){
  /*var _stringObj ="";
  _stringObj = stringObj.replace("<",escape("<"));
  _stringObj = _stringObj.replace(">",escape(">"));
  return _stringObj; */
 stringObj=stringObj.replace(/<|>/g,"");	
	return stringObj;
}

/*经营模式处理*/
function doMode(stringMode){
	var arrayMode = stringMode.split('');
	arrayMode=arrayMode.reverse();
	return arrayMode;
}
function doReverse(arr){
	var _arr= arr.reverse();
	return _arr;
}
function doTrim(s){
	try {
			return s.replace(/^\s+|\s+$/g, "");
		}catch(e){
			return s;
		}
}
function getWangWangStates(o,fn,scope,beginNum){
	o = o||{};
	var l = o.length;
	var stateUrl = '',catchMemberIds = [];
	for(var i=0;i<l;i++){
		catchMemberIds.push(o[i].MEMBERID);
	}
	stateUrl = p4pConfig.wangwangstate+catchMemberIds.join(';');
	if(arguments.length>3){
		stateUrl +="&beginnum="+beginNum;
	}
	AsyncScript.script(stateUrl,fn,window);
}
function getWangWangStateImgUrl(state){
	var s = '';
	switch(state){
		case 1:s= '<img src="http://img.china.alibaba.com/images/common/icon_v01/4000516.gif" align="absmiddle" border=0 width="16" height="16" alt="和我联系">';break;
		case 4:s = '<img src="http://img.china.alibaba.com/images/common/icon_v01/4000416.gif" border=0 width="16" height="16" alt="给我留言">';break;
		case 5:s = '<img src="http://img.china.alibaba.com/images/common/icon_v01/4000416.gif" align="absmiddle" border=0 width="16" height="16" alt="给我留言">';break;
		default:s = '<img src="http://img.china.alibaba.com/images/common/icon_v01/4000416.gif" align="absmiddle" border=0 width="16" height="16" alt="给我留言">';break;
	}
	return s;
}
function wangwangCallback(){
	var wangwangState = eval('online');
	var cacheImgs = [];
	var s = '',s2='',tempObject={};
	for(var i=0,l=wangwangState.length;i<l;i++){
		s = 'p4p-alitalkId'+i;
        s2 = s+'t';
		try{
            tempObject = getWangWangContentBySate(wangwangState[i]);
			document.getElementById(s).src = tempObject.u;
            document.getElementById(s2).innerHTML = tempObject.c;
		}catch(e){
			continue;
		}
	}
}
function getWangWangContentBySate(state){
    var o = {};
    switch(state){
        case 1:o={u:'http://img.china.alibaba.com/images/common/icon_v01/4000516.gif',c:'和我联系',s:1};break;
        case 4:o={u:'http://img.china.alibaba.com/images/common/icon_v01/4000416.gif',c:'给我短信',s:4};break;
        case 5:o={u:'http://img.china.alibaba.com/images/common/icon_v01/4000416.gif',c:'给我短信',s:5};break;
        default:o={u:'http://img.china.alibaba.com/images/common/icon_v01/4000616.gif',c:'给我留言',s:0};break;
    }
    return o;
}
function callbackForNews(){
    var wangwangState = eval('online');
	var cacheImgs = [];
	var s = '',s2='',tempObject={};
	for(var i=0,l=wangwangState.length;i<l;i++){
		s = 'p4p-alitalkId-news'+(i+20);
        s2 = s+'t';
		try{
            tempObject = getWangWangContentBySate(wangwangState[i]);
			document.getElementById(s).src = tempObject.u;
            document.getElementById(s2).innerHTML = tempObject.c;
		}catch(e){
			continue;
		}
	}
}
/**
 * 获取当前url中的参数
 * @Method getQueryParams
 * @return {Object} params
 * eg:
 * s = http://exodus.1688.com?a=1&b=2
 * param={a:1,b:2}
 */
function getQueryParams(){
	var s = document.location.href;
	var u = s.split('?'),
		p = [],
		v=[],
		params={};
	if(u.length==2){
		p = u[1].split('&');
		for(var i=0,l = p.length;i<l;i++){
			v = p[i].split('=');
			if(v[1]){
				params[v[0]]=v[1];
			}
		}
	}
	return params;
}
/**
 * 控制p4p在BD页面是否需要投放p4p广告
 * @Method controlCositePageP4P
 * @return {Boolean} true表示可投放,false表示不可投放
 */
function getCositeValue(){
	/*可投放的范围*/
	var params = getQueryParams();
	var cosite = typeof params['cosite']=='undefined'?'':params['cosite'];
	return cosite;
}


/**
 * 过滤YAHOO传递过来的数据，当offer的图片OFFERIMGURL字段为空，则被过滤
 * @Method controlNoPictureP4P
 * @return {Array}返回图片不为空的一个数组
 */
function doFitlerNoPic(d){
		var new_data=[];
		for(var w=0; w<d.length;w++){
			if(d[w].OFFERIMGURL&&d[w].OFFERIMGURL!=''){
				new_data[new_data.length] = d[w];
			}
		}
		return new_data;
}
String.format=function(str){
	var A = Array.prototype.slice.call(arguments, 1);
	return str.replace(/\{(\d+)\}/g, function (C, D) {return A[D];});
}


/**
 * 统一RMB价格符
 * @Method p4pFormatPrice
 * @return {Array}返回带标准RMB符的价格
 */
function p4pFormatPrice(price){
	var m = price.match(/\d+(\.\d+)?/);
	if(m[0])
		return '￥'+ m[0];
	else
		return '';
};

/**
getIlikeCookie 避免和中文站getCookie方法冲突 重写的方法
*/
function getIlikeCookie(cookieName){
    var cookieString = document.cookie;
    var start = cookieString.indexOf(cookieName + '=');
    if (start == -1)
        return null;
    start += cookieName.length + 1;
    var end = cookieString.indexOf(';', start);
    if (end == -1) return unescape(cookieString.substring(start));
    return unescape(cookieString.substring(start, end));
}

/**
getPageCharset 获取页面的charset
*/
function getPageCharset() {
    var charSet = "";
    if (document.all) {
        charSet = document.charset;
    } else {
        charSet = document.characterSet;
    }
    return charSet;
}

//流量来源@flp
function bdSource(){
	
	var sURL = document.location.href;
	if(document.referrer){
		if(document.referrer.indexOf('alibaba.com')==-1){
			if(document.referrer.indexOf('cosite')!=-1){
				return 'BD';//BD
			}else{
				return 'SEO';//SEO
			}
		}else{
			return 'SITE';//site
		}
	}else{
		return 'SITE'
	}
}