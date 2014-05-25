/**
 * @version 1.0
 * @author  xuewei.youxw
 * @page http://magma-test.china.alibaba.com:15200/ipush/commodity.html
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
	S.RankTophot = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.RankTophot.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
		this.result = data;
		this.oFlyConfig = oFlyConfig;
		this.oMergedFlyConfig = oMergedFlyConfig;
		/*根据返回的状态，调用不用的函数,当然也可以手动调用*/
		this[callback]();
	};
	//继承父类
	L.extend(S.RankTophot,S.AbstractFlyView);
	//接口实例化
	L.augment(S.RankTophot,S.InterfaceFlyView);
	
	// getURL , the p4p pay url is the eURL 
	function getURL(offer){
		if(offer.eURL && offer.eURL !== ''){
			return offer.eURL;
		}else{
			return offer.offerDetailUrl;
		}
	}
	
	//方法封装
	L.augmentObject(S.RankTophot.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('RankTophot');
			this._renderOfferTab();
			this._render();
			this.cancelLink('#js-tab-2nd .tab-t a');
			this.addOver('tophot-1st');
            this.addOver('tophot-2nd');
            this.addOver('tophot-3rd');
		},
		
        addOver: function( node, over , now){
			var removeNode = $$('#'+node+' li');
		 	over = over || 'over';
				    $E.delegate($(node),'mouseenter', function(e) {
						$D.removeClass(removeNode,over);
						var currentEl = this;
						$D.addClass(currentEl,over);
					},  'li'); 
        },
		
	   cancelLink: function( node ){
            var a = $$( node );
            $E.addListener( a, 'click', function(e){
                $E.preventDefault(e);
            });
        },
		// Modify by honglun.menghl start
		onFailure:function(){
			this._onFailure();
		},
		
		onTimeout:function(){
			this._onFailure();
		},
		
		_onFailure:function(){
			$('tophot-1st').innerHTML = $('tophot-2nd').innerHTML =$('tophot-3rd').innerHTML = '<li style="height:200px; text-align:center; font-size:14px; font-weight:bold;"><p style="margin-top:20px; margin-bottom:8px;">获取商品失败</p><p>请<a href="#" title="刷新" class="refresh-page" onclick="javascript:window.location.reload();">刷新</a>页面重新尝试</p></li>';
		},
		
		// Modify by hongluln.menghl end
		
		_renderOfferTab:function(){
			 for(var i=0,l = this.result.data.length;i<l;i++){
				$('Ttab'+(i+1)).innerHTML = '<a href="#" title="'+this.result.data[i].categoryDesc+'">'+this.result.data[i].categoryDesc+'</a>';
			}
		},

		_renderTabO:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data[0].offerIds.slice(0,10)));
			return _html.join('');
		},
		
		_renderTabTw:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data[1].offerIds.slice(0,10)));
			return _html.join('');
		},
		
		_renderTabTr:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data[2].offerIds.slice(0,10)));
			return _html.join('');
		},
		
		_renderOfferList:function(offerList){
			var offerListHtml = [];
			for(var i=0,l = offerList.length;i<l;i++){
				offerListHtml.push(this._renderOfferItem(offerList[i],i));
			}
			return offerListHtml.join('');
		},
		
		_renderOfferItem:function(offer,idx){
			var offerHtml = [];
			if (idx == 0){
			 offerHtml.push('<li class="over">');
			}else if(idx == 9){
			 offerHtml.push('<li class="last-row">');
			}else{
			offerHtml.push('<li>');
			}
			offerHtml.push('<div class="simple">');
			offerHtml.push('<span class="serial">'+(idx+1)+'</span>');
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push('</div>');
			offerHtml.push('<div class="detail">');
			offerHtml.push('<span class="hover-serial">'+(idx+1)+'</span>');
			offerHtml.push('<dl class="cell-product-3rd">');
			offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push(this._renderHoverOfferPrice(offer));
			offerHtml.push('</dl>');
			offerHtml.push('</div>');
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
			var detailSubject = this._stripBadWord(FD.common.stripTags(offer.subject));
			var _title = '<span class="cont"><a href="'+detailUrl+'" title="'+detailSubject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(detailSubject,20,'...')+'</a></span>';
			return _title;
		},
		
		_renderOfferPhoto:function(offer){
			var detailUrl  = getURL(offer);
			var detailSubject = this._stripBadWord(FD.common.stripTags(offer.subject));
			var _photo = '<dt><a class="atom-img" href="'+detailUrl+'" target="_blank" title="'+detailSubject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img class="img2" src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a></dt><dd class="desc"><a class="desc" href="'+detailUrl+'" title="'+detailSubject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(detailSubject,46,'...')+'</a></dd>';
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
			
		_renderHoverOfferPrice:function(offer){
		var currency = offer.rmbPrice !== 0||'' ? '<span class="cny">&yen;</span>' : offer.foreignCurrency,
            price = offer.rmbPrice !== 0||'' ? offer.rmbPrice : offer.foreignPrice;
		var _ddPrice = '<dd class="price">' + currency + '<em class="value">' + price.toFixed(2) +'</em></dd>';
			return _ddPrice;
		},
		
		_render:function(){
		var TabcontO = this._renderTabO();
		var TabcontTw = this._renderTabTw();
		var TabcontTr = this._renderTabTr();	
		$('tophot-1st').innerHTML = TabcontO;
		$('tophot-2nd').innerHTML = TabcontTw;
		$('tophot-3rd').innerHTML = TabcontTr;
		
		var offerIds = this.result.data[0].offerIds.slice(0,10).concat(this.result.data[1].offerIds.slice(0,10),this.result.data[2].offerIds.slice(0,10));
		//this._exposure(offerIds);
		FD.sys.fly.Utils.exposure(offerIds,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
	
		},
		
		end:0
	},true);
})(window,FD.sys.fly);