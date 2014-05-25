/**
 * 定义定向投放广告(FLY)的类
 */

/**
* generate a random pageId, if the window.dmtrack_pageid is undefined
*/

if(typeof window.dmtrack_pageid == "undefined"){
	window.dmtrack_pageid = (new Date())-0+''+Math.floor((Math.random()*1000));
}


 

YAHOO.namespace("FD.sys.fly");
(function(win,S,undefined){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event, G= YAHOO.util.Get;
	/**
	 * 定义提示信息map	
	 */
	S.CONSTANTS={
		'PROCESS_FLY_AO_INIT':       			'process:FD.sys.fly.AO.init',
		'PROCESS_FLY_MODULE_LOAD':				'process:FD.sys.fly.FlyModule.load',
		'PROCESS_FLY_MODULE_ON_SUCCESS':		'process:data load success!',
		'ERROR_FLY_MODULE_ON_FAILURE':			'error:data load failure!',
		'PROCESS_FLY_MODULE_ON_PROCESS':		'process:data loading!',
		'ERROR_FLY_MODULE_ON_TIMEOUT':			'error:data load timeout!',
		'PROCESS_FLY_MODULE_LOAD_LOCAL_DATA':	'process:load local data!',
		end:0
	};
	/**
	 * 定义FLY的接口URL
	 */
	S.API_CONFIG={
		'fly_api':'http://res.1688.com/fly/recommend.do',
		'fly_api2':'http://res.1688.com/fly/commend.do',
		'coase_api':'http://ctr.1688.com/ctr.html',
		'fly_log_api':'http://stat.1688.com/bt/1688_click.html',
		'end':0
	};
	
	/**
	 * 定义接口参数支持的map,注:除了uid,pageid(这些数据来源cookie)
	 */
	 
	S.API_PARAM_ITEM_MAP={
		'memberid':'',          //被收藏公司的memberid，默认空串
		'offerids':'',          //逗号分割,1个或者最多个offer<目前最多3个>,默认空串                     
		'catids':'',            //逗号分割,1个或者最多个offer<目前最多3个>，默认空串
		'ccount':0,             //company数量，默认0，最大4
		'count':'',             //offer数量,不能为空或NULL，最大限制20
		'pid':'',               //不能为空或NULL
		'ratio':'',             //p4p比例<小数两位,如0.75> 默认0
		'offertype':'',         //sale or buy，默认空串
		'querywords':'',        //搜索关键字 默认空串
		'recid':'',             //推荐编号,不能为空或NULL
		'buid':'',				// 目前为：1 小商品 2 服装 3 工业品 41 原材料(1055;1015新加)
		'catnameflg':'',		//false-不获取叶子类目的name，true-获取name：如果不传默认为false(1055;1015新加)
		'catflg':'',			//false-基于叶子类目相关性进行补足，true-不进行补足：不传默认为false(1055;1015新加)
		//'Newflg':'',			//false-基于热门叶子类目补足 true-不进行不足：确认要求传0不传默认为false"(1055;1015新加)
		'rectype':'',			//（默认使用0）1:表示使用默认的推荐支持度(也就是A方案) ; 2:表示使用B方案  ;0:表示使用A/B test，用户可能使用A方案，也可能使用B方案
		'offersource':'',		//offer来源，缺省为不传 0-来自叶子类目热门商品表（不防马太）1-来自叶子类目7日热卖趋势过滤表（防马太）(1055;1015新加)
		'jsonname':'flyResult',	//返回结果集var后的变量名，默认为flyResult
		'cosite':'',
		'end':0	
	};
	
	S.API_LOG_MAP={
		'page':'',				//页面标识,不允许为空，为了方便数据统计，需要与科斯曝光打点中的CTR_TYPE保持一致
		'objectId':'fleet',		//对象编号,对于用户or公司objectId=fleet,对于offer,传offerid
		'recId':'',				//接口编号,允许为空
		'alg':'',				//推荐算法来源,允许为空
		'objectType':'offer',	//对象类型,默认值为offer,不允许为空
		'pid':'',				//投放区域,用来标识P4Poffer的投放页面区域
		'end':0	
	};
	
	/**
	 * 定义对应参数格式化的函数map
	 */
	S.API_PARAM_ITEM_FORMATE_FUNCTON_MAP={
		'memberidFormate':function(memberid){
			return memberid;
		},
		'offeridsFormate':function(offerids){
			return offerids;
		},
		'catidsFormate':function(catids){
			return catids;
		},
		'ccountFormate':function(ccount){
			return ccount;
		},
		'countFormate':function(count){
			return count;
		},
		'pidFormate':function(pid){
			return pid;
		},
		'ratioFormate':function(ratio){
			return ratio;
		},
		'offertypeFormate':function(offertype){
			//offertype如果有值,只能2选1,否则返回空值
			if(offertype==='sale'||offertype==='buy'){
				return offertype;
			}
			return '';
		},
		'querywordsFormate':function(querywords){
			//需经过UTF-8编码,已和后台约定
			return encodeURIComponent(encodeURIComponent(querywords));
		},
		'recidFormate':function(recid){
			return recid;
		},
		'defaultFormate':function(v){
			return v;
		}
	};
	/**
	 * 对外统一被调用的formate函数
	 * @method API_PARAM_ITEM_FORMATE_ACTUATOR
	 * @param {String} key
	 * @param {String|Boolean|int} v
	 */
	S.API_PARAM_ITEM_FORMATE_ACTUATOR=function(key,v){
		var sFnName = key+'Formate',
			APIFFM = S.API_PARAM_ITEM_FORMATE_FUNCTON_MAP,
			formateFn;
	   	formateFn = APIFFM[sFnName]?APIFFM[sFnName]:APIFFM['defaultFormate'];
	   	return formateFn(v);
	};
	/**
	 * 默认设置不开启debug
	 */
	S.debug = false;
	/**
	 * 公用方法封装
	 */
	S.Utils={
		/**
         * set debug state.
         * @param state {Boolean} the state to debug
         */
		debug:function(state){
			if(L.isBoolean(state)){
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
		log: function(msg, cat, src) {
            if (S.debug) {
                if(src) {
                    msg = src + ': ' + msg;
                }
                if (win['console'] !== undefined && console.info) {
                    console[cat && console[cat] ? cat : 'info'](msg);
                }
            }
            return this;
        },
        /**
         * Throws error message.
         */
        error: function(msg) {
            if(S.debug) {
                throw msg;
            }
        },
		/**
		 * 拼装公司的链接
		 * @method getCompanyURL
		 * @param {Int} trustType 诚信通类型 1 企业诚信通 2 个人诚信通 4 海外诚信通 8 专业市场诚信通 16 非诚信通
		 * @param {Stirng} domainID
		 * @param {String} memberID
		 */
		getCompanyURL:function(trustType,domainID,memberID){
			if(trustType!=16){
				if(domainID!=""){
					return "http://"+domainID+".cn.1688.com";
				}else{
					return "http://"+memberID+".cn.1688.com";
				}
			}else{
				return "http://company.1688.com/athena/"+memberID+".html";
			}
		},
		/**
		 * 拼装诚信保障的地址
		 * @method getBizrefURL
		 * @param {String} domainID
		 * @param {String} memberId
		 */
		getBizrefURL:function(domainID,memberID){
			if(domainID!=""){
				return 'http://'+domainID+'.cn.1688.com/athena/bizreflist/'+domainID+'.html';
			}
			if(memberId!=''){
				return 'http://'+memberID+'.cn.1688.com/athena/bizreflist/'+memberID+'.html';
			}
			return '';
		},
		/**
		 * 根据图片类型,来拼装图片地址
		 * @method getOfferImageURL
		 * @param {String} url
		 * @param {Int} type 0为100x100,1为150x150,2为220x200,3为310x310尺寸的图片
		 * @return 返回图片地址
		 */
        getOfferImageURL:function(src,type){
			var type = type||0;
			var noimg = ['http://img.china.alibaba.com/images/cn/p4p/nopic_100x100.gif','http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif','http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif','http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif'];
			if(src == ""){
				return noimg[type];
			}
			if(src&&src.indexOf('http')){
				src ='http:\/\/'+src;
			}
			
			var imgType = ['.summ.jpg','.search.jpg','.220x220.jpg','.310x310.jpg'];
			return src+imgType[type];
        },
		doSubstring:function(str, len, hasDot){
			if(!str){
				return str;
			}
			var newLength 		= 	0,
				newStr 			= 	'',
				chineseRegex 	= 	/[^\x00-\xff]/g,
				singleChar 		= 	'',
				strLength 		= 	str.replace(chineseRegex,'**').length; 
		    for(var i = 0;i < strLength;i++){ 
		        singleChar = str.charAt(i).toString(); 
		        if(singleChar.match(chineseRegex) != null){ 
		            newLength += 2; 
		        }else{ 
		            newLength++; 
		        } 
		        if(newLength > len) { 
		            break; 
		        } 
		        newStr += singleChar; 
		    } 
		    if(hasDot && strLength > len) { 
				newStr = FD.sys.fly.Utils.doSubstring(newStr,len-3);
		        newStr += '...';
				
		    }
		    return newStr; 
		},
		/**
		 * 通过异步扣费
		 * @param {String} eurl
		 * @param {Int} type
		 */
		flyClick:function(eurl,type){
			if(!eurl) return;
			var d = (new Date).getTime(),bNeedClick = true;
			/*非IE,不发送扣费请求*/
			if(type==1&&!YAHOO.env.ua.ie){
				bNeedClick =  false;
			}
		    if (document.images&&bNeedClick) {
		        (new Image).src =  eurl+ "&time=" + d;
		    }
		},
		/**
		 * 点击打点
		 * @method iClick
		 * @param {Object} paramObject 打点参数集合
		 * eg:
		 * {
		 * 		'page':'页面标识',
		 * 		'objectId':'对象编号',
		 * 		'recId':'接口编号',
		 * 		'alg':'推荐算法来源',
		 * 		'objectType':'对象类型',
		 * 		'pid':'投放区域'
		 * }
		 */
		iClick:function(paramObject){
			var param 			= 	[],
				 _paramObject 	= 	L.merge(S.API_LOG_MAP,paramObject);
			_paramObject.objectType = _paramObject.objectType||'offer';
			if(_paramObject.objectType=='undefined'){
				_paramObject.objectType = 'offer';
			}
			param.push('page='+_paramObject.page);
			param.push('objectId='+_paramObject.objectId);
			param.push('recId='+_paramObject.recId);
			param.push('alg='+_paramObject.alg);
			param.push('objectType='+_paramObject.objectType);
			param.push('pid='+_paramObject.pid);
			if(typeof window.dmtrack_pageid != "undefined"){
				param.push('st_page_id='+dmtrack_pageid);
			}else{
				param.push('st_page_id=');
			}
			param = '?'+param.join('&');
			if (typeof window.dmtrack != "undefined") {
		        dmtrack.clickstat(S.API_CONFIG.fly_log_api, param);
		    } else {
		        d = new Date;
		        if (document.images) {
		            (new Image).src = S.API_CONFIG.fly_log_api + param + "&time=" + d.getTime();
		        }
		    }
		    return true;
		},
        getTime:function(){
			return new Date().getTime();
		},
		getPageId:function(){
			return typeof window.dmtrack_pageid=='undefined' ? 1234 : window.dmtrack_pageid;
		},
		getCookie:function(name){
			var value = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
			return value ? unescape(value[1]): '';
		},
		/**
		 * 图片按比例缩放
		 * @param {HTMLElement} img
		 * @param {Int} w 宽
		 * @param {Int} h 高
		 */
		resizeImage:function(img,w,h) {  
		    img.removeAttribute("width");  
		    img.removeAttribute("height");  
		    var pic;  
		    if(window.ActiveXObject) {  
		        var pic=new Image();  
		        pic.src=img.src;  
		    } else pic=img;  
		    if(pic&&pic.width&&pic.height&&w) {  
		        if(!h) h=w;  
		        if(pic.width>w||pic.height>h) {  
		            var scale=pic.width/pic.height,fit=scale>=w/h;  
		            if(window.ActiveXObject) img=img.style;  
		            img[fit?'width':'height']=fit?w:h;  
		            if(window.ActiveXObject) img[fit?'height':'width']=(fit?w:h)*(fit?1/scale:scale);  
		        }  
		    }  
		},
		/**
		* 曝光通用方法  added by honglun.menghl 2010-09-10
		* @method exposure
		* @param offerIds <Array>  the offerIds must like this [{offerId:123,alg:13},{offerId:1234,alg:13}] the alg parameter is must have.
		* @param customParam <object> customParam's all key&value will be contained in the http request.
		*/
		exposure:function(offerIds,customParam){
			var exposureStr = '', customParam = customParam||{}, param = [];
			for(var i = 0, l = offerIds.length; i < l; i++){
				exposureStr+=offerIds[i].offerId+','+offerIds[i].alg+';';
			}
			
			exposureStr = exposureStr.slice(0,-1);
			param.push('object_ids='+exposureStr);
			if(typeof window.dmtrack_pageid != "undefined"){
				param.push('page_id='+dmtrack_pageid);
			}else{
				param.push('page_id=');
			}
			for(var i in customParam){
				param.push(i+'='+customParam[i]);
			}
			param.push('time='+(+new Date()));
			param = '?'+param.join('&');
			YAHOO.util.Get.script('http://ctr.1688.com/ctr.html'+param,{})
		},
        end:0
	};
	/**
	 * class InterFaceView FLY抽象类
	 * @param {Object} data
	 * @param {Object} config
	 * @param {Object} oMergedFlyConfig
	 * @param {Object} isHold 是否手动打点，默认是自动打点
	 */
	S.AbstractFlyView=function(data,config,oMergedFlyConfig,isHold){
		this.result = data||{};
		this.config = config||{};
		this.oMergedFlyConfig = oMergedFlyConfig||{};
		if (!isHold) this.coaseClick();
		return this;
	};
	L.augmentObject(S.AbstractFlyView.prototype,{
		/**
		 * 手动发送请求
		 * @param {Object} coaseObject 曝光对象
		 */
		doRequest:function(coaseObject){
			//目前传入的必须是对象
			if(YAHOO.lang.isObject(coaseObject)){
				var _paramObj = YAHOO.lang.merge(this._getDefaultCoaseParamObject(),coaseObject),
					_paramArr = [];
				for(var i in _paramObj){
					_paramArr.push(i+'='+_paramObj[i]);
				}
				var d = new Date().getTime();
				var s = FD.sys.fly.API_CONFIG.coase_api+'?'+_paramArr.join('&')+"&t="+d;
				//解决ie6下的bug,采用script,而不采用new Image
				YAHOO.util.Get.script(s,{
					onSuccess:function(o){},
					charset:'gb2312'
				});
			}
		},
		/**
		 * 拼装曝光打点的默认数据对象
		 */
		_getDefaultCoaseParamObject:function(){
			var o = {};
			var page_id 	= 	S.Utils.getPageId(),
				/*默认为科斯打点的类型为2,如果外部有定义,则去外部定义的coaseType*/
				type 		= 	parseInt(this.config.coaseType)||2,
				page_area 	= 	parseInt(this.config.recid)||'1010';
				
			o['ctr_type'] 	 = 	type;
			o['page_area']	 =	page_area;
			o['page_id']     = 	page_id;
			o['category_id'] = 	'';
			o['object_type'] = 	'offer';//默认为offer
			o['object_ids']  = 	'';
			o['keyword']	 = 	'';
			o['page_size']	 =	'';
			o['page_no']	 =	'';
			o['refer']		 =	escape(document.location.href);
			return o;
		},
		coaseClick:function(){
			var _param = this.getFunctionByDataType(this.result.datatype||'').call(this);
			if(_param==='')return;
			var d = new Date().getTime();
			if(typeof _param=='string'){

				var s = S.API_CONFIG.coase_api+'?'+_param+"&t="+d;
				//解决ie6下的bug,采用script,而不采用new Image
				YAHOO.util.Get.script(s,{
					onSuccess:function(o){
						//o.purge();
					},
					charset:'gb2312'
				});
			}else if(YAHOO.lang.isArray(_param)){
				var aURLs = [];
				for(var i=0;i<_param.length;i++){
					aURLs.push(S.API_CONFIG.coase_api+'?'+_param[i]+"&t="+d);
				}

				YAHOO.util.Get.script(aURLs,{
					onSuccess:function(o){
						//o.purge();
					},
					charset:'gb2312'
				});
			}
			return true;
		},
		/**
		 * 根据接口返回的数据中datatype类型,来选择不同的打点函数
		 * @param {String|int} dataType
		 * @return {Function} 返回指定的打点函数
		 */
		getFunctionByDataType:function(dataType){
			if(L.isUndefined(dataType)){
				S.Utils.log('the callback data type is undefined!');
			}
			var fn = null;
			switch(dataType.toString()){
				case '1':fn  = this.getOfferIdsByDataTypeA;break;
				case '2':fn  = this.getOfferIdsByDataTypeB;break;
				case '3':fn  = this.getOfferIdsByDataTypeC;break;
				default: fn  = this.getFunctionByDataTypeX;break;
			}
			return fn;
		},
		getFunctionByDataTypeX:function(){
			S.Utils.log('coase:the callback data type cannot render!');
			return '';
		},
		/**
		 * 当接口返回的数据的datatype为1,才选择这种打点方式
		 * @method getOfferIdsByDataTypeA
		 * @return {String} 已拼装好的打点参数字符串
		 */
		getOfferIdsByDataTypeA:function(){
			var o = this.result['data'];
			if(L.isArray(o)&&o.length>0){
				var page_id 	= 	S.Utils.getPageId(),
					/*默认为科斯打点的类型为2,如果外部有定义,则去外部定义的coaseType*/
					type 		= 	parseInt(this.config.coaseType)||2,
					page_area 	= 	parseInt(this.config.recid)||'1010',
					keyword 	= 	"",
					category_id = 	'',
					aOfferId	=	[],
					aParam 		=   [];
				aParam.push('ctr_type='+type);
				aParam.push('page_area='+page_area);
				aParam.push('page_id='+page_id);
				aParam.push('category_id='+category_id);
				aParam.push('object_type=offer');
				if(o&&o.length>0){
					for(var i=0;i<o.length;i++){
						aOfferId.push(o[i].offerId+','+o[i].alg+';');
					}
				}
				aParam.push('object_ids='+aOfferId.join(''));
				aParam.push('keyword='+keyword);
				aParam.push('page_size=');
				aParam.push('page_no=');
				aParam.push('refer='+escape(document.location.href));
				return aParam.join('&');
			}
			return '';
		},	
		/**
		 * 当接口返回的数据的datatype为2,才选择这种打点方式
		 * @method getOfferIdsByDataTypeB
		 * @return {String} 已拼装好的打点参数字符串
		 */
		getOfferIdsByDataTypeB:function(){
			var o = this.result['data'];
			if(L.isArray(o)&&o.length>0){
				var page_id 		= 	S.Utils.getPageId(),
					/*默认为科斯打点的类型为2,如果外部有定义,则去外部定义的coaseType*/
					type 		= 	parseInt(this.config.coaseType)||2,
					page_area 	= 	parseInt(this.config.recid)||'1010',
					category_id = 	'',
					keyword 		= 	"",
					aOfferId		=	[],
					aParam 			=   [],
					aParamCompany   =   [],
					tempOfferIds 	= 	[],
					aMemberId       =   [];
					
				/*offer打点*/	
				aParam.push('ctr_type='+type);
				aParam.push('page_area='+page_area);
				aParam.push('page_id='+page_id);
				aParam.push('category_id='+category_id);
				aParam.push('object_type=offer');
				
				/*公司打点*/
				aParamCompany.push('ctr_type='+type);
				aParamCompany.push('page_area='+page_area);
				aParamCompany.push('page_id='+page_id);
				aParamCompany.push('category_id='+category_id);
				aParamCompany.push('object_type=company');
				if(o&&o.length>0){
					for(var i=0;i<o.length;i++){
						aMemberId.push(o[i].memberId+',0;');
						tempOfferIds = o[i]['offerIds'];
						for(var j=0;j<tempOfferIds.length;j++){
							aOfferId.push(tempOfferIds[j].offerId+','+tempOfferIds[j].alg+';');
						}
					}
				}
				aParam.push('object_ids='+aOfferId.join(''));
				aParam.push('keyword='+keyword);
				aParam.push('page_size=');
				aParam.push('page_no=');
				aParam.push('refer='+escape(document.location.href));
				
				aParamCompany.push('object_ids='+aMemberId.join(''));
				aParamCompany.push('keyword='+keyword);
				aParamCompany.push('page_size=');
				aParamCompany.push('page_no=');
				aParamCompany.push('refer='+escape(document.location.href));
				return [aParam.join('&'),aParamCompany.join('&')];
			}
			return "";
		},
		/**
		 * 当接口返回的数据的datatype为3,才选择这种打点方式
		 * @method getOfferIdsByDataTypeC
		 * @return {String} 已拼装好的打点参数字符串
		 */
		getOfferIdsByDataTypeC:function(){
			var o = this.result['data'];
			if(L.isArray(o)&&o.length>0){
				var page_id 	= 	S.Utils.getPageId(),
					/*默认为科斯打点的类型为2,如果外部有定义,则去外部定义的coaseType*/
					type 		= 	parseInt(this.config.coaseType)||2,
					page_area 	= 	parseInt(this.config.recid)||'1010',
					keyword 	= 	"",
					category_id = 	'',
					aOfferId	=	[],
					aParam 		=   [];
				aParam.push('ctr_type='+type);
				aParam.push('page_area='+page_area);
				aParam.push('page_id='+page_id);
				aParam.push('category_id='+category_id);
				aParam.push('object_type=offer');
				var typeDateOffers = [];
				if(o&&o.length>0){
					for(var i=0;i<o.length;i++){
						typeDateOffers = o[i].offerIds;
						for(var j=0; j<typeDateOffers.length;j++){
							  aOfferId.push(typeDateOffers[j].offerId+','+typeDateOffers[j].alg+';');
						}
					}
				}
				aParam.push('object_ids='+aOfferId.join(''));
				aParam.push('keyword='+keyword);
				aParam.push('page_size=');
				aParam.push('page_no=');
				aParam.push('refer='+escape(document.location.href));
				return aParam.join('&');
			}
			return '';
		},		
		end:0
	});
	/**
	 * class InterfaceFlyView FLY接口类
	 */
	S.InterfaceFlyView=function(){
		//do nothing
	};
	L.augmentObject(S.InterfaceFlyView.prototype,{
		onSuccess:function(){
			//do nothing
		},
		onFailure:function(){
			//do nothing	
		},
		onTimeout:function(){
			//do nothing
		},
		onProgress:function(){
			//do nothing
		},
		end:0
	});
	/**
	 * FLY的module,类似mvc设计模式的m
	 * @param {Object} oFlyConfig  	FLY的配置参数object
	 * @param {Function} fnFilter  	对外开放的干预函数
	 * @param {Object} FlyViewClass 	回调的渲染类
	 */
	S.FlyModule=function(oFlyConfig,fnFilter,FlyViewClass){
		var Utils = FD.sys.fly.Utils;
		this.oFlyConfig = oFlyConfig;
		this.fnFilter = fnFilter;
		this.oMergedFlyConfig = {};
		this.FlyViewClass = FlyViewClass;
		this.load();
	};	
	L.augmentObject(S.FlyModule.prototype,{
		load:function(){
			var u = this.getLoadUrl();
			var callback={
				onSuccess: this.onSuccess,
				onFailure:this.onFailure,
				onTimeout:this.onTimeout,
				onProgress:this.onProgress,	
				scope:this,
				charset:'gb2312',
				timeout:10000,
				data:{}
			};
			S.Utils.log(S.CONSTANTS['PROCESS_FLY_MODULE_LOAD']);
			/*发起请求*/
			var transactionObj = YAHOO.util.Get.script(u,callback);
		},
		getLoadUrl:function(){
			var api = this.getLoadApi()+'?'+this.getParamsString();
			if(L.isFunction(this.fnFilter)){
				api = this.fnFilter(api);
			}
			return api;
		},
		/**
		 * 获取接口地址
		 * @method getLoadApi
		 */
		getLoadApi:function(){
			if(this.oFlyConfig.apiType&&this.oFlyConfig.apiType==='commend'){
				return S.API_CONFIG.fly_api2;
			}
			return S.API_CONFIG.fly_api;
		},
		/**
		 * 拼装接口的参数
		 * @method getParamsString
		 */
		getParamsString:function(){
			var oMergedFlyParamItemMap = this.doParamsFormate(L.merge(S.API_PARAM_ITEM_MAP,this.oFlyConfig)),
				aParamList = [];
			if(oMergedFlyParamItemMap.cosite == ''){delete oMergedFlyParamItemMap.cosite}
			for(var i in oMergedFlyParamItemMap){
				aParamList.push(i+'='+oMergedFlyParamItemMap[i]);
			}
			aParamList = aParamList.concat(this.addDefaultParams());
			return aParamList.join('&');
		},
		doParamsFormate:function(oParamMap){
			//如果不是oject,则直接返回
			if(!L.isObject(oParamMap)) return oParamMap;
			var oNewParamMap = {};
			for(var i in oParamMap){
				//如果该key不是api支持的参数,则不作为请求的参数
				if(!L.isUndefined(S.API_PARAM_ITEM_MAP[i])&&i!='end'){
					oNewParamMap[i] = S.API_PARAM_ITEM_FORMATE_ACTUATOR(i,oParamMap[i]);
				}
			}
			this.oMergedFlyConfig = oNewParamMap;
			return oNewParamMap;
		},
		/**
		 * FLY接口必传的参数列表
		 * @Method addDefaultParams
		 * @return {Array} 
		*/
		addDefaultParams:function(){
			var aRequiredParam = [];
			var sMemberId = S.Utils.getCookie('__last_loginid__');
			var sCookieId = S.Utils.getCookie('ali_beacon_id');
			if(sMemberId==''&&sCookieId==''){
				if(typeof window.membercookieinfo!='undefined'){
					sCookieId = window.membercookieinfo['lastLoginId']||-1;
				}else{
					sCookieId = -1;
				}
			}
			aRequiredParam.push('uid='+(sMemberId!=''?sMemberId:sCookieId));
			//aRequiredParam.push('uid=shuenshuihg');  
			aRequiredParam.push('pageid='+S.Utils.getPageId());
			aRequiredParam.push('t='+S.Utils.getTime());
			return aRequiredParam;
		},
		onSuccess:function(){
			var oFlyResult = {};
			if(!L.isUndefined(this.oFlyConfig.jsonname)){
				oFlyResult = window[this.oFlyConfig.jsonname];
			}else{
				oFlyResult = window[S.API_PARAM_ITEM_MAP.jsonname];
			}
			/*returnCode有4种值,0成功,1为无效的参数,2为请求Serach Web超时/或者异常,9为其他*/
			if(L.isObject(oFlyResult)&&oFlyResult.returnCode.toString()=="0"&&L.isArray(oFlyResult.data)&&oFlyResult.data.length>0){
				S.Utils.log(S.CONSTANTS['PROCESS_FLY_MODULE_ON_SUCCESS']);
				this.toDo('onSuccess',oFlyResult);
			}else{
				this.onFailure();
			}
		},
		onFailure:function(){
			S.Utils.log(S.CONSTANTS['ERROR_FLY_MODULE_ON_FAILURE'],'info');
			var data = {},idx = 0;
			if(typeof FD.sys.fly.DATA_LIST!='undefined'){
				idx = this.oFlyConfig.localDataType?parseInt(this.oFlyConfig.localDataType):0;
				if(idx<=FD.sys.fly.DATA_LIST.length&&idx){
					data = FD.sys.fly.DATA_LIST[idx-1];
					S.Utils.log(data);
				}else{
					data = FD.sys.fly.DATA_LIST[0];
				}
				
				S.Utils.log(S.CONSTANTS['PROCESS_FLY_MODULE_LOAD_LOCAL_DATA'],'info');
			}
			this.toDo('onFailure',data);
		},
		onTimeout:function(){
			S.Utils.log(S.CONSTANTS['ERROR_FLY_MODULE_ON_TIMEOUT'],'error');
			this.onFailure();
		},
		onProgress:function(){
			S.Utils.log(S.CONSTANTS['PROCESS_FLY_MODULE_ON_PROCESS']);
			this.toDo('onProgress',{});
		},
		toDo:function(callback,data){
			new this.FlyViewClass(callback,data,this.oFlyConfig,this.oMergedFlyConfig);
		},
		end:0
	});
	S.Ao=function(oFlyConfig,fnFirter){
		var _this=this;
		if(!(_this instanceof arguments.callee)){
			return new arguments.callee(oFlyConfig,fnFirter);
		}
		return {
			use:function(FlyViewClass){
					S.Utils.log(S.CONSTANTS['PROCESS_FLY_AO_INIT']);
					new S.FlyModule(oFlyConfig,fnFirter,FlyViewClass);
			},
			end:0
		};
	};
	
})(window,FD.sys.fly);