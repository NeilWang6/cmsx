/**
 * @package FD.sys.opensearch
 * @import  FD.get
 * @author  Edgar Hoo <mail@edgarhoo.net>
 * @version 0.3.100808
 * @version 0.3.101103
 * @version 0.3.101111
*/
FDEV.namespace( 'FD.sys.opensearch' );
(function( win, S ){

    // defines open search interface url
    S.ApiConfig = {
        //'searchApi':'http://service.s.1688.com/search/json_viewer.htm',
        'searchApi':'http://service.s.1688.com/rpc/offer/getRemoteOffer.xhtml',
        defaultParams: {
            'fromId': 'opensearch',
            'search_type': 'offer',
            'type': 'sale',
            'keywords': '',
            'imageFlag': 1,
            'onlyAlipay': 1,
            'onlineStatus': 'all',
            'onlyWithPrice': true,
            'distinctField': 'userid',
            'distinctCount': 1,
            'mlr': true,
            'pagesize': 5
        },
        end:0
    };
    
    // defines public method
    S.Util = {
		/**
		 * firebug log
		 * @method  log
		 * @param   {String} message
		 * @param   {String} firebug message status
		 * @return  firebug log
		 */
        log: function( msg, status ){
            if ( win['console'] !== undefined && console.info ){
                console[ status && console[status] ? status : 'info'](msg);
            }
        },
		/**
		 * fixed the bug of number.fixed on IE
		 * @method  toFixed
		 * @param   {Int} value
		 * @param   {Int} fraction digits
		 * @return  value.toFixed
		 */
        toFixed: function( value, fractionDigits ){
            var pre = Math.pow( 10, fractionDigits || 0 );  
            value *= pre;  
            value = value.toFixed( fractionDigits );  
            value = Math.round( value );  
            value /= pre;  
            return value.toFixed( fractionDigits );
        },
		/**
		 * resize image
		 * @method  resizeImage
		 * @param   {Object} image
		 * @param   {Int} width
		 * @param   {Int} height
		 * @return  image
		 */
        resizeImage: function( img, w, h ){
            img.removeAttribute( 'width' );
            img.removeAttribute( 'height' );
            var pic;
            if( window.ActiveXObject ){
                pic = new Image();
                pic.src = img.src;
            } else pic = img;
            if( pic && pic.width && pic.height && w ){
                if( !h ) h = w;
                if( pic.width > w || pic.height > h ) {
                    var scale = pic.width/pic.height, fit = scale >= w/h;
                    if( window.ActiveXObject ) img = img.style;
                    img[ fit ? 'width' : 'height' ] = fit ? w : h ;
                    if( window.ActiveXObject ) img[ fit ? 'height' : 'width' ] = ( fit ? w : h ) * ( fit ? 1/scale : scale );
                }
            }
        },
		/**
		 * get offer detail url
		 * @method  getOfferDetailUrl
		 * @param   {Int} offerId
		 * @return  offer detail url
		 */
        getOfferDetailUrl: function( id ){
            if ( id !== '' ){
                return 'http://detail.1688.com/buyer/offerdetail/'+id+'.html';
                //return url;
            }
        },
		/**
		 * get offer search url
		 * @method  getOfferSearchUrl
         * @param   {String} keywords
         * @param   {String} displayCatIds
		 * @param   {Int} offerId
         * @param   {Boolean} isEtc
         * @param   {String} feature
		 * @return  offer search url
		 */
        getOfferSearchUrl: function( kwd, catIds, id, isEtc, feature ){
            var k = '', c = '', category = '', etc = '', f = '';
            if ( typeof kwd === 'string' && kwd !== '' ){
                k = 'k-'+kwd;
            }
            if ( typeof catIds === 'string' && catIds !== '' ){
                category  = catIds.split(' ');
                if( category.length >= 1 ){
                    c = 'c-'+category[0]+'_';
                }
            }
            if ( typeof isEtc === 'boolean' && isEtc ){
                etc = 'entrance-etc_';
            }
            if ( typeof feature === 'string' && feature !== '' ){
                f = '_f-'+feature.replace( '_', ':' );
            }
            if ( k !== '' || c !== '' ){
                return 'http://s.1688.com/business/'+k+'_'+c+'p-1'+f+'_fromOfferId-'+id+'_'+etc+'n-y.html';
            } else {
                return this.getOfferDetailUrl( id );
            }
            //return url;
        },
		/**
		 * get offer url
		 * @method  getOfferUrl
         * @param   {String} urlType
		 * @param   {Int} privateInfo
         * @param   {String} keywords
         * @param   {String} displayCatIds
		 * @param   {Int} id/offerId
         * @param   {Boolean} isEtc
         * @param   {String} featureArray
		 * @return  offer url
		 */
        getOfferUrl: function( urlType, privateInfo, kwd, catIds, id, isEtc, feature ){
            var url;
            if ( privateInfo || urlType === 'detail' ){
                url = this.getOfferDetailUrl( id );
            } else {
                url = this.getOfferSearchUrl( kwd, catIds, id, isEtc, feature );
            }
            return url;
        },
		/**
		 * get offer image url
		 * @method  getOfferImgUrl
         * @param   {String} offerImgURI
		 * @param   {Int} image type, 0:100x100,1:150x150,2:220x200,3:310x310
		 * @param   {Boolean} isImgPrivate
		 * @return  image url
		 */
        getOfferImgUrl: function( src, type, isImgPrivate ){
            var type = type || 0,
                privateImg = [
                    'http://img.china.alibaba.com/images/sys/lock/100x100.jpg',
                    'http://img.china.alibaba.com/images/sys/lock/150x150.jpg',
                    'http://img.china.alibaba.com/images/sys/lock/220x220.jpg',
                    'http://img.china.alibaba.com/images/sys/lock/310x310.jpg'
                ],
                noImg = [
                    'http://img.china.alibaba.com/images/cn/p4p/nopic_100x100.gif',
                    'http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif',
                    'http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif',
                    'http://img.china.alibaba.com/images/cn/market/trade/list/070423/nopic150.gif'
                ];
            if ( isImgPrivate && isImgPrivate !== 2 ){
                return privateImg[type];
            }
			if( src === '' ){
				return noImg[type];
			}
			if( src && src.indexOf('http') ){
				src ='http:\/\/'+src;
			}
			var imgType = [ '.summ.jpg','.search.jpg','.220x220.jpg','.310x310.jpg' ];
			return src + imgType[type];
        },
		/**
		 * get company url
		 * @method  getCompanyUrl
         * @param   {String} trustType
         * @param   {String} domainId
         * @param   {String} memberId
		 * @return  winport url
		 */
        getCompanyUrl: function( trustType, domainID, memberID ){
            if ( trustType === '1' || trustType === '2' ){
                if ( domainID !== '' ){
                    return 'http://'+domainID+'.cn.1688.com';
                }else{
                    return 'http://'+memberID+'.cn.1688.com';
                }
            } else {
                return 'http://company.1688.com/athena/'+memberID+'.html';
            }
        },
		/**
		 * to do tracelog
		 * @method  tracelog
         * @param   {String} tracelog param
		 * @return  set tracelog
		 */
        tracelog: function( txt ){
            function baseClick(url,param){
                if (typeof window.dmtrack != "undefined") {
                    dmtrack.clickstat(url, param);
                } else {
                    var d = new Date();
                    if (document.images) {
                        (new Image).src = url + param+'&time='+d.getTime();
                    }
                }
                return true;
            }
            return baseClick( 'http://stat.1688.com/tracelog/click.html', '?tracelog='+txt );
        },
        end:0
    };
    
    // theme
    S.theme = {};
    
    /**
     * open search module
     * @param   {Object} open search config 接口配制
     * @param   {Object} app customize 应用配制
     * @param   {Object} open search app 应用类
     */
    S.OpenSearchModule = function( openSearchConfig, appCustomize, openSearchApp ){
        this.openSearchConfig = FD.common.applyIf( openSearchConfig, S.ApiConfig.defaultParams );
        this.appCustomize = appCustomize;
        this.openSearchApp = openSearchApp = function( callback, data, openSearchConfig, appCustomize ){
            this.result = data || {};
            this.openSearchConfig = openSearchConfig;
            this.appCustomize = appCustomize;
            this.appCustomize.imgType = ( this.appCustomize.imgType && ( this.appCustomize.imgType - 0 ) < 4 ) ? ( this.appCustomize.imgType - 0 ) : 1;
            if( this.appCustomize.theme && S.theme[this.appCustomize.theme] && typeof S.theme[this.appCustomize.theme] === 'object'  ){
                if ( this.appCustomize.containerId && $( this.appCustomize.containerId ) ){
                    this[callback]();
                } else{
                    S.Util.log( 'missing containerId!', 'warn' );
                }
            } else{
                S.Util.log( 'missing theme: '+this.appCustomize.theme+'!', 'warn' );
            }
        }
        this.load();
        this.openSearchApp.prototype = {
            onSuccess: function(){
                if ( !FDEV.lang.isObject( this.result ) ) return;
                if ( this.result.searchResultCount !== 0 && this.result.searchResultList.length !== 0 ){
                    S.theme[this.appCustomize.theme].getHtmlRoot( this.result, this.appCustomize, this.openSearchConfig );
                } else {
                    this.onFailure();
                }
            },
            onFailure: function(){
                S.theme[this.appCustomize.theme].getErrorTips( this.appCustomize, 'failure' );
            },
            onTimeout: function(){
                S.theme[this.appCustomize.theme].getErrorTips( this.appCustomize, 'timeout' );
            },
            onProgress: function(){
                S.theme[this.appCustomize.theme].getErrorTips( this.appCustomize, 'progress' );
            },
            end:0
        };
	};	
    
    S.OpenSearchModule.prototype = {
            load: function(){
                var url = this.getLoadUrl();
                var callback = {
                    onSuccess: this.onSuccess,
                    onFailure: this.onFailure,
                    onTimeout: this.onTimeout,
                    onProgress: this.onProgress,
                    scope:this,
                    timeout: 5000,
                    charset: 'gb2312',
                    data:{}
                };
                var setRequest = FDEV.util.Get.script( url, callback ); // set request
            },
            getLoadUrl: function(){
                var api = S.ApiConfig.searchApi+'?'+this.getParamsString();
                return api;
            },
            getParamsString: function(){
                var openSearchParam = this.openSearchConfig, paramsList = [];
                for( var i in openSearchParam ){
                    paramsList.push( i+'='+openSearchParam[i]);
                }
                return paramsList.join('&');
            },
            onSuccess: function(){
                var openSearchResult = {};
                    openSearchResult = window[this.openSearchConfig.returnJsonObjectName];
                this.toDo( 'onSuccess', openSearchResult );
            },
            onFailure: function(){
                this.toDo( 'onFailure', {} );
            },
            onTimeout: function(){
                this.toDo( 'onTimeout', {} );
            },
            onProgress: function(){
                this.toDo( 'onProgress', {} );
            },
            toDo: function( callback, data ){
                new this.openSearchApp( callback, data, this.openSearchConfig, this.appCustomize );
            },
            end:0
    };
    
    // new open search app
	S.Ao = function( openSearchConfig, appCustomize ){
		var _this = this;
		if( !( _this instanceof arguments.callee ) ){
			return new arguments.callee( openSearchConfig, appCustomize );
		}
		return {
			use: function( openSearchApp ){
					new S.OpenSearchModule( openSearchConfig, appCustomize, openSearchApp );
			},
			end:0
		};
	};
    
    
})( window, FD.sys.opensearch );
