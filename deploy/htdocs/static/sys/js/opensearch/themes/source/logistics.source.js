/**
 * @package opensearch.theme.logistics
 * @import  opensearch
 * @author  Leyteirs Lee 110329
 */

(function( win, S ){
    S.theme.logistics = {
        themeConfig: {
            'hasQuantity': 1,
            'priceLabel': '批发价',
            'companyLabel': '货源：',
            'quantityLabel': '起批量：',
            'hasTracelog': 0,
            'tracelogParam':''
        },
		/**
		 * 取得主营描述
		 * @param {Object} url
		 * @param {Object} subject
		 */
        getHtmlDescription: function( url, subject,companyLabel, trustType, domainID, memberID, company ){
			var cpy=company.cut(35);
			var span =  '<span class="span-1"><a href="'+S.Util.getCompanyUrl( trustType, domainID, memberID )+'" title="'+cpy+'">'+subject.cut(55)+'</a></span>';
            return span;
        },
		/**
		 * 取得公司名称和url
		 * @param {Object} companyLabel
		 * @param {Object} trustType
		 * @param {Object} domainID
		 * @param {Object} memberID
		 * @param {Object} company
		 */
        getHtmlCompany: function( companyLabel, trustType, domainID, memberID, company ){
        	var cpy=company.cut(35);
			var span =  '<span class="span-0"><a href="'+S.Util.getCompanyUrl( trustType, domainID, memberID )+'" title="'+cpy+'">'+cpy+'</a></span>'
			return span;
        },
		/**
		 * 取得所在地
		 * @param {Object} province
		 * @param {Object} city
		 */
		getHtmlCity: function(province,city){
			var span =  '<span class="span-2">'+province+'&nbsp;'+city+'</span>'
            return span;
        },
		/**
		 * 取得列表单项
		 * @param {Object} num
		 * @param {Object} offer
		 * @param {Object} customize
		 * @param {Object} keywords
		 */
        getHtmlOfferItem: function(num,offer, customize, keywords ){
            var li = [], url = S.Util.getOfferSearchUrl( keywords, offer.displayCatIds, offer.id, offer.isEtc ),litext;
            num++;
			if (num == 5){
				litext='<li class="last-row">';
			}else{
				litext='<li>';
			}
			li.push( litext );
            li.push( this.getHtmlCompany( customize.companyLabel, offer.trustType, offer.domainId, offer.memberId, offer.company ) );   
            li.push( this.getHtmlDescription( url, offer.subject, customize.companyLabel, offer.trustType, offer.domainId, offer.memberId, offer.company ) );
			li.push( this.getHtmlCity( offer.province,offer.city ) );
            li.push( '</li>' );
            return li.join('');
        },
		/**
		 * 取得列表
		 * @param {Object} offerList
		 * @param {Object} customize
		 * @param {Object} config
		 */
        getHtmlOfferList: function( offerList, customize, config ){
            var lis = [];
            for ( var i = 0, l = offerList.length, max = config.pagesize; i < l && i < max; i++ ){
                lis.push( this.getHtmlOfferItem( i,offerList[i], customize, config.keywords ) );
            }
            return lis.join('');
        },
		/**
		 * 打点曝光函数
		 * @param {Object} hasTracelog
		 * @param {Object} tracelogParam
		 * @param {Object} containerId
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
		 * 根函数
		 * @param {Object} result
		 * @param {Object} customize
		 * @param {Object} config
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
		 * 错误提示函数
		 * @param {Object} customize
		 * @param {Object} txt
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
        },
        end:0
    };
})( window, FD.sys.opensearch );