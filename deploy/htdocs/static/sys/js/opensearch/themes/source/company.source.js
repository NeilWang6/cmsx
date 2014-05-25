/*
for:commodity-home
author:hongss
date:2010.12.14
*/
 
(function( win, S ){

    
    S.theme.company = {
        themeConfig: {
            'hasQuantity': 1,
            'priceLabel': '批发价',
            'companyLabel': '货源：',
            'quantityLabel': '起批量：',
            'hasTracelog': 0,
            'tracelogParam':''
        },
		
		/**
		 * get html dd.description
		 * @method  getHtmlDescription
         * @param   {String} url
         * @param   {String} subject
		 * @return  dd.description
		 */
        getHtmlDescription: function( url, subject ){
            var dd = '<dd class="explain">主营：'+subject.cut(24)+'</dd>';
            return dd;
        },
		
		getHtmlCity: function(city){
            var dd = '<dd>所在地区：'+city+'</dd>';
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
             var cpy=company.cut(32);
			var dd = '<dt><a href="'+S.Util.getCompanyUrl( trustType, domainID, memberID )+'" title="'+cpy+'">'+cpy+'</a></dt>';
            return dd;
        },
		/**
		 * get html offer
		 * @method  getHtmlOfferItem
         * @param   {Object} result data
         * //@param   {Int} offer serial number
		 * @param   {Int} image type, 0:100x100,1:150x150,2:220x200,3:310x310
         * @param   {String} keywords
		 * @return  li list
		 */
        getHtmlOfferItem: function(num,offer, customize, keywords ){
            var li = [], url = S.Util.getOfferSearchUrl( keywords, offer.displayCatIds, offer.id, offer.isEtc ),litext;
            num++;
			if (num==7){
				litext='<li class="last-row"><dl>';
			}else{
				litext='<li><dl class="company">';
			}
			li.push( litext );
            li.push( this.getHtmlCompany( customize.companyLabel, offer.trustType, offer.domainId, offer.memberId, offer.company ) );
                       
            li.push( this.getHtmlDescription( url, offer.subject ) );          
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
                lis.push( this.getHtmlOfferItem( i,offerList[i], customize, config.keywords ) );
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
                var a = $$( '#'+containerId+' .list-vertical a' );
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
            var ul = [];            
            customize = FD.common.applyIf( customize, this.themeConfig );
            ul.push( '<ul class="list-vertical">' );
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
            //$( customize.containerId ).innerHTML = '<div class="opensearch-provider-error">'+txt+'</div>';
        },
        end:0
    };
})( window, FD.sys.opensearch );