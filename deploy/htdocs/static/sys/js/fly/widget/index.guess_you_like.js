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
	S.IndexGuessYouLinkView = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.IndexGuessYouLinkView.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
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
	L.extend(S.IndexGuessYouLinkView,S.AbstractFlyView);
	//接口实例化
	L.augment(S.IndexGuessYouLinkView,S.InterfaceFlyView);
	
	//方法封装
	L.augmentObject(S.IndexGuessYouLinkView.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('IndexGuessYouLinkView');
			this._render();
		},
		onFailure:function(){
				var str = '<li><a href="http://detail.1688.com/buyer/offerdetail/421720919.html" title="潘多拉项链"><img src="http://img.china.alibaba.com/news/upload/00000000000/tj-1_1265175159653.png"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/><span>潘多拉项链</span></a></li>\n';
						str += '<li><a href="http://detail.1688.com/buyer/offerdetail/395062075.html" title="真皮手腕带"><img src="http://img.china.alibaba.com/news/upload/00000000000/tj-2_1265175159664.png"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/><span>真皮手腕带</span></a></li>\n';
						str += '<li><a href="http://detail.1688.com/buyer/offerdetail/594913961.html" title="美臀坐垫（茶色）"><img src="http://img.china.alibaba.com/news/upload/00000000000/tj-3_1265175159665.png"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/><span>美臀坐垫（茶色）</span></a></li>\n';
						str += '<li><a href="http://detail.1688.com/buyer/offerdetail/543065546.html" title="椰壳手表"><img src="http://img.china.alibaba.com/news/upload/00000000000/tj-4_1265175159666.png"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/><span>椰壳手表</span></a></li>\n';
						str += '<li><a href="http://detail.1688.com/buyer/offerdetail/74101727.html" title="贝壳袖扣"><img src="http://img.china.alibaba.com/news/upload/00000000000/tj-5_1265175159667.png"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/><span>贝壳袖扣</span></a></li>\n';
						str += '<li><a href="http://detail.1688.com/buyer/offerdetail/609262869.html" title="时尚复古异族手镯"><img src="http://img.china.alibaba.com/news/upload/00000000000/tj-6_1265175159668.png"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/><span>时尚复古异族手镯</span></a></li>\n';
						$('guess-load').innerHTML = str;
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
			var maxItemLength = parseInt(this.oFlyConfig.count)||5;
			for(var i=0,l = offerList.length;i<l&&i<maxItemLength;i++){
				offerListHtml.push(this._renderOfferItem(offerList[i],i));
			}
			return offerListHtml.join('');
		},
		_renderOfferItem:function(offer,idx){
			var offerHtml = [];
			offerHtml.push('<li>');
			offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push('</a>');
			offerHtml.push('</li>');
			return offerHtml.join('');
		},
		_renderOfferTitle:function(offer){
			var detailUrl  = offer.offerDetailUrl;
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var _title = '<span>'+FD.sys.fly.Utils.doSubstring(offer.subject,21,false)+'</span>';
			return _title;
		},
		_renderOfferPhoto:function(offer){
			var detailUrl  = offer.offerDetailUrl;
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var _photo = '<a href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/>';
			return _photo;
		},
		_renderFoot:function(){
			return '';
		},
		end:0
	},true);
})(window,FD.sys.fly);