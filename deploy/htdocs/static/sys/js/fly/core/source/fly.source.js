/**
 * ���嶨��Ͷ�Ź��(FLY)����
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
	 * ������ʾ��Ϣmap	
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
	 * ����FLY�Ľӿ�URL
	 */
	S.API_CONFIG={
		'fly_api':'http://res.1688.com/fly/recommend.do',
		'fly_api2':'http://res.1688.com/fly/commend.do',
		'coase_api':'http://ctr.1688.com/ctr.html',
		'fly_log_api':'http://stat.1688.com/bt/1688_click.html',
		'end':0
	};
	
	/**
	 * ����ӿڲ���֧�ֵ�map,ע:����uid,pageid(��Щ������Դcookie)
	 */
	 
	S.API_PARAM_ITEM_MAP={
		'memberid':'',          //���ղع�˾��memberid��Ĭ�Ͽմ�
		'offerids':'',          //���ŷָ�,1����������offer<Ŀǰ���3��>,Ĭ�Ͽմ�                     
		'catids':'',            //���ŷָ�,1����������offer<Ŀǰ���3��>��Ĭ�Ͽմ�
		'ccount':0,             //company������Ĭ��0�����4
		'count':'',             //offer����,����Ϊ�ջ�NULL���������20
		'pid':'',               //����Ϊ�ջ�NULL
		'ratio':'',             //p4p����<С����λ,��0.75> Ĭ��0
		'offertype':'',         //sale or buy��Ĭ�Ͽմ�
		'querywords':'',        //�����ؼ��� Ĭ�Ͽմ�
		'recid':'',             //�Ƽ����,����Ϊ�ջ�NULL
		'buid':'',				// ĿǰΪ��1 С��Ʒ 2 ��װ 3 ��ҵƷ 41 ԭ����(1055;1015�¼�)
		'catnameflg':'',		//false-����ȡҶ����Ŀ��name��true-��ȡname���������Ĭ��Ϊfalse(1055;1015�¼�)
		'catflg':'',			//false-����Ҷ����Ŀ����Խ��в��㣬true-�����в��㣺����Ĭ��Ϊfalse(1055;1015�¼�)
		//'Newflg':'',			//false-��������Ҷ����Ŀ���� true-�����в��㣺ȷ��Ҫ��0����Ĭ��Ϊfalse"(1055;1015�¼�)
		'rectype':'',			//��Ĭ��ʹ��0��1:��ʾʹ��Ĭ�ϵ��Ƽ�֧�ֶ�(Ҳ����A����) ; 2:��ʾʹ��B����  ;0:��ʾʹ��A/B test���û�����ʹ��A������Ҳ����ʹ��B����
		'offersource':'',		//offer��Դ��ȱʡΪ���� 0-����Ҷ����Ŀ������Ʒ��������̫��1-����Ҷ����Ŀ7���������ƹ��˱�����̫��(1055;1015�¼�)
		'jsonname':'flyResult',	//���ؽ����var��ı�������Ĭ��ΪflyResult
		'cosite':'',
		'end':0	
	};
	
	S.API_LOG_MAP={
		'page':'',				//ҳ���ʶ,������Ϊ�գ�Ϊ�˷�������ͳ�ƣ���Ҫ���˹�ع����е�CTR_TYPE����һ��
		'objectId':'fleet',		//������,�����û�or��˾objectId=fleet,����offer,��offerid
		'recId':'',				//�ӿڱ��,����Ϊ��
		'alg':'',				//�Ƽ��㷨��Դ,����Ϊ��
		'objectType':'offer',	//��������,Ĭ��ֵΪoffer,������Ϊ��
		'pid':'',				//Ͷ������,������ʶP4Poffer��Ͷ��ҳ������
		'end':0	
	};
	
	/**
	 * �����Ӧ������ʽ���ĺ���map
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
			//offertype�����ֵ,ֻ��2ѡ1,���򷵻ؿ�ֵ
			if(offertype==='sale'||offertype==='buy'){
				return offertype;
			}
			return '';
		},
		'querywordsFormate':function(querywords){
			//�辭��UTF-8����,�Ѻͺ�̨Լ��
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
	 * ����ͳһ�����õ�formate����
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
	 * Ĭ�����ò�����debug
	 */
	S.debug = false;
	/**
	 * ���÷�����װ
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
		 * ƴװ��˾������
		 * @method getCompanyURL
		 * @param {Int} trustType ����ͨ���� 1 ��ҵ����ͨ 2 ���˳���ͨ 4 �������ͨ 8 רҵ�г�����ͨ 16 �ǳ���ͨ
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
		 * ƴװ���ű��ϵĵ�ַ
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
		 * ����ͼƬ����,��ƴװͼƬ��ַ
		 * @method getOfferImageURL
		 * @param {String} url
		 * @param {Int} type 0Ϊ100x100,1Ϊ150x150,2Ϊ220x200,3Ϊ310x310�ߴ��ͼƬ
		 * @return ����ͼƬ��ַ
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
		 * ͨ���첽�۷�
		 * @param {String} eurl
		 * @param {Int} type
		 */
		flyClick:function(eurl,type){
			if(!eurl) return;
			var d = (new Date).getTime(),bNeedClick = true;
			/*��IE,�����Ϳ۷�����*/
			if(type==1&&!YAHOO.env.ua.ie){
				bNeedClick =  false;
			}
		    if (document.images&&bNeedClick) {
		        (new Image).src =  eurl+ "&time=" + d;
		    }
		},
		/**
		 * ������
		 * @method iClick
		 * @param {Object} paramObject ����������
		 * eg:
		 * {
		 * 		'page':'ҳ���ʶ',
		 * 		'objectId':'������',
		 * 		'recId':'�ӿڱ��',
		 * 		'alg':'�Ƽ��㷨��Դ',
		 * 		'objectType':'��������',
		 * 		'pid':'Ͷ������'
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
		 * ͼƬ����������
		 * @param {HTMLElement} img
		 * @param {Int} w ��
		 * @param {Int} h ��
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
		* �ع�ͨ�÷���  added by honglun.menghl 2010-09-10
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
	 * class InterFaceView FLY������
	 * @param {Object} data
	 * @param {Object} config
	 * @param {Object} oMergedFlyConfig
	 * @param {Object} isHold �Ƿ��ֶ���㣬Ĭ�����Զ����
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
		 * �ֶ���������
		 * @param {Object} coaseObject �ع����
		 */
		doRequest:function(coaseObject){
			//Ŀǰ����ı����Ƕ���
			if(YAHOO.lang.isObject(coaseObject)){
				var _paramObj = YAHOO.lang.merge(this._getDefaultCoaseParamObject(),coaseObject),
					_paramArr = [];
				for(var i in _paramObj){
					_paramArr.push(i+'='+_paramObj[i]);
				}
				var d = new Date().getTime();
				var s = FD.sys.fly.API_CONFIG.coase_api+'?'+_paramArr.join('&')+"&t="+d;
				//���ie6�µ�bug,����script,��������new Image
				YAHOO.util.Get.script(s,{
					onSuccess:function(o){},
					charset:'gb2312'
				});
			}
		},
		/**
		 * ƴװ�ع����Ĭ�����ݶ���
		 */
		_getDefaultCoaseParamObject:function(){
			var o = {};
			var page_id 	= 	S.Utils.getPageId(),
				/*Ĭ��Ϊ��˹��������Ϊ2,����ⲿ�ж���,��ȥ�ⲿ�����coaseType*/
				type 		= 	parseInt(this.config.coaseType)||2,
				page_area 	= 	parseInt(this.config.recid)||'1010';
				
			o['ctr_type'] 	 = 	type;
			o['page_area']	 =	page_area;
			o['page_id']     = 	page_id;
			o['category_id'] = 	'';
			o['object_type'] = 	'offer';//Ĭ��Ϊoffer
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
				//���ie6�µ�bug,����script,��������new Image
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
		 * ���ݽӿڷ��ص�������datatype����,��ѡ��ͬ�Ĵ�㺯��
		 * @param {String|int} dataType
		 * @return {Function} ����ָ���Ĵ�㺯��
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
		 * ���ӿڷ��ص����ݵ�datatypeΪ1,��ѡ�����ִ�㷽ʽ
		 * @method getOfferIdsByDataTypeA
		 * @return {String} ��ƴװ�õĴ������ַ���
		 */
		getOfferIdsByDataTypeA:function(){
			var o = this.result['data'];
			if(L.isArray(o)&&o.length>0){
				var page_id 	= 	S.Utils.getPageId(),
					/*Ĭ��Ϊ��˹��������Ϊ2,����ⲿ�ж���,��ȥ�ⲿ�����coaseType*/
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
		 * ���ӿڷ��ص����ݵ�datatypeΪ2,��ѡ�����ִ�㷽ʽ
		 * @method getOfferIdsByDataTypeB
		 * @return {String} ��ƴװ�õĴ������ַ���
		 */
		getOfferIdsByDataTypeB:function(){
			var o = this.result['data'];
			if(L.isArray(o)&&o.length>0){
				var page_id 		= 	S.Utils.getPageId(),
					/*Ĭ��Ϊ��˹��������Ϊ2,����ⲿ�ж���,��ȥ�ⲿ�����coaseType*/
					type 		= 	parseInt(this.config.coaseType)||2,
					page_area 	= 	parseInt(this.config.recid)||'1010',
					category_id = 	'',
					keyword 		= 	"",
					aOfferId		=	[],
					aParam 			=   [],
					aParamCompany   =   [],
					tempOfferIds 	= 	[],
					aMemberId       =   [];
					
				/*offer���*/	
				aParam.push('ctr_type='+type);
				aParam.push('page_area='+page_area);
				aParam.push('page_id='+page_id);
				aParam.push('category_id='+category_id);
				aParam.push('object_type=offer');
				
				/*��˾���*/
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
		 * ���ӿڷ��ص����ݵ�datatypeΪ3,��ѡ�����ִ�㷽ʽ
		 * @method getOfferIdsByDataTypeC
		 * @return {String} ��ƴװ�õĴ������ַ���
		 */
		getOfferIdsByDataTypeC:function(){
			var o = this.result['data'];
			if(L.isArray(o)&&o.length>0){
				var page_id 	= 	S.Utils.getPageId(),
					/*Ĭ��Ϊ��˹��������Ϊ2,����ⲿ�ж���,��ȥ�ⲿ�����coaseType*/
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
	 * class InterfaceFlyView FLY�ӿ���
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
	 * FLY��module,����mvc���ģʽ��m
	 * @param {Object} oFlyConfig  	FLY�����ò���object
	 * @param {Function} fnFilter  	���⿪�ŵĸ�Ԥ����
	 * @param {Object} FlyViewClass 	�ص�����Ⱦ��
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
			/*��������*/
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
		 * ��ȡ�ӿڵ�ַ
		 * @method getLoadApi
		 */
		getLoadApi:function(){
			if(this.oFlyConfig.apiType&&this.oFlyConfig.apiType==='commend'){
				return S.API_CONFIG.fly_api2;
			}
			return S.API_CONFIG.fly_api;
		},
		/**
		 * ƴװ�ӿڵĲ���
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
			//�������oject,��ֱ�ӷ���
			if(!L.isObject(oParamMap)) return oParamMap;
			var oNewParamMap = {};
			for(var i in oParamMap){
				//�����key����api֧�ֵĲ���,����Ϊ����Ĳ���
				if(!L.isUndefined(S.API_PARAM_ITEM_MAP[i])&&i!='end'){
					oNewParamMap[i] = S.API_PARAM_ITEM_FORMATE_ACTUATOR(i,oParamMap[i]);
				}
			}
			this.oMergedFlyConfig = oNewParamMap;
			return oNewParamMap;
		},
		/**
		 * FLY�ӿڱش��Ĳ����б�
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
			/*returnCode��4��ֵ,0�ɹ�,1Ϊ��Ч�Ĳ���,2Ϊ����Serach Web��ʱ/�����쳣,9Ϊ����*/
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