/**
 * @package opensearch.theme.industrial
 * @import  opensearch
 * @author  Arcthur chen
 */

(function( win, S ){

    S.theme.industrial = {
        themeConfig: {
            'hasCompany': 1, //是否有货源, 1: 有, 0: 无
            'hasQuantity': 0, //是否有起批量, 0:无, 1:有
            'priceLabel': '批发价：',
            'companyLabel': '货源：',
            'quantityLabel': '起批',
            'hasTracelog': 0, //是否打点, 0:否, 1:是
            'tracelogParam':'', //打点参数
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
            return '<dd class="price">'+priceLabel+'<em class="value">'+c+S.Util.toFixed( value, 2 )+'</em></dd>';
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
		/**
		 * get html dd.company
		 * @method  getHtmlCompany
         * @param   {String} domainId
         * @param   {String} memberId
		 * @param   {String} company
		 * @return  dd.company
		 */
        getHtmlCompany: function( companyLabel, trustType, domainID, memberID, company ){
            var dd = '<dd class="company"><span class="label">'+companyLabel+'</span><a href="'+S.Util.getCompanyUrl( trustType, domainID, memberID )+'" title="'+company+'">'+company+'</a></dd>';
            return dd;
        },
		
		getPurchase: function( offerUrl ){
			var dd = '<dd class="book"><a href="'+offerUrl+'" title="立即订购">立即订购>></a></dd>';
			return dd;
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
        getHtmlOfferItem: function( item, length, offer, customize, keywords, feature ){
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
			if ( item == length - 1 ) {
				li.push( '<li><dl class="cell-product-2nd fd-clr last-col">' );
			} else {
				li.push( '<li><dl class="cell-product-2nd fd-clr">' );
			}

            //li.push( this.getHtmlDt( keywords, offer.displayCatIds, offer.id, offer.subject, offer.offerImgURI, imgType ) );
            li.push( this.getHtmlDescription( offerUrl, offer.subject, offer.offerImgURI, customize.imgType, isImgPrivate ) );
            
            li.push( this.getHtmlPrice( customize.priceLabel, offer.currency, offer.price, isPricePrivate ) );
            
            if ( customize.hasQuantity - 0 ){
                li.push( this.getHtmlQuantity( offer.quantityBegin, offer.unit, customize.quantityLabel ) );
            }
            
            if ( customize.hasCompany - 0 ){
                li.push( this.getHtmlCompany( customize.companyLabel, offer.trustType, offer.domainId, offer.memberId, offer.company ) );
            }
			li.push( this.getPurchase( offerUrl ) );
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
                lis.push( this.getHtmlOfferItem( i, offerList.length, offerList[i], customize, config.keywords, config.featureArray ) );
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
                    typeImg = 'opensearch-classic type-img-100';
                    break;
                case 1:
                    typeImg = 'opensearch-classic type-img-150';
                    break;
                case 2:
                    typeImg = 'opensearch-classic type-img-220';
                    break;
                case 3:
                    typeImg = 'opensearch-classic type-img-310';
                    break;
            }
            customize = FD.common.applyIf( customize, this.themeConfig );
            ul.push( '<ul class="list-product '+typeImg+'">' );
            ul.push( this.getHtmlOfferList( result.searchResultList, customize, config ) );
            ul.push( '</ul>' );
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
            $( customize.containerId ).innerHTML = '<div class="opensearch-classic-error">'+txt+'</div>';
        },
        end:0
    };
})( window, FD.sys.opensearch );