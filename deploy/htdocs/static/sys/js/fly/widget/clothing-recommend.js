/**
* author honglun.menghl
* date: 2010-08-24
* 服装推荐页面
*/


//是否要开启fly debug
FD.sys.fly.Utils.debug(true);


/**
* 推荐货源区块渲染
*/
(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * 阿里旺旺-猜你喜欢
	 * @param {String} callback 		返回的状态 onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			返回的数据
	 * @param {Object} oFlyConfig 		初始化的配置参数
	 * @param {Object} oMergedFlyConfig	经过mergeed后的配置参数,它跟oFlyConfig不同在于,这个参数就是真正向接口发起请求的所带的参数
	 */
	S.clothingRecommend = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.clothingRecommend.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
		this.result = data;
		this.oFlyConfig = oFlyConfig;
		this.oMergedFlyConfig = oMergedFlyConfig;
		/*根据返回的状态，调用不用的函数,当然也可以手动调用*/
		this[callback]();
	};
	//继承父类
	L.extend(S.clothingRecommend,S.AbstractFlyView);
	//接口实例化
	L.augment(S.clothingRecommend,S.InterfaceFlyView);
	
	// getURL , the p4p pay url is the eURL 
	function getURL(offer){
		if(offer.eURL && offer.eURL !== ''){
			return offer.eURL;
		}else{
			return offer.offerDetailUrl;
		}
	}
	
	//方法封装
	L.augmentObject(S.clothingRecommend.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('clothingRecommend');
			this._renderOfferTab();
			this._render();
			
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
		onFailure:function(){
			this._onFailure();
		},
		
		onTimeout:function(){
			this._onFailure();
		},
		
		onProgress:function(){
			this._onFailure();
		},
		
		_onFailure:function(){
			$('clothing-suggest').innerHTML = '<li style="height:200px; text-align:center; font-size:14px; font-weight:bold;"><p style="margin-top:20px; margin-bottom:8px;">获取商品失败</p><p>请<a href="#" title="刷新" class="refresh-page" onclick="javascript:window.location.reload();">刷新</a>页面重新尝试</p></li>';
			$('clothing-cate').innerHTML = '<span>你是不是想找：</span><a target="_blank" href="http://view.1688.com/cms/shichang/pfjh/cjzg1/200903/index.html" title="厂家直供">厂家直供</a><a href="http://view.1688.com/cms/shichang/pfjh/cjzg1/200903/index.html" title="Top排行榜" target="_blank">Top排行榜</a><a href="http://page.1688.com/shtml/clothing/promo.html" title="商家促销" target="_blank">商家促销</a><a target="_blank" href="http://page.1688.com/jk/index.html" title="全球进口">全球进口</a>';
		},
		
		_renderOfferTab:function(){
		/*
			$('Ttab1').innerHTML = '<a href="#" title="'+this.result.data[0].categoryDesc+'">'+this.result.data[0].categoryDesc+'</a>';
			$('Ttab2').innerHTML = '<a href="#" title="'+this.result.data[1].categoryDesc+'">'+this.result.data[1].categoryDesc+'</a>';
			$('Ttab3').innerHTML = '<a href="#" title="'+this.result.data[2].categoryDesc+'">'+this.result.data[2].categoryDesc+'</a>';
			*/
			var cateName = '<span>你是不是想找：</span>';
			for( var i=0, len= this.result.data.length; i<len; i++){
				cateName +='<a target="_blank" href="http://s.1688.com/search/offer_search.htm?keywords='+this.result.data[i].categoryDesc+'">'+this.result.data[i].categoryDesc+'</a>';
			}
			document.getElementById('clothing-cate').innerHTML=cateName;
		},

		_renderMain:function(){
			var offerIds = [];
			for(var i = 0, l = this.result.data.length; i < l; i++){
				offerIds = offerIds.concat(this.result.data[i].offerIds);
			}

			var offerIds = offerIds.slice(0,20);
			FD.sys.fly.Utils.exposure(offerIds.slice(0,10),{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
			var controls = $$('#goods .control a');
			function more_exposure(){
				//_exposure(offerIds.slice(10,20));
				FD.sys.fly.Utils.exposure(offerIds.slice(10,20),{'ctr_type':'25','page_area':'1015','object_type':'offer'});
				$E.removeListener(controls,'click',more_exposure);
			}
			
			$E.addListener(controls,'click',more_exposure);
			

			return this._renderOfferList(offerIds);
			
		},

		_renderOfferList:function(offerList){
			var offerListHtml = [];
			for(var i=0,l = offerList.length;i<l;i++){
				offerListHtml.push(this._renderOfferItem(offerList[i],i));
			}
			var offerList0 = offerListHtml.slice(0,5);
			var offerList1 = offerListHtml.slice(5,10);
			var offerList2 = offerListHtml.slice(10,15);
			var offerList3 = offerListHtml.slice(15,20);
			var offerListHTML = '<li><table><tbody><tr>'+offerList0.join('')+'</tr><tr>'+offerList1.join('')+'</tr></tbody></table></li><li><table><tbody><tr>'+offerList2.join('')+'</tr></tr>'+offerList3.join('')+'</tr></tbody></table></li>';
			return offerListHTML;
		},
		
		_renderOfferItem:function(offer,idx){
			var offerHtml = [];
			offerHtml.push('<td>');
			offerHtml.push('<div class="pic">');
			offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push('</div>');
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push(this._renderOfferBtn(offer));
			offerHtml.push('</td>');
			return offerHtml.join('');
		},
		
	     _renderOfferTitle:function(offer){
			var detailUrl  = getURL(offer);
			var _title = '<a class="offer-title" href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(offer.subject,14,true)+'<br /></a>';
			return _title;
		},
		
		_renderOfferPhoto:function(offer){
			var detailUrl  = getURL(offer);
			var _photo = '<a href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,1)+'" onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/0/150x150_1281929016314.png\'" width="120" onload="resizeImage(this,120,144);" /></a>';
			return _photo;
		},
			
	     _renderOfferPrice:function(offer){
			var currency,price;
			if(offer.rmbPrice !== 0||''){
				currency = '<span class="fd-cny">&yen;</span>';
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
				var _ddPrice = '<div class="price">' + currency + '</div>';
			}else{
				if(price < 10000 && price !== 0 && price !== ''){
					var _ddPrice = '<div class="price">' + currency + '<em class="value">' + price.toFixed(2) +'/'+offer.unit+'</em></div>';
				}else{
					var _ddPrice = '<div class="price"></div>';
				}
			}
			return _ddPrice;
 
            },
		_renderOfferBtn:function(offer){
			var _detailBtn = '<a target="_blank" href="'+offer.offerDetailUrl+'" class="detail">查看详情</a>';
			return _detailBtn;
		},
	    
		_render:function(){
		var mainContent = this._renderMain();
		$('clothing-suggest').innerHTML = mainContent;

		},
		
		end:0
	},true);
})(window,FD.sys.fly);

/**
* 热销趋势区块渲染
*/

(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * 阿里旺旺-猜你喜欢
	 * @param {String} callback 		返回的状态 onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			返回的数据
	 * @param {Object} oFlyConfig 		初始化的配置参数
	 * @param {Object} oMergedFlyConfig	经过mergeed后的配置参数,它跟oFlyConfig不同在于,这个参数就是真正向接口发起请求的所带的参数
	 */
	S.hotThrend = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.hotThrend.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
		this.result = data;
		this.oFlyConfig = oFlyConfig;
		this.oMergedFlyConfig = oMergedFlyConfig;
		/*根据返回的状态，调用不用的函数,当然也可以手动调用*/
		this[callback]();
	};
	//继承父类
	L.extend(S.hotThrend,S.AbstractFlyView);
	//接口实例化
	L.augment(S.hotThrend,S.InterfaceFlyView);
	
	// getURL , the p4p pay url is the eURL 
	function getURL(offer){
		if(offer.eURL && offer.eURL !== ''){
			return offer.eURL;
		}else{
			return offer.offerDetailUrl;
		}
	}
	
	//方法封装
	L.augmentObject(S.hotThrend.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('hotThrend');
			this._renderOfferTab();
			this._render();
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
		onFailure:function(){
			this._onFailure();
		},
		
		onTimeout:function(){
			this._onFailure();
		},
		
		onProgress:function(){
			this._onFailure();
		},
		
		_onFailure:function(){
			$('tab1').innerHTML = '<div style="text-align:center; font-size:14px; font-weight:bold;"><p style="margin-top:20px; margin-bottom:8px;">获取商品失败</p><p>请<a href="#" title="刷新" class="refresh-page" onclick="javascript:window.location.reload()">刷新</a>页面重新尝试</p></div>';
		},
		
		_renderOfferTab:function(){
			var tabHtml = '<li class="current first" title="'+this.result.data[0].categoryDesc+'">'+FD.sys.fly.Utils.doSubstring(this.result.data[0].categoryDesc,8,false)+'</li><li title="'+this.result.data[1].categoryDesc+'">'+FD.sys.fly.Utils.doSubstring(this.result.data[1].categoryDesc,8,false)+'</li><li title="'+this.result.data[2].categoryDesc+'">'+FD.sys.fly.Utils.doSubstring(this.result.data[2].categoryDesc,8,false)+'</li> ';
			document.getElementById('tab-control').innerHTML= tabHtml;
		},

		_renderMain:function(){
		/*
			var offerIds = [];
			for(var i = 0, l = this.result.data.length; i < l; i++){
				offerIds = offerIds.concat(this.result.data[i].offerIds);
			}
		*/
		var tab0Html = this._renderOfferList(this.result.data[0].offerIds.slice(0,10));
		var tab1Html = this._renderOfferList(this.result.data[1].offerIds.slice(0,10));
		var tab2Html = this._renderOfferList(this.result.data[2].offerIds.slice(0,10));
		$('thrend-tab-0').innerHTML = tab0Html;
		$('thrend-tab-1').innerHTML = tab1Html;
		$('thrend-tab-2').innerHTML = tab2Html;
		var offerIds = this.result.data[0].offerIds.slice(0,10).concat(this.result.data[1].offerIds.slice(0,10),this.result.data[2].offerIds.slice(0,10));
		//this._exposure(offerIds); //曝光
		FD.sys.fly.Utils.exposure(offerIds,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
	
			//return this._renderOfferList(offerIds);
			//return _html.join('');
			
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
			if(idx==0){
				offerHtml.push('<li class="hover">');
			}else{
				offerHtml.push('<li>');
			}
			offerHtml.push('<div class="def">');
			offerHtml.push(this._renderOfferTitleShort(offer));
			offerHtml.push(this._renderOfferTitleLong(offer));
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push('</div>');
			offerHtml.push('<div class="ext">');
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push('</div>');
			offerHtml.push('</li>');
			return offerHtml.join('');
		},
		
	     _renderOfferTitleShort:function(offer){
			var detailUrl  = getURL(offer);
			var _title = '<a class="s" href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(offer.subject,20,true)+'</a>';
			return _title;
		},
		_renderOfferTitleLong:function(offer){
			var detailUrl  = getURL(offer);
			var _title = '<a class="l" href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(offer.subject,30,true)+'</a>';
			return _title;
		},
		_renderOfferPhoto:function(offer){
			var detailUrl  = getURL(offer);
			var _photo = '<a href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,1)+'" onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/0/150x150_1281929016314.png\'" width="120" onload="resizeImage(this,120,144);" /></a>';
			return _photo;
		},
			
	     _renderOfferPrice:function(offer){
		 
			var currency,price;
			if(offer.rmbPrice !== 0 && offer.rmbPrice !==''){
				currency = '<span class="fd-cny">&yen;</span>';
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
				var _ddPrice = '<span class="price">' + currency + '</span>';
			}else{
				if(price < 10000 && price !== 0 && price !== ''){
					var _ddPrice = '<span class="price">' + currency + '<em class="value">' + price.toFixed(2) +'/'+offer.unit+'</em></span>';
				}else{
					var _ddPrice = '';
				}
			}
				return _ddPrice;
			
            //var currency = offer.rmbPrice !== 0||'' ? '<span class="fd-cny">&yen;</span>' : offer.foreignCurrency,
            //price = offer.rmbPrice !== 0||'' ? offer.rmbPrice : offer.foreignPrice;
        	//var _ddPrice = '<span class="price">' + currency + '<em class="value">' + price.toFixed(2) +'/'+offer.unit+'</em></span>';
            //   return _ddPrice;
            },
		_renderOfferBtn:function(offer){
			var _detailBtn = '<a target="_blank" href="'+offer.offerDetailUrl+'" class="detail">查看详情</a>';
			return _detailBtn;
		},
	    
		_render:function(){
		var mainContent = this._renderMain();
		//$('clothing-suggest').innerHTML = mainContent;
		sideTabInit() 
		},
		
		end:0
	},true);
})(window,FD.sys.fly);