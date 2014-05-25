/**
 * @version 1.0
 * @author  xuewei.youxw
 * @page http://magma-test.china.alibaba.com:15200/ims/commodity_focus.htm
 * Date     Aug 27, 2010
 */

//是否要开启fly debug
FD.sys.fly.Utils.debug(false);

(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * 阿里旺旺-猜你喜欢
	 * @param {String} callback 		返回的状态 onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			返回的数据
	 * @param {Object} oFlyConfig 		初始化的配置参数
	 * @param {Object} oMergedFlyConfig	经过mergeed后的配置参数,它跟oFlyConfig不同在于,这个参数就是真正向接口发起请求的所带的参数
	 */
	S.CateAllGuessYouLinkView = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.CateAllGuessYouLinkView.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
		this.result = data;
		this.oFlyConfig = oFlyConfig;
		this.oMergedFlyConfig = oMergedFlyConfig;
		this[callback]();
	};
	//继承父类
	L.extend(S.CateAllGuessYouLinkView,S.AbstractFlyView);
	//接口实例化
	L.augment(S.CateAllGuessYouLinkView,S.InterfaceFlyView);
	
	// getURL , the p4p pay url is the eURL 
	function getURL(offer){
		if(offer.eURL && offer.eURL !== ''){
			return offer.eURL;
		}else{
			return offer.offerDetailUrl;
		}
	}
	
	//方法封装
	L.augmentObject(S.CateAllGuessYouLinkView.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('CateAllGuessYouLinkView');
			this._render();
		},
		
		onFailure:function(){
			this._onFailure();
		},
		
		onTimeout:function(){
			this._onFailure();
		},
		
		_onFailure:function(){
			window.location="http://view.1688.com/cms/xsppf/wwinsider.html";
		},
		
		_render:function(){
			var Fcatall = this._renderAll();
			$('ww-show-product').innerHTML = Fcatall;
		},
		
		_renderAll:function(){
		/*
			var Arraylength = this.result.data.length;
			var arrHtmlO = flyResult.data[0].offerIds;
			var _html = [];
			if(Arraylength == 1){
				arrHtmlO = arrHtmlO.slice(0,6)
				_html.push(this._renderOfferList(arrHtmlO));
				return _html.join('');
			}
			else if(Arraylength == 2){
				var arrHtmlTw = flyResult.data[1].offerIds;
				var arrobj = arrHtmlO.concat(arrHtmlTw).slice(0,6);
				_html.push(this._renderOfferList(arrobj));
				return _html.join('');
			}else if(Arraylength == 3){
				var arrHtmlTw = flyResult.data[1].offerIds;
				var arrHtmlTr = flyResult.data[2].offerIds;
				var arrobj = arrHtmlO.concat(arrHtmlTw,arrHtmlTr).slice(0,6);
				_html.push(this._renderOfferList(arrobj));
				return _html.join('');
			}
		*/
			// update by allen
			var offerIds=[];
			for(var i = 0, l = this.result.data.length; i < l; i++){
				offerIds = offerIds.concat(this.result.data[i].offerIds);
			}
			offerIds = offerIds.slice(0,6);
			//this._exposure(offerIds);
			FD.sys.fly.Utils.exposure(offerIds,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
			return this._renderOfferList(offerIds);
		},
				
		_renderOfferList:function(offerList){
			var offerListHtml = [];
			for(var i=0,l = offerList.length;i<l;i++){
			offerListHtml.push(this._renderOfferItem(offerList[i],i));
			}
			return offerListHtml.join('');
			alert(offerListHtml.join(''))
		},
		
		_renderOfferItem:function(offer,idx){
			var offerHtml = [];
			offerHtml.push('<li>');
			offerHtml.push('<dl class="cell-product-2nd">');
			offerHtml.push('<dt>');
			offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push('</dt>');
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push('</dl>');
			offerHtml.push('</li>');
			return offerHtml.join('');
		},
		
		//非法用词表
		_stripBadWord:function(str){
			var re = />|<|'|"/gi;
			return str.replace(re,function(word){
				return word.replace(/./g,"")
			});
		},
		
		_renderOfferTitle:function(offer){
			var detailUrl  = getURL(offer);
			var detailSubject = this._stripBadWord(FD.common.stripTags(offer.subject));
			var _title = '<dd class="description"><a href="'+detailUrl+'" target="_blank" title="'+detailSubject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(detailSubject,30,'...')+'</a></dd>';
			return _title;
		},
		
		_renderOfferPhoto:function(offer){
			var detailUrl  = getURL(offer);
			var detailSubject = this._stripBadWord(FD.common.stripTags(offer.subject));
			var _photo = '<a class="a-mix" href="'+detailUrl+'" target="_blank" title="'+detailSubject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a>';
			return _photo;
		},

	     _renderOfferPrice:function(offer){
			var currency,price;
			if(offer.rmbPrice !== 0||''){
				currency = '<span class="cny">&yen;</span>';
				price = offer.rmbPrice;
			}else{
				if(offer.foreignCurrency !== ''){
					currency = '<span class="value">外币价格</span>';
					price = offer.foreignCurrency;
				}else{
					currency = '';
					price = '';
				}
			}
			if(currency == '<span class="value">外币价格</span>'){
				var _ddPrice = '<dd class="price">' + currency + '</dd>';
			}else{
				if(price < 10000 && price !== 0 && price !== ''){
					var _ddPrice = '<span class="price">' + currency + '<em class="value">' + price.toFixed(2) +'</em></span>';
				}else{
					var _ddPrice = '';
				}
			}
                return _ddPrice;
            },
		_renderFoot:function(){
			return '';
		},
		end:0
	},true);
})(window,FD.sys.fly);