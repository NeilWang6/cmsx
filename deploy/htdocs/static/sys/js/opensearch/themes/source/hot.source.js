/**
 * @package opensearch.theme.hot
 * @import  opensearch
 * @author  Arcthur.cheny
 * @version 0.3.110104
 */
(function( win, S ){
	S.mySidePoper = "";
    S.theme.hot = {
        themeConfig: {
            'hasQuantity': 0,
            'priceLabel': '批发价',
            'companyLabel': '货源：',
            'quantityLabel': '起批',
            'hasTracelog': 0,
            'tracelogParam':'',
            'urlType':'search' //offer 链接类型, search: 搜索url, detail: detail url
        },
		/**
		 * get html dd.description
		 * @method  getHtmlDescription
         * @param   {String} offerUrl
         * @param   {String} subject
         * @param   {String} offerImgURI
		 * @param   {Int} image type, 0:100x100,1:150x150,2:220x200,3:310x310
         * @param   {Boolean} isImgPrivate
		 * @return  dt & dd.description
		 */
        getHtmlDescription: function( offerUrl, subject, src, type, isImgPrivate ){
            return '<dt class="vertical-img"><a class="a-img box-img" href="'+offerUrl+'" title="'+subject+'"><img src="'+S.Util.getOfferImgUrl( src, type, isImgPrivate )+'" alt="'+subject+'"/></a></dt><dd class="description"><a href="'+offerUrl+'" title="'+subject+'">'+subject+'</a></dd>';
        },
		/**
		 * get html dd.price
		 * @method  getHtmlPrice
		 * @param   {Int} value
		 * @return  dd.price
		 */
        getHtmlPrice: function( priceLabel, currency, value, isPricePrivate ){
            if ( isPricePrivate ){
                return '<dd class="price">'+priceLabel+'<span class="txt">价格授权可见</span></dd>';
            }
            var c = '';
            switch( currency ){
                case '元':
                    c = '<span class="fd-cny">&yen;</span>';
                    break;
                case '美元':
                    c = '<span class="usd">&#36;</span>';
                    break;
            }
            value = typeof value !== 'number' ? ( value - 0 ) : value;
            return '<dd class="price">'+priceLabel+c+'<em class="value">'+S.Util.toFixed( value, 2 )+'</em></dd>';
        },
		/**
		 * get html dd.quantity
		 * @method  getHtmlQuantity
		 * @param   {Int} quantityBegin
         * @param   {String} unit
         * @param   {String} label
		 * @return  dd.quantity
		 */
        getHtmlQuantity: function( quantityBegin, unit, label ){
            var dd = '<dd class="quantity">'+quantityBegin+unit+label+'</dd>';
            return dd;
        },
		
		getHtmlCity: function( province,city ){
            var span = '<span class="city">'+province+city+'</span>';
            return span;
        },
		
		getHtmlService: function( trustType, isUseAlipay){
			var alipay = '',
				trust = '',
				span = '';
			if ( isUseAlipay == true ) {
				alipay = '<span class="icon-alipay"></span>';
			}
			if ( trustType == "1" ) {
				trust = '<span class="icon-bussiness-trust"></span>';
			} else if ( trustType == "2" ) {
				trust = '<span class="icon-personal-trust"></span>';
			} else {
				trust = '';
			}
			span = '<span class="service">'+ trust + alipay +'</span>';
			return span;
		},
		/**
		 * get html offer
		 * @method  getHtmlOfferItem
         * @param   {Object} result data
         * //@param   {Int} offer serial number
		 * @param   {Int} image type, 0:100x100,1:150x150,2:220x200,3:310x310
         * @param   {String} keywords
         * @param   {String} featureArray
		 * @return  li list
		 */
        getHtmlOfferItem: function( offer, customize, keywords, feature ){
            var li = [], isImgPrivate = 0, isPricePrivate = 0,
                offerUrl = S.Util.getOfferUrl( customize.urlType, offer.privateInfo, keywords, offer.displayCatIds, offer.id, offer.isEtc, feature );
            switch ( offer.privateInfo ){
                case 1:
                    isImgPrivate = 1;
                    break;
                case 2:
                    isPricePrivate = 1;
                    break;
                case 3:
                    isImgPrivate = 1;
                    isPricePrivate = 1;
                    break;
            }
            li.push( '<li><dl class="cell-product-2nd">' );
            li.push( this.getHtmlDescription( offerUrl, offer.subject, offer.offerImgURI, customize.imgType, isImgPrivate ) );
            li.push( this.getHtmlPrice( customize.priceLabel, offer.currency, offer.price, isPricePrivate ) );
            if ( customize.hasQuantity - 0 ){
                li.push( this.getHtmlQuantity( offer.quantityBegin, offer.unit, customize.quantityLabel ) );
            }
            li.push('<dd class="info fd-clr">'+ this.getHtmlCity( offer.province, offer.city ) + this.getHtmlService( offer.trustType, offer.isUseAlipay ) +'</dd>');
            li.push( '</dl></li>' );
            return li.join('');
			

        },
		/**
		 * get html offer list
		 * @method  getHtmlOfferList
         * @param   {Object} result data
		 * @param   {Int} image type, 0:100x100,1:150x150,2:220x200,3:310x310
         * @param   {Object} config object
		 * @return  offer list
		 */
        getHtmlOfferList: function( offerList, customize, config ){
            var lis = [];
            for ( var i = 0, l = offerList.length, max = config.pagesize; i < l && i < max; i++ ){
                lis.push( this.getHtmlOfferItem( offerList[i], customize, config.keywords, config.featureArray ) );
            }
            return lis.join('');
        },
		/**
		 * aliclick tracelog
		 * @method  tracelog
         * @param   {Int} hasTracelog
		 * @param   {String} tracelog param
		 * @param   {String} nodeId for display content
		 * @return  tracelog
		 */
        tracelog: function( hasTracelog, tracelogParam, containerId ){
            if ( ( hasTracelog - 0 ) && ( tracelogParam !== '' ) ){
                var a = $$( '#'+containerId+' .list-product a' );
                $E.addListener( a, 'mousedown', function(){
                    S.Util.tracelog( tracelogParam );
                });
            }
        },
		/**
		 * get html ul.list-product
		 * @method  getHtmlRoot
         * @param   {Object} result data
		 * @param   {String} nodeId for display content
		 * @param   {Int} image type, 0:100x100,1:150x150,2:220x200,3:310x310
         * @param   {Object} config object
		 * @return  ul.innerHTML
		 */
        getHtmlRoot: function( result, customize, config ){
            //if ( config.search_type !== 'offer' ) {
            //    S.Util.log( 'please set the \'search_type\' is \'offer\'', 'warn' );
            //    return;
            //}
            var ul = [], typeImg;
            switch( customize.imgType ){
                case 0:
                    typeImg = 'opensearch-common type-img-100';
                    break;
                case 1:
                    typeImg = 'opensearch-common type-img-150';
                    break;
                case 2:
                    typeImg = 'opensearch-common type-img-220';
                    break;
                case 3:
                    typeImg = 'opensearch-common type-img-310';
                    break;
            }
            customize = FD.common.applyIf( customize, this.themeConfig );
            ul.push( '<ul class="list-product '+typeImg+'">' );
            ul.push( this.getHtmlOfferList( result.searchResultList, customize, config ) );
            ul.push( '</ul>' );
			S.currenCount = result.searchResultCount;
            $( customize.containerId ).innerHTML = ul.join('');
            this.tracelog( customize.hasTracelog, customize.tracelogParam, customize.containerId );
        },
        /**
         * get html div.err-tips
		 * @method  getErrorTips
		 * @param   {String} nodeId for display content
		 * @param   {String} tips text
         */
        getErrorTips: function( customize, txt ){
            switch( txt ){
                case 'failure':
                    txt = '加载出错，请稍后操作！';
                    break;
                case 'timeout':
                    txt = '网络繁忙，请稍后操作！';
                    break;
            }
            $( customize.containerId ).innerHTML = '<div class="opensearch-common-error">'+txt+'</div>';
        },
        end:0
    };
})( window, FD.sys.opensearch );