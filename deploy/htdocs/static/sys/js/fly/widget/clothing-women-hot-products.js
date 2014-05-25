/**
 * @version 1.0
 * @author  hongss
 * Date     Sept 19, 2010
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
	S.hotProduct = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.hotProduct.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
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
	L.extend(S.hotProduct,S.AbstractFlyView);
	//接口实例化
	L.augment(S.hotProduct,S.InterfaceFlyView);
	
	//方法封装
	L.augmentObject(S.hotProduct.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('hotProduct');
			this._render();
		},
		 /*addOver: function( node, over , now){
			var removeNode = $$('#'+node+' li');
		 	over = over || 'over';
				    $E.delegate($(node),'mouseenter', function(e) {
						$D.removeClass(removeNode,over);
						var currentEl = this;
						$D.addClass(currentEl,over);
					},  'li'); 
        }, */
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
			$('hot-ranking').innerHTML = '<li style="height:200px; text-align:center; font-size:14px; font-weight:bold; color:#000;"><p style="margin-top:20px; margin-bottom:8px;">获取商品失败</p><p>请<a href="#" class="refresh-page" onclick="javascript:window.location.reload();" style="color: rgb(31, 97, 192);">刷新</a>,重新尝试</p></li>';
		},
		_render:function(){
			var items = $$('#hot-ranking .f-tab-t'),
			contentBox = $$('#hot-ranking .f-tab-b'),
			offerIds = [];
			for (var i=0; i<this.result.data.length; i++) {
				if (items[i]) {
					items[i].innerHTML = this.result.data[i].categoryDesc;
				}
				
				var strHTML = '<ol class="list-order">',
				data = this.result.data[i].offerIds;
				offerIds = offerIds.concat(data);
				for (var j=0; j<data.length; j++) {
					var strPrice = (data[j].rmbPrice==='') ? '外币价格': '<span class="fd-cny">&yen;</span><em class="value">'+data[j].rmbPrice+'</em>',
					strUrl = (data[j].eURL=='') ? data[j].offerDetailUrl : data[j].eURL;
					
					strHTML += '<li><dl class=\"cell-product-3rd\"><dt><a class=\"a-img\" href=\"'+strUrl
							 + '\" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''
							 + data[j].offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+data[j].alg
							 + '\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})" title=\"'+data[j].subject+'\"><img alt="'
							 + data[j].subject+'" src="'+FD.sys.fly.Utils.getOfferImageURL(data[j].offerImageUrl,0)
							 + '" onerror="javascript:this.src=\'http://img.china.alibaba.com/images/app/operation/global/nopic/nopic-100x100.png\'" />'
							 + '</a><span class="num-'+(j+1)+'">'+(j+1)+'</span></dt><dd class="description"><a href=\"'+strUrl
							 + '\" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''
							 + data[j].offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+data[j].alg
							 + '\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})" title=\"'+data[j].subject+'\" >'
							 + FD.sys.fly.Utils.doSubstring(data[j].subject,34,'...')+'</a></dd><dd class="price">'+strPrice
							 + '</dd><dd class="sale-total"></dd><dd class="company">'
							 //+ '</dd><dd class="sale-total">已批<em class="value">'+data[j].offerSaleCnt+ '</em>件</dd><dd class="company">'
							 +data[j].company+'<span class="icon-integrity">诚</span></dd></dl></li>';
					
				}
				strHTML += '</ol>';
				if (contentBox[i]) {
					contentBox[i].innerHTML = strHTML;
				}
			}
			FD.sys.fly.Utils.exposure(offerIds,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
		},

		end:0
	},true);
})(window,FD.sys.fly);