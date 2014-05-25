/**
 * @author chuangui.xiecg
 * @modified arcthur.cheny updated 2011-6-21
 * @modified jiali.shijl at 2012-01-16 ����ȡlastLoginId������Ϊfdev4�ķ���
 */
var p4p_jjCount = 0;//��������
var p4p_pageSize = 40;//ÿҳ��ʾ����
var p4p_keyword = "";//�ؼ���
var p4p_ppp = 1;//�����׵Ĳ���������������TEAMȥ
var p4p_hashCode = 1;//��ϣ��
var p4p_alitalkMethod = "a1875796";//��̬�ĵ���ó��ͨ�ķ�����
var p4p_categoryid = ""; //��ĿID

function initP4pParams(jjCount,pageSize,keyword,ppp,hashCode,alitalkMethod,categoryid){
	p4p_jjCount = jjCount||0;
	p4p_pageSize = pageSize||40;
	p4p_keyword = keyword||'';
	p4p_ppp = ppp||1;
	p4p_hashCode = hashCode||1;
	p4p_alitalkMethod = alitalkMethod||'';
	p4p_categoryid = categoryid;
}

/* p4p �����ļ� */
var p4pConfig = {
	//"api":"http://match.p4p.1688.com/b2bad",//P4P���ýӿ�
	//"api":"http://cmweb.ilike.1688.com/cmweb/cmweb/cMWeb/handleRequest.htm",//ilike���ýӿڣ����� by balibell��
	"api":"http://cmweb.ilike.1688.com/cmweb/hollywood/product/handleJson.htm",//ilike���ýӿڣ����� by balibell��
	"api2":"http://page.1688.com/html/p4p/p4pScript_test2.html",//���Խӿ�
	"api3":"http://10.0.29.13:7001/search/p4p_api.htm",//���ز��Խӿ�2
	"entrance":"http://page.1688.com/html/p4p/pro.html?tracelog=p4plist",//��ҲҪ�������������ڵ�ַ
	"noimg":{
		"x100":"http://img.china.alibaba.com/images/cn/p4p/nopic_100x100.gif",
		"x150":"http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif"
		},
	"img":"http://img.china.alibaba.com/img/offer",
	"company":"http://exodus.1688.com/company/detail/",
	"icon":{
		"p":"http://img.china.alibaba.com/images/common/icon_v01/4000812.gif",  //���˳���ͨicon
		"c":"http://img.china.alibaba.com/images/common/icon_v01/4000712.gif",  //��ҵ����ͨicon
		"u":"http://img.china.alibaba.com/images/buyer/list/trust.gif"          //ͳһ����ͨicon
	},
	"trust":".cn.1688.com/athena/bizreflist/",
	"bdMaxOfferNum":10,
	"wangwangstate":'http://amos.im.alisoft.com/muliuserstatus.aw?uids='
}

/*
 * ��㺯��
 * @param {string} url ��������ڵ�ַ
 * @param {int} type ��������:���Ҫ���������д�㣬����Ҫ����һ����Ϊ��Ĳ�����p4pClick(url,true),����Ҫ���д��ģ�ֱ��p4pClick(url)|p4pClick(url,false)��������
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
	//modified by jiali.shijl at 2012.01.16 ����ȡlastLoginId������Ϊfdev4�ķ���
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
		doc = "������ϵ";
		tips="��˿�ֱ����Է�������ѯ��Ʒ������Ǣ̸����֧��������Ƶ�Ͷ෽����Ǣ̸";
		className = 'sysww_online';
	}else if(dataObj.onlineStatus==4||dataObj.onlineStatus==5){
		imgURL = 'http://img.china.alibaba.com/images/cn/buysell/070801/ww_phone_22x22.gif';
		doc = " ���Ҷ��� ";
		tips="���û�Ϊ�ֻ����ߣ����Ĭ�Ϸ���������Ϣ��Ҳ��ѡ����Է����Ͷ�����ѯ��Ʒ������Ǣ̸";
		className = 'sysww_phone';
	}else{
		imgURL = 'http://img.china.alibaba.com/images/cn/buysell/070801/ww_offline_22x22.gif';
		doc = "��������";
		tips="";
		className = 'sysww_off';
	}
	
	javascriptStr = "'"+dataObj.id+"','"+encodeMemberId+"','isOnline','SALE','"+dataObj.memberLevel+"','"+dataObj.categoryId+"',"+dataObj.onlineStatus;
	
	return [javascriptStr,imgURL,doc,tips,className];
}
/*
 * �ؼ��ּӺ�
 * @param {Object} str �ַ���
 * @param {Object} key ��Ҫ�Ӻ�ؼ���
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
/*��ȡ�ַ���*/
/*
 * @param {Object} str ��Ҫ���н�ȡ���ַ���
 * @param {Object} maxLength ��ʾ�ַ�������󳤶�
 * @param {Object} type:Ϊ2ʱ��ֱ�ӽ�ȡ�ַ���������...,Ϊ1����Ϊ�������Ĭ�ϵĽ�ȡ��ʽ
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
//����YAHOO���ݹ��������ݣ���offer�ı��⣬EURL��RESOURCEIDֻҪ��һ��Ϊ�գ��򱻹���
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
 * @method ������Ч�ַ�
 * @param {String} s Ŀ���ַ���
 */
function doFitlerInvalidCharacter(s){
	s = s || "";
	return s.replace(/[\u0000-\u0008]|\u000b|\u000c|[\u000e-\u001f]/gi,' ');
}
/*
 * ʮ����ת������
 * @param {number} d ����
 * returns {Array} bin ���'0','1'������
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

/*�ж��ǲ���Ϊ'1'
 * @param {string} s
 * return {bool} true|false
 */
function isTrue(s){
	if(s == "1") return true;
		return false;
}
/*
* ƴװp4pURL����
* @param {string} keyword  ��Ҫ�����Ĺؼ��ʣ�gbk���룬����urlencode����
* @param {string} catid    ��Ŀid������Ӣ�Ķ���(,)�ָ��������ʽ����:(����Ŀid,��Ŀid,����id)
* @param {string} cat      ��Ŀ���ƣ�����Ŀid��Ӧ������,����Ӣ�Ķ���(,)�ָ�����catid��˳��һ����gbk���룬����urlencode����
* @param {string} tag      ���ı�ǩ������Ӣ�Ķ���(,)�ָ���gbk���룬����urlencode����
* @param {string} count    ��Ҫȡ�õĹ������
* @param {string} beginPage ��ǰҳ��
* @param {string} needNextGroup �Ƿ���Ҫ�ж�����һҳ���� ��ҪΪture ����Ϊfalse
* @param {string} pid      �������id
* @param {string} p4p      ���صĹ��json������
* @param {string} mt       keyword��ѯ��ƥ�伶��e(��ȷ)��c(����)��ec(�Ⱦ�ȷ������)
* @param {string} forumid  ��̳ID
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
	var oriURL = p4pConfig.api; //�������ļ��л�ȡ����
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

	//oriURL += "&pvtype="+bdSource();//������Դ
	oriURL += "&tag=" + encodeURIComponent(encodeURIComponent(tag));
    oriURL += "&prodid=" + _prodid;
	//oriURL += "&btintent="+btintent;
	return oriURL;
}
/**
 * 
 * ƴװp4pURL����
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
	s += "&pvtype="+bdSource();//������Դ
	s += "&btintent="+defaultParamObject.btintent;
	s += "&cosite="+getCositeValue()+"&pageid="+getP4PPageId();
	return s;
}

/*��ȡҳ���page_id*/
function getP4PPageId(){
	return typeof window.dmtrack_pageid === 'undefined' ? (new Date() - 0 + '' + Math.floor((Math.random() * 1000))) : window.dmtrack_pageid;
}
/*�滻����,����title��html��ǩ,��Ҫ��"<>"
 * stringObjΪ��Ҫ�滻�ַ���
 */
function doReplace(stringObj){
  /*var _stringObj ="";
  _stringObj = stringObj.replace("<",escape("<"));
  _stringObj = _stringObj.replace(">",escape(">"));
  return _stringObj; */
 stringObj=stringObj.replace(/<|>/g,"");	
	return stringObj;
}

/*��Ӫģʽ����*/
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
		case 1:s= '<img src="http://img.china.alibaba.com/images/common/icon_v01/4000516.gif" align="absmiddle" border=0 width="16" height="16" alt="������ϵ">';break;
		case 4:s = '<img src="http://img.china.alibaba.com/images/common/icon_v01/4000416.gif" border=0 width="16" height="16" alt="��������">';break;
		case 5:s = '<img src="http://img.china.alibaba.com/images/common/icon_v01/4000416.gif" align="absmiddle" border=0 width="16" height="16" alt="��������">';break;
		default:s = '<img src="http://img.china.alibaba.com/images/common/icon_v01/4000416.gif" align="absmiddle" border=0 width="16" height="16" alt="��������">';break;
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
        case 1:o={u:'http://img.china.alibaba.com/images/common/icon_v01/4000516.gif',c:'������ϵ',s:1};break;
        case 4:o={u:'http://img.china.alibaba.com/images/common/icon_v01/4000416.gif',c:'���Ҷ���',s:4};break;
        case 5:o={u:'http://img.china.alibaba.com/images/common/icon_v01/4000416.gif',c:'���Ҷ���',s:5};break;
        default:o={u:'http://img.china.alibaba.com/images/common/icon_v01/4000616.gif',c:'��������',s:0};break;
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
 * ��ȡ��ǰurl�еĲ���
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
 * ����p4p��BDҳ���Ƿ���ҪͶ��p4p���
 * @Method controlCositePageP4P
 * @return {Boolean} true��ʾ��Ͷ��,false��ʾ����Ͷ��
 */
function getCositeValue(){
	/*��Ͷ�ŵķ�Χ*/
	var params = getQueryParams();
	var cosite = typeof params['cosite']=='undefined'?'':params['cosite'];
	return cosite;
}


/**
 * ����YAHOO���ݹ��������ݣ���offer��ͼƬOFFERIMGURL�ֶ�Ϊ�գ��򱻹���
 * @Method controlNoPictureP4P
 * @return {Array}����ͼƬ��Ϊ�յ�һ������
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
 * ͳһRMB�۸��
 * @Method p4pFormatPrice
 * @return {Array}���ش���׼RMB���ļ۸�
 */
function p4pFormatPrice(price){
	var m = price.match(/\d+(\.\d+)?/);
	if(m[0])
		return '��'+ m[0];
	else
		return '';
};

/**
getIlikeCookie ���������վgetCookie������ͻ ��д�ķ���
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
getPageCharset ��ȡҳ���charset
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

//������Դ@flp
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