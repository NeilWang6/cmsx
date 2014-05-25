//是否要开启fly debug
FD.sys.fly.Utils.debug(false);

(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * workplace-为你推荐
	 * @param {String} callback 		返回的状态 onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			返回的数据
	 * @param {Object} oFlyConfig 		初始化的配置参数
	 * @param {Object} oMergedFlyConfig	经过mergeed后的配置参数,它跟oFlyConfig不同在于,这个参数就是真正向接口发起请求的所带的参数
	 */
	S.WorkplaceRecommend = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.WorkplaceRecommend.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
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
	L.extend(S.WorkplaceRecommend,S.AbstractFlyView);
	//接口实例化
	L.augment(S.WorkplaceRecommend,S.InterfaceFlyView);
	
	//方法封装
	L.augmentObject(S.WorkplaceRecommend.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('WorkplaceRecommend');
			this._render();
		},
		onFailure:function(){
/*
			var str = '<dl class="borr-1 nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/421720919.html" title="潘多拉项链"><img src="http://img.china.alibaba.com/img/offer/42/17/20/91/9/421720919.310x310.jpg" alt="潘多拉项链" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/421720919.html" title="潘多拉项链"><span>潘多拉项链</span></a></dt></dl>';
				str += '<dl class="borr-1 nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/395062075.html" title="真皮手腕带"><img src="http://img.china.alibaba.com/img/offer/39/50/62/07/5/395062075.310x310.jpg" alt="真皮手腕带" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/395062075.html" title="真皮手腕带"><span>真皮手腕带</span></a></dt><dd class="product-a-icon"><span class="icon-pi">批</span><span class="cny">&yen;</span><span class="price-num b">20.00</span></dd></dl>';
				str += '<dl class="nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/594913961.html" title="美臀坐垫（茶色）"><img src="http://img.china.alibaba.com/img/offer2/2009/913/961/594913961_72b793a181ce4d2b0d70641ac65f33df.310x310.jpg" alt="美臀坐垫（茶色）" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/594913961.html" title="美臀坐垫（茶色）"><span>美臀坐垫（茶</span></a></dt><dd class="product-a-icon"><span class="icon-pi">批</span><span class="cny">&yen;</span><span class="price-num b">141.00</span></dd></dl>';
				str += '<dl class="borr-1 nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/543065546.html" title="椰壳手表"><img src="http://img.china.alibaba.com/img/offer/54/30/65/54/6/543065546.310x310.jpg" alt="椰壳手表" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/543065546.html" title="椰壳手表"><span>椰壳手表</span></a></dt></dl>';
				str += '<dl class="borr-1 nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/74101727.html" title="贝壳袖扣"><img src="http://img.china.alibaba.com/img/offer/74/10/17/27/74101727.310x310.jpg" alt="贝壳袖扣" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/74101727.html" title="贝壳袖扣"><span>贝壳袖扣</span></a></dt></dl>';
				str += '<dl class="nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/609262869.html" title="时尚复古异族手镯"><img src="http://img.china.alibaba.com/news/upload/00000000000/tj-6_1265175159668.png" alt="时尚复古异族手镯" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/609262869.html" title="时尚复古异族手镯"><span>时尚复古异族手</span></a></dt></dl>';
			
*/
			var str ='<div class="recommend-noinfo">获取推荐信息失败，请<a href="#" id="btn-refresh">刷新</a>页面重新尝试</div>';
			$('recommend-box').innerHTML = str;
			this.refreshData();
		},
		onTimeout:function(){
			//do nothing
		},
		onProgress:function(){
			//do nothing
		},
			
		_render:function(){
			
			var html = [];
			html.push(this._renderHead());
			html.push(this._renderBody());
			html.push(this._renderFoot());			
			if($(this.oFlyConfig.flyWidgetId)){
				$(this.oFlyConfig.flyWidgetId).innerHTML = html.join('');
			}
		},
		_renderHead:function(){
			return '';
		},
		_renderBody:function(){
			
			var _html = [];
			_html.push(this._renderOfferList(this.result.data));
			return _html.join('');
		},
		_renderOfferList:function(offerList){
			
			var offerListHtml = [];
			//最多显示5个
			var maxItemLength = 8;
			//parseInt(this.oFlyConfig.count)||5
			for(var i=0,l = offerList.length;i<l&&i<maxItemLength;i++){
				offerListHtml.push(this._renderOfferItem(offerList[i],i));
			}
			return offerListHtml.join('');
		},
		_renderOfferItem:function(offer,idx){
			var offerHtml = [];
			if((idx+1)%3 != 0){
				offerHtml.push('<dl class="borr-1 nomargin">');
			}
			else{
				offerHtml.push('<dl class="nomargin">');
			}
			offerHtml.push('<dt>');
			offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push('</a>');
			offerHtml.push('</dt>');
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push('</dl>');
			return offerHtml.join('');
		},
		_renderOfferTitle:function(offer){
			var detailUrl  = offer.offerDetailUrl;
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var _title = '<a href="'+detailUrl+'" target="_blank" title="'+offer.subject+'"><span>'+FD.sys.fly.Utils.doSubstring(offer.subject,12,false)+'</span></a>';
			return _title;
		},
		_renderOfferPhoto:function(offer){
			var detailUrl  = offer.offerDetailUrl;
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var _photo = '<a class="img-box" href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'"  width=\'80\' height=\'80\'  onload="FD.sys.fly.Utils.resizeImage(this,80,80)" onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a>';
			return _photo;
		},
			
	     _renderOfferPrice:function(offer){
		 	var currency,price;
			var iconpi = '<span class="icon-pi">批</span>';
			if(offer.rmbPrice !== 0||''){
				currency = '<span class="cny">&yen;</span>';
				price = offer.rmbPrice;
			}else{
				if(offer.foreignCurrency !== ''){
					currency = '<span>外币价格</span>';
					price = offer.foreignCurrency;
				}else{
					currency = '';
					price = '';
				}
			}
			if(currency == '<span>外币价格</span>'){
				var _ddPrice = '<dd class="product-a-icon">' + currency + '</dd>';
			}else{
				if(price < 10000 && price !== 0 && price !== ''){
					var _ddPrice = '<dd class="product-a-icon">' + iconpi + currency + '<span class="price-num b">' + price.toFixed(2) + '</span></dd>';
				}else{
					var _ddPrice = '';
				}
			}
			return _ddPrice;
			
            },
		_renderFoot:function(){
			return '';
		},
		refreshData:function(){
			//this.stopDefault(e);
			var stopDefault = function(e){
		        var e = window.event || e;
		        //阻止默认浏览器动作(W3C)
		        if (e.preventDefault) {
		            e.preventDefault();
		            
		        }
		        //IE中阻止函数器默认动作的方式
		        else 
		            e.returnValue = false;
		        return false;
		    };
			FYE.on('btn-refresh','click',function(e){
				stopDefault(e);
				memberId = FDEV.util.Cookie.get('__last_loginid__');
				$('recommend-box').innerHTML = '<div class="recommend-noinfo"><img src="http://img.china.alibaba.com/images/myalibaba/trade/100524/loading.gif"  align="absmiddle" />正在刷新，请稍等...</div>';
		        setTimeout(function (){
					new FD.sys.fly.Ao({
						'flyWidgetId': 'recommend-box',
						'count': 6,
						'pid': '819092_1008',
						'recid': '1010',
						'coaseType': '30',
						'uid': memberId
					}).use(FD.sys.fly.WorkplaceRecommend);
				},2000);
				
			});
			
		},
		end:0
	},true);
})(window,FD.sys.fly);