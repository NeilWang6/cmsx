//�Ƿ�Ҫ����fly debug
FD.sys.fly.Utils.debug(true);
(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * ��������-��Ӧ�ղ�״̬-�ղظ���Ʒ���û����ע����Ʒ
	 * @param {String} callback 		���ص�״̬ onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			���ص�����
	 * @param {Object} oFlyConfig 		��ʼ�������ò���
	 * @param {Object} oMergedFlyConfig	����mergeed������ò���,����oFlyConfig��ͬ����,�����������������ӿڷ�������������Ĳ���
	 */
	S.FavoritesStatusSupplyFocus = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//ʵ��������
		S.FavoritesStatusSupplyFocus.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
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
	L.extend(S.FavoritesStatusSupplyFocus,S.AbstractFlyView);
	//�ӿ�ʵ����
	L.augment(S.FavoritesStatusSupplyFocus,S.InterfaceFlyView);
	
	//������װ
	L.augmentObject(S.FavoritesStatusSupplyFocus.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('FavoritesStatusSupplyFocus');
			this._render();
            new FD.widget.Alitalk(FYS( 'a[alitalk]', 'favorites-supply-focus' ), {
                onRemote: function() {
                    switch(this.opt.online) {
                        case 0:
                        case 2:
                        case 6:
                        default: //������
                            this.innerHTML='��������';
                            this.title='��������';
                            break;
                        case 1: //����
                            this.innerHTML='����Ǣ̸';
                            this.title='����Ǣ̸';
                            break;
                        case 4:
                        case 5: //�ֻ�����
                            this.innerHTML='�ֻ�����';
                            this.title='�ֻ�����';
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
            var _failInfo = '<li><p class="err-info">���緱æ�����Ժ����!</p></li>';
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
            var _modStart = '<div class="mod-offer-focus">\n<div class="cell-header class-header">\n<h4 class="title">�ղظ���Ʒ���û����ע����Ʒ</h4>\n<div class="float-rt round-rt-up">Բ������</div>\n</div>\n<div class="content"><ul class="list-product class-img-100">\n';
			return _modStart;
		},
		_renderBody:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data));
			return _html.join('');
		},
		_renderOfferList:function(offerList){
			var offerListHtml = [];
			//�����ʾ5��
			var maxItemLength = parseInt(this.oFlyConfig.count)||5;
			for(var i=0,l = offerList.length;i<l&&i<maxItemLength;i++){
				offerListHtml.push(this._renderOfferItem(offerList[i],i));
			}
			return offerListHtml.join('');
		},
		_renderOfferItem:function(offer,idx){
			var offerHtml = [];
			offerHtml.push('<li>\n<dl class="cell-product-2nd">\n');
            offerHtml.push(this._renderOfferInfo(offer));
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push(this._renderOfferCompany(offer));
			offerHtml.push(this._renderOfferTalk(offer));
			offerHtml.push('</dl>\n</li>\n');
			return offerHtml.join('');
		},
        _renderOfferInfo:function( offer ){
            var detailUrl  = offer.offerDetailUrl;
			if( offer.type != 0 ){
				detailUrl = offer.eURL;
			}
            var _dtAndDesc = '<dt><a class="a-img" title="' + offer.subject + '" href="' + detailUrl + '" target="_blank" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="' + FD.sys.fly.Utils.getOfferImageURL( offer.offerImageUrl, 0 ) + '" alt="' + offer.subject + '"/></a></dt>\n<dd class="desc"><a href="' + detailUrl + '" target="_blank" title="' + offer.subject + '" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">' + offer.subject + '</a></dd>\n';
            return _dtAndDesc;
        },
        _renderOfferPrice:function(offer){
            var currency = offer.rmbPrice !== 0||'' ? '<span class="cny">&yen;</span>' : offer.foreignCurrency,
            price = offer.rmbPrice !== 0||'' ? offer.rmbPrice : offer.foreignPrice;
            //var _ddPrice = '<dd class="price">' + currency + '<em class="value">' + price +'</em></dd>\n';
            //if ( price !== 0||'' ){
            //    return _ddPrice;
            //}
            var _ddPrice = price !== 0||'' ? '<dd class="price">' + currency + '<em class="value">' + price.toFixed(2) +'</em></dd>\n' : '<dd class="price"></dd>';
            return _ddPrice;
        },
        _renderOfferCompany:function(offer){
            var _ddFactory = '<dd class="factory"><a href="' + offer.contact + '" target="_blank" title="' + offer.company + '" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">' + offer.company + '</a></dd>\n';
            return _ddFactory;
        },
        _renderOfferTalk:function(offer){
            var isTrust = offer.trustType !== 16 ? '<span class="icon-trust"><span class="hide">����ͨ</span></span>' : '',
            iseURL = offer.eURL !== '' ? offer.eURL : '';
            var _ddTalk = '<dd class="talk"><a href="#" alitalk="{id:\'' + offer.memberId + '\'}" onmousedown="FD.sys.fly.Utils.flyClick(\''+iseURL+'\', 1);FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'});"></a>' + isTrust + '</dd>\n';
            return _ddTalk;
        },
		_renderFoot:function(){
            var _modClose = '</ul>\n</div>\n</div>\n';
			return _modClose;
		},
		end:0
	},true);
})(window,FD.sys.fly);