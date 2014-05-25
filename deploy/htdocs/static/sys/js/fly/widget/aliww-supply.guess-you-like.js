/**
 * @version 1.0
 * @author  xuewei.youxw
 * @page http://magma-test.china.alibaba.com:15200/offer/showPrdtDefPage.htm
 * Date     Aug 27, 2010
 */

//是否要开启fly debug
FD.sys.fly.Utils.debug(false);

(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * 阿里旺旺-猜你喜欢
	 * @param {String} callback 		返回的状态 onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			返回的数据
	 * @param {Object} oFlyConfig 		初始化的配置参数
	 * @param {Object} oMergedFlyConfig	经过mergeed后的配置参数,它跟oFlyConfig不同在于,这个参数就是真正向接口发起请求的所带的参数
	 */
	S.AliwwTab = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.AliwwTab.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
		this.result = data;
		this.oFlyConfig = oFlyConfig;
		this.oMergedFlyConfig = oMergedFlyConfig;
		/*根据返回的状态，调用不用的函数,当然也可以手动调用*/
		this[callback]();
	};
	//继承父类
	L.extend(S.AliwwTab,S.AbstractFlyView);
	//接口实例化
	L.augment(S.AliwwTab,S.InterfaceFlyView);
	
	// getURL , the p4p pay url is the eURL 
	function getURL(offer){
		if(offer.eURL && offer.eURL !== ''){
			return offer.eURL;
		}else{
			return offer.offerDetailUrl;
		}
	}
	
	//方法封装
	L.augmentObject(S.AliwwTab.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('AliwwTab');
			this._render();
			this.cancelLink('#tab-supply .c-f-tab-t a');
			this._tab();
		},
		
		onFailure:function(){
			this._onFailure();
		},
		
		onTimeout:function(){
			this._onFailure();
		},
		
		_onFailure:function(){
			$('tab-supply').innerHTML = '<p style="width:210px;height:120px;margin: 80px auto 50px 0px;text-align:center;font-size:14px; font-weight:bold;">获取推荐商品失败<br />请<a href="#" target="_self" style="color:#1f61c0">刷新</a>页面重新尝试</p>';
		},
		
		_tab:function(){
            var tab = new FD.widget.Tab('tab-supply',{
                tabTitleClass:'c-f-tab-t',
                tabBoxClass:'c-f-tab-b'
			});
        },
		
		cancelLink: function( node ){
            var a = $$( node );
            $E.addListener( a, 'click', function(e){
                $E.preventDefault(e);
            });
        }, 
		
		_render:function(){
            var len = this.result.data.length;
            if (len > 8) {
                var FcatO = this._renderFtab1();
                var FcatTw = this._renderFtab2();
                var FcatTr = this._renderFtab3();
                $('tab-1st').innerHTML = FcatO;
                $('tab-2nd').innerHTML = FcatTw;
                $('tab-3rd').innerHTML = FcatTr;
            } else if (len > 4) {
                var FcatO = this._renderFtab1();
                var FcatTw = this._renderFtab2();
                $('tab-1st').innerHTML = FcatO;
                $('tab-2nd').innerHTML = FcatTw;
                $D.removeClass($('.c-f-tab-b')[2], 'c-f-tab-b');
                $D.addClass($$('.c-f-tab-t')[2], 'hide');
            } else {
                var FcatO = this._renderFtab1();
                $('tab-1st').innerHTML = FcatO;
                $D.removeClass($$('#tab-supply div')[1], 'c-f-tab-b');
                $D.removeClass($$('#tab-supply div')[2], 'c-f-tab-b');
                $D.addClass($$('.c-f-tab-t')[1], 'hide');
                $D.addClass($$('.c-f-tab-t')[2], 'hide');
            }
			
			FD.sys.fly.Utils.exposure(this.result.data.slice(0,len),{
                'ctr_type':this.oFlyConfig.coaseType,
                'page_area':this.oFlyConfig.recid,
                'object_type':'offer'
            });
		},
        
		_exposure : function(offerIds){ //曝光
			var exposureStr = '';
			for(var i = 0, l = offerIds.length; i < l; i++){
				exposureStr+=offerIds[i].offerId+','+offerIds[i].alg+';';
			}
			
			exposureStr = exposureStr.slice(0,-1);
			YAHOO.util.Get.script('http://ctr.1688.com/ctr.html?ctr_type='+this.oFlyConfig.coaseType+'&page_area='+this.oFlyConfig.recid+'&object_type=offer&object_ids='+exposureStr+'&time='+(+new Date()),{});
		},
		
		_renderFtab1:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data.slice(0,4)));
			return _html.join('');
		},
		
		_renderFtab2:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data.slice(4,8)));
			return _html.join('');
		},
		
		_renderFtab3:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data.slice(8,12)));
			return _html.join('');
		},
		
		_renderOfferList:function(offerList){
			var offerListHtml = [];
			//最多显示5个
			var maxItemLength = parseInt(this.oFlyConfig.count)||5;
			for(var i=0,l = offerList.length;i<l&&i<maxItemLength;i++){
				offerListHtml.push(this._renderOfferItem(offerList[i],i));
			}
			return offerListHtml.join('');
		},
		
		_renderOfferItem:function(offer,idx){
			var offerHtml = [];
			offerHtml.push('<li>');
			offerHtml.push('<dl class="cell-product-2nd">');
			offerHtml.push('<dt>');
			offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push('</dt>');
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push('</dl>');
			offerHtml.push('</li>');
			return offerHtml.join('');
		},
		
		//非法用词表
		_stripBadWord:function(str){
			var re = />|<|'|"/gi;
			return str.replace(re,function(word){
				return word.replace(/./g,"")
			});
		},
		
		_renderOfferTitle:function(offer){
			var detailUrl  = getURL(offer);
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var detailSubject = this._stripBadWord(FD.common.stripTags(offer.subject));
			var _title = '<dd class="description"><a href="'+detailUrl+'" target="_blank" title="'+detailSubject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(detailSubject,50,'...')+'</a></dd>';
			return _title;
		},
		
		_renderOfferPhoto:function(offer){
			var detailUrl  = getURL(offer);
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var detailSubject = this._stripBadWord(FD.common.stripTags(offer.subject));
			var _photo = '<a class="a-mix" href="'+detailUrl+'" target="_blank" title="'+detailSubject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/0/operation/yoyo/100x100_1282225415019.png\'"/></a>';
			return _photo;
		},
			
	     _renderOfferPrice:function(offer){
			var currency,price;
			if(offer.rmbPrice !== 0||''){
				currency = '<span class="cny">&yen;</span>';
				price = offer.rmbPrice;
			}else{
				if(offer.foreignCurrency !== ''){
					currency = '<span class="value">外币价格</span>';
					price = offer.foreignCurrency;
				}else{
					currency = '';
					price = '';
				}
			}
			if(currency == '<span class="value">外币价格</span>'){
				var _ddPrice = '<dd class="price">' + currency + '</dd>';
			}else{
				if(price < 10000 && price !== 0 && price !== ''){
					var _ddPrice = '<span class="price">' + currency + '<em class="value">' + price.toFixed(2) +'</em></span>';
				}else{
					var _ddPrice = '';
				}
			}
                return _ddPrice;
            },
		_renderFoot:function(){
			return '';
		},
		end:0
	},true);
})(window,FD.sys.fly);