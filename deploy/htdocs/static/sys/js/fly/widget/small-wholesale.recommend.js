//�Ƿ�Ҫ����fly debug
FD.sys.fly.Utils.debug(true);
(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * ����ֱ�Ϊ���Ƽ�
	 * @param {String} callback 		���ص�״̬ onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			���ص�����
	 * @param {Object} oFlyConfig 		��ʼ�������ò���
	 * @param {Object} oMergedFlyConfig	����mergeed������ò���,����oFlyConfig��ͬ����,�����������������ӿڷ�������������Ĳ���
	 */
	S.RecommendGoods = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//ʵ��������
		S.RecommendGoods.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
		this.result = data;
		this.oFlyConfig = oFlyConfig;
		this.oMergedFlyConfig = oMergedFlyConfig;
		/*���ݷ��ص�״̬�����ò��õĺ���,��ȻҲ�����ֶ�����*/
		this[callback]();
		FD.sys.fly.Utils.log(data);
		//FD.sys.fly.Utils.log(oFlyConfig);
		//FD.sys.fly.Utils.log(oMergedFlyConfig);
	};
	//�̳и���
	L.extend(S.RecommendGoods,S.AbstractFlyView);
	//�ӿ�ʵ����
	L.augment(S.RecommendGoods,S.InterfaceFlyView);

	//������װ
	L.augmentObject(S.RecommendGoods.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('RecommendGoods');
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
            var _failInfo = '<li><p class="err-info">��ȡ�Ƽ���Ϣʧ�ܣ���ˢ��ҳ�����³���</p></li>';
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
            var _modStart = '<ul class="list-product">';
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
            if ( companyList.length !== 0 ){
				companyListHtml.push(this._renderCompanyItem(companyList[0],0));
            }
			//}
			return companyListHtml.join('');
		},
		_renderCompanyItem:function(company,idx){
			var companyHtml = [];
			companyHtml.push(this._renderOfferList(company.offerIds));
			return companyHtml.join('');
		},
        _renderOfferList:function( offerList ){
            var offerListHtml = [];
            if ( offerList.length !== 0 ){
                for( var i= 0, l= offerList.length; i < l && i < 8; i++ ){
                    offerListHtml.push(this._renderOfferItem( offerList[i], i ));
                }
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
            var detailUrl  = offer.offerDetailUrl,
				subject = offer.subject.length > 14 ? offer.subject.cut(14) + '...' : offer.subject;
			if( offer.type != 0 ){
				detailUrl = offer.eURL;
			}
            var _dtAndDesc = '<dt><a class="a-img" title="' + offer.subject + '" href="' + detailUrl + '" target="_blank" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="' + FD.sys.fly.Utils.getOfferImageURL( offer.offerImageUrl, 0 ) + '" alt="' + offer.subject + '"/></a></dt><dd class="description"><a href="' + detailUrl + '" target="_blank" title="' + offer.subject + '" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">' + subject + '</a></dd>';
            return _dtAndDesc;
        },
        _renderOfferPrice:function(offer){
            var _ddPrice;
            if ( offer.rmbPrice !== 0 ){
                _ddPrice = '<dd class="price"><span class="fd-cny">&yen;</span><em class="value">' + offer.rmbPrice.toFixed(2) +'</em></dd>';
            }else if ( offer.foreignPrice !== 0 ){
                _ddPrice = '<dd class="price">��Ҽ۸�</dd>';
            }else {
                _ddPrice = '<dd class="price"></dd>';
            }
            return _ddPrice;
        },
		_renderFoot:function(){
            var _modClose = '</ul>';
			return _modClose;
		},
		end:0
	},true);
})(window,FD.sys.fly);