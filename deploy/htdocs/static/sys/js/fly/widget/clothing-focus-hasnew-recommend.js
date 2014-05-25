/**
* author honglun.menghl
* date 2010-08-27
* 旺旺中服装行业 pi 页面
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
	S.clothingHasNew = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.clothingHasNew.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
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
	L.extend(S.clothingHasNew,S.AbstractFlyView);
	//接口实例化
	L.augment(S.clothingHasNew,S.InterfaceFlyView);
	
	// getURL , the p4p pay url is the eURL 
	function getURL(offer){
		if(offer.eURL && offer.eURL !== ''){
			return offer.eURL;
		}else{
			return offer.offerDetailUrl;
		}
	}
	
	//方法封装
	L.augmentObject(S.clothingHasNew.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('clothingHasNew');
			this._render();
			//this.cancelLink('#tab-supply .c-f-tab-t a');
			//this._tab();
		},
		
		onFailure:function(){
			this._onFailure();
						
		},
		onTimeout:function(){
			this._onFailure();
		},
		
		_onFailure:function(){
			$('hot-res').innerHTML = '<li style="height:200px; text-align:center; font-size:14px; font-weight:bold;"><p style="margin-top:20px; margin-bottom:8px;">获取商品失败</p><p>请<a href="#" title="刷新" class="refresh-page" onclick="javascript:window.location.reload();">刷新</a>页面重新尝试</p></li>';
		},
		
		_tab:function(){
            var tab = new FD.widget.Tab('tab-supply',{
			tabTitleClass:'c-f-tab-t',
			tabBoxClass:'c-f-tab-b'
			} );
        },
	cancelLink: function( node ){
            var a = $$( node );
            $E.addListener( a, 'click', function(e){
                $E.preventDefault(e);
            });
        },    	
		_render:function(){
			
			var Arrobj=[];
			for(var i=0, l=this.result.data.length; i<l; i++){
				Arrobj = Arrobj.concat(this.result.data[i].offerIds);
			}
			Arrobj = Arrobj.slice(0,6);
			var hotRes = this._renderOfferList(Arrobj);
			$('hot-res').innerHTML = hotRes;
			//this._exposure(Arrobj);
			FD.sys.fly.Utils.exposure(Arrobj,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
			
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
			if(idx ==0 || idx==3){
				offerHtml.push('<ul class="left-one">');
			}else if(idx==2 || idx==5){
				offerHtml.push('<ul class="right-one">')
			}else{
				offerHtml.push('<ul>');
			}
			offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push('<div>');
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push('</div>');
			offerHtml.push('</ul>');
			return offerHtml.join('');
		},
		_renderOfferTitle:function(offer){
			var detailUrl  = getURL(offer);
			var _title = '<a href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(offer.subject,24,'...')+'</a>';
			return _title;
		},
		
		_renderOfferPhoto:function(offer){
			var detailUrl  = getURL(offer);
			var _photo = '<div class="offer-photo"><a class="show-img" href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img onload="resizeImage(this,100,100);" src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/0/operation/yoyo/100x100_1282225415019.png\'"/></a></div>';
			return _photo;
		},
			
	     _renderOfferPrice:function(offer){
             var currency,price;
			 if(offer.rmbPrice !== 0||''){
				currency = '&yen;';
				price = offer.rmbPrice;
			 }else{
				if(offer.foreignCurrency !== ''){
				   currency = '外币价格';
				   price = offer.foreignCurrency;
				}else{
				   currency = '';
				   price = '';
				}
			 }
			 if(currency == '外币价格'){
				var _ddPrice = '<span class="price">' + currency + '</span>';
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