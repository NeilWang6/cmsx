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
S.DetailSuggestOfferView = function(callback,data,oFlyConfig,oMergedFlyConfig){
	//实例化父类
	this.isHoldOfferView = S.DetailSuggestOfferView.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
	
	this.result = data;
	this.oFlyConfig = oFlyConfig;
	this.oMergedFlyConfig = oMergedFlyConfig;

	//提前获取汇率以及币种,以便offer人民币价格的计算,只对etc的offer有效
	this.rate = '';
	this.currencyCnName = '';
	if($('rate')&&$('currencyCnName')){
		this.rate = parseFloat($('rate').value);
		this.currencyCnName = $('currencyCnName').value;
	}
	this.isTopDomain = false;
	if($('isTopDomain')){
		this.isTopDomain = Boolean($('isTopDomain').value);
	}
	this.topDomainDetailURL = '';
	if(this.isTopDomain===true&&$('topDomainDetailURL')){
		this.topDomainDetailURL = $('topDomainDetailURL').value;
	}
	/*根据返回的状态，调用不用的函数,当然也可以手动调用*/
	this[callback]();
	FD.sys.fly.Utils.log(data);
	FD.sys.fly.Utils.log(oFlyConfig);
	FD.sys.fly.Utils.log(oMergedFlyConfig);
	return this;
};
//继承父类
L.extend(S.DetailSuggestOfferView,S.AbstractFlyView);
//接口实例化
L.augment(S.DetailSuggestOfferView,S.InterfaceFlyView);

//方法封装
L.augmentObject(S.DetailSuggestOfferView.prototype,{
	onSuccess:function(){
		FD.sys.fly.Utils.log('Success:DetailSuggestOfferView');
		this._render();
		//vivian.xul 20101014 add 
		this._isHoldOfferData();
		//vivian.xul 20101014 end
	},
	onFailure:function(){
		FD.sys.fly.Utils.log('Failure:DetailSuggestOfferView');
		//回调传入进来的函数
		this.oFlyConfig.callback(this.result,false); 
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
			var ulEl = document.createElement('ul');
			ulEl.innerHTML = html.join('');
			$(this.oFlyConfig.flyWidgetId).appendChild(ulEl);
			$D.removeClass($$('div.de-blockhd','mod-detail-othsupplyinfo'),'hide');
			$D.removeClass($$('div.de-blockbd','mod-detail-othsupplyinfo'),'hide');
			$D.setStyle('mod-detail-othsupplyinfo','display','block');
			//回调传入进来的函数
			this.oFlyConfig.callback(this.result,true);
			var liItems = '#'+this.oFlyConfig.flyWidgetId+' div.iphoto';
			$E.on($$(liItems),'mouseover',function(){
				$D.addClass(this,'iover');
			});
			$E.on($$(liItems),'mouseout',function(){
				$D.removeClass(this,'iover');
			});
			 //打点
	  		var nodes = $$('a',this.oFlyConfig.flyWidgetId);
	  		YAHOO.detail.util.batchClick(nodes,'data-dydmt');
				
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
		var maxItemLength = parseInt(this.oFlyConfig.count)||10;
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
		offerHtml.push(this._renderOfferPrice(offer));
		offerHtml.push('</li>');
		return offerHtml.join('');
	},
	_renderOfferPrice:function(offer){
		var _price = parseFloat(offer.rmbPrice);
		if(_price===0&&Boolean(offer.ETC)===false){
			return '<p class="no-price">价格面议</p>';
		}
		if(offer.ETC&&Boolean(offer.ETC)===true){
			var foreignPrice = parseFloat(offer.foreignPrice);
			var rmb = offer.foreignPrice*this.rate;
			rmb = rmb.toFixed(2);
			return '<p class="p-etc"><b>约</b>&yen; <em>'+rmb+'</em><br/><span>'+foreignPrice.toFixed(2)+this.currencyCnName+'</span></p>';
		}
		return '<p>&yen; <em>'+_price.toFixed(2)+'</em><br/></p>';
	},
	_renderOfferTitle:function(offer){
		//这里不区分是不是p4p的offer
		var detailUrl  = this._getDetailURL(offer);
		var subject = offer.subject;
		subject = subject.replace("<",'&#60;');
  		subject = subject.replace(">",'&#62;');
		var _title = '<h4><a href="'+detailUrl+'" target="_self" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})" data-dydmt="recommend1title" title="'+subject+'">'+subject+'</a></h4>';
		return _title;
	},
	_renderOfferPhoto:function(offer){
		//这里不区分是不是p4p的offer
		var detailUrl  = this._getDetailURL(offer);
		var _photo = '<div class="iphoto"><a href="'+detailUrl+'" target="_self" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"  data-dydmt="recommend1pic" title="'+offer.subject+'"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'" onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"></a></div>';
		return _photo;
	},
	_renderFoot:function(){
		return '';
	},
	_getDetailURL:function(offer){
		//如果是顶级域名,则按照顶级域名的规则来拼装detail的url,否则直接返回原始的detail url
		if(this.isTopDomain===true&&this.topDomainDetailURL!=""){
			return this.topDomainDetailURL.replace(/\{memberId\}/,offer.memberId).replace(/\{postCatId\}/,offer.categoryId).replace(/\{offerId\}/,offer.offerId);
		}else{
			return offer.offerDetailUrl;
		}
	},
	//vivian.xul add 20101014
	_isHoldOfferData:function(){
		var maxItemLength = parseInt(this.oFlyConfig.count)||10,
			offerList = this.result.data,
			o = {},
			objectIds = [],
			l = (offerList.length>5?5:offerList.length);
			
		for(var i=0;i<l&&i<maxItemLength;i++){
			objectIds.push(offerList[i].offerId+','+offerList[i].alg+';');
		}
		o['category_id'] = this.oFlyConfig.catids;
		o['object_ids'] = objectIds.join('');
		this.isHoldOfferView.doRequest(o);
		if(offerList.length>5){
			var objectIdsNext = [],
				obj = {},
				_flag = true;
			for(var i=5;i<offerList.length&&i<maxItemLength;i++){
				objectIdsNext.push(offerList[i].offerId+','+offerList[i].alg+';');
			}
			obj['category_id'] = this.oFlyConfig.catids;
			obj['object_ids'] = objectIdsNext.join('');
			FYE.on('J_sugNext', 'click', function(){
				if (_flag) {
					this.isHoldOfferView.doRequest(obj);
					_flag = false;
				}
			}, this, true);
		}
	},
	end:0
},true);
})(window,FD.sys.fly); 