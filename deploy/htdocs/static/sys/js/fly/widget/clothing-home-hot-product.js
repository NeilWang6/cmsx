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
	
	//方法封装
	L.augmentObject(S.RankTophot.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('RankTophot');
			this._render();
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
			$('js-marquee').innerHTML = '<li style="height:200px; text-align:center; font-size:14px; font-weight:bold; color:#000;"><p style="margin-top:20px; margin-bottom:8px;">获取商品失败</p><p>请<a href="#" title="刷新" class="refresh-page" onclick="javascript:window.location.reload();" style="color: rgb(31, 97, 192);">刷新</a>页面重新尝试</p></li>';
		},
		_render:function(){
			var offerIds = [];
			for (var i=0; i<this.result.data.length; i++) {
				var strHTML = '<ul class="list-txt">',
				data = this.result.data[i].offerIds;
				offerIds = offerIds.concat(data);
				for (var j=0; j<data.length; j++) {
					var strPrice = (data[j].rmbPrice==='') ? '外币价格' : '<span class="fd-cny">&yen;</span><em class="value">'+data[j].rmbPrice+'</em>',
                    detailUrl =  ( data[j].eURL !== '' ) ? data[j].eURL : data[j].offerDetailUrl;
					
					strHTML += '<li><dl><dt class="description"><a href=\"'+detailUrl
							 + '\" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''
							 + data[j].offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+data[j].alg
							 + '\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})" title=\"'+data[j].subject+'\" >'
							 + FD.sys.fly.Utils.doSubstring(data[j].subject,30,'...')+'</a></dt><dd class="price">'+strPrice
							 + '</dd></dl></li>';
							 //+ '</dd><dd class="sale-total">成交<em>'+data[j].offerSaleCnt+'</em>件</dd></dl></li>';
				}
				strHTML += '</ul>';
			}
			$('js-marquee').innerHTML = strHTML;
			
			var marquee = new FD.widget.Marquee('js-marquee',{direction: 'up', liLength:44});
			$E.on('js-marquee-up', 'click', function(e){
				$E.preventDefault(e);
				marquee.getPre();
			});
			$E.on('js-marquee-dn', 'click', function(e){
				$E.preventDefault(e);
				marquee.getNext();
			});
			
			FD.sys.fly.Utils.exposure(offerIds,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
		},
		
		end:0
	},true);
})(window,FD.sys.fly);