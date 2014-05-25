/**
* author: honglun.menghl
* date : 2010-12-27
* 代理加盟专场页面
*/

(function( win, S ){

	S.theme.agency = {
		themeConfig: {
            'hasQuantity': 1,
            'companyLabel': '品牌商：',
            'hasTracelog': 0,
            'tracelogParam':''
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
            var ul = [], typeImg;
            switch( customize.imgType ){
                case 0:
                    typeImg = 'opensearch-basic type-img-100';
                    break;
                case 1:
                    typeImg = 'opensearch-basic type-img-150';
                    break;
                case 2:
                    typeImg = 'opensearch-basic type-img-220';
                    break;
                case 3:
                    typeImg = 'opensearch-basic type-img-310';
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
                url = S.Util.getOfferUrl( customize.urlType, offer.privateInfo, keywords, offer.displayCatIds, offer.id, offer.isEtc, feature );
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
            li.push( this.getHtmlDt( url, offer.subject, offer.offerImgURI, customize.imgType, isImgPrivate ) );
			li.push( this.getBrand ( offer.brief ) );
            li.push( this.getHtmlDescription( url, offer.subject ) );
            //if ( customize.hasCompany - 0 ){
                li.push( this.getHtmlCompany( customize.companyLabel, offer.trustType, offer.domainId, offer.memberId, offer.company ) );
            //}
            li.push( '</dl></li>' );
            return li.join('');
        },
		
		/**
		 * get html dt
		 * @method  getHtmlDt
         * @param   {String} url
         * @param   {String} subject
         * @param   {String} offerImgURI
		 * @param   {Int} image type, 0:100x100,1:150x150,2:220x200,3:310x310
		 * @return  dt & dd.description
		 */
        getHtmlDt: function( url, subject, src, type, isImgPrivate ){
            var dd = '<dt class="vertical-img"><a class="a-img box-img" href="'+url+'" title="'+subject+'"><img src="'+S.Util.getOfferImgUrl( src, type, isImgPrivate )+'" alt="'+subject+'"/></a></dt>';
            return dd;
        },
		
		/**
		* get brand dd
		* @method getBrand
		* @param {string} brief
		*/
		getBrand: function( brief ){
			var brand = brief.split(' ')[0].split(':')[1];
			return '<dd class="price"><em class="value">'+brand+'</em><span class="icon-alliance"></span></dd>';
		},
		
		
		/**
		 * get html dd.description
		 * @method  getHtmlDescription
         * @param   {String} url
         * @param   {String} subject
		 * @return  dd.description
		 */
        getHtmlDescription: function( url, subject ){
            var dd = '<dd class="description"><a href="'+url+'" title="'+subject+'">'+subject+'</a></dd>';
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
		end:0
	}

})(window,FD.sys.opensearch);