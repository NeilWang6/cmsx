/**
 * @package opensearch.theme.agencyjoin
 * @import  opensearch
 * @author  Arcthur
 */
var Paging = function (paging, configs) {
    this.pagination = FYS('li.pagination', paging, true);
    this.pagem = FYS('em', paging, true);
    this.pagenum = FYS('input', paging, true);
    this.pagesubmit = FYS('a.btn-b', paging, true);
    this.configs = configs || {};
};

Paging.prototype = {
    init: function (cur, total) {
        //valid page number
        var pnReg = /^[1-9]\d*$/,
            pnCache = '';

        function vPn() {
            if (this.value) {
                if (pnReg.test(this.value)) {
                    pnCache = this.value;
                } else {
                    this.value = pnCache;
                }
            } else { 
                pnCache = '';
            }
        }
        
        FYE.on(this.pagenum, 'focus', function () {
            this.select();
        });
        
        FYE.on(this.pagenum, 'keydown', function (e, scope) {
            if (e.keyCode && e.keyCode == 13) {
                scope.pagesubmit.click();
                this.select();
            }
        }, this);
        
        FYE.on(this.pagenum, 'keyup', vPn);
        FYE.on(this.pagenum, 'blur', vPn);
        //total page
        this.pagem.innerHTML = total;
        this.pagenum.max = total;
        //jump event handler
        FD.OP.Agencyjoin.makeup.more.pagingSubmit(this.pagesubmit, this);
        //render
        this.render(cur, total);
    },

    /*
    *   creat page info
    *   @param  cur         index of page from 1
    *   @param  total       total page number from 1
    *   @param  pagination  dom that render paging
    */
    render: function (cur, total) {
        if (cur < 1) cur = 1;
        if (total < 1) total = 1;
        if (cur > total) cur = total;
        var html = [],
            pre, next;
        if (cur == 1) {
            html.push('<a class="pre-disabled" href="javascript:;"> </a>');
            html.push('<a class="current" href="javascript:;">1</a>');
        } else {
            html.push('<a class="pre" href="javascript:;" page="' + (cur - 1) + '"> </a>');
            html.push('<a href="javascript:;" page="1">1</a>');
        }
        if (total > 1) {
            if (cur > 4 && total > 7) html.push('<a class="omit" href="javascript:;">...</a>');
            if (cur < 3) {
                pre = 0;
                next = cur == 1 ? 5 : 4;
                if (cur + next > total) next = total - cur;
            } else if (cur == 3) {
                pre = 1;
                next = 3;
                if (cur + next > total) next = total - cur;
            } else {
                pre = 2;
                next = 2;
                if (cur + next > total) next = total - cur;
                pre = 4 - next;
                if (cur + 3 > total) pre++;
                if (cur - pre < 2) pre = cur - 2;
            }

            for (var i = pre; 0 < i; i--) {
                html.push('<a href="javascript:;" page="' + (cur - i) + '">' + (cur - i) + '</a>');
            }
            if (cur > 1) {
                html.push('<a class="current" href="javascript:;">' + cur + '</a>');
            }
            for (var i = 1; i < next + 1; i++) {
                html.push('<a href="javascript:;" page="' + (cur + i) + '">' + (cur + i) + '</a>');
            }
            if (cur + next < total - 1) {
                html.push('<a class="omit" href="javascript:;">...</a>');
                html.push('<a href="javascript:;" page="' + total + '">' + total + '</a>');
            }
            if (cur + next == total - 1) {
                html.push('<a href="javascript:;" page="' + total + '">' + total + '</a>');
            }
        }
        if (cur == total) {
            html.push('<a class="next-disabled" href="javascript:;">下一页</a>');
        }
        else {
            html.push('<a class="next" href="javascript:;" page="' + (cur + 1) + '">下一页</a>');
        }
        this.pagination.innerHTML = html.join('');
        //trigger onRender
        if (this.configs.onRender) this.configs.onRender.call(this);
        //set nomarl
        if (this.pagenum.value && this.pagenum.value * 1 > total) this.pagenum.value = cur;
        FD.OP.Agencyjoin.makeup.more.paging(this.pagesubmit, this, total);
    }
};
 
(function( win, S ){
   
    S.theme.agencyjoin = {
        themeConfig: {
            'hasCompany': 1, //是否有货源, 1: 有, 0: 无
            'hasQuantity': 0, //是否有起批量, 0:无, 1:有
            'priceLabel': '批发价',
            'companyLabel': '货源：',
            'quantityLabel': '起批',
            'hasTracelog': 0, //是否打点, 0:否, 1:是
            'tracelogParam':'', //打点参数
            'urlType':'search', //offer 链接类型, search: 搜索url, detail: detail url
            'callback' : function(){}
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
            li.push( '<li><dl class="cell-product-2nd fd-clr">' );
            //li.push( this.getHtmlDt( keywords, offer.displayCatIds, offer.id, offer.subject, offer.offerImgURI, imgType ) );
            li.push( this.getHtmlDescription( offerUrl, offer.subject, offer.offerImgURI, customize.imgType, isImgPrivate ) );
            
            li.push( this.getHtmlPrice( customize.priceLabel, offer.currency, offer.price, isPricePrivate ) );
            
            if ( customize.hasQuantity - 0 ){
                li.push( this.getHtmlQuantity( offer.quantityBegin, offer.unit, customize.quantityLabel ) );
            }
            
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
            var ul = [], typeImg,
                pageNum = Math.floor(result.searchResultCount / 20);
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
            
            customize.callback(pageNum);
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
            $( customize.containerId ).innerHTML = '<div class="opensearch-agencyjoin-error">'+txt+'</div>';
        },
        end:0
    };
})( window, FD.sys.opensearch );