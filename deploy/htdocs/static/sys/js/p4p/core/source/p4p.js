/**
 * p4p-core�ļ�����p4p���ýӿڵķ�װ�Լ�һЩ���õķ���
 * @author chuangui.xiecg
 * @date 2011.1.11
 * 
 */

FD.namespace("FD.sys.p4p");
(function(win,S,undefined){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event, G= YAHOO.util.Get;
	/**
	 * ������ʾ��Ϣmap	
	 */
	S.CONSTANTS={
		'P4P_INIT':       	'p4p init',
		'P4P_LOAD':			'p4p load',
		'P4P_ON_SUCCESS':	'p4p success!',
		'P4P_ON_FAILURE':	'p4p failure!',
		end:0
	};
	/**
	 * ����P4P�Ľӿ�URL
	 */
	S.API_CONFIG={
		'p4p_api':'http://match.p4p.1688.com/b2bad',
		"entrance":"http://page.1688.com/html/p4p/pro.html?tracelog=p4plist",//��ҲҪ�������������ڵ�ַ
		"noimg":{
			"x100":"http://img.china.alibaba.com/images/cn/p4p/nopic_100x100.gif",
			"x150":"http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif"
		},
		'end':0
	};
	/**
	 * ����ӿڲ���֧�ֵ�map
	 */
	 
	S.API_PARAM_ITEM_MAP={
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
		'end':0	
	};
	/**
	 * Ĭ�����ò�����debug
	 */
	S.debug = false;
	/**
	 * ���÷�����װ
	 */
	S.Utils = {
		/**
	 	* set debug state.
	 	* @param state {Boolean} the state to debug
	 	*/
		debug: function(state){
			if (L.isBoolean(state)) {
				S.debug = state;
			}
		},
		/**
		 * Prints debug info.
		 * @param msg {String} the message to log.
		 * @param cat {String} the log category for the message. Default
		 *        categories are "info", "warn", "error", "time" etc.
		 * @param src {String} the source of the the message (opt)
		 */
		log: function(msg, cat, src){
			if (S.debug) {
				if (src) {
					msg = src + ': ' + msg;
				}
				if (window['console'] !== undefined && console.log) {
					console[cat && console[cat] ? cat : 'log'](msg);
				}
			}
			return this;
		},
		/**
	 	* Throws error message.
	 	*/
		error: function(msg){
			if (S.debug) {
				throw msg;
			}
		},
		/**
		 * ��㺯��
		 * @param {string} url ��������ڵ�ַ
		 * @param {int} type ��������:���Ҫ���������д�㣬����Ҫ����һ����Ϊ��Ĳ�����p4pClick(url,true),����Ҫ���д��ģ�ֱ��p4pClick(url)|p4pClick(url,false)��������
		 * @returns {bool} true|false
		*/
		p4pClick:function(url,type){
			var d = new Date();
		    if(document.images&&(!arguments[1]||(arguments[1]&&E.isIE))) {
		       (new Image()).src=url+"&j=1&time=" + d.getTime();
		    }
		    return true;
		},
		p4pTraceEnquiryClick:function(o){
			var fromId = '',params = [];
			if(typeof getCookie == 'function'){
				fromId = getCookie('__last_loginid__');
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
		},
		/**
		 * �ؼ��ּӺ�
		 * @param {Object} str �ַ���
		 * @param {Object} key ��Ҫ�Ӻ�ؼ���
		 * @returns {string} str
		 */
		doRed:function(str,key){
				var key = key.replace(/[,\s\+]+/g, '|');
				if(key == ""){return str;}
				try {
					return str.replace(new RegExp('('+key+')', 'ig'), '<span style="color:red;">$1</span>');
				} catch (e) {
					return str;
				}
		},
		/**
		 * ��ȡ�ַ���
		 * @param {Object} str ��Ҫ���н�ȡ���ַ���
		 * @param {Object} maxLength ��ʾ�ַ�������󳤶�
		 * @param {Object} type:Ϊ2ʱ��ֱ�ӽ�ȡ�ַ���������...,Ϊ1����Ϊ�������Ĭ�ϵĽ�ȡ��ʽ
		 */
		doSubstring:function(str,maxLength,type){
			var new_str = "",
				type = type || 1,
				s_length = maxLength-3;
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
		},
		/**
		 * �ַ�����ȡ��������Ӣ��
		 * @param {String} str ��Ҫ���н�ȡ���ַ���
		 * @param {Int} len ��ʾ�ַ�������󳤶�
		 * @param {Boolean} hasDot ����ȡ֮���Ƿ����"..."
		 */
		doSubstringAo:function(str, len, hasDot){ 
		    var newLength = 0,
				newStr = '',
				chineseRegex = /[^\x00-\xff]/g,
				singleChar = '',
				strLength = str.replace(chineseRegex,'**').length; 
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
		},
		/**
		 * ����YAHOO���ݹ��������ݣ���offer�ı��⣬EURL��RESOURCEIDֻҪ��һ��Ϊ�գ��򱻹���
		 * @param {Object} d ����Դ
		 */
		doFitlerData:function(d){
				var new_data=[];
				for(var w=0; w<d.length;w++){
					if(d[w].TITLE&&d[w].TITLE!=''&&d[w].EURL&&d[w].EURL!=''&&d[w].RESOURCEID&&d[w].RESOURCEID!=''){
						d[w].EURL = d[w].EURL.replace(/"/g,'&quot;');
						d[w].TITLE = this.doFitlerInvalidCharacter(d[w].TITLE);
						d[w].DESC = this.doFitlerInvalidCharacter(d[w].DESC);
						d[w].COMPANY = this.doFitlerInvalidCharacter(d[w].COMPANY);
						d[w].REDKEY = this.doFitlerInvalidCharacter(d[w].REDKEY);
						d[w].RESOURCEID = this.doFitlerInvalidCharacter(d[w].RESOURCEID);
						new_data[new_data.length] = d[w];
					}
				}
				return new_data;
		},
		/**
		 * @method ������Ч�ַ�
		 * @param {String} s Ŀ���ַ���
		 */
		doFitlerInvalidCharacter:function(s){
			s = s || "";
			return s.replace(/[\u0000-\u0008]|\u000b|\u000c|[\u000e-\u001f]/gi,' ');
		},
		/**
		 * ��ȡpageid
		 */
		getPageId:function(){
			return typeof window.dmtrack_pageid=='undefined' ? "" : dmtrack_pageid;
		},
		getTime:function(){
			return new Date().getTime();
		},
		/**
		 * �ַ������˴���
		 * @param {String} stringObj
		 */
		doReplace:function(stringObj){
			stringObj = stringObj.replace(/<|>/g,"");	
			return stringObj;
		},
		p4pTagClick:function(offerId,keywords,pid){
			var d = this.getTime(),
				offerid = offerId||"",
				keywords = keywords||"",
				pageid = this.getPageId()||"",
				pid = pid||"";
			if(document.images){
				(new Image()).src = "http://stat.1688.com/p4ptag.html?offerid="+offerid+"&pageid="+pageid+"&keywords="+keywords+"&pos=3&pid="+pid+"&time="+d;
			}
		},
		end: 0
	};
	S.AbstractP4PView=function(data,config,oMergedP4PConfig){
		this.result = data||{};
		this.config = config||{};
		this.oMergedP4PConfig = oMergedP4PConfig||{};
		this.stat(data);
	};
	L.augmentObject(S.AbstractP4PView.prototype,{
		stat:function(o){
			var ctrType = this.config.ctrType||1;
			if(o&&o.length>0){
				var pageId = FD.sys.p4p.Utils.getPageId(),
				 	keyword = "",
					objectIds = [];
				for(var i=0;i<o.length;i++){
					if(keyword==""){
						keyword = o[i].REDKEY;
					}
					objectIds.push(o[i].RESOURCEID+",2;");
				}
				var coaseURL = "http://ctr.1688.com/ctr.html?ctr_type="+ctrType+"&page_area=2&page_id="+pageId+"&category_id=&object_type=offer&object_ids="+objectIds.join('')+"&keyword="+keyword+"&page_size=&page_no=&refer="+escape(document.location.href);
				this._post(coaseURL);
			}
		},
		_post:function(s){
			var d = FD.sys.p4p.Utils.getTime();
			if(document.images){
				setTimeout(function(){
					(new Image()).src = s+"&time="+d;
				},10);
			}
		}
	});
	S.P4PModel=function(oP4PConfig,fnFilter,P4PViewClass){
		if(typeof oP4PConfig!=='object') return;
		this.oP4PConfig = oP4PConfig;
		this.fnFilter = fnFilter;
		this.oMergedP4PConfig = FD.common.applyIf(this.oP4PConfig || {}, S.API_PARAM_ITEM_MAP);
		this.P4PViewClass = P4PViewClass;
		this.load();
	};
	L.augmentObject(S.P4PModel.prototype,{
		load:function(){
			var u = this.getLoadURL();
			var callback={
				onSuccess: this.onSuccess,
				onFailure:this.onFailure,
				onTimeout:this.onTimeout,
				scope:this,
				charset:'gb2312',
				timeout:10000,
				data:{}
			};
			S.Utils.log(S.CONSTANTS['P4P_LOAD']);
			/*��������*/
			var transactionObj = YAHOO.util.Get.script(u,callback);
		},
		getLoadURL:function(){
			var url = this._getHost()+'?'+this._getQuery();
			if(L.isFunction(this.fnFilter)){
				url = this.fnFilter(url);
			}
			return url;
		},
		_getHost:function(){
			return S.API_CONFIG.p4p_api;
		},
		_getQuery:function(){
			var query=[],fn = query.push;
			query.push("keyword="+this.oMergedP4PConfig.keyword);
			query.push("catid="+this.oMergedP4PConfig.catid);
			query.push("cat="+this.oMergedP4PConfig.cat);
			query.push("tag="+this.oMergedP4PConfig.tag);
			query.push("count="+this.oMergedP4PConfig.count);
			var _needNextGroup = this.oMergedP4PConfig.needNextGroup,
				 _beginPage = this.oMergedP4PConfig.beginPage||1,
				 _fixBeginPage = this.oMergedP4PConfig.fixBeginPage;
			if(_needNextGroup){
				_offset = parseInt(this.oMergedP4PConfig.count)*(parseInt(_beginPage)-1);
			}else{
				_offset = parseInt(this.oMergedP4PConfig.count)*(parseInt(_beginPage)-1)+_fixBeginPage;
			}
			query.push("offset="+_offset);
			query.push("pid="+this.oMergedP4PConfig.pid);
			query.push("p4p="+this.oMergedP4PConfig.p4p);
			query.push("mt="+this.oMergedP4PConfig.mt);
			query.push("forumid="+this.oMergedP4PConfig.forumid);
			query.push("source="+this.oMergedP4PConfig.source);
			query.push("docid="+this.oMergedP4PConfig.docid);
			query.push("category="+this.oMergedP4PConfig.info_catid);
			query.push("subject="+this.oMergedP4PConfig.info_subjid);
			query.push("dcatid="+this.oMergedP4PConfig.dcatid);
			query.push("prob="+this.oMergedP4PConfig.prob);
			query.push("pageid="+FD.sys.p4p.Utils.getPageId());
			query.push("retailWholesale="+this.oMergedP4PConfig.retailWholesale);
			query.push("isUseAlipay="+this.oMergedP4PConfig.isUseAlipay);
			query.push("mixWholesaleFlag="+this.oMergedP4PConfig.mixWholesaleFlag);
			query.push("cosite="+this.oMergedP4PConfig.cosite);
			query.push("t="+FD.sys.p4p.Utils.getTime());
			return query.join('&');
		},
		onSuccess:function(){
			var oP4PResult = window[this.oMergedP4PConfig.p4p];
			
			if(L.isObject(oP4PResult)&&oP4PResult.length>0){
				S.Utils.log(S.CONSTANTS['P4P_ON_SUCCESS']);
				this.toDo('onSuccess',oP4PResult);
			}else{
				this.onFailure();
			}
		},
		onFailure:function(){
			S.Utils.log(S.CONSTANTS['P4P_ON_FAILURE'],'info');
			this.toDo('onFailure',{});
		},
		onTimeout:function(){
			S.Utils.log(S.CONSTANTS['P4P_ON_FAILURE'],'error');
			this.onFailure();
		},
		toDo:function(callback,data){
			new this.P4PViewClass(callback,data,this.oP4PConfig,this.oMergedP4PConfig);
		},
		end:0
	});
	S.Ao=function(oP4PConfig,fnFilter){
		var _this=this;
		if(!(_this instanceof arguments.callee)){
			return new arguments.callee(oP4PConfig,fnFilter);
		}
		return {
			use:function(P4PViewClass){
				S.Utils.log(S.CONSTANTS['P4P_INIT']);
				new S.P4PModel(oP4PConfig,fnFilter,P4PViewClass);
			},
			end:0
		};
	};
	
})(window,FD.sys.p4p);
