//是否要开启fly debug
FD.sys.fly.Utils.debug(true);
(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * 阿里助手-收藏夹状态-同类公司最热收藏
	 * @param {String} callback 		返回的状态 onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			返回的数据
	 * @param {Object} oFlyConfig 		初始化的配置参数
	 * @param {Object} oMergedFlyConfig	经过mergeed后的配置参数,它跟oFlyConfig不同在于,这个参数就是真正向接口发起请求的所带的参数
	 */
	S.FavoritesStatusCompanySimilar = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.FavoritesStatusCompanySimilar.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
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
	L.extend(S.FavoritesStatusCompanySimilar,S.AbstractFlyView);
	//接口实例化
	L.augment(S.FavoritesStatusCompanySimilar,S.InterfaceFlyView);
	
	//方法封装
	L.augmentObject(S.FavoritesStatusCompanySimilar.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('FavoritesStatusCompanySimilar');
			this._render();
            new FD.widget.Alitalk(FYS( 'a[alitalk]', 'favorites-company-similar' ), {
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
            var _modStart = '<div class="mod-similar-hot"><div class="cell-header class-header"><h4 class="title">同类公司最热收藏</h4><div class="float-rt round-rt-up">圆角右上</div></div><div class="content"><ul class="list">';
			return _modStart;
		},
		_renderBody:function(){
			var _html = [];
			_html.push(this._renderCompanyhList(this.result.data));
			return _html.join('');
		},
		_renderCompanyhList:function(companyList){
			var companyListHtml = [];
            // 公司数最大是4
			var maxItemLength = parseInt(this.oFlyConfig.ccount)||4;
			for(var i=0,l = companyList.length;i<l&&i<maxItemLength;i++){
				companyListHtml.push(this._renderCompanyItem(companyList[i],i));
			}
			return companyListHtml.join('');
		},
		_renderCompanyItem:function(company,idx){
			var companyHtml = [];
			companyHtml.push('<li class="item-'+ (idx+1)+'"><div class="obj-similar clear-self">');
            companyHtml.push(this._renderCompanyInfo(company));
			companyHtml.push(this._renderOfferList(company.offerIds));
			companyHtml.push('</div></li>');
			return companyHtml.join('');
		},
        _renderCompanyInfo:function( company ){
            var companyInfoHtml = [];
            companyInfoHtml.push('<dl class="cell-product-4th">');
            companyInfoHtml.push( this._renderCompanyTitle( company ) );
            companyInfoHtml.push( this._renderCompanyCity( company ) );
            companyInfoHtml.push( this._renderCompanyTxt( company ) );
            companyInfoHtml.push( this._renderCompanyTalk( company ) );
            companyInfoHtml.push( this._renderCompanyCount( company ) );
            companyInfoHtml.push('</dl>' );
            return companyInfoHtml.join('');
        },
        _renderCompanyTitle:function( company ){
            var _cDt = '<dt><a href="'+company.contact+'" target="_blank" title="'+company.company+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+company.memberId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+company.alg+'\',\'objectType\':\'company\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+company.company+'</a></dt>';
            return _cDt;
        },
        _renderCompanyCity:function( company ){
            var _cDdCity = '<dd class="city">[' + company.province + company.city + ']</dd>';
            return _cDdCity;
        },
        _renderCompanyTxt:function( company ){
            var _cDdTxt = '<dd class="txt"><span class="label">主营：</span>'+company.mainCats+'</dd>';
            return _cDdTxt;
        },
        _renderCompanyTalk:function( company ){
            var isTrust = company.trustType !== 16 ? '<span class="icon-trust"><span class="hide">诚信通</span></span>' : '';
            var _cDdTalk = '<dd class="talk"><a href="#" alitalk="{id:\'' + company.memberId + '\'}" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+company.memberId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+company.alg+'\',\'objectType\':\'company\',\'pid\':\''+this.oFlyConfig.pid+'\'})"></a>' + isTrust + '</dd>';
            return _cDdTalk;
        },
        _renderCompanyCount:function( company ){
            var _cDdCount = '<dd class="count"><span class="icon-count">'+company.companyFavoriteCnt+'</span></dd>';
            return _cDdCount;
        },
        _renderOfferList:function( offerList ){
            var offerListHtml = [];
            if ( offerList.length !== 0 ){
                offerListHtml.push('<ul class="list-product class-img-100">');
                for( var i= 0, l = offerList.length; i < l && i < 3; i++ ){
                    offerListHtml.push(this._renderOfferItem( offerList[i], i ));
                }
                offerListHtml.push('</ul>');
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
            //var _ddPrice = '<dd class="price">' + currency + '<em class="value">' + price +'/'+offer.unit+'</em></dd>';
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