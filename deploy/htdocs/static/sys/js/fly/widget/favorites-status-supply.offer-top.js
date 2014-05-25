//是否要开启fly debug
FD.sys.fly.Utils.debug(true);
(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * 阿里助手-供应收藏夹状态-同类商品收藏最热排行
	 * @param {String} callback 		返回的状态 onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			返回的数据
	 * @param {Object} oFlyConfig 		初始化的配置参数
	 * @param {Object} oMergedFlyConfig	经过mergeed后的配置参数,它跟oFlyConfig不同在于,这个参数就是真正向接口发起请求的所带的参数
	 */
	S.FavoritesStatusSupplyTop = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.FavoritesStatusSupplyTop.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
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
	L.extend(S.FavoritesStatusSupplyTop,S.AbstractFlyView);
	//接口实例化
	L.augment(S.FavoritesStatusSupplyTop,S.InterfaceFlyView);
	
	//方法封装
	L.augmentObject(S.FavoritesStatusSupplyTop.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('FavoritesStatusSupplyTop');
			this._render();
            var online = null;
            new FD.widget.Alitalk(FYS( 'a[alitalk]', 'favorites-supply-top' ), {
                onRemote: function() {
                    switch(this.opt.online) {
                        case 0:
                        case 2:
                        case 6:
                        default: //不在线
                            this.innerHTML='旺旺留言';
                            this.title='旺旺留言';
                            break;
                        case 1: //在线
                            this.innerHTML='在线洽谈';
                            this.title='在线洽谈';
                            break;
                        case 4:
                        case 5: //手机在线
                            this.innerHTML='手机在线';
                            this.title='手机在线';
                            break;
                    }
                }
            });
		},
		onFailure:function(){
            // no display
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
            var _modStart = '<div class="mod-similar-top"><div class="cell-header class-header"><h4 class="title">同类商品收藏最热排行</h4><div class="float-rt round-rt-up">圆角右上</div></div><div class="content"><ol class="list-order">';
			return _modStart;
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
			offerHtml.push('<li><dl class="cell-product-3rd">');
            offerHtml.push(this._renderOfferInfo(offer));
			offerHtml.push(this._renderOfferPrice(offer));
			//offerHtml.push(this._renderOfferCompany(offer));
			offerHtml.push(this._renderOfferTalk(offer));
			offerHtml.push('</dl></li>');
			return offerHtml.join('');
		},
        _renderOfferInfo:function( offer ){
            var detailUrl  = offer.offerDetailUrl;
			if( offer.type != 0 ){
				detailUrl = offer.eURL;
			}
            var _dtAndDesc = '<dt><div><a class="a-img" title="' + offer.subject + '" href="' + detailUrl + '" target="_blank" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="' + FD.sys.fly.Utils.getOfferImageURL( offer.offerImageUrl, 0 ) + '" width="50px" height="50px" onload="FD.sys.fly.Utils.resizeImage(this,50,50)" alt="' + offer.subject + '"/></a></div></dt><dd class="desc"><a href="' + detailUrl + '" target="_blank" title="' + offer.subject + '" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">' + offer.subject + '</a></dd>';
            return _dtAndDesc;
        },
        _renderOfferPrice:function(offer){
            var currency = offer.rmbPrice !== 0||'' ? '<span class="cny">&yen;</span>' : offer.foreignCurrency,
            price = offer.rmbPrice !== 0||'' ? offer.rmbPrice : offer.foreignPrice;
            var _ddPrice = '<dd class="price">' + currency + '<em class="value">' + price.toFixed(2) +'/'+offer.unit+'</em></dd>';
            if ( price !== 0||'' ){
                return _ddPrice;
            }
        },
        _renderOfferTalk:function(offer){
            var isTrust = offer.trustType !== 16 ? '<span class="icon-trust"><span class="hide">诚信通</span></span>' : '',
            iseURL = offer.eURL !== '' ? offer.eURL : '';
            var _ddTalk = '<dd class="talk"><a href="#" alitalk="{id:\'' + offer.memberId + '\'}" onmousedown="FD.sys.fly.Utils.flyClick(\''+iseURL+'\', 1);FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'});"></a>' + isTrust + '<span class="icon-count">'+offer.offerFavoriteCnt+'</span></dd>';
            return _ddTalk;
        },
		_renderFoot:function(){
            var _modClose = '</ol></div></div>';
			return _modClose;
		},
		end:0
	},true);
})(window,FD.sys.fly);