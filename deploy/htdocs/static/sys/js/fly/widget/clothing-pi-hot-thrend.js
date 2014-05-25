/**
 * @version 1.0
 * @author  xuewei.youxw
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
		//FD.sys.fly.Utils.log(data);
		//FD.sys.fly.Utils.log(oFlyConfig);
		//FD.sys.fly.Utils.log(oMergedFlyConfig);
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
			this._render();
			this._renderOfferTab();
			this.tab();
			this.cancelLink('#tab-trend .tab-t a');
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
			$('render-2').innerHTML = '<li style="height:200px; text-align:center; font-size:14px; font-weight:bold; color:#000;"><p style="margin-top:20px; margin-bottom:8px;">获取商品失败</p><p>请<a href="#" title="刷新" class="refresh-page" onclick="javascript:window.location.reload();" style="color: rgb(31, 97, 192);">刷新</a>页面重新尝试</p></li>';
		},
        _renderOfferTab:function(){
			$('tab-hot1').innerHTML = '<a href="#" title="'+this.result.data[0].categoryDesc+'">'+this.result.data[0].categoryDesc+'</a>';
			$('tab-hot2').innerHTML = '<a href="#" title="'+this.result.data[1].categoryDesc+'">'+this.result.data[1].categoryDesc+'</a>';
			$('tab-hot3').innerHTML = '<a href="#" title="'+this.result.data[2].categoryDesc+'">'+this.result.data[2].categoryDesc+'</a>';
		},
		
        tab:function(){
            var tab = new FD.widget.Tab('tab-trend',{
                tabTitleClass:'tab-t',  
                tabBoxClass:'tab-b'
            });
        },
        
        cancelLink: function( node ){
            var a = $$( node );
            $E.addListener( a, 'click', function(e){
                $E.preventDefault(e);
            });
        },
		_render:function(){
			var FcatO = this._renderFtab1();
			var FcatTw = this._renderFtab2();
			var FcatTr = this._renderFtab3();
			$('tophot-1st').innerHTML = FcatO;
			$('tophot-2nd').innerHTML = FcatTw;
			$('tophot-3rd').innerHTML = FcatTr;
			var offerIds = this.result.data[0].offerIds.slice(0,10).concat(this.result.data[1].offerIds.slice(0,10),this.result.data[2].offerIds.slice(0,10));
			FD.sys.fly.Utils.exposure(offerIds,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
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
			this.result.data[0].offerIds = this.result.data[0].offerIds.slice(0,10);
			_html.push(this._renderOfferList(this.result.data[0].offerIds));
			return _html.join('');
		},
		
		_renderFtab2:function(){
			var _html = [];
			this.result.data[1].offerIds = this.result.data[1].offerIds.slice(0,10);
			_html.push(this._renderOfferList(this.result.data[1].offerIds));
			return _html.join('');
		},
		
		_renderFtab3:function(){
			var _html = [];
			this.result.data[2].offerIds = this.result.data[2].offerIds.slice(0,10);
			_html.push(this._renderOfferList(this.result.data[2].offerIds));
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
		
	     _renderOfferTitle:function(offer){
			var detailUrl  = getURL(offer);
			var _title = '<span class="cont"><a target="_blank" href="'+detailUrl+'" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(offer.subject,18,'...')+'</a></span>';
			return _title;
		},
		
		_renderOfferPhoto:function(offer){
			var detailUrl  = getURL(offer);
			var _photo = '<dt><a target="_blank" class="atom-img" href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img class="img2" src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a></dt><dd class="desc"><a target="_blank" class="desc" href="'+detailUrl+'" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+offer.subject+'</a></dd>';
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

		_renderFoot:function(){
			return '';
		},
		end:0
	},true);
})(window,FD.sys.fly);