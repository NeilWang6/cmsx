//是否要开启fly debug
FD.sys.fly.Utils.debug(true);
(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * 阿里助手-收藏夹状态-公司最热收藏商品
	 * @param {String} callback 		返回的状态 onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			返回的数据
	 * @param {Object} oFlyConfig 		初始化的配置参数
	 * @param {Object} oMergedFlyConfig	经过mergeed后的配置参数,它跟oFlyConfig不同在于,这个参数就是真正向接口发起请求的所带的参数
	 */
	S.FavoritesStatusCompanyGoods = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.FavoritesStatusCompanyGoods.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
		this.result = data;
		this.oFlyConfig = oFlyConfig;
		this.oMergedFlyConfig = oMergedFlyConfig;
		/*根据返回的状态，调用不用的函数,当然也可以手动调用*/
		this[callback]();
		FD.sys.fly.Utils.log(data);
		//FD.sys.fly.Utils.log(oFlyConfig);
		//FD.sys.fly.Utils.log(oMergedFlyConfig);
	};
	//继承父类
	L.extend(S.FavoritesStatusCompanyGoods,S.AbstractFlyView);
	//接口实例化
	L.augment(S.FavoritesStatusCompanyGoods,S.InterfaceFlyView);
	
	//方法封装
	L.augmentObject(S.FavoritesStatusCompanyGoods.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('FavoritesStatusCompanyGoods');
			this._render();
		},
		onFailure:function(){
			//this._failRender();
		},
		onTimeout:function(){
			this._failRender();
		},
		onProgress:function(){
			//do nothing
		},
		_failRender:function(){
            var fHtml = [];
            fHtml.push( this._renderHead() );
            fHtml.push( this._failRenderBody() );
            fHtml.push( this._renderFoot() );
            if( $( this.oFlyConfig.flyWidgetId ) ){
                $( this.oFlyConfig.flyWidgetId ).innerHTML = fHtml.join('');
            }
        },
        _failRenderBody:function(){
            var _failInfo = '<li><p class="err-info">网络繁忙，请稍后操作!</p></li>';
            return _failInfo;
        },
		_render:function(){
			var html = [];
            if ( this.result.data && this.result.data.length !== 0 ){
                html.push(this._renderHead());
                html.push(this._renderBody());
                html.push(this._renderFoot());			
                if($(this.oFlyConfig.flyWidgetId)){
                    $(this.oFlyConfig.flyWidgetId).innerHTML = html.join('');
                }
            }
		},
		_renderHead:function(){
            var _modStart = '<div class="mod-com-hot"><div class="cell-header class-header"><h4 class="title">公司最热收藏商品</h4><div class="float-rt round-rt-up">圆角右上</div></div><div class="content"><ul class="list-product class-img-100">';
			return _modStart;
		},
		_renderBody:function(){
			var _html = [];
            if ( this.result.datatype === 1 ){
                _html.push(this._renderOfferList(this.result.data));
            }else if ( this.result.datatype === 2 ) {
                _html.push(this._renderCompanyhList(this.result.data));
            }
			return _html.join('');
		},
		_renderCompanyhList:function(companyList){
			var companyListHtml = [];
            // 公司数最大是4
			//var maxItemLength = parseInt(this.oFlyConfig.ccount)||4;
			//for(var i=0,l = companyList.length;i<l&&i<maxItemLength;i++){
            if ( companyList.length !== 0 ){
				companyListHtml.push(this._renderCompanyItem(companyList[0],0));
            }
			//}
			return companyListHtml.join('');
		},
		_renderCompanyItem:function(company,idx){
			var companyHtml = [];
			//companyHtml.push('<li><div class="obj-similar clear-self">');
            //companyHtml.push(this._renderCompanyInfo(company));
			companyHtml.push(this._renderOfferList(company.offerIds));
			//companyHtml.push('</div></li>');
			return companyHtml.join('');
		},
        _renderOfferList:function( offerList ){
            var offerListHtml = [];
            if ( offerList.length !== 0 ){
                //offerListHtml.push('<ul class="list-product class-img-100">');
                for( var i= 0, l= offerList.length; i < l && i < 8; i++ ){
                    offerListHtml.push(this._renderOfferItem( offerList[i], i ));
                }
                //offerListHtml.push('</ul>');
                return offerListHtml.join('');
            }
        },
        _renderOfferItem:function( offer, idx ){
            var offerHtml = [];
            offerHtml.push('<li><dl class="cell-product-2nd">');
            offerHtml.push(this._renderOfferInfo(offer));
            offerHtml.push(this._renderOfferPrice(offer));
            offerHtml.push('</dl></li>');
            return offerHtml.join('');
        },
        _renderOfferInfo:function( offer ){
            var detailUrl  = offer.offerDetailUrl;
			if( offer.type != 0 ){
				detailUrl = offer.eURL;
			}
            var _dtAndDesc = '<dt><a class="a-img" title="' + offer.subject + '" href="' + detailUrl + '" target="_blank" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="' + FD.sys.fly.Utils.getOfferImageURL( offer.offerImageUrl, 0 ) + '" alt="' + offer.subject + '"/></a></dt><dd class="desc"><a href="' + detailUrl + '" target="_blank" title="' + offer.subject + '" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">' + offer.subject + '</a></dd>';
            return _dtAndDesc;
        },
        _renderOfferPrice:function(offer){
            var currency = offer.rmbPrice !== 0||'' ? '<span class="cny">&yen;</span>' : offer.foreignCurrency,
            price = offer.rmbPrice !== 0||'' ? offer.rmbPrice : offer.foreignPrice;
            var _ddPrice = price !== 0||'' ? '<dd class="price">' + currency + '<em class="value">' + price.toFixed(2) +'/'+offer.unit+'</em></dd>' : '<dd class="price"></dd>';
            //if ( price !== 0||'' ){
                return _ddPrice;
            //}
        },
		_renderFoot:function(){
            var _modClose = '</ul></div></div>';
			return _modClose;
		},
		end:0
	},true);
})(window,FD.sys.fly);