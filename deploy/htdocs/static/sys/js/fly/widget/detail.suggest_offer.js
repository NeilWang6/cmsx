//�Ƿ�Ҫ����fly debug
FD.sys.fly.Utils.debug(true);
(function(win,S){
var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
/**
 * ��������-����ϲ��
 * @param {String} callback 		���ص�״̬ onSuccess|onFailure|onTimeout|onProgress
 * @param {Object} data 			���ص�����
 * @param {Object} oFlyConfig 		��ʼ�������ò���
 * @param {Object} oMergedFlyConfig	����mergeed������ò���,����oFlyConfig��ͬ����,�����������������ӿڷ�������������Ĳ���
 */
S.DetailSuggestOfferView = function(callback,data,oFlyConfig,oMergedFlyConfig){
	//ʵ��������
	this.isHoldOfferView = S.DetailSuggestOfferView.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
	
	this.result = data;
	this.oFlyConfig = oFlyConfig;
	this.oMergedFlyConfig = oMergedFlyConfig;

	//��ǰ��ȡ�����Լ�����,�Ա�offer����Ҽ۸�ļ���,ֻ��etc��offer��Ч
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
	/*���ݷ��ص�״̬�����ò��õĺ���,��ȻҲ�����ֶ�����*/
	this[callback]();
	FD.sys.fly.Utils.log(data);
	FD.sys.fly.Utils.log(oFlyConfig);
	FD.sys.fly.Utils.log(oMergedFlyConfig);
	return this;
};
//�̳и���
L.extend(S.DetailSuggestOfferView,S.AbstractFlyView);
//�ӿ�ʵ����
L.augment(S.DetailSuggestOfferView,S.InterfaceFlyView);

//������װ
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
		//�ص���������ĺ���
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
			//�ص���������ĺ���
			this.oFlyConfig.callback(this.result,true);
			var liItems = '#'+this.oFlyConfig.flyWidgetId+' div.iphoto';
			$E.on($$(liItems),'mouseover',function(){
				$D.addClass(this,'iover');
			});
			$E.on($$(liItems),'mouseout',function(){
				$D.removeClass(this,'iover');
			});
			 //���
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
		//�����ʾ5��
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
			return '<p class="no-price">�۸�����</p>';
		}
		if(offer.ETC&&Boolean(offer.ETC)===true){
			var foreignPrice = parseFloat(offer.foreignPrice);
			var rmb = offer.foreignPrice*this.rate;
			rmb = rmb.toFixed(2);
			return '<p class="p-etc"><b>Լ</b>&yen; <em>'+rmb+'</em><br/><span>'+foreignPrice.toFixed(2)+this.currencyCnName+'</span></p>';
		}
		return '<p>&yen; <em>'+_price.toFixed(2)+'</em><br/></p>';
	},
	_renderOfferTitle:function(offer){
		//���ﲻ�����ǲ���p4p��offer
		var detailUrl  = this._getDetailURL(offer);
		var subject = offer.subject;
		subject = subject.replace("<",'&#60;');
  		subject = subject.replace(">",'&#62;');
		var _title = '<h4><a href="'+detailUrl+'" target="_self" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})" data-dydmt="recommend1title" title="'+subject+'">'+subject+'</a></h4>';
		return _title;
	},
	_renderOfferPhoto:function(offer){
		//���ﲻ�����ǲ���p4p��offer
		var detailUrl  = this._getDetailURL(offer);
		var _photo = '<div class="iphoto"><a href="'+detailUrl+'" target="_self" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"  data-dydmt="recommend1pic" title="'+offer.subject+'"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'" onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"></a></div>';
		return _photo;
	},
	_renderFoot:function(){
		return '';
	},
	_getDetailURL:function(offer){
		//����Ƕ�������,���ն��������Ĺ�����ƴװdetail��url,����ֱ�ӷ���ԭʼ��detail url
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